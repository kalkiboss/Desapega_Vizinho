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
                        <span className="sidebar-brand-name">  Desapega Vizinho</span>
                    </div>
                    <button className="sidebar-close-btn" onClick={onClose} aria-label="Fechar menu">
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-menu-links">
                    <Link to="/" className="sidebar-link" onClick={onClose}>
                        <Home size={18} /> Início
                    </Link>
                    
                    <Link to="/feed" className="sidebar-link" onClick={onClose}>
                        <LayoutGrid size={18} /> Anúncios
                    </Link>

                    {isAuthenticated && (
                        <Link to="/perfil" className="sidebar-link" onClick={onClose}>
                            <User size={18} /> Meu Perfil
                        </Link>
                    )}

                    {isAuthenticated && (
                        <button
                            className="sidebar-link btn-sidebar-logout"
                            onClick={() => setIsLogoutModalOpen(true)}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer' 
                            }}
                        >
                            <LogOut size={18} /> Sair da Conta
                        </button>
                    )}

                    <Link to="/cadastro" className="sidebar-link sidebar-cta" onClick={onClose}>
                        <PlusCircle size={18} /> <span>Anunciar Desapego</span>
                    </Link>
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