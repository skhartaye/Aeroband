export const PRODUCTION_CONFIG = {
  // Debug settings
  DEBUG_MODE: false,
  LOG_LEVEL: 'error', // 'debug', 'info', 'warn', 'error'
  
  // Performance settings
  MAX_DATA_POINTS: 1000,
  MIN_DATA_POINTS: 10,
  CHART_UPDATE_DEBOUNCE: 250,
  
  // Alert settings
  ALERT_TIMEOUT_GOOD: 30000, // 30 seconds
  ALERT_TIMEOUT_HAZARDOUS: 120000, // 2 minutes
  
  // BLE settings
  BLE_SCAN_TIMEOUT: 10000, // 10 seconds
  BLE_CONNECTION_TIMEOUT: 15000, // 15 seconds
  
  // Database settings
  DATABASE_RETRY_ATTEMPTS: 3,
  DATABASE_RETRY_DELAY: 1000, // 1 second
  
  // UI settings
  TOAST_DURATION: 5000, // 5 seconds
  LOADING_TIMEOUT: 10000, // 10 seconds
  
  // Validation settings
  TEMPERATURE_MIN: -50,
  TEMPERATURE_MAX: 100,
  HUMIDITY_MIN: 0,
  HUMIDITY_MAX: 100,
  PRESSURE_MIN: 800,
  PRESSURE_MAX: 1200,
  AIR_QUALITY_MIN: 0,
  AIR_QUALITY_MAX: 5000
};

export const isProduction = () => {
  return window.location.hostname !== 'localhost' && 
         window.location.hostname !== '127.0.0.1' &&
         !window.location.hostname.includes('dev');
};

export const shouldLog = (level: string) => {
  if (!PRODUCTION_CONFIG.DEBUG_MODE) return false;
  
  const levels = ['debug', 'info', 'warn', 'error'];
  const currentLevel = levels.indexOf(PRODUCTION_CONFIG.LOG_LEVEL);
  const messageLevel = levels.indexOf(level);
  
  return messageLevel >= currentLevel;
}; 