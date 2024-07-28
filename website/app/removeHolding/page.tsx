import { Container, Flex, Title } from '@mantine/core';
import { notFound } from 'next/navigation';
import { ReactElement } from 'react';

import { BackButton } from './BackButton';
import { RemoveHoldingButton } from './RemoveHoldingButton';

type SearchParams = {
  holdingEntity?: string;
};

export default function Page({ searchParams }: { searchParams?: SearchParams }): ReactElement {
  const { holdingEntity } = searchParams ?? {};

  if (!holdingEntity) {
    return notFound();
  }

  return (
    <Container size="xs">
      <Title>Remove Holding</Title>
      <p>Are you sure you want to remove {holdingEntity} from your holdings? This is an irreversible process.</p>
      <Flex justify="space-between">
        <BackButton />
        <RemoveHoldingButton holdingEntity={holdingEntity ?? ''} />
      </Flex>
    </Container>
  );
}
