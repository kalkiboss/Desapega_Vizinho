import express from 'express';
import cors from 'cors';
import { db } from './config/firebase.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

app.delete('/v1/ads/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'O ID do anúncio é obrigatório para exclusão.' });
        }

        const docRef = db.collection('anuncios').doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ error: 'Anúncio não encontrado no banco de dados.' });
        }

        await docRef.delete();

        console.log(`🗑️ Anúncio ${id} excluído com sucesso por solicitação do morador.`);
        return res.status(200).json({ success: true, message: 'Anúncio removido com sucesso.' });

    } catch (error) {
        console.error('Erro na integração HTTP ao deletar anúncio:', error);
        return res.status(500).json({ error: 'Erro interno ao processar a exclusão do anúncio.' });
    }
});

app.put('/v1/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, whatsapp, localizacao } = req.body;

        if (!nome || !whatsapp || !localizacao) {
            return res.status(400).json({ error: 'Nome, WhatsApp e Localização são obrigatórios.' });
        }

        const userRef = db.collection('usuarios').doc(id);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            return res.status(404).json({ error: 'Morador não encontrado no sistema.' });
        }

        const updateData = {
            nome: nome.trim(),
            whatsapp: whatsapp.replace(/\D/g, ''),
            localizacao: localizacao.trim()
        };

        await userRef.update(updateData);

        console.log(`👤 Perfil do morador ${id} atualizado com sucesso.`);
        return res.status(200).json({ id, ...updateData, email: userSnap.data().email });

    } catch (error) {
        console.error('Erro ao atualizar perfil do morador:', error);
        return res.status(500).json({ error: 'Erro interno ao processar a atualização cadastral.' });
    }
});

app.post('/v1/auth/register', async (req, res) => {
    try {
        const { nome, email, password, whatsapp, localizacao } = req.body;

        if (!nome || !email || !password || !whatsapp || !localizacao) {
            return res.status(400).json({ error: 'Todos os campos de cadastro são obrigatórios.' });
        }

        const usersRef = db.collection('usuarios');
        const snapshot = await usersRef.where('email', '==', email.trim()).get();
        
        if (!snapshot.empty) {
            return res.status(409).json({ error: 'Este e-mail já está em uso por outro morador.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
            nome: nome.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            whatsapp: whatsapp.replace(/\D/g, ''),
            localizacao: localizacao.trim(),
            createdAt: new Date().toISOString()
        };

        const docRef = await usersRef.add(newUser);

        delete newUser.password;

        console.log(`🛡️ Novo morador cadastrado: ${newUser.nome}`);
        return res.status(201).json({ id: docRef.id, ...newUser });

    } catch (error) {
        console.error('Erro no registro de usuário:', error);
        return res.status(500).json({ error: 'Erro interno ao processar o cadastro.' });
    }
});

app.post('/v1/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
        }

        const usersRef = db.collection('usuarios');
        const snapshot = await usersRef.where('email', '==', email.toLowerCase().trim()).limit(1).get();

        if (snapshot.empty) {
            return res.status(401).json({ error: 'Credenciais inválidas. Morador não encontrado.' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas. Senha incorreta.' });
        }

        const token = jwt.sign(
            { id: userDoc.id, email: userData.email },
            'DESAPEGA_VIZINHO_CHAVE_SECRETA',
            { expiresIn: '7d' }
        );

        delete userData.password;

        console.log(`🔓 Acesso autorizado: ${userData.nome}`);
        
        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: { id: userDoc.id, ...userData }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ error: 'Erro interno ao processar a autenticação.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(` API REST Privada do Desapega Vizinho rodando na porta ${PORT}`);
});