import { useMemo, useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Edit3, PackageOpen, Trash2 } from 'lucide-react';
import apego from '../assets/apego.svg';
import { useAnuncios } from '../context/AnunciosContext';
import { useAuth } from '../context/AuthContext';
import ImageCarousel from '../components/ImageCarousel';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/Perfil.css';

export default function Perfil() {

    const { user, updateUserSession } = useAuth();
    const { anuncios, setAnuncios } = useAnuncios();
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [userNome, setUserNome] = useState('');
    const [userWhatsapp, setUserWhatsapp] = useState('');
    const [userLocalizacao, setUserLocalizacao] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        const resgatarAnunciosSeVazio = async () => {
            if (anuncios.length > 0) return;

            try {
                const response = await fetch('http://localhost:3000/v1/ads');
                if (!response.ok) throw new Error('Erro ao sincronizar com a API.');

                const data = await response.json();
                setAnuncios(data);
            } catch (error) {
                console.error('Erro de persistência no Perfil:', error);
            }
        };

        resgatarAnunciosSeVazio();
    }, [anuncios.length, setAnuncios]);

    const meusAnuncios = useMemo(() => {
        if (!user) return [];
        return anuncios.filter(ad => ad.author === user.nome);
    }, [anuncios, user]);

    const handleStartUserEdit = () => {
        if (!user) return;
        setUserNome(user.nome);
        setUserWhatsapp(user.whatsapp);
        setUserLocalizacao(user.localizacao);
        setIsEditingUser(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !userNome.trim() || !userWhatsapp.trim() || !userLocalizacao.trim()) return;

        try {
            const response = await fetch(`http://localhost:3000/v1/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: userNome,
                    whatsapp: userWhatsapp,
                    localizacao: userLocalizacao
                })
            });

            if (!response.ok) throw new Error('Falha ao atualizar dados de perfil na API.');

            const updatedData = await response.json();

            if (updateUserSession) {
                updateUserSession({
                    ...user,
                    nome: updatedData.nome,
                    whatsapp: updatedData.whatsapp,
                    localizacao: updatedData.localizacao
                });
            }

            setIsEditingUser(false);

        } catch (error: unknown) {
            console.error('Erro na sincronização do Perfil:', error);
            alert('Não foi possível salvar as alterações do perfil.');
        }
    };

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
            setIsModalOpen(false);

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

    const handleStartEdit = (ad: any) => {
        setEditId(ad.id);
        setEditTitle(ad.title);
        setEditPrice(ad.price.toString());
        setEditDescription(ad.description);
        setIsEditing(true);
    };


    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setEditTitle('');
        setEditPrice('');
        setEditDescription('');
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editId || !editTitle.trim() || !editPrice.trim()) return;

        try {
            const response = await fetch(`http://localhost:3000/v1/ads/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editTitle,
                    price: editPrice,
                    description: editDescription
                })
            });

            if (!response.ok) throw new Error('Falha ao atualizar dados na API.');

            setAnuncios((prevAnuncios) => prevAnuncios.map(ad =>
                ad.id === editId ? { ...ad, title: editTitle, price: Number(editPrice), description: editDescription } : ad
            ));

            handleCancelEdit();

        } catch (error) {
            console.error('Erro na sincronização do UPDATE:', error);
            alert('Não foi possível salvar as alterações. Verifique sua conexão.');
        }
    };
    return (
        <div className="page-container perfil-container">
            <div className="perfil-header">
                <div className="perfil-avatar">
                    <User size={32} />
                </div>
                <div>
                    <h1 className="perfil-title">Meu Perfil</h1>
                    <p className="perfil-subtitle">Gerencie seus dados e seus anúncios ativos</p>
                </div>
            </div>

            <div className="form-card">
                <div className="perfil-section-header">
                    <h2>Dados do Morador</h2>
                    {!isEditingUser && (
                        <button className="btn btn-edit-profile" onClick={handleStartUserEdit}>
                            <Edit3 size={16} /> Editar
                        </button>
                    )}
                </div>

                {isEditingUser ? (
                    <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group perfil-info-group">
                            <label>Nome / Apelido</label>
                            <input type="text" value={userNome} onChange={(e) => setUserNome(e.target.value)} required />
                        </div>
                        <div className="form-group perfil-info-group">
                            <label>WhatsApp</label>
                            <input type="text" value={userWhatsapp} onChange={(e) => setUserWhatsapp(e.target.value)} required />
                        </div>
                        <div className="form-group perfil-info-group">
                            <label>Localização Interna (Bloco/Apto)</label>
                            <input type="text" value={userLocalizacao} onChange={(e) => setUserLocalizacao(e.target.value)} required />
                        </div>
                        <div className="modal-action-row" style={{ marginTop: '8px' }}>
                            <button type="button" className="btn btn-modal-cancel" onClick={() => setIsEditingUser(false)}>Cancelar</button>
                            <button type="submit" className="btn btn-save-edit">Salvar Perfil</button>
                        </div>
                    </form>
                ) : (
                    <div className="perfil-data-grid">
                        <div className="form-group perfil-info-group">
                            <label><User size={14} className="perfil-icon" /> Nome / Apelido</label>
                            <div className="perfil-info-value">{user?.nome}</div>
                        </div>

                        <div className="form-group perfil-info-group">
                            <label><Mail size={14} className="perfil-icon" /> E-mail de Acesso</label>
                            <div className="perfil-info-value">{user?.email}</div>
                        </div>

                        <div className="form-group perfil-info-group">
                            <label><Phone size={14} className="perfil-icon" /> WhatsApp</label>
                            <div className="perfil-info-value">{user?.whatsapp}</div>
                        </div>

                        <div className="form-group perfil-info-group">
                            <label><MapPin size={14} className="perfil-icon" /> Localização Interna</label>
                            <div className="perfil-info-value">{user?.localizacao}</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="perfil-ads-section">
                <div className="perfil-section-header perfil-section-header.no-margin">
                    <h2 className="perfil-title" style={{ fontSize: 'var(--fs-lg)' }}>Meus Anúncios Ativos</h2>
                    <span className="perfil-ads-count">
                        {meusAnuncios.length} {meusAnuncios.length === 1 ? 'item' : 'itens'}
                    </span>
                </div>

                {meusAnuncios.length === 0 ? (
                    <div className="feed-status perfil-empty-state">
                        <PackageOpen size={48} className="perfil-empty-icon" />
                        <p>Você ainda não tem nenhum desapego ativo.</p>
                    </div>
                ) : (
                    <div className="ads-grid">
                        {meusAnuncios.map((ad) => (
                            <div key={ad.id} className="form-card perfil-ad-card">
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

                                    <div className="perfil-card-actions">
                                        <button className="btn btn-delete-ad" onClick={() => openDeleteConfirmation(ad.id)}>
                                            <Trash2 size={16} /> Excluir
                                        </button>
                                        <button className="btn btn-edit-ad" onClick={() => handleStartEdit(ad)}>
                                            <Edit3 size={16} /> Editar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="home-footer perfil-footer">
                <img src={apego} alt="Desapega Vizinho" className="perfil-footer-logo" />
                <p className="perfil-footer-text">
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

            {isEditing && (
                <>
                    <div className="sidebar-backdrop active edit-modal-backdrop" onClick={handleCancelEdit} />
                    <div className="custom-modal-overlay">
                        <div className="custom-modal-card edit-modal-card">
                            <div className="perfil-section-header perfil-section-header.no-margin">
                                <h3 className="perfil-title" style={{ fontSize: 'var(--fs-lg)' }}>Editar Desapego</h3>
                            </div>

                            <form onSubmit={handleUpdate} className="edit-modal-form">
                                <div className="form-group perfil-info-group">
                                    <label>Título do Anúncio</label>
                                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                                </div>
                                <div className="form-group perfil-info-group">
                                    <label>Preço (R$)</label>
                                    <input type="text" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required />
                                </div>
                                <div className="form-group perfil-info-group">
                                    <label>Descrição Detalhada</label>
                                    <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                </div>

                                <div className="modal-action-row" style={{ marginTop: '12px' }}>
                                    <button type="button" className="btn btn-modal-cancel" onClick={handleCancelEdit}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-save-edit">
                                        Salvar Alterações
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}