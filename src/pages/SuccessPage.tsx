import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ExternalLink, Home, Twitter, Repeat } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useRegistrationStore } from '@/store/useRegistrationStore';

/**
 * Success Page - Shown after successful IP registration
 * Now with confetti animation and sharing options
 */
export const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reset } = useRegistrationStore();
  
  const txHash = searchParams.get('tx');
  const ipAssetId = searchParams.get('id');
  const ghostWallet = searchParams.get('wallet');

  const explorerUrl = `https://odyssey.storyscan.io/tx/${txHash}`;

  // Trigger confetti on mount
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Gold confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#D4AF37', '#CD7F32', '#FFD700']
      });
      
      // Gold confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#D4AF37', '#CD7F32', '#FFD700']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleRegisterAnother = () => {
    reset();
    navigate('/register');
  };

  const handleShareTwitter = () => {
    const text = `I just registered my IP on Ghost Protocol! 👻✨ Ensuring eternal royalties for creators on @StoryProtocol blockchain. #GhostProtocol #Web3`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 flex items-center justify-center px-4 py-8">\n      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-12 text-center shadow-2xl">\n          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-stone-900 mb-4"
          >
            ✨ IP Asset Successfully Registered!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-stone-600 mb-8"
          >
            Your intellectual property has been permanently recorded on the Story Protocol blockchain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-stone-50 rounded-xl p-6 mb-8 space-y-4"
          >
            {ipAssetId && (
              <div className="flex justify-between items-center py-2 border-b border-stone-200">
                <span className="text-sm font-medium text-stone-700">IP Asset ID:</span>
                <span className="text-sm font-mono text-accent-gold">{ipAssetId}</span>
              </div>
            )}

            {ghostWallet && ghostWallet !== '0x0000000000000000000000000000000000000000' && (
              <div className="flex justify-between items-center py-2 border-b border-stone-200">
                <span className="text-sm font-medium text-stone-700">Ghost Wallet:</span>
                <span className="text-sm font-mono text-stone-900">
                  {ghostWallet.slice(0, 6)}...{ghostWallet.slice(-4)}
                </span>
              </div>
            )}

            {txHash && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-stone-700">Transaction Hash:</span>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-mono text-accent-gold hover:underline"
                >
                  {txHash.slice(0, 6)}...{txHash.slice(-4)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {txHash && (
              <Button
                variant="secondary"
                onClick={() => window.open(explorerUrl, '_blank')}
                iconRight={<ExternalLink className="h-4 w-4" />}
              >
                View on Explorer
              </Button>
            )}

            <Button
              variant="primary"
              onClick={() => navigate('/')}
              icon={<Home className="h-4 w-4" />}
            >
              Back to Home
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-6 border-t border-stone-200"
          >
            <p className="text-sm text-stone-500">
              Your IP is now protected on the blockchain and eligible for royalties through Story Protocol.
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
