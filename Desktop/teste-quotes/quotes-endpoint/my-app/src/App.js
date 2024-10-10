import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [amount, setAmount] = useState(""); // O valor padrão se refere ao valor de compra/venda em criptomoedas
  const [payment, setPayment] = useState("PIX"); // Método de pagamento
  const [crypto, setCrypto] = useState("ETH"); // Criptomoeda
  const [fiat, setFiat] = useState("BRL"); // Moeda Fiat
  const [wallet, setWallet] = useState("0xc458f721D11322E36f781a9C58055de489178BF2");
  const [region, setRegion] = useState("BR"); // Região
  const [resultOnramp, setResultOnramp] = useState(null); // Resultado da compra
  const [resultOfframp, setResultOfframp] = useState(null); // Resultado da venda
  const [error, setError] = useState(null); // Erro na requisição
  const [loading, setLoading] = useState(false); // Indicador de carregamento
  const [isSelling, setIsSelling] = useState(false); // Controle para saber se estamos na função de venda

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/onramp/v1/quotes`, {
        params: {
          partnerAccountId: 'baa2d9f8-6ff0-48e9-babf-709c9007ffbe',
          payment: payment,
          crypto: crypto,
          fiat: fiat,
          amount: amount,
          region: region,
          wallet: wallet,
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

  const fetchOfframpQuote = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/offramp/v1/quotes`, {
        params: {
          partnerAccountId: 'baa2d9f8-6ff0-48e9-babf-709c9007ffbe',
          payment: payment,
          fiat: fiat,
          crypto: crypto,
          region: region,
          cryptoAmount: amount,
          wallet: wallet,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSelling) {
        fetchOfframpQuote(); // Chama a função de Offramp se estivermos vendendo
      } else {
        fetchQuote(); // Chama a função de Onramp
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [fetchQuote, fetchOfframpQuote, isSelling]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSelling) {
      fetchOfframpQuote(); // Chama a função de Offramp
    } else {
      fetchQuote(); // Chama a função de Onramp
    }
  };

  const amountInOnramp = resultOnramp?.amountIn;
  const amountOutOnramp = resultOnramp?.amountOut;
  const amountInOfframp = resultOfframp?.amountIn;
  const amountOutOfframp = resultOfframp?.amountOut;

  const handleButtonClickOnramp = () => {
    const payout = amountOutOnramp || amountOutOfframp; // Use a saída correta de acordo com a operação
    const fiatCurrency = isSelling ? fiat : fiat; // Aqui, você pode usar o valor que deseja
    const urlOnramp = `https://onramp-sandbox.gatefi.com/?merchantId=baa2d9f8-6ff0-48e9-babf-709c9007ffbe&cryptoCurrency=${crypto}&payout=${payout}&fiatCurrency=${fiatCurrency}&region=${region}&wallet=${wallet}&walletLock=true&fiatCurrencyLock=true&cryptoCurrencyLock=true&fiatAmount=${amount}`;
    window.open(urlOnramp, '_blank');
  };
  const handleButtonClickOfframp = () => {
    const payout = amountOutOnramp || amountOutOfframp; // Use a saída correta de acordo com a operação
    const fiatCurrency = isSelling ? fiat : fiat; // Aqui, você pode usar o valor que deseja
    const urlOnramp = `https://offramp-sandbox.gatefi.com/?merchantId=baa2d9f8-6ff0-48e9-babf-709c9007ffbe&cryptoCurrency=${crypto}&payout=${payout}&fiatCurrency=${fiatCurrency}&region=${region}&wallet=${wallet}&walletLock=true&fiatCurrencyLock=true&cryptoCurrencyLock=true&fiatAmount=${amount}`;
    window.open(urlOnramp, '_blank');
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="quote-form">
        {/* <h2>{isSelling ? "Sell Cryptocurrency" : "Buy Cryptocurrency"}</h2> */}
        <div className="toggle-area">
          <button type="button" onClick={() => setIsSelling(false)} className={`toggle-button ${!isSelling ? 'active' : ''}`}>
            Buy
          </button>
          <button type="button" onClick={() => setIsSelling(true)} className={`toggle-button ${isSelling ? 'active' : ''}`}>
            Sell
          </button>
        </div>
        <label htmlFor="wallet">
          Wallet
          <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} />
        </label>
        <label>
          Region:
          <input className="region-form" type="text" value={region} onChange={(e) => setRegion(e.target.value)} />
        </label>
        <label>
          Currency:
          <input className="currency-form" type="text" value={fiat} onChange={(e) => setFiat(e.target.value)} />
        </label>
        <p></p>
        <label htmlFor="amount">
          Amount ({isSelling ? crypto : fiat}):
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <p></p>
        <label>
          Crypto:
          <input className="crypto-form" type="text" value={crypto} onChange={(e) => setCrypto(e.target.value)} />
        </label>
        <p></p>
        <label>
          Payment Method:
          <input type="text" value={payment} onChange={(e) => setPayment(e.target.value)} />
        </label>
      
        <p></p>
          <button type="submit" className="submit-button">Get Quote</button>
      </form>
  
      <div>
        {/* Resultados do Onramp */}
        {resultOnramp && !isSelling && (
          <div className="result-container">
            <h2>Quote Result (Buying)</h2>
            <p>{fiat}: {amountInOnramp}</p>
            <p>{crypto}: {amountOutOnramp}</p>
            <button onClick={handleButtonClickOnramp} className="action-button"> Proceed to Onramp</button>  {/* Botão para Onramp */}
          </div>
        )}
        {/* Resultados do Offramp */}
        {resultOfframp && isSelling && (
          <div className="result-container">
            <h2>Quote Result (Selling)</h2>
            <p>{crypto}: {amountInOfframp}</p>
            <p>{fiat}: {amountOutOfframp}</p>
            <button onClick={handleButtonClickOfframp} className="action-button">Proceed to Offramp</button>  {/* Botão para Offramp */}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;