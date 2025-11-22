// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8WExv1I1N5B8ZWqmUgdMpwYFQAbNmFpA",
  authDomain: "prepai-4e280.firebaseapp.com",
  projectId: "prepai-4e280",
  storageBucket: "prepai-4e280.firebasestorage.app",
  messagingSenderId: "402806111768",
  appId: "1:402806111768:web:f2b96ad45f527c08a14d6d"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

