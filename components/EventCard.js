import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/Colors';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=1000&auto=format&fit=crop';

export default function EventCard({ event, onJoin }) {
  return (
    <View style={styles.eventCard}>
      <Image 
        source={{ uri: event.image || DEFAULT_IMAGE }}
        style={styles.eventImage}
        onError={(e) => {
          console.log('Image load error:', e.nativeEvent.error);
          // Image will automatically use defaultSource if loading fails
        }}
        defaultSource={require('../assets/placeholder.png')}
      />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>
        <Text style={styles.eventTime}>{event.time}, {new Date(event.date).toLocaleDateString()}</Text>
        
        <View style={styles.attendeesRow}>
          <View style={styles.avatarGroup}>
            {(event.attendees || []).slice(0, 3).map((attendee, index) => (
              <View key={index} style={[styles.avatar, { marginLeft: index * -10 }]}>
                <Text>👤</Text>
              </View>
            ))}
          </View>
          <Text style={styles.attendeesText}>
            {event.attendees?.length || 0} joined
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.seatsContainer}>
            <MaterialCommunityIcons name="account-group" size={20} color={colors.textSecondary} />
            <Text style={styles.seatsText}>
              {event.attendees?.length || 0}/{event.maxParticipants} seats
            </Text>
          </View>

          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => onJoin(event._id)}
          >
            <Text style={styles.joinButtonText}>JOIN</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationBudget}>
          <Text style={styles.locationText}>📍 {event.location.name}</Text>
          <Text style={styles.budgetText}>💰 ₹{event.budget.min} - ₹{event.budget.max}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    backgroundColor: colors.gray200,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },
  attendeesText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatsText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  locationBudget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  budgetText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
