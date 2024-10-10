// Onramp.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Onramp = ({ wallet, setWallet, amount, setAmount, payment, setPayment, crypto, setCrypto, fiat, setFiat, region, setRegion }) => {
  const [resultOnramp, setResultOnramp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/onramp/v1/quotes`, {
        params: {
          partnerAccountId: 'baa2d9f8-6ff0-48e9-babf-709c9007ffbe',
          payment,
          crypto,
          fiat,
          amount,
          region,
          wallet,
        },
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'fGhKXIdWINsjKFuMZpnKqPrlWOIGocRE',
          'signature': 'dd32b38bc3cd9046ce0d09699c770deaf43fe4f9c06eebc649ecc4ba76802930',
        },
      });
      setResultOnramp(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao buscar os dados");
      setResultOnramp(null);
    } finally {
      setLoading(false);
    }
  }, [amount, payment, crypto, fiat, region, wallet]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchQuote();
  };

  const handleButtonClick = () => {
    const payout = resultOnramp?.amountOut;
    const urlOnramp = `https://onramp-sandbox.gatefi.com/?merchantId=baa2d9f8-6ff0-48e9-babf-709c9007ffbe&cryptoCurrency=${crypto}&payout=${payout}&fiatCurrency=${fiat}&region=${region}&wallet=${wallet}&walletLock=true&fiatCurrencyLock=true&cryptoCurrencyLock=true&fiatAmount=${amount}`;
    window.open(urlOnramp, '_blank');
  };

  return (
    <div className="result-container">
      <h2>Onramp - Buy Cryptocurrency</h2>
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
      {resultOnramp && (
        <div>
          <h3>Quote Result</h3>
          <p>{fiat}: {resultOnramp.amountIn}</p>
          <p>{crypto}: {resultOnramp.amountOut}</p>
          <button onClick={handleButtonClick} className="action-button">Proceed to Onramp</button>
        </div>
      )}
    </div>
  );
};

export default Onramp;