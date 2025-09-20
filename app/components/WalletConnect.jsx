'use client';

import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

const WalletConnect = ({ onConnect, className = '' }) => {
  const { isConnected, address, isConnecting, connect, disconnect } = useWallet();
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    try {
      setError(null);
      const connectedAddress = await connect();
      if (onConnect) {
        onConnect(connectedAddress);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    if (onConnect) {
      onConnect(null);
    }
  };

  if (isConnected) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
};

export default WalletConnect;