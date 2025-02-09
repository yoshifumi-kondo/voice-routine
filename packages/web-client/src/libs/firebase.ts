
"use client";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWfoChhEUk7HlAEab2hFgT8i8edvBwaSM",
  authDomain: "voice-routine.firebaseapp.com",
  projectId: "voice-routine",
  storageBucket: "voice-routine.firebasestorage.app",
  messagingSenderId: "606257438837",
  appId: "1:606257438837:web:1f8b34d8ded865f09bd83c",
  measurementId: "G-TSTK4T367M",
};

export const app = initializeApp(firebaseConfig);

if (typeof window !== "undefined") {
  getAnalytics(app);
}

export const auth = getAuth(app);
