import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="page-container home-page">
            <div className="hero-banner">
                <div className="hero-content">
                    <div className="badge">
                        <ShieldCheck className="w-[16px] h-[16px]" /> Compra 100% Segura
                    </div>
                    <h2>Seu novo mercado é o seu condomínio.</h2>
                    <p>Venda desapegos, alugue vagas de garagem ou ofereça serviços diretamente para seus vizinhos.</p>
                    <div className="hero-actions">
                        <Link to="/feed" className="btn btn-primary">
                            Ver Anúncios <ArrowRight className="w-[16px] h-[16px]" />
                        </Link>
                        <Link to="/cadastro" className="btn btn-secondary">Anunciar Algo</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}