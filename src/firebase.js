// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef",
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID || "G-MEASUREMENT"
};

let app = null;
let db = null;
let auth = null;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} catch (error) {
    console.warn("Firebase initialization failed. Running in offline mode:", error.message);
}

export { app, db, auth };