import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// The cloud database is provisioned with a custom DB ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export default app;
