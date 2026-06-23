import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Menu, LogOut } from 'lucide-react';
import logoApego from '../assets/apego.svg';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        logout();
        navigate('/login');
    };
    return (
        <header className="navbar-header">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img
                        src={logoApego}
                        alt="Desapega Vizinho"
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    />
                    <div>
                        <h1>Desapega<span className="logo-accent"> Vizinho</span></h1>
                    </div>
                </Link>


                <nav className="navbar-menu desktop-only">
                    <Link to="/" className="nav-link">Início</Link>
                    <Link to="/feed" className="nav-link">Anúncios</Link>
                    
                    {isAuthenticated && (
                        <Link to="/perfil" className="nav-link">Meu Perfil</Link>
                    )}
                    <Link to="/cadastro" className="nav-link nav-cta">
                        <PlusCircle size={16} /> Anunciar
                    </Link>
                    {isAuthenticated && (
                        <button
                            className="nav-link btn-logout"
                            onClick={() => setIsLogoutModalOpen(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <LogOut size={16} /> Sair da Conta
                        </button>
                    )}

                
                </nav>


                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Abrir menu"
                >
                    <Menu size={24} />
                </button>
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                title="Sair do Aplicativo"
                message="Tem certeza que deseja encerrar sua sessão? Você precisará digitar seu e-mail e senha novamente para ver os desapegos dos moradores."
                confirmText="Sim, Sair"
                cancelText="Permanecer"
                onConfirm={handleConfirmLogout}
                onClose={() => setIsLogoutModalOpen(false)}
            />
        </header>
    );
}