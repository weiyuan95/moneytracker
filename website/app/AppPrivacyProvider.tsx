'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface PrivacyContextI {
  isPrivate: boolean;
  setIsPrivate: (isPrivate: boolean) => void;
  isLoading: boolean;
}

const PrivacyContext = createContext<PrivacyContextI | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export function AppPrivacyProvider({ children }: Props) {
  // Default to public
  const [isPrivate, setIsPrivate] = useState(false);
  const storageKey = 'moneytracker-privacy';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window) {
      setIsPrivate(JSON.parse(window.localStorage.getItem(storageKey) ?? 'false'));
      setLoading(false);
    }
  }, []);

  const setPrivacy = useCallback((isPrivate: boolean) => {
    if (window) {
      setIsPrivate(isPrivate);
      window.localStorage.setItem(storageKey, JSON.stringify(isPrivate));
    }
  }, []);

  return (
    <PrivacyContext.Provider
      value={{
        isPrivate,
        setIsPrivate: setPrivacy,
        isLoading: loading,
      }}
    >
      {children}
    </PrivacyContext.Provider>
  );
}

export function useAppPrivacy(): PrivacyContextI {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('useAppPrivacy must be used within an AppPrivacyProvider');
  }

  return context;
}
