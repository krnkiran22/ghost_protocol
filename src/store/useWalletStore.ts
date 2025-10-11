import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WalletState {
  // Connection state
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  
  // UI state
  showConnectionModal: boolean;
  
  // Actions
  setConnected: (address: string, chainId: number) => void;
  setDisconnected: () => void;
  setConnecting: (connecting: boolean) => void;
  toggleConnectionModal: (show?: boolean) => void;
}

/**
 * Zustand store for wallet connection state
 * Persists connection preference to localStorage
 */
export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      address: null,
      chainId: null,
      isConnecting: false,
      showConnectionModal: false,

      // Actions
      setConnected: (address: string, chainId: number) => {
        set({
          isConnected: true,
          address,
          chainId,
          isConnecting: false,
        });
      },

      setDisconnected: () => {
        set({
          isConnected: false,
          address: null,
          chainId: null,
          isConnecting: false,
        });
      },

      setConnecting: (connecting: boolean) => {
        set({ isConnecting: connecting });
      },

      toggleConnectionModal: (show?: boolean) => {
        const currentShow = get().showConnectionModal;
        set({ showConnectionModal: show !== undefined ? show : !currentShow });
      },
    }),
    {
      name: 'ghost-protocol-wallet',
      // Only persist connection preference, not sensitive data
      partialize: () => ({ 
        // Don't persist actual connection data for security
      }),
    }
  )
);