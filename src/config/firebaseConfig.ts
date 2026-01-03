import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAYBXEAPGqTK90kRt0FonGc2KYlrrCKR5c",
    authDomain: "webchatfe.firebaseapp.com",
    projectId: "webchatfe",
    storageBucket: "webchatfe.firebasestorage.app",
    messagingSenderId: "1085229854250",
    appId: "1:1085229854250:web:3a6453e353fcf99d135d53",
    measurementId: "G-QQTYLJP3WJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
