'use client';
import { Button, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';

import { useHoldings } from '../../store/HoldingsProvider';

type Props = {
  holdingEntity: string;
};

export function RemoveHoldingButton({ holdingEntity }: Props): ReactElement {
  const { clearHolding } = useHoldings();
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        clearHolding(holdingEntity);
        notifications.show({
          title: 'Holding Entity Removed',
          message: `${holdingEntity} removed from your holdings.`,
          color: 'green',
        });
        router.back();
      }}
      color="red"
      style={{ width: rem(100) }}
    >
      Remove
    </Button>
  );
}
