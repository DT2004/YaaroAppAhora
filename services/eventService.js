import axios from 'axios';
import { API_URL } from '../config';

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 second timeout

// Test the API connection
const testConnection = async () => {
  try {
    console.log('Testing connection to:', `${API_URL}/api/test`);
    const response = await axios.get(`${API_URL}/api/test`);
    console.log('Connection successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Connection error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      }
    });
    throw error;
  }
};

// Fetch all open events
export const fetchEvents = async () => {
  try {
    console.log('Starting to fetch events...');
    console.log('API URL:', `${API_URL}/api/events`);
    
    const response = await axios.get(`${API_URL}/api/events`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Events fetch successful:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      count: response.data?.length || 0,
      data: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to load events:', {
      message: error.message,
      code: error.code,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      },
      request: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    throw error;
  }
};

// Join an event
export const joinEvent = async (eventId, userId) => {
  try {
    console.log('Joining event:', `${API_URL}/api/events/${eventId}/join`);
    const response = await axios.post(`${API_URL}/api/events/${eventId}/join`, { userId });
    console.log('Join event response:', {
      status: response.status,
      data: response.data
    });
    if (response.data.groupChat) {
      console.log('Successfully joined group chat:', response.data.groupChat._id);
    }
    return response.data;
  } catch (error) {
    console.error('Failed to join event:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      }
    });
    throw error;
  }
};
