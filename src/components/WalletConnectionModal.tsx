import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Shield, ExternalLink } from 'lucide-react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import toast from 'react-hot-toast';

import { useWalletStore } from '@/store/useWalletStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  recommended?: boolean;
}

const walletOptions: WalletOption[] = [
  {
    id: 'metaMask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect using browser extension',
    recommended: true,
  },
  {
    id: 'walletConnect',
    name: 'WalletConnect',
    icon: '📱',
    description: 'Connect using mobile wallet',
  },
  {
    id: 'coinbaseWallet',
    name: 'Coinbase Wallet',
    icon: '💙',
    description: 'Connect using Coinbase Wallet',
  },
  {
    id: 'injected',
    name: 'Browser Wallet',
    icon: '🌐',
    description: 'Connect using any browser wallet',
  },
];

export const WalletConnectionModal: React.FC = () => {
  const { isWalletModalOpen, closeWalletModal } = useWalletStore();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  
  const { connect, connectors } = useConnect({
    mutation: {
      onSuccess: () => {
        toast.success('Wallet connected successfully!');
        setIsConnecting(null);
        closeWalletModal();
      },
      onError: (error: Error) => {
        console.error('Wallet connection failed:', error);
        toast.error('Failed to connect wallet. Please try again.');
        setIsConnecting(null);
      },
    },
  });

  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleWalletConnect = (walletId: string) => {
    setIsConnecting(walletId);
    
    // Find the appropriate connector
    let targetConnector = connectors.find(connector => {
      switch (walletId) {
        case 'metaMask':
          return connector.name.toLowerCase().includes('metamask');
        case 'walletConnect':
          return connector.name.toLowerCase().includes('walletconnect');
        case 'coinbaseWallet':
          return connector.name.toLowerCase().includes('coinbase');
        case 'injected':
        default:
          return connector.name.toLowerCase().includes('injected') || 
                 connector.name.toLowerCase().includes('browser');
      }
    });

    // Fallback to first available connector
    if (!targetConnector && connectors.length > 0) {
      targetConnector = connectors[0];
    }

    if (targetConnector) {
      connect({ connector: targetConnector });
    } else {
      toast.error('No wallet connector found. Please install a Web3 wallet.');
      setIsConnecting(null);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
    closeWalletModal();
  };

  if (!isWalletModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeWalletModal();
          }
        }}
      >
        <motion.div
          className={cn(
            "bg-stone-900/95 backdrop-blur-xl border border-stone-800/50",
            "rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden",
            "shadow-2xl shadow-vintage-gold/10"
          )}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-800/50">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {isConnected ? 'Manage Wallet' : 'Connect Wallet'}
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                {isConnected 
                  ? 'Your wallet is connected and ready to use'
                  : 'Choose your preferred wallet to connect'
                }
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeWalletModal}
              className="p-2 hover:bg-stone-800/50 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isConnected ? (
              <ConnectedWalletView onDisconnect={handleDisconnect} />
            ) : (
              <WalletOptionsView
                options={walletOptions}
                onConnect={handleWalletConnect}
                connectingWallet={isConnecting}
              />
            )}
          </div>

          {/* Footer */}
          {!isConnected && (
            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Shield className="w-4 h-4" />
                <span>Your wallet data is secure and never stored on our servers</span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface WalletOptionsViewProps {
  options: WalletOption[];
  onConnect: (walletId: string) => void;
  connectingWallet: string | null;
}

const WalletOptionsView: React.FC<WalletOptionsViewProps> = ({
  options,
  onConnect,
  connectingWallet,
}) => {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-stone-300 mb-2">Available Wallets</h3>
        <p className="text-xs text-stone-500">
          Select a wallet to connect and start registering intellectual property
        </p>
      </div>

      {options.map((wallet) => (
        <motion.button
          key={wallet.id}
          onClick={() => onConnect(wallet.id)}
          disabled={connectingWallet !== null}
          className={cn(
            "w-full p-4 rounded-xl border border-stone-800/50",
            "bg-stone-800/20 hover:bg-stone-800/40 transition-all duration-200",
            "flex items-center gap-4 text-left",
            "hover:border-vintage-gold/30 group",
            connectingWallet === wallet.id && "bg-vintage-gold/10 border-vintage-gold/50",
            connectingWallet && connectingWallet !== wallet.id && "opacity-50 cursor-not-allowed"
          )}
          whileHover={{ scale: connectingWallet ? 1 : 1.02 }}
          whileTap={{ scale: connectingWallet ? 1 : 0.98 }}
        >
          <div className="text-2xl">{wallet.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-white">{wallet.name}</h4>
              {wallet.recommended && (
                <span className="px-2 py-0.5 text-xs font-medium bg-vintage-gold/20 text-vintage-gold rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <p className="text-sm text-stone-400 mt-0.5">{wallet.description}</p>
          </div>
          {connectingWallet === wallet.id && (
            <div className="w-5 h-5 border-2 border-vintage-gold border-t-transparent rounded-full animate-spin" />
          )}
        </motion.button>
      ))}

      <div className="mt-6 p-4 bg-stone-800/20 rounded-xl border border-stone-800/50">
        <div className="flex items-start gap-3">
          <Wallet className="w-5 h-5 text-vintage-gold mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-white mb-1">New to Web3?</h4>
            <p className="text-xs text-stone-400 mb-2">
              You'll need a Web3 wallet to register and manage your intellectual property on the blockchain.
            </p>
            <button 
              onClick={() => window.open('https://metamask.io/download/', '_blank')}
              className="inline-flex items-center gap-1 text-xs text-vintage-gold hover:text-vintage-gold/80 transition-colors"
            >
              Get MetaMask <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ConnectedWalletViewProps {
  onDisconnect: () => void;
}

const ConnectedWalletView: React.FC<ConnectedWalletViewProps> = ({ onDisconnect }) => {
  const { address, connector } = useAccount();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <div>
            <h3 className="text-sm font-medium text-green-400">Wallet Connected</h3>
            <p className="text-xs text-green-300/70 mt-0.5">
              Ready to register intellectual property
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-stone-800/20 rounded-xl border border-stone-800/50">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">
              Connected Wallet
            </label>
            <p className="text-sm font-mono text-white mt-1">
              {address ? formatAddress(address) : 'Not connected'}
            </p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">
              Wallet Type
            </label>
            <p className="text-sm text-white mt-1">
              {connector?.name || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => {
            if (address) {
              navigator.clipboard.writeText(address);
              toast.success('Address copied to clipboard');
            }
          }}
          className="flex-1"
        >
          Copy Address
        </Button>
        <Button
          variant="ghost"
          onClick={onDisconnect}
          className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
};