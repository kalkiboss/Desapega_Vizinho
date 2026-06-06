import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAnuncios } from '../context/AnunciosContext';

export default function Feed() {
    const { setAnuncios, carregando, setCarregando } = useAnuncios();

    useEffect(() => {
        const buscarAnuncios = async () => {
            try {
                setCarregando(true);

                const response = await fetch('http://localhost:3000/v1/ads');

                if (!response.ok) {
                    throw new Error('Falha ao sincronizar com o servidor.');
                }

                const data = await response.json();

                setAnuncios(data);
                console.log('✅ Anúncios carregados com sucesso no Contexto:', data);

            } catch (error) {
                console.error('Erro na integração HTTP:', error);
            } finally {
                // Desliga o loading independente de sucesso ou erro
                setCarregando(false);
            }
        };

        buscarAnuncios();
    }, [setAnuncios, setCarregando]);

    return (
        <div className="page-container feed-page">
            <div className="search-bar">
                <Search className="w-[20px] h-[20px]" />
                <input type="text" placeholder="Buscar por TV, vaga, faxina..." disabled />
            </div>

            <div className="feed-status">
                {carregando ? (
                    <p>Carregando anúncios do condomínio...</p>
                ) : (
                    <p>Dados injetados no contexto! (Vamos renderizar os cards no Passo 6.3)</p>
                )}
            </div>
        </div>
    );
}