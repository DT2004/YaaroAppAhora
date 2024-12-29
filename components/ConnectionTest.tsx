import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { API_URL } from '@/config';

export function ConnectionTest() {
  const [status, setStatus] = useState<string>('Testing connection...');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('Testing connection to:', `${API_URL}/api/test`);
      const response = await fetch(`${API_URL}/api/test`);
      const data = await response.json();
      setStatus(`Connected! ${data.message}`);
    } catch (error) {
      console.error('Connection error:', error);
      setStatus(`Connection failed: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
      <Text style={styles.apiUrl}>API URL: {API_URL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  apiUrl: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
}); 