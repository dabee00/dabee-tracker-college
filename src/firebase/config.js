// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeASTSEnFWxYaPcuwC75VMXkJXG76cJNc",
  authDomain: "school-tracker-25048.firebaseapp.com",
  projectId: "school-tracker-25048",
  storageBucket: "school-tracker-25048.firebasestorage.app",
  messagingSenderId: "215611465323",
  appId: "1:215611465323:web:dd924b763952d6b0319b2e",
  measurementId: "G-B1MCDXF6CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);