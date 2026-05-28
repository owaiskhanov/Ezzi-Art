import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
