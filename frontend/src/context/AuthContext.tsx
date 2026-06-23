import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    nome: string;
    email: string;
    whatsapp: string;
    localizacao: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (dados: any) => Promise<void>;
    register: (dados: any) => Promise<void>;
    logout: () => void;
    updateUserSession: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('@Desapega:token');
        const storedUser = localStorage.getItem('@Desapega:user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (credenciais: any) => {
        const response = await fetch('http://localhost:3000/v1/auth/login', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciais)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Erro no login');

        localStorage.setItem('@Desapega:token', data.token);
        localStorage.setItem('@Desapega:user', JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);
    };

    const register = async (dadosCadastro: any) => {
        const response = await fetch('http://localhost:3000/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCadastro)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Erro no cadastro');

        await login({ email: dadosCadastro.email, password: dadosCadastro.password });
    };

    const logout = () => {
        localStorage.removeItem('@Desapega:token');
        localStorage.removeItem('@Desapega:user');
        setToken(null);
        setUser(null);
    };

    const updateUserSession = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('@Desapega:user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            isAuthenticated: !!token, 
            isLoading, 
            login, 
            register, 
            logout,
            updateUserSession 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);