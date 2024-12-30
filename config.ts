import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Your computer's IP address on the local network
const DEV_MACHINE_IP = '192.168.2.199';

function getApiUrl() {
  // Get the current environment
  const isWeb = Platform.OS === 'web';
  const isIOS = Platform.OS === 'ios';
  const isAndroid = Platform.OS === 'android';
  const isExpo = Constants.executionEnvironment === 'storeClient';

  // Log environment details
  console.log('Environment:', {
    platform: Platform.OS,
    executionEnvironment: Constants.executionEnvironment,
    isExpo,
    isWeb,
    isIOS,
    isAndroid,
  });

  if (__DEV__) {
    // For web development
    if (isWeb) {
      return 'http://localhost:3000';
    }
    
    // For Expo Go on physical device (iOS or Android)
    if (isExpo) {
      console.log('Using dev machine IP:', DEV_MACHINE_IP);
      return `http://${DEV_MACHINE_IP}:3000`;
    }
    
    // For iOS simulator
    if (isIOS) {
      return 'http://localhost:3000';
    }
    
    // For Android emulator
    if (isAndroid) {
      return 'http://10.0.2.2:3000';
    }
    
    // Default development URL
    return 'http://localhost:3000';
  }

  // Production URL
  return 'https://your-production-url.com';
}

export const API_URL = getApiUrl();

// Log the final configuration
console.log('API Configuration:', {
  API_URL,
  environment: __DEV__ ? 'development' : 'production'
});
