import { Container, Flex, Title } from '@mantine/core';
import { notFound } from 'next/navigation';
import { ReactElement } from 'react';

import { BackButton } from '../removeHolding/BackButton';
import { RemoveAssetButton } from './RemoveAssetButton';

type SearchParams = {
  holdingEntity?: string;
  assetNameToDelete?: string;
};

export default function Page({ searchParams }: { searchParams?: SearchParams }): ReactElement {
  const { holdingEntity, assetNameToDelete } = searchParams ?? {};

  if (!holdingEntity && !assetNameToDelete) {
    return notFound();
  }

  return (
    <Container size="xs">
      <Title>Remove Holding</Title>
      <p>
        Are you sure you want to remove {assetNameToDelete} from {holdingEntity}? This is an irreversible process.
      </p>
      <Flex justify="space-between">
        <BackButton />
        <RemoveAssetButton holdingEntity={holdingEntity ?? ''} assetNameToDelete={assetNameToDelete ?? ''} />
      </Flex>
    </Container>
  );
}
