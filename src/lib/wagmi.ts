import { http, createConfig } from 'wagmi';
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { STORY_NETWORK } from './contracts/addresses';

// WalletConnect project ID - you'll need to get this from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'ghost-protocol-2c6f4c7e8b9d4f3a1e5c7b8a9d4f3a1e';

// Configure Wagmi with Story Protocol Odyssey Testnet
export const config = createConfig({
  chains: [STORY_NETWORK as any],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId,
      metadata: {
        name: 'Ghost Protocol',
        description: 'Intellectual Property Rights for the Deceased on Story Protocol',
        url: 'https://ghost-protocol.app',
        icons: ['https://ghost-protocol.app/logo.png'],
      },
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: 'Ghost Protocol',
      appLogoUrl: 'https://ghost-protocol.app/logo.png',
    }),
  ],
  transports: {
    [STORY_NETWORK.id]: http(STORY_NETWORK.rpcUrls.default.http[0]),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}