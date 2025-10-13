import { useAccount } from 'wagmi';
import { useRegistrationStore } from '@/store/useRegistrationStore';
import { useCreateGhostWallet } from './useGhostWallet';
import { useRegisterIPAsset, useCheckPlagiarism } from './useIPRegistry';
import { toast } from 'react-hot-toast';

/**
 * Complete registration orchestration hook
 * Handles the full flow: Ghost Wallet creation (if needed) → IP Asset registration
 */
export function useRegistration() {
  const { address } = useAccount();
  const { formData } = useRegistrationStore();
  
  const { createGhostWallet, isPending: isCreatingWallet } = useCreateGhostWallet();
  const { registerIPAsset, isPending: isRegisteringIP } = useRegisterIPAsset();
  const { data: isPlagiarized, isLoading: isCheckingPlagiarism } = useCheckPlagiarism(formData.ipfsHash || null);

  const handleCompleteRegistration = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return { success: false, error: 'No wallet connected' };
    }

    if (!formData.ipfsHash || !formData.fileAnalysis) {
      toast.error('Please upload a file first');
      return { success: false, error: 'No file uploaded' };
    }

    if (isPlagiarized) {
      toast.error('⚠️ This content is already registered!');
      return { success: false, error: 'Content already registered' };
    }

    try {
      let ghostWalletAddress = '0x0000000000000000000000000000000000000000';

      // Step 1: Create Ghost Wallet if deceased
      if (formData.isDeceased) {
        if (!formData.creatorName || !formData.deathYear) {
          toast.error('Creator name and death year are required');
          return { success: false, error: 'Missing creator details' };
        }

        if (formData.beneficiaries.length === 0) {
          toast.error('At least one beneficiary is required');
          return { success: false, error: 'No beneficiaries' };
        }

        toast.loading('Creating Ghost Wallet...', { id: 'ghost-wallet' });
        
        const ghostResult = await createGhostWallet({
          creatorName: formData.creatorName,
          deathYear: formData.deathYear,
          beneficiaries: formData.beneficiaries,
          adminAddress: address,
        });

        toast.dismiss('ghost-wallet');

        if (!ghostResult.success) {
          return { success: false, error: 'Ghost Wallet creation failed' };
        }

        ghostWalletAddress = ghostResult.ghostWalletAddress!;
        console.log('✅ Ghost Wallet created:', ghostWalletAddress);
      }

      // Step 2: Register IP Asset
      toast.loading('Registering IP Asset on blockchain...', { id: 'ip-registration' });

      const ipResult = await registerIPAsset({
        owner: address,
        ghostWallet: ghostWalletAddress,
        ipfsHash: formData.ipfsHash,
        title: formData.fileAnalysis.title || 'Untitled',
        creator: formData.creatorName || 'Unknown',
        isDeceased: formData.isDeceased ?? false,
      });

      toast.dismiss('ip-registration');

      if (!ipResult.success) {
        return { success: false, error: 'IP registration failed' };
      }

      // Log results (You can store this in your store if needed)
      console.log('🎉 Registration Complete:', {
        ipAssetId: ipResult.ipAssetId,
        ghostWalletAddress,
        transactionHash: ipResult.txHash,
      });

      toast.success('✨ IP Asset registered successfully on Story Protocol!', {
        duration: 6000,
      });

      return {
        success: true,
        ipAssetId: ipResult.ipAssetId,
        ghostWalletAddress,
        txHash: ipResult.txHash,
      };
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      toast.error('Registration failed: ' + (error.message || 'Unknown error'));
      return { success: false, error: error.message };
    }
  };

  return {
    handleCompleteRegistration,
    isPending: isCreatingWallet || isRegisteringIP,
    isCheckingPlagiarism,
    isPlagiarized: !!isPlagiarized,
    isReady: !!address && !!formData.ipfsHash && !isPlagiarized,
  };
}
