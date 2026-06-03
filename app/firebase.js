// ============================================================
//  GLORY OF CHRIST CHURCH — firebase.js
//  Replace the firebaseConfig object with YOUR project values
//  from: Firebase Console → Project Settings → Your Apps
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage }     from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getAnalytics } from "firebase/analytics";

//firebaseConfig object from Firebase Console → Project Settings → Your Apps
const firebaseConfig = {
  apiKey: "AIzaSyBBii2Bs0SBTxJ6Ysmy_5_EUtbGWDQkN68",
  authDomain: "gccwakiso.firebaseapp.com",
  projectId: "gccwakiso",
  storageBucket: "gccwakiso.firebasestorage.app",
  messagingSenderId: "588553829106",
  appId: "1:588553829106:web:30a805ac74f685cdb0ee6b",
  measurementId: "G-4YWMXYTZTB"
};

const app  = initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);
export const analytics = getAnalytics(app);