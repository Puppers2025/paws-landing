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

export const connectWallet = async () => {
  if (typeof window === 'undefined') return null;
  
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      return accounts[0];
    } catch (error) {
      console.error('Wallet connection error:', error);
      return null;
    }
  }
  
  return null;
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