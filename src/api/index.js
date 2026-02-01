// API index file - central export for all API modules
export { default as userAPI } from './userApi';
export { default as authAPI } from './authApi';

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Common API headers
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// API error types
export const API_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR'
};
