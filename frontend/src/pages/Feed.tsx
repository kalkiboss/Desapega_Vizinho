import React from 'react';
import { Search } from 'lucide-react';

export default function Feed() {
    return (
        <div className="page-container feed-page">
            <div className="search-bar">
                <Search className="w-[20px] h-[20px]" />
                <input type="text" placeholder="Buscar por TV, vaga, faxina..." disabled />
            </div>

            <div className="feed-status">
                <p>Carregando anúncios do condomínio...</p>
            </div>
        </div>
    );
}