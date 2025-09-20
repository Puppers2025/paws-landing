'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { detectWalletProvider, getSupportedWallets } from '../../lib/wallet-utils';

const WalletConnect = ({ onConnect, className = '' }) => {
  const { isConnected, address, isConnecting, connect, disconnect } = useWallet();
  const [error, setError] = useState(null);
  const [detectedWallet, setDetectedWallet] = useState(null);
  const [supportedWallets, setSupportedWallets] = useState([]);

  useEffect(() => {
    // Detect wallet on component mount
    const wallet = detectWalletProvider();
    setDetectedWallet(wallet);
    setSupportedWallets(getSupportedWallets());
  }, []);

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
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
            </span>
            {detectedWallet && (
              <span className="text-xs text-gray-500">{detectedWallet}</span>
            )}
          </div>
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
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 mb-2">
          {detectedWallet ? (
            <>Detected: <span className="font-medium text-blue-600">{detectedWallet}</span></>
          ) : (
            <>No wallet detected</>
          )}
        </p>
        <p className="text-xs text-gray-400">
          Supported wallets: {supportedWallets.slice(0, 3).join(', ')}
          {supportedWallets.length > 3 && ` +${supportedWallets.length - 3} more`}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Don't have a wallet?{' '}
          <a 
            href="https://metamask.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            MetaMask
          </a>
          {', '}
          <a 
            href="https://rabby.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            Rabby
          </a>
          {' or '}
          <a 
            href="https://walletconnect.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            WalletConnect
          </a>
        </p>
      </div>
    </div>
  );
};

export default WalletConnect;