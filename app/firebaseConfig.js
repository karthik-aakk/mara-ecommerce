import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAmrox5_kNE3SMGv7lk6Piu_KxUlcEhUU",
  authDomain: "mara-e-commerce.firebaseapp.com",
  projectId: "mara-e-commerce",
  storageBucket: "mara-e-commerce.firebasestorage.app",
  messagingSenderId: "501498395957",
  appId: "1:501498395957:web:841828518e35f2ca39607c",
  measurementId: "G-1S2CCPKMST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
