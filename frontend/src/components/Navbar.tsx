import React from 'react';
import { Link } from 'react-router-dom';
import { Store, PlusCircle, Tag } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="navbar-header">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <Store className="w-[20px] h-[20px]" />
                    </div>
                    <div>
                        <h1>Desapega<span className="logo-accent">Vizinho</span></h1>
                        <p>Mercado Privado</p>
                    </div>
                </Link>

                <nav className="navbar-menu">
                    <Link to="/" className="nav-link">Início</Link>
                    <Link to="/feed" className="nav-link">Anúncios</Link>
                    <Link to="/cadastro" className="nav-link nav-cta">
                        <PlusCircle className="w-[16px] h-[16px]" /> Anunciar
                    </Link>
                </nav>
            </div>
        </header>
    );
}