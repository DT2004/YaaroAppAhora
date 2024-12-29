import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image, TextInput } from 'react-native';

const colors = {
  primary: '#6B2FB3',
  primaryLight: '#F6F2F9',
  secondary: '#F8F4FB',
  text: '#1A1A1A',
  textSecondary: '#666666',
  white: '#FFFFFF',
  cardBackground: '#FFFFFF',
};

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const spontaneousEvents = [
    {
      id: '1',
      user: {
        name: 'Shamza Singh',
        avatar: 'https://example.com/avatar1.jpg',
      },
      location: {
        distance: '1.2 miles',
        area: 'Gokuldhum, Mumbai',
      },
      title: 'Rajinikanth movie screening this weekend anyone up?',
      date: 'Saturday, Oct 21',
      attendees: '10 people+',
      replies: '21 Reply',
    },
    {
      id: '2',
      user: {
        name: 'Vikram Malhotra',
        avatar: 'https://example.com/avatar2.jpg',
      },
      location: {
        distance: '3 miles',
        area: 'Bandra, Mumbai',
      },
      title: 'Anyone wanting to go Mumbai City FC vs Bangalore FC match',
      date: 'Sunday, Oct 22',
      attendees: '10 people+',
      replies: '30 Reply',
    },
    {
      id: '3',
      user: {
        name: 'Shashank Shah',
        avatar: 'https://example.com/avatar3.jpg',
      },
      location: {
        distance: '0.5 Mile',
        area: 'Westwood, Colaba',
      },
      title: 'Late Night Special Standup @ NCPA Comedy Theatre',
      date: 'Sunday, Oct 22',
      attendees: '5 people+',
      replies: '12 Reply',
    },
  ];

  const handleJoin = (eventId) => {
    // TODO: Implement join functionality and create group chat
    console.log('Joining event:', eventId);
  };

  const handleCreateEvent = () => {
    // TODO: Implement event creation
    console.log('Creating new event');
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.user.name.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.location}>
            📍 {item.location.distance} | {item.location.area}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreButtonText}>⋮</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
      </View>

      <View style={styles.eventActions}>
        <View style={styles.eventStats}>
          <Text style={styles.statsText}>{item.attendees}</Text>
          <Text style={styles.statsText}>{item.replies}</Text>
        </View>
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={() => handleJoin(item.id)}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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

      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Join 1000+ spontaneous plans because who doesn{"'"}t want to meet amazing people
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateEvent}
        >
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Text>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text>↕️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={spontaneousEvents}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  titleContainer: {
    padding: 16,
    paddingTop: 8,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '500',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 24,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  eventCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  moreButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  moreButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  eventInfo: {
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  eventDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  eventStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
