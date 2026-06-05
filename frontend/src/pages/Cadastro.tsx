import React from 'react';
import { useState} from 'react';
 
export default function Cadastro() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('OUTROS');
    const [price, setPrice] = useState('');
    const [description, setDescription ] =useState('');
    const [ author, setAuthor ] = useState('');
    const [phone, setPhone ] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) return setError('Por favor, insira um título para o anúncio.');
        if (!price.trim()) return setError('O preço do produto é obrigatório.');
        if (!phone.trim()) return setError('Um número de WhatsApp é necessário para os vizinhos te contatarem.');
        if (!location.trim()) return setError('A localização interna (Bloco/Apto) é obrigatória para a entrega.');

        const precoConvertido = Number(price);
        if (isNaN(precoConvertido) || precoConvertido <= 0) {
            return setError('O preço digitado é inválido. Digite um valor maior que zero.');
        }

        const digitosTelefone = phone.replace(/\D/g, '');
        if (digitosTelefone.length < 10) {
            return setError('O número de WhatsApp está incompleto. Certifique-se de incluir o DDD.');
        }

        setError('');
        console.log('Payload validado com sucesso e pronto para envio:', {
            title: title.trim(),
            category,
            price: precoConvertido,
            description: description.trim(),
            author: author.trim() || 'Anônimo',
            phone: digitosTelefone,
            location: location.trim()
        });
        
        alert('Sucesso! Formulário validado localmente.');
    };


    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const apenasNumeros = input.replace(/\D/g, '');
        
        if (apenasNumeros.length <= 2) {
            setPhone(apenasNumeros);
        } else if (apenasNumeros.length <= 7) {
            setPhone(`(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`);
        } else {
            setPhone(`(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        let limpo = input.replace(/[^0-9.]/g, '');
        const partes = limpo.split('.');

        if (partes.length > 2) {
            limpo = partes[0] + '.' + partes.slice(1).join('');
        }
        
        if (partes[1] && partes[1].length > 2) {
            limpo = partes[0] + '.' + partes[1].slice(0, 2);
        }

        if (limpo.length <= 9) {
            setPrice(limpo);
        }
    };

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const apenasLetras = input.replace(/[0-9]/g, '');
        setAuthor(apenasLetras);
    };

    return (
        <div className="page-container cadastro-page">
            <div className="form-card">
                <h2>Criar Anúncio</h2>
                <p>Preencha os detalhes para os seus vizinhos verem.</p>

                {error && (
                    <div style={{ backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: '700' }}>
                        ⚠️ {error}
                    </div>
                )}

                <form className="cadastro-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Título do Anúncio *</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Bicicleta Caloi Aro 29" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label>Categoria</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #d4d4d8', backgroundColor: 'var(--bg-surface)' }}
                        >
                            <option value="OUTROS">Outros</option>
                            <option value="MÓVEIS">Móveis</option>
                            <option value="ELETRÔNICOS">Eletrônicos</option>
                            <option value="VEÍCULOS">Vagas / Veículos</option>
                            <option value="SERVIÇOS">Serviços</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Preço (R$) *</label>
                        <input 
                            type="text" 
                            placeholder="Ex: 150.00" 
                            value={price}
                            onChange={handlePriceChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição detalhada</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Entrego no Bloco C, ótimo estado..." 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Seu Nome / Apelido</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Carlos (Apto 302)" 
                            value={author}
                            onChange={handleAuthorChange}
                            maxLength={30}
                        />
                    </div>

                    <div className="form-group">
                        <label>WhatsApp de Contato *</label>
                        <input 
                            type="text" 
                            placeholder="Ex: 61999998888" 
                            value={phone}
                            onChange={handlePhoneChange}
                            maxLength={15}
                        />
                    </div>

                    <div className="form-group">
                        <label>Localização no Condomínio *</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Bloco C - Apto 402" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            maxLength={40}
                        />
                    </div>

                    <button type="submit" className="btn btn-submit">
                        Salvar Anúncio
                    </button>
                </form>
            </div>
        </div>
    );
}