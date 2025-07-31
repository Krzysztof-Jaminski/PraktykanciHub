
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Debug: sprawdź czy zmienna środowiskowa jest dostępna
console.log("🔍 Firebase API Key from env used!:");
console.log("🔍 Using fallback:", !process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

// Dodatkowe sprawdzenie bezpieczeństwa
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn("⚠️ NEXT_PUBLIC_FIREBASE_API_KEY not found, using fallback");
}

const firebaseConfig = {
  projectId: "spacewise-a4inb",
  appId: "1:395387933933:web:a28e37d4a4238e65cf28e4",
  storageBucket: "spacewise-a4inb.firebasestorage.app",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDFFApC7Vxo5QYdRFJb09HKi_54WFLNwO8",
  authDomain: "spacewise-a4inb.firebaseapp.com",
  messagingSenderId: "395387933933"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
