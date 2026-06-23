import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const credentialsPath = new URL('../serviceAccountKey.json', import.meta.url);
const serviceAccount = JSON.parse(readFileSync(credentialsPath));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export { db };