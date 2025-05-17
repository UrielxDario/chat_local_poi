import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAl97Vcn6evaVMzd9LEIAs6lFmoa2g2-6I",
  authDomain: "videollamada-poi.firebaseapp.com",
  projectId: "videollamada-poi",
  storageBucket: "videollamada-poi.firebasestorage.app",
  messagingSenderId: "638622739298",
  appId: "1:638622739298:web:3403b5e4017b5ae9f55a3b",
  measurementId: "G-EJ6MR49PYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };