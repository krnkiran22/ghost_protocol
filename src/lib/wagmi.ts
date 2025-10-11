import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains';
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// WalletConnect project ID - you'll need to get this from https://cloud.walletconnect.com
const projectId = '2c6f4c7e8b9d4f3a1e5c7b8a9d4f3a1e'; // Replace with your actual project ID

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId,
      metadata: {
        name: 'Ghost Protocol',
        description: 'Intellectual Property Rights for the Deceased',
        url: 'https://ghost-protocol.app',
        icons: ['https://ghost-protocol.app/logo.png'],
      },
    }),
    coinbaseWallet({
      appName: 'Ghost Protocol',
      appLogoUrl: 'https://ghost-protocol.app/logo.png',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}