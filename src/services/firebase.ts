import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 
  apiKey: "AIzaSyBsvKB94suMGqf-jM9MDKz-aon687SSDzU",
  authDomain: "towers-of-hanoi-705f3.firebaseapp.com",
  projectId: "towers-of-hanoi-705f3",
  storageBucket: "towers-of-hanoi-705f3.firebasestorage.app",
  messagingSenderId: "944054467281",
  appId: "1:944054467281:web:d64c53fb1ea3e8803523f0",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);