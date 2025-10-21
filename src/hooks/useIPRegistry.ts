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

      // Validate inputs
      if (!params.owner || params.owner === '0x0000000000000000000000000000000000000000') {
        throw new Error('Invalid owner address');
      }

      if (!params.ipfsHash || params.ipfsHash.trim() === '') {
        throw new Error('IPFS hash is required');
      }

      if (!params.title || params.title.trim() === '') {
        throw new Error('Title is required');
      }

      if (!params.creator || params.creator.trim() === '') {
        throw new Error('Creator name is required');
      }

      // Ensure ghostWallet is valid address (use zero address if not deceased)
      const ghostWalletAddress = params.ghostWallet && params.ghostWallet !== '0x0000000000000000000000000000000000000000'
        ? params.ghostWallet
        : '0x0000000000000000000000000000000000000000';

      console.log('✅ Validated params:', {
        owner: params.owner,
        ghostWallet: ghostWalletAddress,
        ipfsHash: params.ipfsHash,
        title: params.title,
        creator: params.creator,
        isDeceased: params.isDeceased,
      });

      // Call contract with explicit gas limit
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.IP_REGISTRY,
        abi: IPRegistryABI,
        functionName: 'registerIPAsset',
        args: [
          params.owner as `0x${string}`,
          ghostWalletAddress as `0x${string}`,
          params.ipfsHash,
          params.title,
          params.creator,
          params.isDeceased,
        ],
        gas: 500000n, // Explicit gas limit
      });

      toast.success('IP registration transaction sent!');
      console.log('📤 Transaction hash:', txHash);
      toast.loading('Waiting for blockchain confirmation... This may take 30-60 seconds', { 
        id: 'waiting-confirmation',
        duration: Infinity 
      });

      // Wait for confirmation with longer timeout (5 minutes instead of default 1 minute)
      const receipt = await publicClient!.waitForTransactionReceipt({ 
        hash: txHash,
        timeout: 300_000, // 5 minutes
        pollingInterval: 2_000, // Check every 2 seconds
      });
      
      toast.dismiss('waiting-confirmation');
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
      
      // Better error messages
      let errorMessage = 'Failed to register IP Asset';
      
      if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas';
      } else if (error.message?.includes('already registered')) {
        errorMessage = 'This content is already registered';
      } else if (error.shortMessage) {
        errorMessage = error.shortMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
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
