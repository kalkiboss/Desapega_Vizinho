import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, ShieldAlert } from 'lucide-react';
import '../styles/login.css';

export default function Login() {
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [localizacao, setLocalizacao] = useState('');

    const handleToggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            if (isLoginMode) {

                if (!email.trim() || !password.trim()) {
                    return setError('Por favor, preencha todos os campos obrigatórios de acesso.');
                }
                await login({ email, password });
            } else {

                if (!nome.trim() || !whatsapp.trim() || !localizacao.trim()) {
                    return setError('Todos os campos de cadastro são obrigatórios para moradores.');
                }
                await register({ nome, email, password, whatsapp, localizacao });
            }


            navigate('/feed');

        } catch (err: unknown) {

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Falha na autenticação. Verifique seus dados de acesso.');
            }
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">

                <div className="auth-header">
                    <h2>{isLoginMode ? 'Acessar Condomínio' : 'Primeiro Acesso'}</h2>
                    <p>
                        {isLoginMode
                            ? 'Digite suas credenciais exclusivas de morador.'
                            : 'Cadastre seus dados para validar sua entrada na rede privada.'}
                    </p>
                </div>

                {error && (
                    <div className="auth-error-banner">
                        <ShieldAlert size={18} /> {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>

                    {!isLoginMode && (
                        <>
                            <div className="form-group">
                                <label>Nome / Apelido</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Carlos Silva"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>WhatsApp de Contato</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 61999998888"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Localização Interna</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Bloco C - Apto 402"
                                    value={localizacao}
                                    onChange={(e) => setLocalizacao(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>E-mail Corporativo / Pessoal</label>
                        <input
                            type="email"
                            placeholder="seu.nome@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha de Acesso</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-submit" style={{ marginTop: '8px' }}>
                        {isLoginMode ? (
                            <>Entrar no App <LogIn size={18} /></>
                        ) : (
                            <>Criar minha Conta <UserPlus size={18} /></>
                        )}
                    </button>
                </form>

                <div className="auth-toggle-footer">
                    {isLoginMode ? 'Ainda não validou seu acesso?' : 'Já possui cadastro ativo?'}
                    <button type="button" className="auth-toggle-btn" onClick={handleToggleMode}>
                        {isLoginMode ? 'Registrar Primeiro Acesso' : 'Fazer Login'}
                    </button>
                </div>

            </div>
        </div>
    );
}