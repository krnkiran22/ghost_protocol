import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './lib/wagmi'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1C1917',
              color: '#FAFAF9',
              border: '1px solid #D4AF37',
            },
            success: {
              iconTheme: {
                primary: '#D4AF37',
                secondary: '#FAFAF9',
              },
            },
          }}
        />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
