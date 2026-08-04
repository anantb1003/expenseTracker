import React, { createContext, useContext } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const selectedCurrency = 'INR';

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
      formatAmount,
      getSymbol,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
