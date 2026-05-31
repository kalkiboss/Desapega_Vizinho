import express from 'express';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const app = express();
const serviceAccount = JSON.parse(
    readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log('Firebase Admin SDK inicializado com sucesso e conectado ao Firestore!');