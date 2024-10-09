// src/QuoteFetcher.js
import React, { useState } from 'react';

const QuoteFetcher = () => {
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [crypto, setCrypto] = useState('ETH');
  const [currency, setCurrency] = useState('BRL');
  const [amount, setAmount] = useState(100); // Valor padrão
  const [region, setRegion] = useState('BR');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = `/onramp/v1/quotes?partnerAccountId=baa2d9f8-6ff0-48e9-babf-709c9007ffbe&payment=${paymentMethod}&crypto=${crypto}&fiat=${currency}&amount=${amount}&region=${region}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'fGhKXIdWINsjKFuMZpnKqPrlWOIGocRE',
          'signature': 'dd32b38bc3cd9046ce0d09699c770deaf43fe4f9c06eebc649ecc4ba76802930',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'Erro ao buscar cotação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Fetcher de Cotação</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Método de pagamento"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        <input
          type="text"
          placeholder="Criptomoeda"
          value={crypto}
          onChange={(e) => setCrypto(e.target.value)}
        />
        <input
          type="text"
          placeholder="Moeda (fiat)"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Região"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Buscar Cotação'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {quote && <pre>{JSON.stringify(quote, null, 2)}</pre>}
    </div>
  );
};

export default QuoteFetcher;
