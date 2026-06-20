import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="page-container home-page">
            <div className="hero-section">
                <div className="hero-content">
                    <div className="security-badge">
                        <ShieldCheck size={16} />
                        <span>Compra 100% Segura</span>
                    </div>

                    <h1 className="hero-title">Seu novo mercado é o seu condomínio.</h1>
                    <p className="hero-subtitle">
                        Venda desapegos, alugue vagas de garagem ou ofereça serviços diretamente para seus vizinhos.
                    </p>

                    <div className="hero-actions">
                        <Link to="/feed" className="btn btn-primary">
                            Ver Anúncios <ArrowRight size={16} />
                        </Link>
                        <Link to="/cadastro" className="btn btn-secondary">
                            Anunciar Algo
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}