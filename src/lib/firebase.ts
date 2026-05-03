import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let auth: any = null;
let db: any = null;

try {
  // @ts-ignore - This file might not exist yet
  const firebaseConfig = await import('../firebase-applet-config.json');
  if (firebaseConfig && getApps().length === 0) {
    const app = initializeApp(firebaseConfig.default || firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.warn('Firebase config not found or terms not accepted yet. Authentication will run in demo mode.');
}

export { auth, db };
