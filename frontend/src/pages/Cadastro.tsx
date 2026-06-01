import React from 'react';

export default function Cadastro() {
    return (
        <div className="page-container cadastro-page">
            <div className="form-card">
                <h2>Criar Anúncio</h2>
                <p>Preencha os detalhes para os seus vizinhos verem.</p>

                <form className="cadastro-form">
                    {/* O formulário controlado será implementado na Issue #5 */}
                    <div className="form-group">
                        <label>Título do Anúncio *</label>
                        <input type="text" placeholder="Ex: Bicicleta Caloi Aro 29" disabled />
                    </div>
                    <button type="button" className="btn btn-submit" disabled>Aguardando Integração</button>
                </form>
            </div>
        </div>
    );
}