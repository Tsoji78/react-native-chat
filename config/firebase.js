import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY || "AIzaSyCp7QF3XdCtnxNxqZiuRfCb1Om3LqH2GPQ",
  authDomain: "tutormama-4888b.firebaseapp.com",
  projectId: "tutormama-4888b",
  storageBucket: "tutormama-4888b.firebasestorage.app",
  messagingSenderId: "756880604092",
  appId: "1:756880604092:web:2f9b967fea27e5929b09b9",
  measurementId: "G-78NYYX1B6E"
};

let app;
let auth;
let db;

try {
  // Initialize Firebase if it hasn't been initialized yet
  if (!app) {
    app = initializeApp(firebaseConfig);
  }

  // Initialize Auth with persistence, wrapped in try-catch to handle potential errors
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    // If auth is already initialized, get the existing instance
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      console.error('Auth initialization error:', error);
      throw error;
    }
  }

  // Initialize Firestore
  if (!db) {
    db = getFirestore(app);
  }

} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { app, auth, db };