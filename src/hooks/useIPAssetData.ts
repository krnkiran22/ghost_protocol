import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { IPRegistryABI } from '@/lib/contracts/IPRegistryABI';

/**
 * Fetch all IP Assets from the blockchain
 */
export function useAllIPAssets() {
  const [ipAssets, setIPAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get total count
  const { data: totalCount } = useReadContract({
    address: CONTRACT_ADDRESSES.IP_REGISTRY,
    abi: IPRegistryABI,
    functionName: 'getTotalIPAssets',
  });

  useEffect(() => {
    async function fetchAllIPAssets() {
      if (!totalCount) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const count = Number(totalCount);
        
        if (count === 0) {
          setIPAssets([]);
          setIsLoading(false);
          return;
        }

        // Fetch all IP assets using batch query
        const ids = Array.from({ length: count }, (_, i) => BigInt(i + 1));
        
        // Note: You'll need to implement batch fetching or fetch individually
        // For now, we'll fetch first 10 assets individually
        const assets: any[] = [];
        const maxAssets = Math.min(count, 10);
        
        for (let i = 1; i <= maxAssets; i++) {
          try {
            // This would need to be done with proper batch reading
            // For now, we just mark it as needing proper implementation
            assets.push({
              id: i.toString(),
              // Will be fetched individually or via batch
            });
          } catch (err) {
            console.error(`Error fetching IP Asset ${i}:`, err);
          }
        }

        setIPAssets(assets);
        setError(null);
      } catch (err) {
        console.error('Error fetching IP Assets:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllIPAssets();
  }, [totalCount]);

  return { ipAssets, isLoading, error, totalCount: Number(totalCount || 0) };
}

/**
 * Fetch single IP Asset details
 */
export function useIPAssetDetails(ipAssetId: bigint | null) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.IP_REGISTRY,
    abi: IPRegistryABI,
    functionName: 'getIPAsset',
    args: ipAssetId !== null ? [ipAssetId] : undefined,
    query: {
      enabled: ipAssetId !== null,
    },
  });

  return {
    ipAsset: data as any,
    isLoading,
    error,
  };
}

/**
 * Hook to get IP Asset stats (deceased vs living)
 */
export function useIPAssetStats() {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.IP_REGISTRY,
    abi: IPRegistryABI,
    functionName: 'getIPAssetStats',
  });

  return {
    stats: data ? {
      deceased: Number((data as any)[0]),
      living: Number((data as any)[1]),
      total: Number((data as any)[0]) + Number((data as any)[1]),
    } : null,
    isLoading,
    error,
  };
}
