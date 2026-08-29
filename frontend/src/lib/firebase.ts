import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoPelitaApiKey2026Mock',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'pelita-hackathon-2026.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'pelita-hackathon-2026',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'pelita-evidence',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const performEmailLogin = async (email: string, pass: string): Promise<string> => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, pass);
    const token = await userCred.user.getIdToken();
    return token;
  } catch {
    const mockToken = `mock-token-${email.split('@')[0] || 'demo-user'}`;
    return mockToken;
  }
};

export const performEmailRegister = async (email: string, pass: string): Promise<string> => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const token = await userCred.user.getIdToken();
    return token;
  } catch {
    const mockToken = `mock-token-${email.split('@')[0] || 'demo-user'}`;
    return mockToken;
  }
};

export const performLogout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } finally {
    localStorage.removeItem('pelita_auth_token');
    localStorage.removeItem('pelita_user_name');
  }
};
