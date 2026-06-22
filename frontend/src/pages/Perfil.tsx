import { User, MapPin, Phone, Mail, Edit3 } from 'lucide-react';
import apego from '../assets/apego.svg';

export default function Perfil() {
    const morador = {
        nome: "Carlos Eduardo",
        email: "carlos.edu@email.com",
        telefone: "(61) 99999-8888",
        localizacao: "Bloco C - Apto 402"
    };

    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '32px' }}>

            {/* Header do Dashboard */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <User size={32} />
                </div>
                <div>
                    <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 900 }}>Meu Perfil</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gerencie seus dados e seus anúncios ativos</p>
                </div>
            </div>
            <div className="form-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2>Dados do Morador</h2>
                    <button className="btn" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)', padding: '8px 16px', fontSize: 'var(--fs-sm)' }}>
                        <Edit3 size={16} /> Editar
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label><User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Nome / Apelido</label>
                        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-global)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                            {morador.nome}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> E-mail de Acesso</label>
                        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-global)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                            {morador.email}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label><Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> WhatsApp</label>
                        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-global)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                            {morador.telefone}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Localização Interna</label>
                        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-global)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                            {morador.localizacao}
                        </div>
                    </div>

                </div>
            </div>
            <footer className="home-footer" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '40px 0 20px 0', borderTop: '1px solid var(--border-color)', marginTop: 'auto', gap: '8px'
            }}>
                <img src={apego} alt="Desapega Vizinho" style={{ height: '32px', objectFit: 'contain' }} />
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    © {new Date().getFullYear()} Desapega Vizinho — Todos os direitos reservados.
                </p>
            </footer>

        </div>
    );
}