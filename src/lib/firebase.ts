
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBm70iMr01vzvqQrkxYn48pxy_X_el677Y",
  authDomain: "cema-web.firebaseapp.com",
  databaseURL: "https://cema-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cema-web",
  storageBucket: "cema-web.firebasestorage.app",
  messagingSenderId: "863275304034",
  appId: "1:863275304034:web:24d07885696e9509d8fd3b",
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { db };