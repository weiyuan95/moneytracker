'use client';
import React, { ReactElement, useState } from 'react';
import { useForm } from '@mantine/form';
import { Box, Button, Group, Loader, LoadingOverlay, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { CRYPTO_CURRENCY_INFO, FIAT_CURRENCY_INFO, getCurrencyDecimals } from '../../currencies/CurrencyInfo';
import { TTL_DURATION_MS, useHoldings } from '../../store/HoldingsProvider';

type Props = {
  holdingEntity?: string;
  assetAmount?: string;
  assetName?: string;
  assetSymbol?: string;
  isEditAsset?: boolean;
  isAddAsset?: boolean;
};

export function TrackForm({ holdingEntity, assetAmount, assetName, assetSymbol, isEditAsset }: Props): ReactElement {
  const router = useRouter();
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      holdingEntity: holdingEntity ?? '',
      assetName: assetName ?? '',
      assetAmount: Number(assetAmount ?? 0),
      assetSymbol: assetSymbol ?? '',
    },
    validate: {
      holdingEntity: (value) => (value.length <= 0 ? 'Holding Entity must not be empty' : null),
      assetName: (value) => (value.length <= 0 ? 'Asset Name must not be empty' : null),
      assetAmount: (value) => {
        // Assumption: value will always be a valid number since it's a NumberInput, so we just need to check that it's positive
        if (value <= 0) {
          return 'Asset Amount must be greater than 0';
        }

        return null;
      },
      assetSymbol: (value) => (value.length <= 0 ? 'Asset Symbol must not be empty' : null),
    },
  });
  const { upsertHolding } = useHoldings();

  return (
    // miw -> min width
    // documented here: https://mantine.dev/styles/style-props/
    <Box miw={500} pos="relative">
      <LoadingOverlay visible={formIsSubmitting} zIndex={1000} />
      <form
        onSubmit={form.onSubmit(async (values) => {
          setFormIsSubmitting(true);
          try {
            await upsertHolding(values.holdingEntity, {
              name: values.assetName,
              amount: Number(values.assetAmount),
              symbol: values.assetSymbol,
              decimals: getCurrencyDecimals(values.assetSymbol),
              fiatCache: {
                amount: Number(values.assetAmount),
                symbol: values.assetSymbol,
                decimals: getCurrencyDecimals(values.assetSymbol),
                ttl: Date.now() + TTL_DURATION_MS,
              },
            });

            // Keep it simple since it's binary state, but we can use the isAddAsset prop if we want
            const notificationTitle = isEditAsset ? 'Asset Edited' : 'Asset Added';
            const notificationMessage = isEditAsset
              ? `${values.assetName} edited in ${values.holdingEntity}.`
              : `${values.assetName} added to ${values.holdingEntity}.`;

            notifications.show({
              title: notificationTitle,
              message: notificationMessage,
              color: 'green',
            });

            // Redirect back to main page after adding holding/asset
            router.push('/');
            // Note: no need to set the form to submitting false since we're redirecting right after
          } catch (e) {
            console.error(e);
            notifications.show({
              title: 'Error',
              message: 'Unable to add asset. Do you have a valid internet connection?',
              color: 'red',
            });
            setFormIsSubmitting(false);
          }
        })}
      >
        <Stack>
          <TextInput
            withAsterisk
            description="The name of the entity or application holding the asset"
            placeholder="Credit Suisse / Metamask / Gemini etc"
            label="Holding Entity"
            {...removeKeyFromProps(form.getInputProps('holdingEntity'))}
          />
          <TextInput
            withAsterisk
            placeholder="Bitcoin / Ethereum / USD / SGD etc"
            label="Asset Name"
            {...removeKeyFromProps(form.getInputProps('assetName'))}
          />
          <NumberInput
            label="Amount"
            placeholder="1234.56"
            thousandSeparator=","
            hideControls
            withAsterisk
            {...removeKeyFromProps(form.getInputProps('assetAmount'))}
          />
          <Select
            withAsterisk
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
            label="Asset Symbol"
            placeholder="SGD"
            nothingFoundMessage="Asset symbol does not exist"
            searchable
            clearable
            allowDeselect={false}
            {...removeKeyFromProps(form.getInputProps('assetSymbol'))}
          />
        </Stack>
        <Group justify="center" mt="lg">
          {formIsSubmitting ? (
            <Loader></Loader>
          ) : (
            <Button type="submit" size="md">
              {isEditAsset ? 'Edit Asset' : 'Add Asset'}
            </Button>
          )}
        </Group>
      </form>
    </Box>
  );
}

// Necessary to remove a warning from using Mantine and Next.js
// context: https://github.com/vercel/next.js/issues/55642
// The removed key prop does not seem to be necessary and does not cause any warnings after removal. It might cause more re-renders though.
function removeKeyFromProps(obj: any): any {
  delete obj['key'];
  return obj;
}
