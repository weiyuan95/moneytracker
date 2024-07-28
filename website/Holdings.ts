import { Currency } from './currencies/Currency';

export type Holdings = { [holdingEntity: string]: { assets: Asset[]; totalValue: Currency } };

export type HoldingsData = {
  holdings: Holdings;
  totalValue: Currency;
};

export type HoldingsDto = {
  [holdingEntity: string]: AssetDto[];
};

export type AssetDto = {
  name: string;
  amount: number;
  symbol: string;
  decimals: number;
  fiatCache: FiatCacheDto;
};

export type Asset = {
  currencyInfo: Currency;
  name: string;
  fiatCache: FiatCache;
};

type FiatCacheDto = {
  amount: number;
  symbol: string;
  decimals: number;
  ttl: number;
};

export type FiatCache = {
  currencyInfo: Currency;
};
