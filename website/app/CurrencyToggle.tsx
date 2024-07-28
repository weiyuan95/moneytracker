'use client';
import { Button, Popover, Select, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactElement, useState } from 'react';

import { CRYPTO_CURRENCY_INFO, FIAT_CURRENCY_INFO } from '../currencies/CurrencyInfo';
import { useHoldings } from '../store/HoldingsProvider';
import { useAppCurrency } from './AppCurrencyProvider';

export function CurrencyToggle(): ReactElement {
  const [loading, setLoading] = useState(false);
  const [popoverOpened, { toggle: togglePopover }] = useDisclosure();
  const { appCurrencySymbol, setAppCurrencySymbol, isLoading } = useAppCurrency();
  const { updateFiatCache } = useHoldings();

  return (
    <Popover width={200} position="bottom" shadow="md" offset={2} opened={popoverOpened} trapFocus withArrow>
      <Popover.Target>
        <Skeleton visible={loading}>
          <Button variant="default" loading={isLoading} onClick={togglePopover}>
            {appCurrencySymbol}
          </Button>
        </Skeleton>
      </Popover.Target>
      <Popover.Dropdown>
        <Skeleton visible={loading}>
          <Select
            dropdownOpened={popoverOpened}
            width={200}
            data={[
              {
                group: 'Cryptocurrencies',
                items: CRYPTO_CURRENCY_INFO.map(({ name, symbol }) => {
                  return { value: symbol, label: `${name} (${symbol})` };
                }),
              },
              {
                group: 'Fiat',
                items: FIAT_CURRENCY_INFO.map(({ name, symbol }) => {
                  return { value: symbol, label: `${name} (${symbol})` };
                }),
              },
            ]}
            placeholder={appCurrencySymbol}
            comboboxProps={{ withinPortal: false }}
            onChange={async (value) => {
              // Not possible to deselect or clear the input, so we can safely assume it will never be null
              const symbol = value ?? '';
              setLoading(true);
              togglePopover();
              // Update the fiat cache on app currency symbol change to display updated values
              await updateFiatCache(symbol);
              setAppCurrencySymbol(symbol);
              setLoading(false);
            }}
            nothingFoundMessage="Asset symbol does not exist"
            searchable
            allowDeselect={false}
          />
        </Skeleton>
      </Popover.Dropdown>
    </Popover>
  );
}
