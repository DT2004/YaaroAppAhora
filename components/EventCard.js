import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SpontaneousReply from './SpontaneousReply';
import { eventService } from '../services/eventService';
import { colors } from '../constants/Colors';

export default function EventCard({ event, onJoin }) {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    if (event.type === 'spontaneous') {
      loadReplies();
      
      // Subscribe to real-time updates
      const unsubscribe = eventService.subscribeToEvent(event._id, (newReply) => {
        setReplies(currentReplies => [...currentReplies, newReply]);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [event._id]);

  const loadReplies = async () => {
    try {
      const eventReplies = await eventService.getEventReplies(event._id);
      setReplies(eventReplies);
    } catch (error) {
      console.error('Failed to load replies:', error);
    }
  };

  const handleReply = async (eventId, message) => {
    try {
      await eventService.replyToEvent(eventId, message);
      // No need to manually update replies as we're subscribed to real-time updates
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  return (
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

        <View style={styles.actionsRow}>
          <View style={styles.seatsContainer}>
            <MaterialCommunityIcons name="account-group" size={20} color={colors.textSecondary} />
            <Text style={styles.seatsText}>
              {event.currentAttendees.length}/{event.maxAttendees} seats left
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            {event.type === 'spontaneous' && (
              <SpontaneousReply eventId={event._id} onReply={handleReply} />
            )}
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => onJoin(event._id)}
            >
              <Text style={styles.joinButtonText}>JOIN</Text>
            </TouchableOpacity>
          </View>
        </View>

        {event.type === 'spontaneous' && replies.length > 0 && (
          <View style={styles.repliesSection}>
            <TouchableOpacity
              style={styles.repliesHeader}
              onPress={() => setShowReplies(!showReplies)}
            >
              <Text style={styles.repliesTitle}>
                Replies ({replies.length})
              </Text>
              <MaterialCommunityIcons
                name={showReplies ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>

            {showReplies && (
              <View style={styles.repliesList}>
                {replies.map((reply) => (
                  <View key={reply._id} style={styles.replyItem}>
                    <View style={styles.replyAvatar}>
                      <Text>👤</Text>
                    </View>
                    <View style={styles.replyContent}>
                      <Text style={styles.replyUserName}>{reply.userName}</Text>
                      <Text style={styles.replyMessage}>{reply.message}</Text>
                      <Text style={styles.replyTime}>
                        {new Date(reply.createdAt).toLocaleTimeString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatsText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  repliesSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.primaryLight,
    paddingTop: 16,
  },
  repliesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  repliesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  repliesList: {
    marginTop: 12,
  },
  replyItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  replyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 8,
  },
  replyUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  replyMessage: {
    fontSize: 14,
    color: colors.text,
  },
  replyTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
