import { useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { IPRegistryABI } from '@/lib/contracts/IPRegistryABI';
import { toast } from 'react-hot-toast';
import { parseEventLogs } from 'viem';

/**
 * Hook: Check if content is already registered (plagiarism check)
 */
export function useCheckPlagiarism(ipfsHash: string | null) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.IP_REGISTRY,
    abi: IPRegistryABI,
    functionName: 'isContentRegistered',
    args: ipfsHash ? [ipfsHash] : undefined,
    query: {
      enabled: !!ipfsHash,
    },
  });
}

/**
 * Hook: Register IP Asset on the blockchain
 */
export function useRegisterIPAsset() {
  const publicClient = usePublicClient();
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const registerIPAsset = async (params: {
    owner: string;
    ghostWallet: string;
    ipfsHash: string;
    title: string;
    creator: string;
    isDeceased: boolean;
  }) => {
    try {
      console.log('📝 Registering IP Asset with params:', params);

      // Call contract
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.IP_REGISTRY,
        abi: IPRegistryABI,
        functionName: 'registerIPAsset',
        args: [
          params.owner as `0x${string}`,
          params.ghostWallet as `0x${string}`,
          params.ipfsHash,
          params.title,
          params.creator,
          params.isDeceased,
        ],
      });

      toast.success('IP registration transaction sent!');
      console.log('📤 Transaction hash:', txHash);

      // Wait for confirmation
      const receipt = await publicClient!.waitForTransactionReceipt({ hash: txHash });
      console.log('✅ Transaction confirmed:', receipt);

      // Parse event to get IP Asset ID
      const logs = parseEventLogs({
        abi: IPRegistryABI,
        logs: receipt.logs,
        eventName: 'IPAssetRegistered',
      });

      const ipAssetId = logs[0]?.args.id;
      console.log('🎉 IP Asset registered with ID:', ipAssetId?.toString());

      toast.success(`IP Asset registered successfully! ID: ${ipAssetId?.toString()}`);

      return {
        success: true,
        ipAssetId,
        txHash,
      };
    } catch (error: any) {
      console.error('❌ IP registration error:', error);
      toast.error(error.shortMessage || error.message || 'Failed to register IP Asset');
      return {
        success: false,
        error: error.message,
      };
    }
  };

  return {
    registerIPAsset,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook: Get IP Asset details by ID
 */
export function useGetIPAsset(ipAssetId: bigint | null) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.IP_REGISTRY,
    abi: IPRegistryABI,
    functionName: 'getIPAsset',
    args: ipAssetId !== null ? [ipAssetId] : undefined,
    query: {
      enabled: ipAssetId !== null,
    },
  });
}

/**
 * Hook: Get total number of IP Assets registered
 */
export function useGetTotalIPAssets() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.IP_REGISTRY,
    abi: IPRegistryABI,
    functionName: 'getTotalIPAssets',
  });
}
