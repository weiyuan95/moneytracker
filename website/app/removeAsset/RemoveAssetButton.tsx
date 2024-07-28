'use client';
import { Button, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';

import { useHoldings } from '../../store/HoldingsProvider';

type Props = {
  holdingEntity: string;
  assetNameToDelete: string;
};

export function RemoveAssetButton({ holdingEntity, assetNameToDelete }: Props): ReactElement {
  const { clearAsset } = useHoldings();
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        clearAsset(holdingEntity, assetNameToDelete);
        notifications.show({
          title: 'Asset Removed',
          message: `${assetNameToDelete} removed from ${holdingEntity}.`,
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
