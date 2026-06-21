import { Link } from 'react-router-dom';
import { PlusCircle, Home, LayoutGrid, X } from 'lucide-react';
import { useEffect } from 'react';
import logoApego from '../assets/apego.svg';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
                </nav>
            </aside>
        </>
    );
}