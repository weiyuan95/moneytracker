import { AssetDto, HoldingsData } from '../Holdings';

export interface HoldingsStore {
  getHoldings: () => HoldingsData;
  upsertHolding: (holdingEntity: string, asset: AssetDto) => Promise<void>;
  clearAsset: (holdingEntity: string, assetNameToDelete: string) => void;
  clearHolding: (holdingEntity: string) => void;
  clearAllHoldings: () => void;
  updateFiatCache: (symbol: string) => Promise<void>;
}
