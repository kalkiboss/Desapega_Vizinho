import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import logoApego from '../assets/apego.svg';

export default function Navbar() {
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

                <nav className="navbar-menu">
                    <Link to="/" className="nav-link">Início</Link>
                    <Link to="/feed" className="nav-link">Anúncios</Link>
                    <Link to="/cadastro" className="nav-link nav-cta">
                        <PlusCircle size={16} /> Anunciar
                    </Link>
                </nav>
            </div>
        </header>
    );
}