import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const EventMapView = ({ events }) => {
  const initialRegion = {
    latitude: 19.0760,  // Mumbai
    longitude: 72.8777,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {events.map((event, index) => (
          <Marker
            key={index}
            coordinate={event.coordinates}
            title={event.title}
            description={`${event.date} • ${event.time}`}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
});

export default EventMapView;
