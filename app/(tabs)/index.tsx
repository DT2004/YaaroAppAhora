import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { eventService, Event } from '@/services/eventService';
import { Link, MaterialCommunityIcons } from 'expo-router';

const colors = {
  primary: '#5D3FD3', // More posh purple
  primaryLight: '#F4F0FF',
  secondary: '#F8F4FB',
  text: '#1A1A1A',
  textSecondary: '#666666',
  white: '#FFFFFF',
};

export default function YaaroEventsScreen() {
  const router = useRouter();
  const [weekendEvents, setWeekendEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const events = await eventService.getEvents({ type: 'weekend', status: 'active' });
      setWeekendEvents(events);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToYaaroEvents = () => {
    router.push('/(tabs)/index/events');
  };

  const navigateToSpontaneous = () => {
    router.push('/(tabs)/discover');
  };

  const handleJoin = async (eventId: string) => {
    try {
      await eventService.joinEvent(eventId);
      router.push('/(tabs)/index/events');
    } catch (err) {
      console.error('Failed to join event:', err);
      // TODO: Show error toast
    }
  };

  const handleYaaroHangouts = () => {
    router.push('/events');
  };

  const handleSpontaneousEvents = () => {
    router.push('/spontaneous');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.logo}>
          <Text style={styles.logoText}>Y</Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Text>💬</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Discover your Yaaro</Text>
        <Text style={styles.heroSubtitle}>Turn shared interests to lifelong friendships.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yaaro Hangouts</Text>
        <Text style={styles.sectionSubtitle}>Meet up with like minded people</Text>
        <TouchableOpacity 
          style={styles.hangoutCard} 
          onPress={handleYaaroHangouts}
          activeOpacity={0.9}
        >
          <Text style={styles.hangoutText}>
            For dining, movies, arcade, escape rooms, concerts & more for 2-6 people
          </Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Discover your Yaaro</Text>
        <Text style={styles.sectionSubtitle}>Join spontaneous plans happening now</Text>
        <TouchableOpacity 
          style={styles.mapPreview} 
          onPress={handleSpontaneousEvents}
          activeOpacity={0.9}
        >
          <View style={styles.mapOverlay}>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>On the weekend</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading events...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.eventScroll}
            contentContainerStyle={styles.eventScrollContent}
          >
            {weekendEvents.map((event) => (
              <TouchableOpacity 
                key={event._id} 
                style={styles.eventCard}
                activeOpacity={0.9}
              >
                <View style={styles.eventImagePlaceholder}>
                  {event.image ? (
                    <Image source={{ uri: event.image }} style={styles.eventImage} />
                  ) : (
                    <Text style={styles.eventImageText}>🎉</Text>
                  )}
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventLocation}>{event.location.name}</Text>
                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => handleJoin(event._id)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.joinButtonText}>
                    Join {event.currentAttendees.length}/{event.maxAttendees} people
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
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
    padding: 16,
    backgroundColor: colors.primary,
  },
  menuIcon: {
    fontSize: 24,
    color: colors.white,
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
  notificationIcon: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
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
  heroSection: {
    padding: 16,
    backgroundColor: colors.primary,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  hangoutCard: {
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  hangoutText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
  },
  arrow: {
    fontSize: 24,
    color: colors.text,
  },
  mapPreview: {
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
  },
  playIcon: {
    fontSize: 24,
    color: colors.white,
  },
  eventScroll: {
    paddingVertical: 16,
  },
  eventScrollContent: {
    paddingHorizontal: 16,
  },
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  eventImagePlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  eventImageText: {
    fontSize: 48,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    padding: 16,
  },
  eventLocation: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 4,
    padding: 16,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  loadingText: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    padding: 20,
  },
});
