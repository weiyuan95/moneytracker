import { notifications } from '@mantine/notifications';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { CoinGateClient } from '../currencies/CoinGateClient';
import { Currency } from '../currencies/Currency';
import { getCurrencyDecimals } from '../currencies/CurrencyInfo';
import { Asset, AssetDto, Holdings, HoldingsData, HoldingsDto } from '../Holdings';
import { HoldingsStore } from './HoldingsStore';

export const TTL_DURATION_MS = 1000 * 60 * 30; // 30 minutes

interface HoldingsContextI extends HoldingsStore {
  // For exporting
  getHoldingsDto: () => HoldingsDto;
  // For importing
  setHoldingsByDto: (holdingsDto: HoldingsDto) => Promise<void>;
  updateFiatCache: (symbol: string) => Promise<void>;
  isLoading: boolean;
  isErrored: boolean;
}

const HoldingsContext = createContext<HoldingsContextI | undefined>(undefined);

type Props = {
  children: ReactNode;
  appCurrencySymbol: string;
};

export function HoldingsProvider({ children, appCurrencySymbol }: Props) {
  const holdingsDefaultValue = {};
  const storageKey = 'moneytracker-holdings';
  const [store, setStore] = useState<typeof window.localStorage | undefined>();
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  // Default to no holdings at all, due to the limitations of typing Javascript Objects
  const [holdingsDto, setHoldingsDto] = useState<HoldingsDto>(holdingsDefaultValue);

  useEffect(() => {
    if (window) {
      setStore(window.localStorage);
      setHoldingsDto(
        JSON.parse(window.localStorage.getItem(storageKey) ?? JSON.stringify(holdingsDefaultValue)) as HoldingsDto
      );
      setLoading(false);
    }
  }, []);

  const saveHoldings = useCallback(
    (holdingsDto: HoldingsDto) => {
      if (store) {
        store.setItem(storageKey, JSON.stringify(holdingsDto));
        setHoldingsDto(holdingsDto);
      }
    },
    [store]
  );

  const getHoldingsDto = useCallback((): HoldingsDto => {
    return JSON.parse(store?.getItem(storageKey) ?? JSON.stringify(holdingsDefaultValue)) as HoldingsDto;
  }, [store]);

  const setHoldingsByDto = useCallback(
    async (holdingsDto: HoldingsDto) => {
      const updatedHoldings = await getHoldingsWithUpdatedCacheInfo(holdingsDto, appCurrencySymbol);
      saveHoldings(updatedHoldings);
    },
    [store]
  );

  const getHoldings = useCallback((): HoldingsData => {
    if (!holdingsDto) {
      throw Error(
        'Attempting to getHoldings when it has not yet been set. Please wait for the component to finish loading.'
      );
    }

    // Assume that holdings are empty with no holdings tracked
    const holdings = {} as Holdings;
    /**
     * Default to the appCurrencySymbol if there are no holdings in localstorage.
     *
     * NOTE: This code in the lops makes the assumption that
     * the fiatCache will always have the same symbols for all the assets, which should always be the case.
     */
    let fiatCacheSymbol = appCurrencySymbol;

    for (const [holdingEntity, assets] of Object.entries(holdingsDto)) {
      fiatCacheSymbol = assets[0].fiatCache.symbol;
      const parsedAssets = assets.map(assetDtoToAsset);

      holdings[holdingEntity] = {
        assets: parsedAssets,
        totalValue: parsedAssets.reduce(
          (prev, currentAsset) => {
            return prev.plus(currentAsset.fiatCache.currencyInfo);
          },
          new Currency({ amount: 0, symbol: fiatCacheSymbol, decimals: getCurrencyDecimals(fiatCacheSymbol) })
        ),
      };
    }

    // Parsed from DTO to actual object used through the app
    return {
      holdings,
      totalValue: Object.values(holdings).reduce(
        (prev, currentHolding) => prev.plus(currentHolding.totalValue),
        new Currency({ amount: 0, symbol: fiatCacheSymbol, decimals: getCurrencyDecimals(fiatCacheSymbol) })
      ),
    };
  }, [holdingsDto, appCurrencySymbol]);

  const updateFiatCache = useCallback(
    async (symbol: string) => {
      if (store) {
        // Restart loading state and assume no error
        setLoading(true);
        setErrored(false);

        // If there is something to parse, we parse it
        if (Object.keys(holdingsDto).length > 0) {
          try {
            const updatedHoldings = await getHoldingsWithUpdatedCacheInfo(holdingsDto, symbol);
            saveHoldings(updatedHoldings);
          } catch (e) {
            setErrored(true);
            console.log(e);
            notifications.show({
              title: 'Application Error',
              message: `Unable to fetch exchange rates for ${symbol}. The application may not work as expected.`,
              color: 'red',
            });
          }
        }

        // Regardless of whether there's data to parse, we set the loading to false after everything is done
        setLoading(false);
      }
    },
    [store, holdingsDto]
  );

  const upsertHolding = useCallback(
    async (holdingEntity: string, asset: AssetDto): Promise<void> => {
      const data = JSON.parse(store?.getItem(storageKey) ?? JSON.stringify(holdingsDefaultValue)) as HoldingsDto;
      const holding = data[holdingEntity];

      // Holding doesn't exist, we just need to add it in
      if (!holding) {
        const updatedInfo = await getHoldingsWithUpdatedCacheInfo(
          { ...data, [holdingEntity]: [asset] },
          appCurrencySymbol
        );
        saveHoldings(updatedInfo);
        return;
      }

      let assetExists = false;

      // Check if the asset exists for the holding - if it does, edit it
      data[holdingEntity] = holding.map((existingAsset) => {
        if (existingAsset.name === asset.name) {
          assetExists = true;
          // Overwrite the existing asset with the newer, edited asset
          return asset;
        }
        return existingAsset;
      });

      // The asset did not exist - we need to add it in
      if (!assetExists) {
        data[holdingEntity] = [...data[holdingEntity], asset];
      }

      const updatedInfo = await getHoldingsWithUpdatedCacheInfo(data, appCurrencySymbol);

      saveHoldings(updatedInfo);
    },
    [store, appCurrencySymbol]
  );

  const clearAsset = useCallback(
    (holdingEntity: string, assetNameToDelete: string): void => {
      const data = JSON.parse(store?.getItem(storageKey) ?? JSON.stringify(holdingsDefaultValue)) as HoldingsDto;
      const holding = data[holdingEntity];

      // Delete asset from holding
      data[holdingEntity] = holding
        .map((existingAsset) => {
          if (existingAsset.name === assetNameToDelete) {
            return undefined;
          }
          return existingAsset;
        })
        .filter((asset) => asset !== undefined) as AssetDto[];

      saveHoldings(data);
    },
    [store]
  );

  const clearHolding = useCallback(
    (holdingEntity: string): void => {
      const data = JSON.parse(store?.getItem(storageKey) ?? JSON.stringify(holdingsDefaultValue)) as HoldingsDto;

      delete data[holdingEntity];

      // We've already modified the data in-place, so we can just set it back
      saveHoldings(data);
    },
    [store]
  );

  const clearAllHoldings = useCallback(() => {
    // No need to do anything fancy here, we can just override the entirety of the value with an empty object
    store?.setItem(storageKey, JSON.stringify({}));
    saveHoldings({});
  }, [store]);

  return (
    <HoldingsContext.Provider
      value={{
        getHoldings,
        getHoldingsDto,
        setHoldingsByDto,
        upsertHolding,
        clearAsset,
        clearHolding,
        clearAllHoldings,
        updateFiatCache,
        isLoading: loading,
        isErrored: errored,
      }}
    >
      {children}
    </HoldingsContext.Provider>
  );
}

export function useHoldings(): HoldingsContextI {
  const context = useContext(HoldingsContext);
  if (context === undefined) {
    throw new Error('useHoldings must be used within a HoldingsProvider');
  }
  return context;
}

function assetDtoToAsset(assetDto: AssetDto): Asset {
  return {
    name: assetDto.name,
    currencyInfo: new Currency({ amount: assetDto.amount, symbol: assetDto.symbol, decimals: assetDto.decimals }),
    fiatCache: {
      currencyInfo: new Currency({
        amount: assetDto.fiatCache.amount,
        symbol: assetDto.fiatCache.symbol,
        decimals: assetDto.fiatCache.decimals,
      }),
    },
  };
}

/**
 * Returns a HoldingsDto that has had its cache info updated
 * @param holdings
 * @param symbol
 */
async function getHoldingsWithUpdatedCacheInfo(holdings: HoldingsDto, symbol: string): Promise<HoldingsDto> {
  // Copy to avoid in place mutation
  const newHoldings = { ...holdings };
  const assetData = Object.entries(newHoldings).flatMap(([_, assets]) => assets);
  // Keep a consistent time for all the assets
  const currentTime = Date.now();

  const client = new CoinGateClient();
  for (const asset of assetData) {
    // The fiat information that was saved previously
    const { fiatCache } = asset;

    // We only update the fiat cache if the previously cached symbol has changed which requires an update,
    // or if the cache has expired
    if (fiatCache.symbol !== symbol || currentTime > fiatCache.ttl) {
      // Change from the previous cached symbol for the asset to the current symbol used by the app
      const conversionRate = await client.getExchangeRate(asset.symbol, symbol);
      const assetCurrency = new Currency({
        amount: asset.amount,
        symbol: asset.symbol,
        decimals: asset.decimals,
      });
      const newCurrency = new Currency({
        // Multiply the previous cached amount for the asset by the conversion rate and add it to the total
        amount: assetCurrency.multiply(conversionRate).canonicalAmount,
        symbol,
        decimals: getCurrencyDecimals(symbol),
      });

      /**
       * Update the fiat cache in-place with the new symbol and amount
       * We assume that the number will never go above Number.MAX_SAFE_INTEGER since
       * we are passing around canonical numbers. Also, this number is purely used for storing
       * purposes since we cannot serialise the class - the actual calculations are
       * still done with the Currency object.
       */
      fiatCache.amount = newCurrency.canonicalAmount.toNumber();
      fiatCache.symbol = newCurrency.symbol;
      fiatCache.decimals = newCurrency.decimals;
      fiatCache.ttl = currentTime + TTL_DURATION_MS;
    }
  }

  return newHoldings;
}
