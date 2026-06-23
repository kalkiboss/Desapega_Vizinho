import { useMemo, useState } from 'react';
import { User, MapPin, Phone, Mail, Edit3, PackageOpen, Trash2 } from 'lucide-react';
import apego from '../assets/apego.svg';
import { useAnuncios } from '../context/AnunciosContext';
import ImageCarousel from '../components/ImageCarousel';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Perfil() {
    const morador = {
        nome: "Carlos Eduardo",
        email: "carlos.edu@email.com",
        telefone: "(61) 99999-8888",
        localizacao: "Bloco C - Apto 402"
    };

    const { anuncios, setAnuncios } = useAnuncios();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdId, setSelectedAdId] = useState<string | null>(null);

    const meusAnuncios = useMemo(() => {
        return anuncios.filter(ad => ad.author === morador.nome);
    }, [anuncios, morador.nome]);


    const executeDelete = async () => {
        if (!selectedAdId) return;

        try {
            const response = await fetch(`http://localhost:3000/v1/ads/${selectedAdId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Falha ao comunicar com o servidor.');
            }

            setAnuncios((prevAnuncios) => prevAnuncios.filter(ad => ad.id !== selectedAdId));
            setIsModalOpen(false); // Fecha o modal após o sucesso

        } catch (error) {
            console.error('Erro ao excluir anúncio:', error);
            alert('Erro de conexão. Não foi possível excluir o anúncio no momento.');
        } finally {
            setSelectedAdId(null);
        }
    };

    const openDeleteConfirmation = (id: string) => {
        setSelectedAdId(id);
        setIsModalOpen(true);
    };

    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '32px' }}>

            {/* Header do Dashboard */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <User size={32} />
                </div>
                <div>
                    <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 900 }}>Meu Perfil</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gerencie seus dados e seus anúncios ativos</p>
                </div>
            </div>
            <div className="form-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2>Dados do Morador</h2>
                    <button className="btn" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)', padding: '8px 16px', fontSize: 'var(--fs-sm)' }}>
                        <Edit3 size={16} /> Editar
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label><User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Nome / Apelido</label>
                        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-global)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                            {morador.nome}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> E-mail de Acesso</label>
                        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-global)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                            {morador.email}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label><Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> WhatsApp</label>
                        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-global)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                            {morador.telefone}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Localização Interna</label>
                        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-global)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                            {morador.localizacao}
                        </div>
                    </div>

                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 900 }}>Meus Anúncios Ativos</h2>
                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                        {meusAnuncios.length} {meusAnuncios.length === 1 ? 'item' : 'itens'}
                    </span>
                </div>

                {meusAnuncios.length === 0 ? (
                    <div className="feed-status" style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                        <PackageOpen size={48} style={{ margin: '0 auto 16px', color: 'var(--text-secondary)', opacity: 0.5 }} />
                        <p>Você ainda não tem nenhum desapego ativo.</p>
                    </div>
                ) : (
                    <div className="ads-grid">
                        {meusAnuncios.map((ad) => (
                            <div key={ad.id} className="form-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                                <ImageCarousel
                                    images={ad.images && ad.images.length > 0 ? ad.images : (ad.image ? [ad.image] : [])}
                                    altTitle={ad.title}
                                />

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

                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
                                        <button
                                            className="btn"
                                            onClick={() => openDeleteConfirmation(ad.id)}
                                            style={{ flex: 1, backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', fontSize: 'var(--fs-sm)' }}
                                        >
                                            <Trash2 size={16} /> Excluir
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="home-footer" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '40px 0 20px 0', borderTop: '1px solid var(--border-color)', marginTop: 'auto', gap: '8px'
            }}>
                <img src={apego} alt="Desapega Vizinho" style={{ height: '32px', objectFit: 'contain' }} />
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    © {new Date().getFullYear()} Desapega Vizinho — Todos os direitos reservados.
                </p>
            </footer>

            <ConfirmationModal
                isOpen={isModalOpen}
                title="Excluir Anúncio"
                message="Tem certeza que deseja remover este desapego? Essa ação é permanente e o item sumirá imediatamente do feed do condomínio."
                confirmText="Sim, Excluir"
                cancelText="Manter Anúncio"
                onConfirm={executeDelete}
                onClose={() => { setIsModalOpen(false); setSelectedAdId(null); }}
            />

        </div>
    );

}