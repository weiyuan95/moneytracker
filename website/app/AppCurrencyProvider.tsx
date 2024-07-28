'use client';
import { createContext, ReactElement, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface AppCurrencyContextI {
  appCurrencySymbol: string;
  setAppCurrencySymbol: (currency: string) => void;
  isLoading: boolean;
}

const AppCurrencyContext = createContext<AppCurrencyContextI | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function AppCurrencyProvider({ children }: Props): ReactElement {
  const storageKey = 'moneytracker-appcurrency';
  const [store, setStore] = useState<typeof window.localStorage | undefined>();
  // Default app currency to USD
  const [appCurrencySymbol, setAppCurrencySymbol] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window) {
      setStore(window.localStorage);
    }
  }, []);

  useEffect(() => {
    if (store) {
      setAppCurrencySymbol(store?.getItem(storageKey) ?? appCurrencySymbol);
      setIsLoading(false);
    }
  }, [store, appCurrencySymbol]);

  return (
    <AppCurrencyContext.Provider
      value={{
        appCurrencySymbol,
        setAppCurrencySymbol: useCallback(
          (currency) => {
            if (!store) {
              throw Error('Attempting to set app currency symbol when localstorage is not available');
            }

            setAppCurrencySymbol(currency);
            store.setItem(storageKey, currency);
          },
          [store]
        ),
        isLoading,
      }}
    >
      {children}
    </AppCurrencyContext.Provider>
  );
}

export function useAppCurrency(): AppCurrencyContextI {
  const context = useContext(AppCurrencyContext);
  if (context === undefined) {
    throw new Error('useAppCurrency must be used within a AppCurrencyProvider');
  }
  return context;
}
