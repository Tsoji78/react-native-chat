import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import { getAuth,initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCp7QF3XdCtnxNxqZiuRfCb1Om3LqH2GPQ",
  authDomain: "tutormama-4888b.firebaseapp.com",
  databaseURL: "https://tutormama-4888b-default-rtdb.firebaseio.com",
  projectId: "tutormama-4888b",
  storageBucket: "tutormama-4888b.firebasestorage.app",
  messagingSenderId: "756880604092",
  appId: "1:756880604092:web:2f9b967fea27e5929b09b9",
  measurementId: "G-78NYYX1B6E"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use React Native persistence for Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };