import { useWriteContract, useWaitForTransactionReceipt, usePublicClient, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { GhostWalletFactoryABI } from '@/lib/contracts/GhostWalletFactoryABI';
import { GhostWalletABI } from '@/lib/contracts/GhostWalletABI';
import { toast } from 'react-hot-toast';
import { parseEventLogs } from 'viem';

interface CreateGhostWalletParams {
  creatorName: string;
  deathYear: number;
  beneficiaries: Array<{
    walletAddress: string;
    name: string;
    percentage: number;
  }>;
  adminAddress: string;
}

/**
 * Hook: Create Ghost Wallet for deceased creators
 */
export function useCreateGhostWallet() {
  const publicClient = usePublicClient();
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createGhostWallet = async (params: CreateGhostWalletParams) => {
    try {
      console.log('🎭 Creating Ghost Wallet with params:', params);

      // Validate inputs
      if (!params.beneficiaries || params.beneficiaries.length === 0) {
        throw new Error('At least one beneficiary is required');
      }

      // Prepare data
      const addresses = params.beneficiaries.map(b => b.walletAddress as `0x${string}`);
      const shares = params.beneficiaries.map(b => BigInt(Math.round(b.percentage * 100))); // Convert to basis points
      const names = params.beneficiaries.map(b => b.name);

      // Validate total shares = 100%
      const totalPercentage = params.beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new Error(`Total beneficiary percentage must equal 100%, got ${totalPercentage}%`);
      }

      console.log('📊 Prepared contract data:', {
        addresses,
        shares: shares.map(s => s.toString()),
        names,
      });

      // Call contract
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.GHOST_WALLET_FACTORY,
        abi: GhostWalletFactoryABI,
        functionName: 'createGhostWallet',
        args: [
          params.creatorName,
          BigInt(params.deathYear),
          addresses,
          shares,
          names,
          [params.adminAddress as `0x${string}`],
          BigInt(1), // requiredSigs
        ],
      });

      toast.success('Ghost Wallet creation transaction sent!');
      console.log('📤 Transaction hash:', txHash);

      // Wait for confirmation
      const receipt = await publicClient!.waitForTransactionReceipt({ hash: txHash });
      console.log('✅ Transaction confirmed:', receipt);

      // Parse event to get Ghost Wallet address
      const logs = parseEventLogs({
        abi: GhostWalletFactoryABI,
        logs: receipt.logs,
        eventName: 'GhostWalletCreated',
      });

      const ghostWalletAddress = logs[0]?.args.walletAddress;
      console.log('🎉 Ghost Wallet created at:', ghostWalletAddress);

      toast.success(`Ghost Wallet created successfully! ${ghostWalletAddress}`);

      return {
        success: true,
        ghostWalletAddress,
        txHash,
      };
    } catch (error: any) {
      console.error('❌ Ghost Wallet creation error:', error);
      toast.error(error.shortMessage || error.message || 'Failed to create Ghost Wallet');
      return {
        success: false,
        error: error.message,
      };
    }
  };

  return {
    createGhostWallet,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook: Get Ghost Wallet by creator name and death year
 */
export function useGetGhostWallet(creatorName: string | null, deathYear: number | null) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GHOST_WALLET_FACTORY,
    abi: GhostWalletFactoryABI,
    functionName: 'getGhostWallet',
    args: creatorName && deathYear ? [creatorName, BigInt(deathYear)] : undefined,
    query: {
      enabled: !!creatorName && !!deathYear,
    },
  });
}

/**
 * Hook: Get total number of Ghost Wallets created
 */
export function useGetTotalWallets() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GHOST_WALLET_FACTORY,
    abi: GhostWalletFactoryABI,
    functionName: 'getTotalWallets',
  });
}

/**
 * Hook: Get all beneficiaries of a Ghost Wallet
 */
export function useGetBeneficiaries(ghostWalletAddress: string | null) {
  return useReadContract({
    address: ghostWalletAddress as `0x${string}`,
    abi: GhostWalletABI,
    functionName: 'beneficiaryList',
    args: [BigInt(0)], // Get first beneficiary as example
    query: {
      enabled: !!ghostWalletAddress && ghostWalletAddress !== '0x0000000000000000000000000000000000000000',
    },
  });
}
