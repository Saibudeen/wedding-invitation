// Ashaf & Abisha — Firebase guestbook (GitHub Pages compatible, no build tools).
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import {
  initializeFirestore, collection, addDoc, serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnFZ4GBH_5b0h3ZZ66LUZbx2_tfYFkAvA",
  authDomain: "asaf-abhi.firebaseapp.com",
  projectId: "asaf-abhi",
  storageBucket: "asaf-abhi.firebasestorage.app",
  messagingSenderId: "152689834293",
  appId: "1:152689834293:web:227f8c8c28bcf2b2e2347c",
  measurementId: "G-GQGMY9VM47"
};

const db = initializeFirestore(initializeApp(firebaseConfig), { experimentalForceLongPolling: true });
const wishesRef = collection(db, "wishes");
const form = document.getElementById("wishForm");
const status = document.getElementById("wishStatus");
const list = document.getElementById("wishesList");
const listStatus = document.getElementById("wishesListStatus");
const submitButton = form?.querySelector('button[type="submit"]');

function renderWish(doc) {
  const wish = doc.data();
  const article = document.createElement("article");
  article.className = "guest-wish";
  const header = document.createElement("div");
  header.className = "guest-wish-header";
  const name = document.createElement("strong");
  name.textContent = wish.name || "Guest";
  const when = document.createElement("time");
  const date = wish.createdAt?.toDate?.();
  if (date && !Number.isNaN(date.getTime())) {
    when.dateTime = date.toISOString();
    when.textContent = date.toLocaleDateString(undefined, {day:"numeric", month:"short", year:"numeric"});
  }
  header.append(name, when);
  const message = document.createElement("p");
  // Never use innerHTML for user-submitted text.
  message.textContent = wish.message || "";
  article.append(header, message);
  return article;
}

if (list && listStatus) {
  // Read every document, including older documents without timestamps.
  const recentWishes = wishesRef;
  onSnapshot(recentWishes, { includeMetadataChanges: true }, snapshot => {
    const cards = snapshot.docs.filter(doc => !doc.metadata.hasPendingWrites).sort((a,b) => (b.data().createdAt?.toMillis?.() || 0) - (a.data().createdAt?.toMillis?.() || 0)).map(renderWish);
    list.replaceChildren(...cards);
    listStatus.textContent = snapshot.metadata.fromCache ? "Connecting to Firebase… showing cached wishes, if available." : (cards.length ? "" : "No wishes yet. Be the first to share your blessings!");
  }, error => {
    console.error("Could not load guest wishes:", error);
    listStatus.textContent = `Unable to load wishes (${error.code || "connection error"}). Please check Firestore rules and refresh.`;
  });
}

if (form && status && submitButton) {
  submitButton.disabled = false;
  status.textContent = "";
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const name = document.getElementById("guestName").value.trim();
    const message = document.getElementById("guestWish").value.trim();
    if (!name || !message || name.length > 80 || message.length > 1200) {
      status.textContent = "Please enter your name (up to 80 characters) and wishes (up to 1200 characters).";
      return;
    }
    submitButton.disabled = true;
    const fields = [document.getElementById("guestName"), document.getElementById("guestWish")];
    fields.forEach(field => field.readOnly = true);
    submitButton.textContent = "Sending your wishes…";
    status.textContent = "Waiting for Firebase to confirm your wish…";
    if (!navigator.onLine) {
      fields.forEach(field => field.readOnly = false);
      submitButton.disabled = false;
      submitButton.textContent = "Send Your Wishes ♡";
      status.textContent = "You are offline. Reconnect and try again. Your text is preserved.";
      return;
    }
    const warning = setTimeout(() => {
      submitButton.textContent = "Awaiting confirmation…";
      status.textContent = "Firebase has not confirmed the write yet. Check your internet connection, VPN or browser network restrictions. Keep this page open; your wish may still be saved. Do not submit it again yet.";
    }, 15000);
    try {
      await addDoc(wishesRef, {name, message, createdAt: serverTimestamp()});
      status.textContent = "Thank you! Your wishes are now in our guestbook. ♡";
      form.reset();
      const preview = document.getElementById("wishPreview");
      if (preview) preview.hidden = true;
    } catch(error) {
      console.error("Could not save guest wish:", error);
      status.textContent = `Wish not saved (${error.code || "connection error"}). Your text is preserved. Please try again.`;
    } finally {
      clearTimeout(warning);
      fields.forEach(field => field.readOnly = false);
      submitButton.disabled = false;
      submitButton.textContent = "Send Your Wishes ♡";
    }
  });
}
