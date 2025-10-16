import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { GhostWalletFactoryABI } from '@/lib/contracts/GhostWalletFactoryABI';
import { GhostWalletABI } from '@/lib/contracts/GhostWalletABI';

/**
 * Fetch all Ghost Wallets from the blockchain
 */
export function useAllGhostWallets() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get total count
  const { data: totalCount } = useReadContract({
    address: CONTRACT_ADDRESSES.GHOST_WALLET_FACTORY,
    abi: GhostWalletFactoryABI,
    functionName: 'getTotalWallets',
  });

  useEffect(() => {
    async function fetchAllWallets() {
      if (!totalCount) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const count = Number(totalCount);
        
        if (count === 0) {
          setWallets([]);
          setIsLoading(false);
          return;
        }

        // For now, return empty array since we need proper batch fetching
        // This would require fetching wallet addresses from factory contract
        // and then details from each wallet
        setWallets([]);
        setError(null);
      } catch (err) {
        console.error('Error fetching Ghost Wallets:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllWallets();
  }, [totalCount]);

  return { wallets, isLoading, error, totalCount: Number(totalCount || 0) };
}

/**
 * Fetch Ghost Wallet details by address
 */
export function useGhostWalletDetails(walletAddress: string | null) {
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get creator info
  const { data: creatorData } = useReadContract({
    address: walletAddress as `0x${string}`,
    abi: GhostWalletABI,
    functionName: 'creatorName',
    query: {
      enabled: !!walletAddress && walletAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Get death year
  const { data: deathYearData } = useReadContract({
    address: walletAddress as `0x${string}`,
    abi: GhostWalletABI,
    functionName: 'deathYear',
    query: {
      enabled: !!walletAddress && walletAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  useEffect(() => {
    if (creatorData && deathYearData) {
      setDetails({
        creatorName: creatorData,
        deathYear: Number(deathYearData),
        address: walletAddress,
      });
    }
  }, [creatorData, deathYearData, walletAddress]);

  return {
    details,
    isLoading,
  };
}

/**
 * Hook to get beneficiaries of a Ghost Wallet
 */
export function useWalletBeneficiaries(walletAddress: string | null) {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // This would require iterating through beneficiary list
  // For now, return empty array
  useEffect(() => {
    if (walletAddress && walletAddress !== '0x0000000000000000000000000000000000000000') {
      setBeneficiaries([]);
    }
  }, [walletAddress]);

  return {
    beneficiaries,
    isLoading,
  };
}
