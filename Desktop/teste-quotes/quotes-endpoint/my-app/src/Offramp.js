// Offramp.js
import React, { useState, useCallback } from 'react';
import axios from 'axios';

const Offramp = ({ wallet, setWallet, amount, setAmount, payment, setPayment, crypto, setCrypto, fiat, setFiat, region, setRegion }) => {
  const [resultOfframp, setResultOfframp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOfframpQuote = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/offramp/v1/quotes`, {
        params: {
          partnerAccountId: 'baa2d9f8-6ff0-48e9-babf-709c9007ffbe',
          payment,
          fiat,
          crypto,
          region,
          cryptoAmount: amount,
          wallet,
        },
        headers: {
          'Accept': 'application/json',
          'api-key': 'fGhKXIdWINsjKFuMZpnKqPrlWOIGocRE',
          'signature': 'f6262b4049b424fee9ae5e1148a224cf300adef8cd11de69789c42fa8762f19c',
        },
      });

      setResultOfframp(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao buscar os dados");
      setResultOfframp(null);
    } finally {
      setLoading(false);
    }
  }, [amount, payment, crypto, fiat, region, wallet]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOfframpQuote();
  };

  const handleButtonClick = () => {
    const payout = resultOfframp?.amountOut; // Utilize a saída correta de acordo com a operação
    const fiatCurrency = fiat; // Defina a moeda Fiat
    const urlOfframp = `https://offramp-sandbox.gatefi.com/?merchantId=baa2d9f8-6ff0-48e9-babf-709c9007ffbe&cryptoCurrency=${crypto}&payout=${payout}&fiatCurrency=${fiatCurrency}&region=${region}&wallet=${wallet}&walletLock=true&fiatCurrencyLock=true&cryptoCurrencyLock=true&fiatAmount=${amount}`;
    window.open(urlOfframp, '_blank');
  };

  return (
    <div className="result-container">
      <h2>Offramp - Sell Cryptocurrency</h2>
      <form onSubmit={handleSubmit} className="quote-form">
        <label htmlFor="wallet">
          Wallet
          <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} />
        </label>
        <label htmlFor="amount">
          Amount:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label>
          Payment Method:
          <input type="text" value={payment} onChange={(e) => setPayment(e.target.value)} />
        </label>
        <label>
          Cryptocurrency:
          <input type="text" value={crypto} onChange={(e) => setCrypto(e.target.value)} />
        </label>
        <label>
          Fiat Currency:
          <input type="text" value={fiat} onChange={(e) => setFiat(e.target.value)} />
        </label>
        <label>
          Region:
          <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} />
        </label>
        <button type="submit" className="submit-button">Get Quote</button>
      </form>
    
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {resultOfframp && (
        <div>
          <h3>Quote Result</h3>
          <p>{crypto}: {resultOfframp.amountIn}</p>
          <p>{fiat}: {resultOfframp.amountOut}</p>
          <button onClick={handleButtonClick} className="action-button">Proceed to Offramp</button>
        </div>
      )}
    </div>
  );
};

export default Offramp;