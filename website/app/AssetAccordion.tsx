'use client';
import { Accordion, ActionIcon, Button, Flex, Grid, Group, Loader,Stack, Table, Text, Title } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactElement, useState } from 'react';

import { useHoldings } from '../store/HoldingsProvider';
import { useAppCurrency } from './AppCurrencyProvider';
import { useAppPrivacy } from './AppPrivacyProvider';
import classes from './AssetAccordion.module.css';

export function AssetAccordion(): ReactElement {
  const router = useRouter();
  const [selectedHoldingEntities, setSelectedHoldingEntities] = useState<string[]>([]);
  const { getHoldings, isLoading: isHoldingsLoading, isErrored: isHoldingsErrored } = useHoldings();
  const { holdings, totalValue: holdingsTotalValue } = getHoldings();
  const { appCurrencySymbol, isLoading: isAppCurrencyLoading } = useAppCurrency();
  const { isPrivate } = useAppPrivacy();

  // Ideally we don't have loading state like this, but since we don't have a server,
  // everything must be done on the front end.
  if (isHoldingsLoading || isAppCurrencyLoading || isHoldingsErrored) {
    return (
      <>
        <Flex justify="center">
          <Loader size="xl" mt={100} />
        </Flex>
      </>
    );
  }

  return (
    <>
      <Stack gap="lg">
        <Title>{privatizeText(holdingsTotalValue.format(), isPrivate)}</Title>
        <Accordion value={selectedHoldingEntities} onChange={setSelectedHoldingEntities} multiple>
          {Object.keys(holdings).length === 0 && (
            <Flex justify="center">
              <Text>No holdings yet. Add a holding entity to get started.</Text>
            </Flex>
          )}

          {Object.entries(holdings).map(([holdingEntity, assetInfo]) => {
            const holdingTotalFiatAmount = assetInfo.totalValue.format();

            return (
              <Accordion.Item key={holdingEntity} value={holdingEntity}>
                <Accordion.Control>
                  <Group>
                    <div>
                      <Text size="lg">{holdingEntity}</Text>
                      {/* Don't show the consolidated value of the holding if the user selected the Accordion.Item */}
                      <Text size="sm" c="dimmed">
                        {!selectedHoldingEntities.includes(holdingEntity)
                          ? `${privatizeText(holdingTotalFiatAmount, isPrivate)}`
                          : 'Breakdown'}
                      </Text>
                    </div>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack align="stretch">
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Name</Table.Th>
                          <Table.Th>Amount</Table.Th>
                          <Table.Th>Value ({appCurrencySymbol})</Table.Th>
                          <Table.Th />
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {assetInfo.assets.map((asset, i) => (
                          <Table.Tr key={`${asset.name}_${i}`}>
                            <Table.Td className={classes.tableName}>{asset.name}</Table.Td>
                            <Table.Td className={classes.tableAmount}>
                              <Flex gap="2">{privatizeText(asset.currencyInfo.format(), isPrivate)}</Flex>
                            </Table.Td>
                            <Table.Td className={classes.tableValue}>
                              {privatizeText(asset.fiatCache.currencyInfo.format(), isPrivate)}
                            </Table.Td>
                            <Table.Td>
                              <Flex gap={5}>
                                <ActionIcon variant="default" aria-label="edit">
                                  <IconEdit
                                    className={classes.editAssetAmount}
                                    size="20"
                                    stroke="1.5"
                                    onClick={() => {
                                      router.push(
                                        createTrackPageLink({
                                          holdingEntity,
                                          assetName: asset.name,
                                          // We assume that the number will never go above Number.MAX_SAFE_INTEGER since we are passing around canonical numbers
                                          assetAmount: asset.currencyInfo.canonicalAmount.toNumber(),
                                          assetSymbol: asset.currencyInfo.symbol,
                                          isEditAsset: true,
                                        })
                                      );
                                    }}
                                  />
                                </ActionIcon>
                                <ActionIcon variant="default" aria-label="delete">
                                  <IconTrash
                                    className={classes.editAssetAmount}
                                    size="20"
                                    stroke="1.5"
                                    onClick={() => {
                                      router.push(
                                        `/removeAsset?holdingEntity=${holdingEntity}&assetNameToDelete=${asset.name}`
                                      );
                                    }}
                                  />
                                </ActionIcon>
                              </Flex>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                    <Grid>
                      <Grid.Col span={3} offset={2}>
                        <Button
                          component={Link}
                          href={createTrackPageLink({ holdingEntity, isAddAsset: true })}
                          size="sm"
                          fullWidth
                        >
                          Add Asset
                        </Button>
                      </Grid.Col>
                      <Grid.Col span={3} offset={2}>
                        <Button
                          component={Link}
                          color="red"
                          href={`/removeHolding?holdingEntity=${holdingEntity}`}
                          size="sm"
                          fullWidth
                        >
                          Delete Holding
                        </Button>
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
        <Grid>
          <Grid.Col span={4} offset={4}>
            <Button component={Link} href={createTrackPageLink()} size="sm" fullWidth>
              Add Holding Entity
            </Button>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
}

function createTrackPageLink({
  holdingEntity,
  assetAmount,
  assetName,
  assetSymbol,
  isAddAsset,
  isEditAsset,
}: {
  holdingEntity?: string;
  assetName?: string;
  assetAmount?: number;
  assetSymbol?: string;
  isAddAsset?: boolean;
  isEditAsset?: boolean;
} = {}) {
  let baseLink = '/track';

  // Basic information missing, start the form from scratch
  if (!holdingEntity && !assetAmount) {
    return baseLink;
  }

  const searchParams: string[] = [];

  if (holdingEntity) {
    searchParams.push(`holdingEntity=${holdingEntity}`);
  }

  if (assetAmount) {
    searchParams.push(`assetAmount=${assetAmount}`);
  }

  if (assetName) {
    searchParams.push(`assetName=${assetName}`);
  }

  if (assetSymbol) {
    searchParams.push(`assetSymbol=${assetSymbol}`);
  }

  if (isAddAsset) {
    searchParams.push(`isAddAsset=true`);
  }

  if (isEditAsset) {
    searchParams.push(`isEditAsset=true`);
  }

  return `${baseLink}?${searchParams.join('&')}`;
}

function privatizeText(text: string, isPrivate: boolean): string {
  return isPrivate ? '*****' : text;
}
