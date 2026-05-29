import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAF35H3X_SbALdhGjAuwGOTI4i5Pf4ZeMY",
  authDomain: "recreationvote.firebaseapp.com",
  projectId: "recreationvote",
  storageBucket: "recreationvote.firebasestorage.app",
  messagingSenderId: "809326371925",
  appId: "1:809326371925:web:732f7679ac376c1ba160dc",
};

const app = initializeApp(firebaseConfig);
const auth: ReturnType<typeof getAuth> = getAuth(app);
const db: ReturnType<typeof getFirestore> = getFirestore(app);

export { auth, db };
