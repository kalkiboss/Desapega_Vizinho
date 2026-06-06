import { useEffect } from 'react';
import { Search, MapPin, Phone, Tag } from 'lucide-react';
import { useAnuncios } from '../context/AnunciosContext';

export default function Feed() {
    const { anuncios, setAnuncios, carregando, setCarregando } = useAnuncios();

    useEffect(() => {
        const buscarAnuncios = async () => {
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
                // Desliga o loading independente de sucesso ou erro
                setCarregando(false);
            }
        };

        buscarAnuncios();
    }, [setAnuncios, setCarregando]);

    return (
        <div className="page-container feed-page">
            <div className="search-bar">
                <Search className="w-[20px] h-[20px]" />
                <input type="text" placeholder="Buscar por TV, vaga, faxina..." disabled />
            </div>

            {carregando ? (
                <div className="feed-status">
                    <p>Carregando anúncios do condomínio...</p>
                </div>
            ) : anuncios.length === 0 ? (
                <div className="feed-status">
                    <p>Nenhum anúncio encontrado. Seja o primeiro a desapegar!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginTop: '32px' }}>
                    {anuncios.map((ad) => (
                        <div key={ad.id} className="form-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            {ad.image ? (
                                <img src={ad.image} alt={ad.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '220px', backgroundColor: '#e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa' }}>
                                    <Tag className="w-[48px] h-[48px]" />
                                </div>
                            )}

                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--color-primary)', backgroundColor: 'var(--color-secondary)', padding: '6px 12px', borderRadius: '999px' }}>
                                        {ad.category}
                                    </span>
                                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>
                                        {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2 }}>{ad.title}</h3>
                                <p style={{ fontSize: 'var(--fs-xxl)', fontWeight: 900, color: 'var(--color-success)' }}>
                                    {Number(ad.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', flex: 1 }}>{ad.description}</p>

                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                                        <MapPin className="w-[16px] h-[16px]" /> {ad.location}
                                    </div>
                                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>Vendido por: {ad.author}</p>

                                    <a
                                        href={`https://wa.me/55${ad.phone}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn"
                                        style={{ backgroundColor: '#25D366', color: '#fff', justifyContent: 'center', width: '100%', marginTop: '8px' }}
                                    >
                                        <Phone className="w-[16px] h-[16px]" /> Chamar no WhatsApp
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