import express from 'express';
import cors from 'cors';
import { db } from './config/firebase.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/v1/ads', async (req, res) => {
    try {

        const { title, category, price, description, phone, author, location, images, image } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'O título do anúncio é obrigatório.' });
        }
        if (!price || isNaN(price) || Number(price) <= 0) {
            return res.status(400).json({ error: 'O preço deve ser um valor numérico maior que zero.' });
        }
        if (!phone) {
            return res.status(400).json({ error: 'O WhatsApp de contato é obrigatório.' });
        }

        if (!location || !location.trim()) {
            return res.status(400).json({ error: 'A localização interna (Bloco/Apto) é obrigatória.' });
        }

        let arrayDeImagens = [];
        if (Array.isArray(images)) {
            arrayDeImagens = images;
        } else if (image) {
            arrayDeImagens = [image];
        }

        const newAd = {
            title: title.trim(),
            category: category || 'OUTROS',
            price: Number(price),
            description: description ? description.trim() : '',
            phone: phone.replace(/\D/g, ''),
            author: author ? author.trim() : 'Vizinho Anônimo',
            location: location.trim(),
            images: arrayDeImagens,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('anuncios').add(newAd);

        return res.status(201).json({ id: docRef.id, ...newAd });

    } catch (error) {
        console.error('Erro ao criar anúncio:', error);
        return res.status(500).json({ error: 'Erro interno ao processar a criação do anúncio.' });
    }
});

app.get('/v1/ads', async (req, res) => {
    try {
        const snapshot = await db.collection('anuncios').orderBy('createdAt', 'desc').get();
        const ads = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.status(200).json(ads);

    } catch (error) {
        console.error('Erro ao buscar anúncios:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar o feed de anúncios.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(` API REST Privada do Desapega Vizinho rodando na porta ${PORT}`);
});