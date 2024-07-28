export interface ExchangeRateClient {
  // Returns the exchange rate of the two currencies.
  // client usage: const convertedAmount = fromAmount * getExchangeRate(fromCurrencySymbol, toCurrencySymbol)
  getExchangeRate(from: string, to: string): Promise<number>;
}
