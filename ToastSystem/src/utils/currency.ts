export const formatCurrency = (amount: number, currency: string): string => {
  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    VES: 'Bs.',
    COP: '$',
    MXN: '$',
    ARS: '$',
    PEN: 'S/',
    CLP: '$',
    BRL: 'R$',
  };

  const symbol = currencySymbols[currency] || '$';
  
  // Format with appropriate decimal places
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol}${formatted}`;
};

export const getCurrencyName = (currency: string): string => {
  const currencyNames: { [key: string]: string } = {
    USD: 'Dólar Americano',
    EUR: 'Euro',
    VES: 'Bolívar Venezolano',
    COP: 'Peso Colombiano',
    MXN: 'Peso Mexicano',
    ARS: 'Peso Argentino',
    PEN: 'Sol Peruano',
    CLP: 'Peso Chileno',
    BRL: 'Real Brasileño',
  };

  return currencyNames[currency] || currency;
};