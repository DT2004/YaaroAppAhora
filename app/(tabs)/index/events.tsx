import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { eventService, Event } from '../../../services/eventService';
import { colors } from '../../../constants/Colors';
import { ConnectionTest } from '@/components/ConnectionTest';

function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'people' | 'hangouts'>('hangouts');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventService.getEvents({ type: 'hangout', status: 'active' });
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (eventId: string) => {
    try {
      await eventService.joinEvent(eventId);
      loadEvents();
    } catch (error) {
      console.error('Failed to join event:', error);
    }
  };

  const EventCard = ({ event }: { event: Event }) => (
    <View style={styles.eventCard}>
      <Image 
        source={{ uri: event.image || 'https://placeholder.com/400x200' }}
        style={styles.eventImage}
      />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventTime}>{event.time}, {new Date(event.date).toLocaleDateString()}</Text>
        
        <View style={styles.attendeesRow}>
          <View style={styles.avatarGroup}>
            {event.currentAttendees.slice(0, 3).map((attendee, index) => (
              <View key={index} style={[styles.avatar, { marginLeft: index * -10 }]}>
                <Text>👤</Text>
              </View>
            ))}
          </View>
          <Text style={styles.attendeesText}>
            You & {event.currentAttendees.length} others
          </Text>
        </View>

        <View style={styles.seatsRow}>
          <MaterialCommunityIcons name="account-group" size={20} color={colors.textSecondary} />
          <Text style={styles.seatsText}>
            {event.currentAttendees.length}/{event.maxAttendees} seats left
          </Text>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => handleJoin(event._id)}
          >
            <Text style={styles.joinButtonText}>JOIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ConnectionTest />
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>Y</Text>
        </View>
        <Text style={styles.headerTitle}>Yaaro Hangouts</Text>
        <TouchableOpacity style={styles.chatButton}>
          <MaterialCommunityIcons name="chat" size={24} color={colors.white} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'people' && styles.activeTab]}
          onPress={() => setActiveTab('people')}
        >
          <Text style={[styles.tabText, activeTab === 'people' && styles.activeTabText]}>
            Discover people
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'hangouts' && styles.activeTab]}
          onPress={() => setActiveTab('hangouts')}
        >
          <Text style={[styles.tabText, activeTab === 'hangouts' && styles.activeTabText]}>
            Discover hangouts
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity>
          <MaterialCommunityIcons name="filter-variant" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.eventsList}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading events...</Text>
        ) : events.length === 0 ? (
          <Text style={styles.emptyText}>No events found</Text>
        ) : (
          events.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.primary,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
  },
  chatButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  eventsList: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  eventImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.primaryLight,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarGroup: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  attendeesText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seatsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
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
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
  },
});

export default EventsScreen;
