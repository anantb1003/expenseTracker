import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const availableCurrencies = ['INR'];

  const getSymbol = () => '₹';

  const formatAmount = (amount) => {
    if (amount == null || isNaN(amount)) return '₹0.00';
    const num = Number(amount);

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setSelectedCurrency,
      availableCurrencies,
      formatAmount,
      getSymbol,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
