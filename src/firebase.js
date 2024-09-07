// src/firebase.js
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, browserLocalPersistence  } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.APP_FIREBASE_MEASUREMENT_ID
};

export const firebaseApp =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(firebaseApp);

export const auth = initializeAuth(firebaseApp, {
    persistence: browserLocalPersistence,
});
