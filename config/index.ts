// Configuration file for SafeClass mobile app

export const API_CONFIG = {
  // Change this to your actual API URL
  BASE_URL: 'http://localhost:3001/api',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const APP_CONFIG = {
  // App name
  NAME: 'SafeClass',
  
  // Version
  VERSION: '1.0.0',
  
  // Default user profile image
  DEFAULT_AVATAR: require('../assets/images/prof.png'),
  
  // QR Code image
  QR_CODE_IMAGE: require('../assets/images/qr-code.png'),
  
  // Background image
  BACKGROUND_IMAGE: require('../assets/images/background.png'),
};

export const COLORS = {
  PRIMARY: '#2684FE',
  PRIMARY_LIGHT: '#4FA8FF',
  PRIMARY_DARK: '#1E6BDB',
  SECONDARY: '#667eea',
  SUCCESS: '#28a745',
  ERROR: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
  WHITE: '#FFF',
  BLACK: '#000',
  GRAY: '#666',
  LIGHT_GRAY: '#F0F0F0',
};
