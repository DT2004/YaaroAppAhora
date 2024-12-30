import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import eventService from '@/services/eventService';
import type { Event, GroupChat } from '@/services/eventService';

// Define types
interface Attendee {
  _id: string;
  name: string;
  avatar: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  maxParticipants: number;
  attendees: Attendee[];
}

const colors = {
  primary: '#5D3FD3',
  primaryLight: '#F4F0FF',
  secondary: '#F8F4FB',
  text: '#1A1A1A',
  white: '#FFFFFF'
};

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      // Mock data for MVP
      const mockEvents: Event[] = [
        {
          _id: '1',
          title: 'Coffee Meetup',
          description: 'Let\'s meet for coffee!',
          date: '2024-12-30',
          time: '10:00 AM',
          image: 'https://picsum.photos/400/300',
          maxParticipants: 6,
          attendees: [
            { _id: '1', name: 'John', avatar: 'https://picsum.photos/50/50' },
            { _id: '2', name: 'Jane', avatar: 'https://picsum.photos/50/51' }
          ]
        },
        {
          _id: '2',
          title: 'Movie Night',
          description: 'Watch the latest blockbuster!',
          date: '2024-12-31',
          time: '7:00 PM',
          image: 'https://picsum.photos/400/301',
          maxParticipants: 8,
          attendees: [
            { _id: '3', name: 'Mike', avatar: 'https://picsum.photos/50/52' }
          ]
        }
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleJoin = async (eventId: string) => {
    try {
      console.log('Joining event:', eventId);
      const result = await eventService.joinEvent(eventId);
      console.log('Join result:', result);
      
      if (result.groupChat) {
        // Navigate to the chat screen with the group chat ID
        router.push({
          pathname: '/chat',
          params: { 
            chatId: result.groupChat._id,
            eventId: result.event._id,
            eventTitle: result.event.title
          }
        });
      } else {
        console.error('No group chat created for event');
        Alert.alert('Error', 'Could not create group chat for this event');
      }
    } catch (error) {
      console.error('Error joining event:', error);
      Alert.alert('Error', 'Failed to join event. Please try again.');
    }
  };

  const navigateToChat = () => {
    router.push('/chat');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yaaro Hangouts</Text>
        <TouchableOpacity onPress={navigateToChat} style={styles.chatIcon}>
          <Ionicons name="chatbubbles-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hangouts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.eventsList}>
        {events.map((event) => (
          <View key={event._id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventTime}>{event.time}, {event.date}</Text>
            
            <View style={styles.participantsContainer}>
              <View style={styles.avatarGroup}>
                {event.attendees.slice(0, 3).map((attendee, index) => (
                  <Image 
                    key={attendee._id}
                    source={{ uri: attendee.avatar }} 
                    style={[styles.avatar, { marginLeft: index > 0 ? -10 : 0 }]} 
                  />
                ))}
              </View>
              <Text style={styles.participantsText}>
                {event.attendees.length > 0 ? `You & ${event.attendees.length - 1} others` : 'Be the first to join!'}
              </Text>
            </View>

            <View style={styles.seatsContainer}>
              <Ionicons name="people-outline" size={20} color={colors.text} />
              <Text style={styles.seatsText}>
                {event.maxParticipants - event.attendees.length}/{event.maxParticipants} seats left
              </Text>
              <TouchableOpacity 
                style={styles.joinButton}
                onPress={() => handleJoin(event._id)}
              >
                <Text style={styles.joinButtonText}>JOIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatIcon: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
  },
  filterButton: {
    padding: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsList: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventTime: {
    color: '#666',
    marginBottom: 12,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarGroup: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.white,
  },
  participantsText: {
    color: colors.text,
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seatsText: {
    color: colors.text,
    flex: 1,
    marginLeft: 8,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  joinButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
});
