import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Home, LayoutGrid, User, X, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import logoApego from '../assets/apego.svg';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isOpen]);

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        onClose();
        logout();
        navigate('/login');
    };

    return (
        <>
            <div
                className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>

                <div className="sidebar-brand-header">
                    <div className="sidebar-logo-group">
                        <img src={logoApego} alt="Logo" className="sidebar-mini-logo" />
                        <span className="sidebar-brand-name">Desapega</span>
                    </div>
                    <button className="sidebar-close-btn" onClick={onClose} aria-label="Fechar menu">
                        <X size={20} />
                    </button>
                </div>


                <div className="sidebar-divider" />

                <nav className="sidebar-menu-links">
                    <Link to="/" className="sidebar-link" onClick={onClose}>
                        <Home size={18} /> <span>Início</span>
                    </Link>
                    <Link to="/feed" className="sidebar-link" onClick={onClose}>
                        <LayoutGrid size={18} /> <span>Anúncios</span>
                    </Link>

                    <div className="sidebar-divider" style={{ margin: '8px 0' }} />

                    <Link to="/cadastro" className="sidebar-link sidebar-cta" onClick={onClose}>
                        <PlusCircle size={18} /> <span>Anunciar Desapego</span>
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link to="/perfil" className="sidebar-link" onClick={onClose}>
                                <User size={18} /> <span>Meu Perfil</span>
                            </Link>

                            <div className="sidebar-divider" style={{ margin: '8px 0' }} />

                            <button
                                className="sidebar-link"
                                onClick={() => setIsLogoutModalOpen(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    width: '100%',
                                    textAlign: 'left',
                                    color: '#f87171',
                                    cursor: 'pointer'
                                }}
                            >
                                <LogOut size={18} /> <span>Sair da Conta</span>
                            </button>
                        </>
                    )}
                </nav>
            </aside>
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                title="Sair do Aplicativo"
                message="Tem certeza que deseja encerrar sua sessão? Você precisará digitar seu e-mail e senha novamente para ver os desapegos dos moradores."
                confirmText="Sim, Sair"
                cancelText="Permanecer"
                onConfirm={handleConfirmLogout}
                onClose={() => setIsLogoutModalOpen(false)}
            />
        </>
    );
}