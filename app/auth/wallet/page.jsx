'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletAuth } from '../../hooks/useWalletAuth';
import WalletConnect from '../../components/WalletConnect';

export default function WalletAuthPage() {
  const { isConnected, address, isAuthenticating, isAuthenticated, user, authenticate, logout } = useWalletAuth();
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleWalletConnect = async (connectedAddress) => {
    if (connectedAddress) {
      try {
        setError(null);
        const result = await authenticate();
        
        if (result.user) {
          // Check if this is a new user or existing user
          if (result.user.nftCount === 0 && result.user.level === 1) {
            // New user - redirect to getting started
            router.push('/pages/get-started');
          } else {
            // Existing user - redirect to dashboard
            router.push('/dashboard');
          }
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Wallet</h1>
          <p className="text-gray-600">
            Connect your wallet to access Paws Landing
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {isAuthenticated && user ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome back!</h2>
              <p className="text-gray-600 mb-4">
                {user.username} ({address?.slice(0, 6)}...{address?.slice(-4)})
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Discord Role:</span>
                <span className="font-medium capitalize">{user.discordRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Game Level:</span>
                <span className="font-medium">{user.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">NFT Count:</span>
                <span className="font-medium">{user.nftCount}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <WalletConnect onConnect={handleWalletConnect} />
            
            {isAuthenticating && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Authenticating...</p>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don't have a wallet?{' '}
                <a 
                  href="https://metamask.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Install MetaMask
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}