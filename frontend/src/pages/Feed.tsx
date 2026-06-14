import { useEffect, useState, useMemo } from 'react';
import { Search, MapPin, Phone, Tag } from 'lucide-react';
import { useAnuncios } from '../context/AnunciosContext';

export default function Feed() {
    const { anuncios, setAnuncios, carregando, setCarregando } = useAnuncios();
    const [searchTerm, setSearchTerm] = useState('');


    const anunciosFiltrados = useMemo(() => {
        const termoBusca = searchTerm.toLowerCase().trim();

        return anuncios.filter((ad) => {
            const tituloContem = (ad.title || '').toLowerCase().includes(termoBusca);
            const descricaoContem = (ad.description || '').toLowerCase().includes(termoBusca);
            return tituloContem || descricaoContem;
        });

    }, [anuncios, searchTerm]);

    useEffect(() => {
        const buscarAnuncios = async () => {

            if (anuncios.length > 0) {
                setCarregando(false);
                return;
            }

            try {
                setCarregando(true);

                const response = await fetch('http://localhost:3000/v1/ads');

                if (!response.ok) {
                    throw new Error('Falha ao sincronizar com o servidor.');
                }

                const data = await response.json();

                setAnuncios(data);
                console.log('✅ Anúncios carregados com sucesso no Contexto:', data);

            } catch (error) {
                console.error('Erro na integração HTTP:', error);
            } finally {
                setCarregando(false);
            }
        };

        buscarAnuncios();
    }, [setAnuncios, setCarregando, anuncios.length]);

    return (
        <div className="page-container feed-page">
            <div className="search-bar">
                <Search size={20} />
                <input type="text" placeholder="Buscar por TV, Sofá, faxina..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {carregando ? (
                <div className="feed-status">
                    <p>Carregando anúncios do condomínio...</p>
                </div>
            ) : anuncios.length === 0 ? (
                <div className="feed-status">
                    <p>Nenhum anúncio encontrado. Seja o primeiro a desapegar!</p>
                </div>
            ) : anunciosFiltrados.length === 0 ? (
                <div className="feed-status">
                    <p>Nenhum desapego encontrado para a sua busca: "{searchTerm}"</p>
                </div>
            ) : (
                <div className="ads-grid">
                    {anunciosFiltrados.map((ad) => (
                        <div key={ad.id} className="form-card">

                            {ad.image ? (
                                <img src={ad.image} alt={ad.title} loading="lazy" className="ad-card-image" />
                            ) : (
                                <div className="ad-card-image-placeholder">
                                    <Tag size={48} />
                                </div>
                            )}

                            <div className="ad-card-body">
                                <div className="ad-card-header">
                                    <span className="ad-card-badge">{ad.category}</span>
                                    <span className="ad-card-date">
                                        {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>

                                <h3 className="ad-card-title">{ad.title}</h3>
                                <p className="ad-card-price">
                                    {Number(ad.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                                <p className="ad-card-description">{ad.description}</p>

                                <div className="ad-card-footer">
                                    <div className="ad-card-location">
                                        <MapPin size={16} /> {ad.location}
                                    </div>
                                    <p className="ad-card-author">Vendido por: {ad.author}</p>

                                    <a
                                        href={`https://wa.me/55${ad.phone}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-whatsapp"
                                    >
                                        <Phone size={16} /> Chamar no WhatsApp
                                    </a>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}