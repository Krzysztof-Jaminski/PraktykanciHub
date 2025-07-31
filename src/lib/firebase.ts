
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "spacewise-a4inb",
  appId: "1:395387933933:web:a28e37d4a4238e65cf28e4",
  storageBucket: "spacewise-a4inb.firebasestorage.app",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "spacewise-a4inb.firebaseapp.com",
  messagingSenderId: "395387933933"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
