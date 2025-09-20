import { useState } from 'react';
import { useWallet } from './useWallet';
import { generateNonce, formatMessage, signMessage } from '../../lib/wallet-utils';

export const useWalletAuth = () => {
  const { isConnected, address, connect, disconnect } = useWallet();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const authenticate = async () => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsAuthenticating(true);
    try {
      // Generate nonce and message
      const nonce = generateNonce();
      const message = formatMessage(nonce, address);

      // Sign the message
      const signature = await signMessage(message);
      if (!signature) {
        throw new Error('Failed to sign message');
      }

      // Send to backend for verification
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          message,
          signature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Authentication failed');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      console.error('Wallet authentication error:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    disconnect();
  };

  return {
    isConnected,
    address,
    isAuthenticating,
    isAuthenticated,
    user,
    connect,
    authenticate,
    logout,
  };
};