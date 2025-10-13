import { useSwitchChain, useChainId } from 'wagmi';
import { STORY_NETWORK } from '@/lib/contracts/addresses';
import toast from 'react-hot-toast';

/**
 * Hook to check and switch to Story Protocol network
 */
export function useNetworkCheck() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const isCorrectNetwork = chainId === STORY_NETWORK.id;

  const switchToStory = async () => {
    try {
      toast.loading('Switching to Story Protocol...', { id: 'network-switch' });
      
      await switchChain({ chainId: STORY_NETWORK.id as any });
      
      toast.dismiss('network-switch');
      toast.success('Successfully switched to Story Protocol!');
      
      return true;
    } catch (error: any) {
      toast.dismiss('network-switch');
      
      // If network not added to wallet, show instructions
      if (error.code === 4902 || error.message?.includes('Unrecognized chain')) {
        toast.error(
          'Please add Story Protocol network to your wallet manually',
          { duration: 6000 }
        );
        
        // Show network details to user
        console.log('Add this network to your wallet:', {
          chainId: `0x${STORY_NETWORK.id.toString(16)}`,
          chainName: STORY_NETWORK.name,
          rpcUrls: STORY_NETWORK.rpcUrls.default.http,
          blockExplorerUrls: [STORY_NETWORK.blockExplorers.default.url],
          nativeCurrency: STORY_NETWORK.nativeCurrency,
        });
        
        return false;
      }
      
      toast.error('Failed to switch network');
      console.error('Network switch error:', error);
      return false;
    }
  };

  return { 
    isCorrectNetwork, 
    switchToStory, 
    isPending,
    currentChainId: chainId,
    requiredChainId: STORY_NETWORK.id 
  };
}
