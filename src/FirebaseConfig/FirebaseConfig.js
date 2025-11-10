import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBaBjLGkIYxjA6mpCOHGLq4IGIEYQMY6lE",
  authDomain: "programacionweb-cabdf.firebaseapp.com",
  projectId: "programacionweb-cabdf",
  storageBucket: "programacionweb-cabdf.firebasestorage.app",
  messagingSenderId: "187181697453",
  appId: "1:187181697453:web:4e136f00c190607ce23924"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
const auth = getAuth(app);


export { app, db, auth };
