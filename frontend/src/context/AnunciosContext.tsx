import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Anuncio {
    id: string;
    title: string;
    category: string;
    price: number;
    description: string;
    author: string;
    phone: string;
    location: string;
    image: string | null;
    createdAt: string;
}

interface AnunciosContextType {
    anuncios: Anuncio[];
    setAnuncios: React.Dispatch<React.SetStateAction<Anuncio[]>>;
    carregando: boolean;
    setCarregando: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnunciosContext = createContext<AnunciosContextType | undefined>(undefined);

export const AnunciosProvider = ({ children }: { children: ReactNode }) => {
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true); // Começa como true para exibir o loading no feed

    return (
        <AnunciosContext.Provider value={{ anuncios, setAnuncios, carregando, setCarregando }}>
            {children}
        </AnunciosContext.Provider>
    );
};

export const useAnuncios = (): AnunciosContextType => {
    const context = useContext(AnunciosContext);
    if (!context) {
        throw new Error('useAnuncios deve ser usado dentro de um AnunciosProvider');
    }
    return context;
};