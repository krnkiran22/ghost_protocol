// ═══════════════════════════════════════════════════════════
// CONTRACT ADDRESSES - Story Protocol Aeneid Testnet
// ═══════════════════════════════════════════════════════════

export const CONTRACT_ADDRESSES = {
  // ✅ Your Deployed Contracts on Aeneid
  GHOST_WALLET_IMPLEMENTATION: '0xf73d6c9472245ed0eaf3001fca14c1608d4ccae2' as const,
  GHOST_WALLET_FACTORY: '0xc17c11ab2736bcab4f69e0c1a75f4a7aafbbf1bb' as const,
  IP_REGISTRY: '0x62be70f0015b2398dab49f714762e4886ec24b6e' as const,
} as const;

export const STORY_NETWORK = {
  id: 1514,
  name: 'Story Aeneid Testnet',
  nativeCurrency: {
    name: 'IP',
    symbol: 'IP',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://aeneid.storyrpc.io'],
    },
    public: {
      http: ['https://aeneid.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Explorer',
      url: 'https://aeneid.storyscan.io',
    },
  },
  testnet: true,
} as const;
