import { ReactElement } from 'react';
import { notFound } from 'next/navigation';
import { Container, Flex, Title } from '@mantine/core';
import { RemoveHoldingButton } from './RemoveHoldingButton';
import { BackButton } from './BackButton';

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
