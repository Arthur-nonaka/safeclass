export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',

  TIMEOUT: 10000,

  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const APP_CONFIG = {

  DEFAULT_AVATAR: require('../assets/images/prof.png'),

  QR_CODE_IMAGE: require('../assets/images/qr-code.png'),

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
