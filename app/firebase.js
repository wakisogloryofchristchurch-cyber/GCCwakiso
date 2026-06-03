// ============================================================
//  GLORY OF CHRIST CHURCH — firebase.js
//  Firestore + Auth only (images handled by Cloudinary)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBBii2Bs0SBTxJ6Ysmy_5_EUtbGWDQkN68",
  authDomain:        "gccwakiso.firebaseapp.com",
  projectId:         "gccwakiso",
  storageBucket:     "gccwakiso.firebasestorage.app",
  messagingSenderId: "588553829106",
  appId:             "1:588553829106:web:30a805ac74f685cdb0ee6b",
  measurementId:     "G-4YWMXYTZTB"
};

const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);

// ============================================================
//  IMAGE UPLOADS → Cloudinary (not Firebase Storage)
//  Cloud Name:    droecocgs
//  Upload Preset: GCC wakiso  (unsigned)
// ============================================================
