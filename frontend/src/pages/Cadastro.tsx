import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnuncios } from '../context/AnunciosContext';

export default function Cadastro() {

    const navigate = useNavigate();
    const { anuncios, setAnuncios } = useAnuncios();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('OUTROS');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState<string | null>(null);
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
            image
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
            setIsSubmitting(false); // Libera o botão
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        const arquivo = e.target.files?.[0];

        if (!arquivo) return;

        if (arquivo.size > 2 * 1024 * 1024) {
            return setError('A imagem selecionada é muito grande. Escolha uma foto de até 2MB.');
        }

        const leitor = new FileReader();

        leitor.onloadend = () => {
            setImage(leitor.result as string);
        };

        leitor.readAsDataURL(arquivo);
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
                            placeholder="Ex: Carlos (Apto 302)"
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
                        <label>Foto do Produto (Opcional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ padding: '8px 0' }}
                        />
                        {image && (
                            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img
                                    src={image}
                                    alt="Preview do desapego"
                                    style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setImage(null)}
                                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '700' }}
                                >
                                    Remover Foto
                                </button>
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
        </div>
    );
}