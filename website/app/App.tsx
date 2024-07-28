'use client';
import { Container } from '@mantine/core';
import { ReactNode } from 'react';

import { HoldingsProvider } from '../store/HoldingsProvider';
import { useAppCurrency } from './AppCurrencyProvider';
import { AppHeader } from './AppHeader';

type Props = {
  children: ReactNode;
};

export function App({ children }: Props) {
  const { appCurrencySymbol } = useAppCurrency();

  // App component for providers which require client-side props
  return (
    <HoldingsProvider appCurrencySymbol={appCurrencySymbol}>
      <AppHeader />
      <Container size="sm">{children}</Container>
    </HoldingsProvider>
  );
}
