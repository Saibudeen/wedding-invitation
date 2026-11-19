// Ashaf & Abisha — Firebase guestbook (GitHub Pages compatible, no build tools).
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, serverTimestamp,
  query, orderBy, limit, onSnapshot
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

const db = getFirestore(initializeApp(firebaseConfig));
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
  // The newest 30 messages are displayed. Firestore pushes updates live.
  const recentWishes = query(wishesRef, orderBy("createdAt", "desc"), limit(30));
  onSnapshot(recentWishes, snapshot => {
    const cards = snapshot.docs.map(renderWish);
    list.replaceChildren(...cards);
    listStatus.textContent = cards.length ? "" : "No wishes yet. Be the first to share your blessings!";
  }, error => {
    console.error("Could not load guest wishes:", error);
    listStatus.textContent = "Wishes are temporarily unavailable. Please check the Firestore rules and try again.";
  });
}

if (form && status && submitButton) {
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const name = document.getElementById("guestName").value.trim();
    const message = document.getElementById("guestWish").value.trim();
    if (!name || !message || name.length > 80 || message.length > 1200) {
      status.textContent = "Please enter your name (up to 80 characters) and wishes (up to 1200 characters).";
      return;
    }
    submitButton.disabled = true;
    submitButton.textContent = "Sending your wishes…";
    status.textContent = "";
    try {
      await addDoc(wishesRef, {name, message, createdAt: serverTimestamp()});
      status.textContent = "Thank you! Your wishes are now in our guestbook. ♡";
      form.reset();
      const preview = document.getElementById("wishPreview");
      if (preview) preview.hidden = true;
    } catch(error) {
      console.error("Could not save guest wish:", error);
      status.textContent = "Unable to send your wishes. Please try again or check the Firestore configuration.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Your Wishes ♡";
    }
  });
}
