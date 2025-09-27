import React, { useState, useEffect } from 'react';
import { getEvents, deleteEvent } from '../../../Backend/firebase/eventService.js';
import EventForm from './EventForm';
import './EventsList.css';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getEvents();
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        setEvents(events.filter(event => event.id !== id));
      } catch (err) {
        setError('Failed to delete event');
        console.error(err);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchEvents();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && events.length === 0) {
    return <div className="events-loading">Loading events...</div>;
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <button className="add-event-btn" onClick={handleAddEvent}>
          Add New Event
        </button>
      </div>

      {error && <div className="events-error">{error}</div>}

      {showForm ? (
        <EventForm 
          eventId={selectedEvent?.id} 
          onSuccess={handleFormSuccess} 
          onCancel={handleFormCancel} 
        />
      ) : (
        <>
          {events.length === 0 ? (
            <div className="no-events">
              <p>No events scheduled. Create a new event to get started!</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  {event.imageUrl ? (
                    <div className="event-image" style={{ backgroundImage: `url(${event.imageUrl})` }}></div>
                  ) : (
                    <div className="event-image event-image-placeholder"></div>
                  )}
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-date">{formatDate(event.date)}</p>
                    <p className="event-time">{event.time}</p>
                    <p className="event-location">{event.location}</p>
                    <p className="event-description">{event.description}</p>
                    <p className="event-organizer">Organized by: {event.organizer}</p>
                    <div className="event-actions">
                      <button 
                        className="edit-event-btn" 
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-event-btn" 
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventsList;