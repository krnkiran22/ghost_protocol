import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WalletState {
  // Connection state
  isConnected: boolean;
  address: string | undefined;
  chainId: number | undefined;
  balance: bigint | undefined;
  
  // UI state
  isConnecting: boolean;
  isWalletModalOpen: boolean;
  
  // Actions
  setConnectionState: (state: Partial<WalletState>) => void;
  setConnecting: (connecting: boolean) => void;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  disconnect: () => void;
}


/**
 * Zustand store for wallet connection state
 * Persists connection preference to localStorage
 */
/**
 * Zustand store for wallet connection state
 */
export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      address: undefined,
      chainId: undefined,
      balance: undefined,
      isConnecting: false,
      isWalletModalOpen: false,

      // Actions
      setConnectionState: (newState) => {
        set((state) => ({
          ...state,
          ...newState,
        }));
      },

      setConnecting: (connecting: boolean) => {
        set({ isConnecting: connecting });
      },

      openWalletModal: () => {
        set({ isWalletModalOpen: true });
      },

      closeWalletModal: () => {
        set({ isWalletModalOpen: false });
      },

      disconnect: () => {
        set({
          isConnected: false,
          address: undefined,
          chainId: undefined,
          balance: undefined,
          isConnecting: false,
        });
      },
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        address: state.address,
        chainId: state.chainId,
        isConnected: state.isConnected,
      }),
    }
  )
);