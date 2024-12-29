import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import SearchBar from '../components/SearchBar';
import UserProfileCard from '../components/UserProfileCard';

export default function PeopleScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Alex',
      interests: ['Movies', 'Sports'],
      location: 'Mumbai',
      avatar: 'https://example.com/avatar1.jpg',
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
        placeholder="Search by interests, location..."
        onSearch={handleSearch}
        value={searchQuery}
      />
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <UserProfileCard user={item} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
