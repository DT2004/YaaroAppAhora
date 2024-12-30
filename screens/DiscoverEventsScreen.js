import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchEvents, joinEvent } from '../services/eventService';
import EventCard from '../components/EventCard';
import { colors } from '../constants/Colors';

const DiscoverEventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load events. Please try again.');
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleJoinEvent = async (eventId) => {
    try {
      // TODO: Get actual userId from auth context
      const userId = 'current-user-id';
      const updatedEvent = await joinEvent(eventId, userId);
      
      Alert.alert(
        'Success!',
        'You\'ve joined the event! Check your notifications for the group chat invite.',
        [{ text: 'OK' }]
      );

      // Update the events list
      setEvents(currentEvents => 
        currentEvents.map(event => 
          event._id === eventId ? updatedEvent : event
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to join event. Please try again.');
      console.error('Failed to join event:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Hangouts</Text>
      </View>
      
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventCard 
            event={item}
            onJoin={handleJoinEvent}
          />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.eventsList}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No events available right now.</Text>
            <Text style={styles.emptyStateSubtext}>Check back later for new hangouts!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  eventsList: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default DiscoverEventsScreen;
