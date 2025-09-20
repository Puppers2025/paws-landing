import { ethers } from 'ethers';

// Security: Nonce storage with expiration (in production, use Redis)
const nonceStore = new Map();
const NONCE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

export const generateNonce = () => {
  // Security: Use crypto.randomBytes for better randomness
  const nonce = ethers.hexlify(ethers.randomBytes(16));
  const timestamp = Date.now();
  
  // Store nonce with expiration
  nonceStore.set(nonce, {
    timestamp,
    used: false
  });
  
  // Clean up expired nonces
  cleanupExpiredNonces();
  
  return nonce;
};

export const formatMessage = (nonce, address) => {
  // Security: Include timestamp and domain in message
  const timestamp = new Date().toISOString();
  return `Sign this message to authenticate with Paws Landing.\n\nNonce: ${nonce}\nAddress: ${address}\nTimestamp: ${timestamp}\nDomain: paws-landing.com`;
};

// Security: Verify nonce is valid and not expired
export const verifyNonce = (nonce) => {
  const nonceData = nonceStore.get(nonce);
  if (!nonceData) {
    return { valid: false, reason: 'Nonce not found' };
  }
  
  if (nonceData.used) {
    return { valid: false, reason: 'Nonce already used' };
  }
  
  if (Date.now() - nonceData.timestamp > NONCE_EXPIRATION) {
    nonceStore.delete(nonce);
    return { valid: false, reason: 'Nonce expired' };
  }
  
  // Mark nonce as used
  nonceData.used = true;
  nonceStore.set(nonce, nonceData);
  
  return { valid: true };
};

// Security: Clean up expired nonces
const cleanupExpiredNonces = () => {
  const now = Date.now();
  for (const [nonce, data] of nonceStore.entries()) {
    if (now - data.timestamp > NONCE_EXPIRATION) {
      nonceStore.delete(nonce);
    }
  }
};

export const verifySignature = (message, signature, expectedAddress) => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

// Security: Supported EVM wallet providers
const SUPPORTED_WALLETS = {
  'MetaMask': 'metamask',
  'Coinbase Wallet': 'coinbase',
  'WalletConnect': 'walletconnect',
  'Trust Wallet': 'trust',
  'Brave Wallet': 'brave',
  'Opera Wallet': 'opera',
  'Phantom': 'phantom',
  'Rainbow': 'rainbow',
  'Frame': 'frame',
  'Tally': 'tally'
};

export const getSupportedWallets = () => {
  return Object.keys(SUPPORTED_WALLETS);
};

export const detectWalletProvider = () => {
  if (typeof window === 'undefined') return null;
  
  // Check for various wallet providers
  if (window.ethereum) {
    // Check for specific wallet providers
    if (window.ethereum.isMetaMask) return 'MetaMask';
    if (window.ethereum.isCoinbaseWallet) return 'Coinbase Wallet';
    if (window.ethereum.isBraveWallet) return 'Brave Wallet';
    if (window.ethereum.isOpera) return 'Opera Wallet';
    if (window.ethereum.isTrust) return 'Trust Wallet';
    if (window.ethereum.isRainbow) return 'Rainbow';
    if (window.ethereum.isFrame) return 'Frame';
    if (window.ethereum.isTally) return 'Tally';
    
    // Generic ethereum provider
    return 'Ethereum Provider';
  }
  
  // Check for other wallet providers
  if (window.phantom?.ethereum) return 'Phantom';
  if (window.walletconnect) return 'WalletConnect';
  
  return null;
};

export const connectWallet = async (walletType = 'auto') => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Auto-detect wallet if not specified
    if (walletType === 'auto') {
      const detectedWallet = detectWalletProvider();
      if (!detectedWallet) {
        throw new Error('No supported wallet detected. Please install MetaMask or another EVM-compatible wallet.');
      }
      console.log(`Detected wallet: ${detectedWallet}`);
    }
    
    if (window.ethereum) {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }
      
      // Get chain ID to ensure we're on the right network
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      
      console.log(`Connected to chain: ${chainId}`);
      
      return {
        address: accounts[0],
        chainId: chainId,
        walletType: detectWalletProvider() || 'Unknown'
      };
    }
    
    throw new Error('No Ethereum provider found. Please install a wallet like MetaMask.');
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
};

export const signMessage = async (message) => {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  
  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, window.ethereum.selectedAddress],
    });
    return signature;
  } catch (error) {
    console.error('Message signing error:', error);
    return null;
  }
};