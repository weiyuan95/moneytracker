import { Flex } from '@mantine/core';
import { ReactElement } from 'react';

import { TrackForm } from './TrackForm';

type SearchParams = {
  holdingEntity?: string;
  assetAmount?: string;
  assetName?: string;
  assetSymbol?: string;
  isEditAsset?: boolean;
  isAddAsset?: boolean;
};

export default function Page({ searchParams }: { searchParams?: SearchParams }): ReactElement {
  const { holdingEntity, assetAmount, assetName, assetSymbol, isEditAsset, isAddAsset } = searchParams ?? {};

  return (
    <Flex justify="center">
      <TrackForm
        holdingEntity={holdingEntity}
        assetName={assetName}
        assetAmount={assetAmount}
        assetSymbol={assetSymbol}
        isEditAsset={isEditAsset}
        isAddAsset={isAddAsset}
      />
    </Flex>
  );
}
