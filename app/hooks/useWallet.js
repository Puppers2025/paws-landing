import { useState, useEffect } from 'react';
import { connectWallet } from '../../lib/wallet-utils';

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        })
        .catch(console.error);
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const result = await connectWallet();
      
      if (result && result.address) {
        setAddress(result.address);
        setIsConnected(true);
        return result.address;
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  return {
    isConnected,
    address,
    isConnecting,
    connect,
    disconnect,
  };
};