import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const UserProfileCard = ({ user }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{user.name[0]}</Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.location}>📍 {user.location}</Text>
        <View style={styles.interests}>
          {user.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6B2FB3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  location: {
    color: '#666',
    marginBottom: 8,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  interestTag: {
    backgroundColor: '#f0e6fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    color: '#6B2FB3',
    fontSize: 12,
  },
  connectButton: {
    backgroundColor: '#6B2FB3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default UserProfileCard;
