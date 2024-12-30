import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import eventService from '../../services/eventService';
import type { Event } from '../../services/eventService';
import { colors } from '../../constants/Colors';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const events = await eventService.getEvents({ id });
        if (events && events.length > 0) {
          setEvent(events[0]);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleJoinEvent = async () => {
    if (!event) return;
    
    try {
      await eventService.joinEvent(event._id);
      // Refresh event details after joining
      const events = await eventService.getEvents({ id });
      if (events && events.length > 0) {
        setEvent(events[0]);
      }
    } catch (err) {
      console.error('Error joining event:', err);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Event not found'}</Text>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.eventHeader}>
          <View style={styles.eventType}>
            <MaterialCommunityIcons
              name={event.type === 'food' ? 'food' : 'account-group'}
              size={32}
              color={colors.primary}
            />
            <Text style={styles.eventTypeText}>{event.type}</Text>
          </View>
          <View style={[styles.status, { backgroundColor: event.status === 'open' ? '#E8F5E9' : '#FFEBEE' }]}>
            <Text style={[styles.statusText, { color: event.status === 'open' ? '#2E7D32' : '#C62828' }]}>
              {event.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={24} color={colors.primary} />
            <Text style={styles.infoText}>{formattedDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
            <Text style={styles.infoText}>{event.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={24} color={colors.primary} />
            <Text style={styles.infoText}>{event.location.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-group" size={24} color={colors.primary} />
            <Text style={styles.infoText}>
              {event.attendees.length}/{event.maxParticipants} Participants
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="currency-inr" size={24} color={colors.primary} />
            <Text style={styles.infoText}>
              ₹{event.budget.min} - ₹{event.budget.max}
            </Text>
          </View>
        </View>

        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>Participants</Text>
          {event.attendees.map((attendee, index) => (
            <View key={attendee._id} style={styles.participantRow}>
              <MaterialCommunityIcons name="account" size={24} color={colors.textSecondary} />
              <Text style={styles.participantName}>{attendee.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {event.status === 'open' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.joinButton]}
            onPress={handleJoinEvent}
          >
            <Text style={styles.buttonText}>Join Event</Text>
          </TouchableOpacity>
          {event.groupChat && (
            <TouchableOpacity
              style={[styles.button, styles.chatButton]}
              onPress={() => router.push(`/chat/${event.groupChat._id}`)}
            >
              <MaterialCommunityIcons name="chat" size={24} color={colors.white} />
              <Text style={styles.buttonText}>Group Chat</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTypeText: {
    marginLeft: 8,
    fontSize: 18,
    color: colors.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  participantsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantName: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  joinButton: {
    marginRight: 8,
  },
  chatButton: {
    marginLeft: 8,
    backgroundColor: colors.secondary,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    marginBottom: 16,
  },
});
