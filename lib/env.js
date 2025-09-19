// Secure environment variable management for Paws Landing
// Based on the secure-env.js pattern from puppers-discord

/**
 * Secure environment variable loader
 * Validates and sanitizes environment variables
 */
export class SecureEnv {
  constructor() {
    this.env = {};
    this.loadEnvironment();
  }

  loadEnvironment() {
    // Load environment variables with validation
    this.env = {
      // Next.js Configuration
      NEXT_PUBLIC_APP_URL: this.validateUrl(process.env.NEXT_PUBLIC_APP_URL) || 'http://localhost:3000',
      NEXT_PUBLIC_APP_NAME: this.sanitizeText(process.env.NEXT_PUBLIC_APP_NAME) || 'Paws Landing',
      
      // Security
      NEXTAUTH_SECRET: this.validateSecret(process.env.NEXTAUTH_SECRET),
      NEXTAUTH_URL: this.validateUrl(process.env.NEXTAUTH_URL) || 'http://localhost:3000',
      
      // Database
      DATABASE_URL: this.validateUrl(process.env.DATABASE_URL) || 'sqlite:./data/paws-landing.db',
      
      // API Keys
      OPENSEA_API_KEY: this.validateApiKey(process.env.OPENSEA_API_KEY),
      BLOCKCHAIN_RPC_URL: this.validateUrl(process.env.BLOCKCHAIN_RPC_URL),
      
      // Admin Configuration
      ADMIN_EMAIL: this.validateEmail(process.env.ADMIN_EMAIL) || 'admin@example.com',
      ADMIN_PASSWORD_HASH: this.validateHash(process.env.ADMIN_PASSWORD_HASH),
      
      // Rate Limiting
      RATE_LIMIT_MAX_REQUESTS: this.validateNumber(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      RATE_LIMIT_WINDOW_MS: this.validateNumber(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
      
      // Feature Flags
      ENABLE_ADMIN_PANEL: this.validateBoolean(process.env.ENABLE_ADMIN_PANEL) || false,
      ENABLE_ANALYTICS: this.validateBoolean(process.env.ENABLE_ANALYTICS) || false,
      ENABLE_DEBUG_MODE: this.validateBoolean(process.env.ENABLE_DEBUG_MODE) || false,
    };
  }

  validateUrl(url) {
    if (!url) return null;
    try {
      new URL(url);
      return url;
    } catch {
      console.warn(`Invalid URL: ${url}`);
      return null;
    }
  }

  validateEmail(email) {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      return email.toLowerCase().trim();
    }
    console.warn(`Invalid email: ${email}`);
    return null;
  }

  validateSecret(secret) {
    if (!secret) {
      console.warn('NEXTAUTH_SECRET not set, using default (NOT SECURE FOR PRODUCTION)');
      return 'dev-secret-change-in-production';
    }
    if (secret.length < 32) {
      console.warn('NEXTAUTH_SECRET should be at least 32 characters long');
    }
    return secret;
  }

  validateApiKey(key) {
    if (!key) return null;
    if (key.length < 10) {
      console.warn('API key seems too short');
      return null;
    }
    return key;
  }

  validateHash(hash) {
    if (!hash) {
      console.warn('ADMIN_PASSWORD_HASH not set, using default (NOT SECURE FOR PRODUCTION)');
      return 'dev-hash-change-in-production';
    }
    if (hash.length < 32) {
      console.warn('Password hash seems too short');
    }
    return hash;
  }

  validateNumber(value) {
    if (!value) return null;
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      console.warn(`Invalid number: ${value}`);
      return null;
    }
    return num;
  }

  validateBoolean(value) {
    if (!value) return null;
    return value.toLowerCase() === 'true';
  }

  sanitizeText(text) {
    if (!text) return null;
    return text.replace(/[<>]/g, '').trim();
  }

  get(key) {
    return this.env[key];
  }

  getAll() {
    return { ...this.env };
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  isDebugMode() {
    return this.env.ENABLE_DEBUG_MODE === true;
  }
}

// Create and export the secure environment instance
export const secureEnv = new SecureEnv();

// Export individual getters for convenience
export const getEnv = (key) => secureEnv.get(key);
export const getAllEnv = () => secureEnv.getAll();
export const isProduction = () => secureEnv.isProduction();
export const isDevelopment = () => secureEnv.isDevelopment();
export const isDebugMode = () => secureEnv.isDebugMode();
