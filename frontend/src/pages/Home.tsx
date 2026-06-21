import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Smartphone, Zap, MapPin, Lock, Camera, TrendingUp } from 'lucide-react';
import apego from '../assets/apego.svg';

export default function Home() {
    return (
        <div className="page-container home-landing">
            <section className="hero-app-style">
                <div className="hero-content-wrapper">
                    <div className="pill-badge">
                        <span className="live-dot"></span> Exclusivo para moradores
                    </div>
                    <h1 className="hero-title-bold">
                        Seu condomínio virou um <span className="text-gradient">shopping privado.</span>
                    </h1>
                    <p className="hero-subtitle-cool">
                        Compre, venda e troque com quem mora a um elevador de distância. Zero taxa de entrega, zero dor de cabeça, 100% de confiança.
                    </p>

                    <div className="action-group">
                        <Link to="/cadastro" className="btn btn-app-primary">
                            <Camera size={18} /> Anunciar Desapego
                        </Link>
                        <Link to="/feed" className="btn btn-app-ghost">
                            Ver vitrine <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="social-proof">
                        <div className="avatars">
                            <img src="https://i.pravatar.cc/100?img=5" alt="Vizinho" />
                            <img src="https://i.pravatar.cc/100?img=12" alt="Vizinho" />
                            <img src="https://i.pravatar.cc/100?img=33" alt="Vizinho" />
                        </div>
                        <span>Vizinhos do <strong>condomínio</strong> já estão negociando.</span>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <div className="section-header-center">
                    <h2>Como funciona a mágica</h2>
                    <p>Esqueça os classificados cheios de golpes da internet.</p>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-icon-wrapper"><Smartphone size={28} /></div>
                        <h3>1. Fotografe e Poste</h3>
                        <p>Tirou foto, colocou o preço, tá no ar. Leva literalmente menos de 1 minuto para criar seu anúncio.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon-wrapper"><Zap size={28} /></div>
                        <h3>2. Papo Reto no Whats</h3>
                        <p>Sem chat travado no app. O vizinho clica e cai direto no seu WhatsApp para fechar negócio.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon-wrapper"><MapPin size={28} /></div>
                        <h3>3. Entrega de Chinelo</h3>
                        <p>Desça até a portaria, entregue o produto, receba o PIX na hora e volte pro sofá em 5 minutos.</p>
                    </div>
                </div>
            </section>

            <section className="security-pitch">
                <div className="security-pitch-content">
                    <div className="security-text">
                        <h2>Ambiente <span className="highlight-lock">100% Blindado</span></h2>
                        <p>Aqui não entra perfil fake. Nosso ecossistema é desenhado para garantir que você saiba exatamente de qual bloco ou apartamento está comprando.</p>
                        <ul className="check-list">
                            <li><Lock size={18} /> Acesso e negociações restritas à comunidade</li>
                            <li><ShieldCheck size={18} /> Sem intermediários retendo o seu dinheiro</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="bottom-cta">
                <div className="bottom-cta-box">
                    <h2>Pronto para fazer dinheiro com o que tá parado aí?</h2>
                    <p>Aquele violão encostado ou a furadeira que você usou uma vez valem dinheiro para o seu vizinho.</p>
                    <Link to="/cadastro" className="btn btn-massive">
                        Criar meu primeiro anúncio <TrendingUp size={20} />
                    </Link>
                </div>
            </section>
            <footer className="home-footer" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 0 20px 0',
                borderTop: '1px solid var(--border-color)',
                marginTop: '24px',
                gap: '8px'
            }}>
                <img
                    src={apego}
                    alt="Desapega Vizinho"
                    style={{ height: '32px', objectFit: 'contain' }}
                />
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    © {new Date().getFullYear()} Desapega Vizinho — Todos os direitos reservados.
                </p>
            </footer>
        </div>
    );
}