import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY || "AIzaSyCp7QF3XdCtnxNxqZiuRfCb1Om3LqH2GPQ",
  authDomain: "tutormama-4888b.firebaseapp.com",
  projectId: "tutormama-4888b",
  storageBucket: "tutormama-4888b.firebasestorage.app",
  messagingSenderId: "756880604092",
  appId: "1:756880604092:web:2f9b967fea27e5929b09b9",
  measurementId: "G-78NYYX1B6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  // Use initializeAuth for native platforms
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  // Use getAuth for web platforms (Expo Go)
  auth = getAuth(app);
}

export { auth };