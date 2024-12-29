import { eventEmitter } from '../utils/EventEmitter';
import io from 'socket.io-client';

const API_URL = 'http://192.168.1.100:5001/api'; // Use your local IP address
const socket = io('http://192.168.1.100:5001');

export interface Event {
  _id: string;
  title: string;
  description: string;
  type: 'hangout' | 'spontaneous' | 'weekend';
  category: string;
  location: {
    name: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
  };
  date: string;
  time: string;
  maxAttendees: number;
  currentAttendees: any[];
  creator: any;
  image: string | null;
  status: 'active' | 'full' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface Message {
  _id: string;
  eventId: string;
  userId: string;
  userName: string;
  message: string;
  type: 'text' | 'join' | 'leave';
  createdAt: string;
}

// Socket event handlers
socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from socket server');
});

export const eventService = {
  // Subscribe to event updates
  subscribeToEvent: (eventId: string, callback: (message: Message) => void) => {
    socket.emit('join_event', eventId);
    socket.on('new_message', callback);
    socket.on('user_joined', callback);
    
    return () => {
      socket.emit('leave_event', eventId);
      socket.off('new_message', callback);
      socket.off('user_joined', callback);
    };
  },

  // Get all events with filters
  getEvents: async (filters?: { type?: string; category?: string; status?: string }): Promise<Event[]> => {
    const queryParams = new URLSearchParams(filters as any).toString();
    const response = await fetch(`${API_URL}/events?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  // Get nearby events
  getNearbyEvents: async (longitude: number, latitude: number, maxDistance?: number): Promise<Event[]> => {
    const params = new URLSearchParams({
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      ...(maxDistance && { maxDistance: maxDistance.toString() }),
    });
    const response = await fetch(`${API_URL}/events/nearby?${params}`);
    if (!response.ok) throw new Error('Failed to fetch nearby events');
    return response.json();
  },

  // Create new event
  createEvent: async (eventData: Partial<Event>): Promise<Event> => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  },

  // Join an event
  joinEvent: async (eventId: string): Promise<Event> => {
    const response = await fetch(`${API_URL}/events/${eventId}/join`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to join event');
    return response.json();
  },

  // Get event messages
  getEventMessages: async (eventId: string): Promise<Message[]> => {
    const response = await fetch(`${API_URL}/events/${eventId}/messages`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  // Send message to event
  sendMessage: async (eventId: string, message: string): Promise<Message> => {
    const response = await fetch(`${API_URL}/events/${eventId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },
};
