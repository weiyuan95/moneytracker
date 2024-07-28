//  Data pulled from 'https://api.coingate.com/v2/currencies?enabled=true&kind=crypto&native=true'
export const CRYPTO_CURRENCY_INFO = [
  { name: 'Bitcoin', symbol: 'BTC', decimals: 8 },
  { name: 'Litecoin', symbol: 'LTC', decimals: 8 },
  { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  { name: 'Bitcoin Cash', symbol: 'BCH', decimals: 8 },
  { name: 'XRP', symbol: 'XRP', decimals: 6 },
  { name: 'TRON', symbol: 'TRX', decimals: 6 },
  { name: 'Dai', symbol: 'DAI', decimals: 18 },
  { name: 'Dogecoin', symbol: 'DOGE', decimals: 8 },
  { name: 'Binance Coin', symbol: 'BNB', decimals: 8 },
  { name: 'USDT', symbol: 'USDT', decimals: 6 },
  { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
  { name: 'USDC', symbol: 'USDC', decimals: 6 },
  { name: 'Cardano', symbol: 'ADA', decimals: 6 },
  { name: 'Binance USD', symbol: 'BUSD', decimals: 18 },
  { name: 'Solana', symbol: 'SOL', decimals: 9 },
  { name: 'Internet Computer', symbol: 'ICP', decimals: 8 },
  { name: 'SHIBA INU', symbol: 'SHIB', decimals: 18 },
  { name: 'Axie Infinity', symbol: 'AXS', decimals: 18 },
  { name: 'Cosmos', symbol: 'ATOM', decimals: 6 },
  { name: 'The Sandbox', symbol: 'SAND', decimals: 18 },
  { name: 'Elrond', symbol: 'EGLD', decimals: 18 },
  { name: 'Flow', symbol: 'FLOW', decimals: 8 },
  { name: 'Tether EURt', symbol: 'EURT', decimals: 6 },
] as const;

// 'https://api.coingate.com/v2/currencies?enabled=true&kind=fiat'
export const FIAT_CURRENCY_INFO = [
  { name: 'United States Dollar', symbol: 'USD', decimals: 2 },
  { name: 'Euro', symbol: 'EUR', decimals: 2 },
  { name: 'British Pound', symbol: 'GBP', decimals: 2 },
  { name: 'Polish Zloty', symbol: 'PLN', decimals: 2 },
  { name: 'Czech Republic Koruna', symbol: 'CZK', decimals: 2 },
  { name: 'Swedish Krona', symbol: 'SEK', decimals: 2 },
  { name: 'Norwegian Krone', symbol: 'NOK', decimals: 2 },
  { name: 'Danish Krone', symbol: 'DKK', decimals: 2 },
  { name: 'Swiss Franc', symbol: 'CHF', decimals: 2 },
  { name: 'South African Rand', symbol: 'ZAR', decimals: 2 },
  { name: 'Australian Dollar', symbol: 'AUD', decimals: 2 },
  { name: 'Japanese Yen', symbol: 'JPY', decimals: 2 },
  { name: 'New Zealand Dollar', symbol: 'NZD', decimals: 2 },
  { name: 'Turkish Lira', symbol: 'TRY', decimals: 2 },
  { name: 'Brazilian Real', symbol: 'BRL', decimals: 2 },
  { name: 'Canadian Dollar', symbol: 'CAD', decimals: 2 },
  { name: 'Chinese Yuan Renminbi', symbol: 'CNY', decimals: 2 },
  { name: 'Hong Kong Dollar', symbol: 'HKD', decimals: 2 },
  { name: 'Hungarian Forint', symbol: 'HUF', decimals: 2 },
  { name: 'Indian Rupee', symbol: 'INR', decimals: 2 },
  { name: 'Russian Ruble', symbol: 'RUB', decimals: 2 },
  { name: 'Israeli New Shekel', symbol: 'ILS', decimals: 2 },
  { name: 'Malaysian Ringgit', symbol: 'MYR', decimals: 2 },
  { name: 'Mexican Peso', symbol: 'MXN', decimals: 2 },
  { name: 'Singapore Dollar', symbol: 'SGD', decimals: 2 },
  { name: 'Romanian Leu', symbol: 'RON', decimals: 2 },
  { name: 'Indonesian Rupiah', symbol: 'IDR', decimals: 2 },
  { name: 'Philippine Peso', symbol: 'PHP', decimals: 2 },
  { name: 'Argentine Peso', symbol: 'ARS', decimals: 2 },
  { name: 'Thai Baht', symbol: 'THB', decimals: 2 },
  { name: 'Nigerian Naira', symbol: 'NGN', decimals: 2 },
  { name: 'Pakistani Rupee', symbol: 'PKR', decimals: 2 },
  { name: 'United Arab Emirates Dirham', symbol: 'AED', decimals: 2 },
  { name: 'Ukrainian Hryvnia', symbol: 'UAH', decimals: 2 },
  { name: 'Bulgarian Lev', symbol: 'BGN', decimals: 2 },
  { name: 'Croatian Kuna', symbol: 'HRK', decimals: 2 },
  { name: 'Serbian Dinar', symbol: 'RSD', decimals: 2 },
  { name: 'New Taiwan Dollar', symbol: 'TWD', decimals: 2 },
  { name: 'Chilean Peso', symbol: 'CLP', decimals: 2 },
  { name: 'South Korean won', symbol: 'KRW', decimals: 2 },
  { name: 'Egyptian pound', symbol: 'EGP', decimals: 2 },
  { name: 'Saudi riyal', symbol: 'SAR', decimals: 2 },
  { name: 'Qatari riyal', symbol: 'QAR', decimals: 2 },
];

export function getCurrencyDecimals(symbol: string): number {
  const currencyInfo =
    CRYPTO_CURRENCY_INFO.find((currency) => currency.symbol === symbol) ??
    FIAT_CURRENCY_INFO.find((currency) => currency.symbol === symbol);

  if (!currencyInfo) {
    throw Error(`Currency with symbol ${symbol} not found`);
  }

  return currencyInfo.decimals;
}
