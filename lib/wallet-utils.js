import { ethers } from 'ethers';

export const generateNonce = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const formatMessage = (nonce, address) => {
  return `Sign this message to authenticate with Paws Landing.\n\nNonce: ${nonce}\nAddress: ${address}`;
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