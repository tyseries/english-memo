import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBy8awn316oTvM4Sq546p5uCiQVQpZo8zs",
  authDomain: "english-memo-975b8.firebaseapp.com",
  projectId: "english-memo-975b8",
  storageBucket: "english-memo-975b8.firebasestorage.app",
  messagingSenderId: "999546649161",
  appId: "1:999546649161:web:c45fb4dc5d8c8449f6dd98"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;