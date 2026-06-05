import React from 'react';
import { useState} from 'react';
 
export default function Cadastro() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('OUTROS');
    const [price, setPrice] = useState('');
    const [description, setDescription ] =useState('');
    const [ author, setAuthor ] = useState('');
    const [phone, setPhone ] = useState('');

    return (
        <div className="page-container cadastro-page">
            <div className="form-card">
                <h2>Criar Anúncio</h2>
                <p>Preencha os detalhes para os seus vizinhos verem.</p>

                <form className="cadastro-form">
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