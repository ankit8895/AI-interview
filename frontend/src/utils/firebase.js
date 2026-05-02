import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API_KEY,
  authDomain: "intervuedotai-cdafe.firebaseapp.com",
  projectId: "intervuedotai-cdafe",
  storageBucket: "intervuedotai-cdafe.firebasestorage.app",
  messagingSenderId: "289872267875",
  appId: "1:289872267875:web:cc8e1b7b38bdfb098c4656",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
