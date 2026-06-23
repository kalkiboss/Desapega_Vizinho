import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Menu } from 'lucide-react';
import logoApego from '../assets/apego.svg';
import Sidebar from '../components/Sidebar';

export default function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                    <Link to="/perfil" className="nav-link">Meu Perfil</Link>
                    <Link to="/" className="nav-link">Início</Link>
                    <Link to="/feed" className="nav-link">Anúncios</Link>
                    <Link to="/cadastro" className="nav-link nav-cta">
                        <PlusCircle size={16} /> Anunciar
                    </Link>
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
        </header>
    );
}