import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/eventService'; // Adjust the import path as necessary

const DiscoverEventsScreen = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };

    getEvents();
  }, []);

  return (
    <div>
      {events.length > 0 ? (
        events.map(event => (
          <div key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            {/* Add more event details as needed */}
          </div>
        ))
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
};

export default DiscoverEventsScreen;
