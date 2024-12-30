import { eventEmitter } from '../utils/EventEmitter';
import { API_URL } from '../config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Manager } from 'socket.io-client';
import type { Socket as SocketType } from 'socket.io-client';

export interface Coordinates {
  type: 'Point';
  coordinates: [number, number];
}

export interface Location {
  name: string;
  coordinates: Coordinates;
}

export interface Budget {
  min: number;
  max: number;
}

export interface ChatMessage {
  _id?: string;
  eventId: string;
  userId: string;
  message: string;
  timestamp: string;
}

export interface GroupChat {
  _id: string;
  eventId: string;
  type: string;
  participants: any[];
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  type: 'food' | 'sports' | 'music' | 'social' | 'study' | 'other';
  location: Location;
  date: string;
  time: string;
  maxParticipants: number;
  attendees: Array<{ _id: string; name: string }>;
  budget: Budget;
  image: string;
  status: 'open' | 'full' | 'cancelled' | 'completed';
  groupChat: GroupChat;
  createdAt: string;
  updatedAt: string;
}

class EventService {
  private api: AxiosInstance;
  private socket: any;

  constructor() {
    // Initialize socket
    const manager = new Manager(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 30000,
      autoConnect: false
    });
    
    this.socket = manager.socket('/');

    // Create axios instance
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor
    this.api.interceptors.request.use(config => {
      console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
      return config;
    });

    // Response interceptor
    this.api.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.code === 'ECONNABORTED') {
          console.error('Request timed out');
        } else if (!error.response) {
          console.error('Network error:', error.message);
        } else {
          console.error('API error:', error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  getSocket(): any {
    return this.socket;
  }

  async getEvents(filters?: { type?: string; status?: string; id?: string }): Promise<Event[]> {
    try {
      const response = await this.api.get<Event[]>('/api/events', { params: filters });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error fetching events:', error.message);
      }
      throw error;
    }
  }

  async joinEvent(eventId: string): Promise<{ event: Event; groupChat: GroupChat }> {
    try {
      const response = await this.api.post(`/api/events/${eventId}/join`);
      if (response.data.groupChat) {
        // Connect to socket for real-time chat updates
        this.connect();
        this.socket.emit('join_chat', response.data.groupChat._id);
      }
      return response.data;
    } catch (error) {
      console.error('Error joining event:', error);
      throw error;
    }
  }

  async getChatMessages(eventId: string): Promise<ChatMessage[]> {
    try {
      const response = await this.api.get(`/api/events/${eventId}/messages`);
      return response.data.messages;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Return empty array if chat doesn't exist yet
        return [];
      }
      throw error;
    }
  }

  async sendMessage(eventId: string, message: string): Promise<void> {
    try {
      await this.api.post(`/api/events/${eventId}/messages`, { message });
      this.socket.emit('new_message', { eventId, message });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getEventMessages(eventId: string): Promise<ChatMessage[]> {
    try {
      const response = await this.api.get(`/api/events/${eventId}/messages`);
      return response.data.messages || [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  async getJoinedEvents(): Promise<Event[]> {
    try {
      const response = await this.api.get('/api/events/joined');
      return response.data;
    } catch (error) {
      console.error('Error fetching joined events:', error);
      throw error;
    }
  }

  subscribeToEventChat(eventId: string, callback: (message: ChatMessage) => void) {
    this.socket.on(`event_message_${eventId}`, callback);
  }

  unsubscribeFromEventChat(eventId: string, callback: (message: ChatMessage) => void) {
    this.socket.off(`event_message_${eventId}`, callback);
  }
}

// Create a singleton instance
const eventService = new EventService();

// Export the singleton instance and its type
export type EventServiceType = EventService;
export default eventService;