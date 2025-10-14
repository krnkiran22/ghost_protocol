import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { config } from '@/lib/wagmi';
import { LandingPage } from '@/pages/LandingPage';
import { IPRegistrationPage } from '@/pages/IPRegistrationPage';
import { SuccessPage } from '@/pages/SuccessPage';
import { InfluenceGraphPage } from '@/pages/InfluenceGraphPage';
import { GhostWalletDashboard } from '@/pages/GhostWalletDashboard';
import { WalletConnectionModal } from '@/components/WalletConnectionModal';
import './index.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<IPRegistrationPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/influence-graph" element={<InfluenceGraphPage />} />
            <Route path="/dashboard" element={<GhostWalletDashboard />} />
          </Routes>
          
          {/* Global Components */}
          <WalletConnectionModal />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(28, 25, 23, 0.95)',
                color: '#fff',
                border: '1px solid rgba(168, 162, 158, 0.2)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
