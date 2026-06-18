# Glory of Christ Church Website
## Firebase Setup & Deployment Guide

---

## 📁 File Structure

```
glory-of-christ-church/
├── index.html        → Home page
├── about.html        → About, Mission & Leaders
├── services.html     → Services, Events & Sermons
├── contact.html      → Contact form & Donate
├── admin.html        → Admin dashboard (protected)
├── style.css         → Global styles
├── firebase.js       → Firebase config (edit this!)
└── SETUP.md          → This guide
```

---

## 🔥 Step 1 — Create a Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** → name it `glory-of-christ-church`
3. Disable Google Analytics (optional) → **Create project**

---

## ⚙️ Step 2 — Register a Web App

1. In your Firebase project, click the **`</>`** icon (Web)
2. App nickname: `Glory of Christ Church Website`
3. ✅ Check **"Also set up Firebase Hosting"**
4. Click **Register app**
5. Copy the `firebaseConfig` object shown — you'll need it next

---

## ✏️ Step 3 — Edit `firebase.js`

Open `firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",           // ← paste from Firebase
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

---

## 🗄️ Step 4 — Enable Firestore Database

1. Firebase Console → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** → select region → Done
4. Go to **Rules** tab and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public can read
    match /leaders/{doc}   { allow read: if true; allow write: if request.auth != null; }
    match /events/{doc}    { allow read: if true; allow write: if request.auth != null; }
    match /sermons/{doc}   { allow read: if true; allow write: if request.auth != null; }
    // Messages: anyone can write, only admin reads
    match /messages/{doc}  { allow create: if true; allow read, delete: if request.auth != null; }
  }
}
```

---

## 🔐 Step 5 — Enable Authentication

1. Firebase Console → **Build → Authentication**
2. Click **Get started** → **Sign-in method** tab
3. Enable **Email/Password**
4. Go to **Users** tab → **Add user**
5. Enter your admin email and a strong password
6. This is what you'll use to log into `admin.html`

---

## 🖼️ Step 6 — Enable Storage (for image uploads)

1. Firebase Console → **Build → Storage**
2. Click **Get started** → production mode → Done
3. Go to **Rules** tab and set:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🚀 Step 7 — Deploy with Firebase Hosting

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login & init
```bash
firebase login
firebase init hosting
```

When prompted:
- **Public directory:** `.` (just a dot — current folder)
- **Single-page app:** No
- **Overwrite index.html:** No

### Deploy
```bash
firebase deploy
```

Your site will be live at `https://YOUR_PROJECT.web.app` 🎉

---

## 🖼️ Step 8 — Copy Your Images

Make sure these image files are in the same folder as the HTML files:
- `elvis.jpg` — Church logo
- `Pastor1.jpg` — Lead Pastor
- `Kaates.jpg` — Co-Pastors
- `r.jpg` — Pastor Rogers
- `sh1.jpg` — Youth Pastor
- `prwrs.jpg` — Worship photo (used in slider)

---

## 📋 Firestore Collections (auto-created by Admin panel)

| Collection | Fields |
|---|---|
| `leaders`  | name, role, bio, order, image, createdAt |
| `events`   | title, date, time, location, description, image, createdAt |
| `sermons`  | title, speaker, date, scripture, link, notes, createdAt |
| `messages` | name, contact, subject, message, createdAt |

---

## 💡 Tips

- Open `admin.html` to add leaders, events, and sermons via the dashboard
- The public pages fall back to static content if Firebase isn't configured yet
- To add a Google Map, replace the map placeholder in `contact.html` with your Google Maps embed iframe
- For a custom domain: Firebase Console → Hosting → Add custom domain

---

*Built for Glory of Christ Church Wakiso-Kayunga, Uganda 🙏*
