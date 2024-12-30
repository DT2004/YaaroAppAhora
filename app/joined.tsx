import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import eventService from '@/services/eventService';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  primary: '#5D3FD3',
  primaryLight: '#F4F0FF',
  secondary: '#F8F4FB',
  text: '#1A1A1A',
  white: '#FFFFFF'
};

export default function JoinedEventsScreen() {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadJoinedEvents();
  }, []);

  const loadJoinedEvents = async () => {
    try {
      const eventsData = await eventService.getJoinedEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading joined events:', error);
    }
  };

  const handleChatPress = (eventId) => {
    router.push(`/chat/${eventId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Hangouts</Text>
        <View style={{ width: 24 }} />
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
                You & {event.attendees.length - 1} others
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.chatButton}
              onPress={() => handleChatPress(event._id)}
            >
              <Ionicons name="chatbubbles-outline" size={20} color={colors.white} />
              <Text style={styles.chatButtonText}>Open Chat</Text>
            </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
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
  chatButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    gap: 8,
  },
  chatButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
});
