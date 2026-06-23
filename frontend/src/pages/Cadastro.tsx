import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAnuncios } from '../context/AnunciosContext';
import apego from '../assets/apego.svg';

export default function Cadastro() {

    const navigate = useNavigate();
    const { anuncios, setAnuncios } = useAnuncios();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('OUTROS');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState(user?.nome || '');
    const [phone, setPhone] = useState(user?.whatsapp || '');
    const [location, setLocation] = useState(user?.localizacao || '');
    const [error, setError] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) return setError('Por favor, insira um título para o anúncio.');
        if (!price.trim()) return setError('O preço do produto é obrigatório.');
        if (!phone.trim()) return setError('Um número de WhatsApp é necessário para os vizinhos te contatarem.');
        if (!location.trim()) return setError('A localização interna (Bloco/Apto) é obrigatória para a entrega.');

        const precoConvertido = Number(price);
        if (isNaN(precoConvertido) || precoConvertido <= 0) {
            return setError('O preço digitado é inválido. Digite um valor maior que zero.');
        }

        const digitosTelefone = phone.replace(/\D/g, '');
        if (digitosTelefone.length < 10) {
            return setError('O número de WhatsApp está incompleto. Certifique-se de incluir o DDD.');
        }

        const payload = {
            title: title.trim(),
            category,
            price: precoConvertido,
            description: description.trim(),
            author: author.trim() || 'Anônimo',
            phone: digitosTelefone,
            location: location.trim(),
            images
        };

        try {
            setIsSubmitting(true);

            const response = await fetch('http://localhost:3000/v1/ads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Falha ao comunicar com o servidor.');
            }

            const novoAnuncio = await response.json();

            setAnuncios([novoAnuncio, ...anuncios]);

            navigate('/feed');

        } catch (error) {
            console.error('Erro ao salvar anúncio:', error);
            setError('Erro de conexão. Certifique-se de que o servidor (API) está rodando.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');

        const arquivosSelecionados = Array.from(e.target.files || []);
        if (arquivosSelecionados.length === 0) return;

        if (images.length + arquivosSelecionados.length > 4) {
            e.target.value = '';
            return setError('Você pode enviar no máximo 4 fotos por anúncio.');
        }

        const novasImagens: string[] = [];

        for (const arquivo of arquivosSelecionados) {
           if (arquivo.size > 2 * 1024 * 1024) {
                e.target.value = '';
                return setError(`A imagem "${arquivo.name}" passou do limite de 2MB. Envio cancelado.`);
            }

            const base64 = await new Promise<string>((resolve, reject) => {
                const leitor = new FileReader();
                leitor.onloadend = () => resolve(leitor.result as string);
                leitor.onerror = reject;
                leitor.readAsDataURL(arquivo);
            });

            novasImagens.push(base64);
        }

        setImages((prevImages) => [...prevImages, ...novasImagens]);
        e.target.value = '';
    };

    const removeImage = (indexToRemove: number) => {
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const apenasNumeros = input.replace(/\D/g, '');

        if (apenasNumeros.length <= 2) {
            setPhone(apenasNumeros);
        } else if (apenasNumeros.length <= 7) {
            setPhone(`(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`);
        } else {
            setPhone(`(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        let limpo = input.replace(/[^0-9.]/g, '');
        const partes = limpo.split('.');

        if (partes.length > 2) {
            limpo = partes[0] + '.' + partes.slice(1).join('');
        }

        if (partes[1] && partes[1].length > 2) {
            limpo = partes[0] + '.' + partes[1].slice(0, 2);
        }

        if (limpo.length <= 9) {
            setPrice(limpo);
        }
    };

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const apenasLetras = input.replace(/[0-9]/g, '');
        setAuthor(apenasLetras);
    };

    return (
        <div className="page-container cadastro-page">
            <div className="form-card">
                <h2>Criar Anúncio</h2>
                <p>Preencha os detalhes para os seus vizinhos verem.</p>

                {error && (
                    <div style={{ backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: '700' }}>
                        ⚠️ {error}
                    </div>
                )}

                <form className="cadastro-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Título do Anúncio *</label>
                        <input
                            type="text"
                            placeholder="Ex: Bicicleta Caloi Aro 29"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label>Categoria</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #d4d4d8', backgroundColor: 'var(--bg-surface)' }}
                        >
                            <option value="OUTROS">Outros</option>
                            <option value="MÓVEIS">Móveis</option>
                            <option value="ELETRÔNICOS">Eletrônicos</option>
                            <option value="VEÍCULOS">Vagas / Veículos</option>
                            <option value="SERVIÇOS">Serviços</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Preço (R$) *</label>
                        <input
                            type="text"
                            placeholder="Ex: 150.00"
                            value={price}
                            onChange={handlePriceChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição detalhada</label>
                        <input
                            type="text"
                            placeholder="Ex: Entrego no Bloco C, ótimo estado..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Seu Nome / Apelido</label>
                        <input
                            type="text"
                            placeholder="Ex: Carlos"
                            value={author}
                            onChange={handleAuthorChange}
                            maxLength={30}
                        />
                    </div>

                    <div className="form-group">
                        <label>WhatsApp de Contato *</label>
                        <input
                            type="text"
                            placeholder="Ex: 61999998888"
                            value={phone}
                            onChange={handlePhoneChange}
                            maxLength={15}
                        />
                    </div>

                    <div className="form-group">
                        <label>Localização no Condomínio *</label>
                        <input
                            type="text"
                            placeholder="Ex: Bloco C - Apto 402"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            maxLength={40}
                        />
                    </div>

                    <div className="form-group">
                        <label>Fotos do Produto (Máximo 4)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            style={{ padding: '8px 0' }}
                            disabled={images.length >= 4}
                        />

                        {images.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px', marginTop: '16px' }}>
                                {images.map((imgBase64, index) => (
                                    <div key={index} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <img
                                            src={imgBase64}
                                            alt={`Preview ${index + 1}`}
                                            style={{ width: '100%', height: '100px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-submit"
                        disabled={isSubmitting}
                        style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                    >
                        {isSubmitting ? 'Salvando no banco...' : 'Salvar Anúncio'}
                    </button>
                </form>
            </div>

            <footer className="home-footer" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 0 20px 0',
                borderTop: '1px solid var(--border-color)',
                marginTop: '24px',
                gap: '8px'
            }}>
                <img
                    src={apego}
                    alt="Desapega Vizinho"
                    style={{ height: '32px', objectFit: 'contain' }}
                />
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    © {new Date().getFullYear()} Desapega Vizinho — Todos os direitos reservados.
                </p>
            </footer>
        </div>
    );
}