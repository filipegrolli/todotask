import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9l38jqd7HdcEb7YCdO7YFqZiuRgUGmJM",
  authDomain: "todolist-14b6a.firebaseapp.com",
  projectId: "todolist-14b6a",
  storageBucket: "todolist-14b6a.firebasestorage.app",
  messagingSenderId: "611825714284",
  appId: "1:611825714284:web:c7e261ea447a72a100c449",
  measurementId: "G-NEBYE7VT52"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const db: Firestore = getFirestore(app);

const auth: Auth = getAuth(app);

const storage = getStorage(app);

export { db, auth, storage };