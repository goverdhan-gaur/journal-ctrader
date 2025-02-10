import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCiCzgyFgCMtkINJgi1wvPzzAkbVtudvos",
    authDomain: "journal-e69f5.firebaseapp.com",
    projectId: "journal-e69f5",
    storageBucket: "journal-e69f5.firebasestorage.app",
    messagingSenderId: "882015316955",
    appId: "1:882015316955:web:5ceaa27269b8121c1c55fe",
    measurementId: "G-8RWDGBBXC5"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
