import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import MapView from '../components/MapView';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Escape Room, Bandra Mall',
      date: '17th October',
      time: '7 PM',
      location: 'Bandra West',
      image: 'https://example.com/image.jpg',
      attendees: ['user1', 'user2'],
      totalSeats: 6,
      currentSeats: 3,
      coordinates: {
        latitude: 19.0596,
        longitude: 72.8295,
      },
    },
    // Add more mock data
  ]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  return (
    <View style={styles.container}>
      <SearchBar 
        placeholder="Search events, locations..."
        onSearch={handleSearch}
        value={searchQuery}
      />
      
      {viewMode === 'list' ? (
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <EventCard event={item} />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <MapView events={events} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
});
