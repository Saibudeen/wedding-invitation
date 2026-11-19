# Ashaf & Abisha Wedding Invitation

royal burgundy and champagne gold static wedding website with a public Firebase Cloud Firestore guestbook and music player. Works on GitHub Pages without a build step.

## Files
- `index.html`: wedding invitation, wish form and public guestbook UI
- `firebase-wishes.js`: saves wishes and listens for new ones in real time
- `firestore.rules`: Firestore security rules to publish in Firebase Console
- `wedding-melody.mp3`: original background music

## Setup
1. Open https://console.firebase.google.com/ and choose **asaf-abhi**.
2. Under **Build → Firestore Database**, create the Cloud Firestore database if necessary.
3. Go to **Firestore Database → Rules**, replace the current rules with the contents of `firestore.rules`, and click **Publish**. The prior rules required a query limit of 30; the new rules allow reading all wishes, so publishing them is required.
4. Commit `index.html`, `firebase-wishes.js`, and `wedding-melody.mp3` to the **same folder** at the root of your GitHub repository (or update your existing files). The `firestore.rules` file is for Firebase Console; uploading it to GitHub does not apply those rules.
5. Enable GitHub Pages in **Settings → Pages → Deploy from a branch → main / (root)**.
6. Open the live page and submit a test wish. It should appear below the form and also in **Firestore Database → Data → wishes**. Open the page in a second browser tab to verify real-time updates.

## Guestbook behavior
Wishes are saved in a `wishes` collection with `name`, `message`, and server-generated `createdAt`. The website displays the **all wishes**, sorted newest first, and listens for changes using Firestore's real-time listener. No site visitor can edit or delete saved wishes using these security rules.

## Privacy, spam, and costs
**All names and wishes will be publicly readable** by visitors and anyone able to query the public Firestore collection. This simple anonymous guestbook does not moderate content, prevent spam, or authenticate senders. Public create permissions can be abused and generate Firestore usage charges. For a public event, consider a moderation/approval flow and abuse prevention (e.g. Firebase App Check plus rate-limiting through a backend). Avoid posting sensitive personal details in messages. Delete offensive wishes through the Firebase Console with project owner privileges; the website cannot delete them.

The website uses the Firebase CDN in a JavaScript module, so no `npm install` is required. Analytics is unnecessary for the guestbook. The Firebase configuration is normal client-side app configuration, not a private backend credential; security comes from Firestore rules.

## Events
- Mehndi: Saturday, 21 November 2026, 3:00 PM IST, Elite Beach Resort, Kanathur.
- Wedding: Sunday, 22 November 2026, 11:11 AM IST, Samco, Pallavaram.
Both events have separate map search and calendar buttons. Calendar entries specify start times only because end times were not supplied. The names use Parisienne via Google Fonts with a cursive fallback.

## Glitter edition
Animated gold and rose sparkles, shimmering names and glowing frame. Reduced-motion preferences disable animations. No additional files required for the effect.

## Troubleshooting
If submission fails, the form preserves the text and shows an error code. If the database is offline, sending may remain pending until the connection returns. Confirm that Cloud Firestore (default database), not Realtime Database, exists in asaf-abhi. Verify the GitHub Pages deployment includes the new JS file and reload the page. Public reads and writes may incur charges; moderate messages using the Firebase console. The countdown targets 2026-11-22 11:11 IST.
