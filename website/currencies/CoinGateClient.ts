import { ExchangeRateClient } from './ExchangeRateClient';
import { wait } from '../utils/Wait';

export class CoinGateClient implements ExchangeRateClient {
  private baseUrl = 'https://api.coingate.com/v2';

  async getExchangeRate(from: string, to: string): Promise<number> {
    const url = `${this.baseUrl}/rates/merchant/${from}/${to}`;

    const response = await fetch(url);
    const rate = (await response.json()) as number;

    // Arbitrarily wait for 0.5s to avoid spamming the public API.
    await wait(500);

    // The rate is the conversion rate from `from` to `to`.
    return rate;
  }
}
