import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config - Official web app configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDAKN1pCSpvF6wmCoxTLPQMJc4C1NbDfaw",
  authDomain: "ibox-c36af.firebaseapp.com",
  projectId: "ibox-c36af",
  storageBucket: "ibox-c36af.firebasestorage.app",
  messagingSenderId: "79631645506",
  appId: "1:79631645506:web:6bea7c8f2f03585dfe66db",
  measurementId: "G-EH0261L48J"
};

// Initialize Firebase App
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth with React Native persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If already initialized, get the existing instance
  auth = getAuth(app);
}

export { auth, app };
export default firebaseConfig;