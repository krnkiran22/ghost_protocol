import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wallet, 
  TrendingUp, 
  Users, 
  Activity,
  DollarSign,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useAccount } from 'wagmi';
import { STORY_NETWORK } from '@/lib/contracts/addresses';

// Mock Ghost Wallet data (replace with real contract calls)
interface GhostWallet {
  address: string;
  creatorName: string;
  deathYear: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  pendingBalance: number;
  beneficiariesCount: number;
  ipAssetsCount: number;
  lastActivity: Date;
}

interface Beneficiary {
  address: string;
  name: string;
  share: number;
  totalReceived: number;
}

interface IPAsset {
  id: string;
  title: string;
  derivatives: number;
  earnings: number;
}

/**
 * Ghost Wallet Dashboard
 * 
 * View and manage Ghost Wallets created for deceased creators
 * Shows earnings, beneficiaries, and activity logs
 */
export const GhostWalletDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [selectedWallet, setSelectedWallet] = useState<GhostWallet | null>(null);

  // Mock data - replace with actual blockchain queries
  const mockWallets: GhostWallet[] = [
    {
      address: '0xGHO5T742bd8e9f3a1c5d6e8f9a2b3c4d5e6',
      creatorName: 'Bram Stoker',
      deathYear: 1912,
      totalEarnings: 847293,
      thisMonthEarnings: 12473,
      pendingBalance: 2847,
      beneficiariesCount: 3,
      ipAssetsCount: 3,
      lastActivity: new Date('2025-10-12')
    },
    {
      address: '0xGHO5T893cd0f5b7e9a3d8f1b4c6d8e2f7a9',
      creatorName: 'Mary Shelley',
      deathYear: 1851,
      totalEarnings: 623847,
      thisMonthEarnings: 8294,
      pendingBalance: 1923,
      beneficiariesCount: 2,
      ipAssetsCount: 2,
      lastActivity: new Date('2025-10-11')
    },
  ];

  const mockBeneficiaries: Beneficiary[] = [
    {
      address: '0x742bd8e9f3a1c5d6e8f9a2b3c4d5e6f7a8b',
      name: 'Stoker Family Trust',
      share: 50,
      totalReceived: 423646
    },
    {
      address: '0x8f3a1c5d6e8f9a2b3c4d5e6f7a8b9c0d1e2',
      name: 'Trinity College Dublin',
      share: 30,
      totalReceived: 254187
    },
    {
      address: '0xc5d6e8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b',
      name: 'Irish Writers\' Museum',
      share: 20,
      totalReceived: 169458
    },
  ];

  const mockIPAssets: IPAsset[] = [
    { id: '1', title: 'Dracula', derivatives: 1247, earnings: 742839 },
    { id: '2', title: 'The Jewel of Seven Stars', derivatives: 87, earnings: 52394 },
    { id: '3', title: 'The Lair of the White Worm', derivatives: 42, earnings: 52060 },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4 text-stone-400" />
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-stone-600 mb-6">
            Please connect your wallet to view your Ghost Wallets
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => navigate('/')}
              >
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-stone-900">Ghost Wallet Dashboard</h1>
                <p className="text-sm text-stone-600">Administering eternal IP rights</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
            >
              + Create New Ghost Wallet
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-stone-600">Total Ghost Wallets</p>
              <Wallet className="h-5 w-5 text-gold" />
            </div>
            <p className="text-3xl font-bold text-stone-900">{mockWallets.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-stone-600">Total Earnings</p>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-stone-900">
              ${mockWallets.reduce((sum, w) => sum + w.totalEarnings, 0).toLocaleString()}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-stone-600">This Month</p>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-stone-900">
              ${mockWallets.reduce((sum, w) => sum + w.thisMonthEarnings, 0).toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-1">↑ 23% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-stone-600">Total Beneficiaries</p>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-stone-900">
              {mockWallets.reduce((sum, w) => sum + w.beneficiariesCount, 0)}
            </p>
          </Card>
        </div>

        {/* Ghost Wallets List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockWallets.map((wallet) => (
            <motion.div
              key={wallet.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className="p-6 cursor-pointer border-2 border-transparent hover:border-gold transition-colors"
                onClick={() => setSelectedWallet(wallet)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 mb-1">
                      {wallet.creatorName}
                    </h3>
                    <p className="text-sm text-stone-600">
                      ({wallet.deathYear.toLocaleString()}) 👻
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gold">
                      ${wallet.totalEarnings.toLocaleString()}
                    </p>
                    <p className="text-xs text-stone-600">Total Earnings</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-700">
                      ${wallet.thisMonthEarnings.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600">This Month</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-700">
                      {wallet.beneficiariesCount}
                    </p>
                    <p className="text-xs text-blue-600">Beneficiaries</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-700">
                      {wallet.ipAssetsCount}
                    </p>
                    <p className="text-xs text-purple-600">IP Assets</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar className="h-4 w-4" />
                    <span>Last activity: {wallet.lastActivity.toLocaleDateString()}</span>
                  </div>
                  <a
                    href={`${STORY_NETWORK.blockExplorers.default.url}/address/${wallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-sm text-gold hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Explorer
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed View Modal */}
        {selectedWallet && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedWallet(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">{selectedWallet.creatorName}</h2>
                  <p className="text-sm text-stone-600">Ghost Wallet Details</p>
                </div>
                <button
                  onClick={() => setSelectedWallet(null)}
                  className="text-stone-400 hover:text-stone-900"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Wallet Info */}
                <Card className="p-4 bg-stone-50">
                  <p className="text-xs text-stone-600 mb-1">Wallet Address</p>
                  <p className="font-mono text-sm text-stone-900">{selectedWallet.address}</p>
                </Card>

                {/* Beneficiaries */}
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Beneficiaries ({mockBeneficiaries.length})
                  </h3>
                  <div className="space-y-3">
                    {mockBeneficiaries.map((beneficiary) => (
                      <Card key={beneficiary.address} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-stone-900">{beneficiary.name}</p>
                            <p className="text-xs font-mono text-stone-600">{beneficiary.address.substring(0, 20)}...</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gold">{beneficiary.share}%</p>
                            <p className="text-xs text-stone-600">${beneficiary.totalReceived.toLocaleString()} received</p>
                          </div>
                        </div>
                        <div className="mt-2 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gold rounded-full"
                            style={{ width: `${beneficiary.share}%` }}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* IP Assets */}
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    IP Assets ({mockIPAssets.length})
                  </h3>
                  <div className="space-y-3">
                    {mockIPAssets.map((asset) => (
                      <Card key={asset.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-stone-900">{asset.title}</p>
                            <p className="text-sm text-stone-600">{asset.derivatives} derivatives</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-700">${asset.earnings.toLocaleString()}</p>
                            <p className="text-xs text-stone-600">Lifetime earnings</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-stone-200">
                  <Button variant="primary" className="flex-1">
                    Send Test Payment
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Manage Beneficiaries
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Activity Log
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
