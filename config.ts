import Constants from 'expo-constants';

function getApiUrl() {
  if (__DEV__) {
    const LOCAL_IP = '192.168.2.200';
    return `http://${LOCAL_IP}:3000`;
  }
  return 'https://your-production-api.com';
}

export const API_URL = getApiUrl();
console.log('Using API URL:', API_URL);
