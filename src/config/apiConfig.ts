/**
 * API Configuration
 * Centralized configuration for API base URLs
 * 
 * Uses reverse proxy via Next.js rewrites to avoid mixed content issues
 * (HTTPS frontend -> HTTP backend)
 * 
 * The proxy is configured in next.config.ts to forward /api/backend/* to the backend
 * 
 * Environment variables:
 * - NEXT_PUBLIC_API_URL: Direct API URL (for development/testing)
 * - BACKEND_URL: Backend URL for Next.js proxy (defaults to http://13.235.244.88)
 */
const USE_PROXY = process.env.NEXT_PUBLIC_USE_API_PROXY !== 'false'; // Default to true

export const API_BASE_URL = USE_PROXY
  ? '/api/backend' // Use Next.js proxy (HTTPS -> HTTP via server-side proxy)
  : (process.env.NEXT_PUBLIC_API_URL || 'http://13.235.244.88'); // Direct connection

/**
 * API endpoint paths
 * These are appended to the base URL
 */
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  ORDERS: '/orders',
  KYC: '/kyc',
} as const;

/**
 * Helper function to get full API URL for an endpoint
 */
export const getApiUrl = (endpoint: keyof typeof API_ENDPOINTS): string => {
  return `${API_BASE_URL}${API_ENDPOINTS[endpoint]}`;
};

