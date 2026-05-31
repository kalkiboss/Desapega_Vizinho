import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const serviceAccount = JSON.parse(
    readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
console.log('Firebase Admin SDK inicializado com sucesso e conectado ao Firestore!');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(` API REST Privada do Desapega Vizinho rodando na porta ${PORT}`);
});