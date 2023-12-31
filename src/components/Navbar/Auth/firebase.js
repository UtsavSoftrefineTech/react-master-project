import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcOQxTDUmJEW-Cbm5nhOUjTWZDdqSNocY",
  authDomain: "react-master-project-a4daf.firebaseapp.com",
  projectId: "react-master-project-a4daf",
  storageBucket: "react-master-project-a4daf.appspot.com",
  messagingSenderId: "232941566243",
  appId: "1:232941566243:web:dcd96dc078f83aa1453496",
  measurementId: "G-GY4RN2CXNJ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
