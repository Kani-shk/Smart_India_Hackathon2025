import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, deleteEvent } from '../../../../Backend/firebase/eventService.js';
import EventForm from '../EventsList/EventForm';
import '../EventsList/EventsList.css';

const AdminEvents = () => {
  const navigate = useNavigate();
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

  const isEventFinished = (date, endTime) => {
    if (!date || !endTime) return false;
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    const [hours, minutes] = endTime.split(':');
    const endDateTime = new Date(dateObj);
    endDateTime.setHours(parseInt(hours), parseInt(minutes));
    return endDateTime < new Date();
  };

  const sortEvents = (events) => {
    return events.sort((a, b) => {
      const aDate = a.date.toDate ? a.date.toDate() : new Date(a.date);
      const bDate = b.date.toDate ? b.date.toDate() : new Date(b.date);
      return aDate - bDate;
    });
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminSession');
    } catch {}
    navigate('/admin', { replace: true });
  };

  const handleLogisticsMap = () => {
    navigate('/admin/logistics-map');
  };

  if (loading && events.length === 0) {
    return <div className="events-loading">Loading events...</div>;
  }

  const upcomingEvents = events.filter(event => !isEventFinished(event.date, event.endTime));
  const finishedEvents = events.filter(event => isEventFinished(event.date, event.endTime));
  const sortedUpcomingEvents = sortEvents(upcomingEvents);
  const sortedFinishedEvents = sortEvents(finishedEvents);

  return (
    <div className="events-container">
      <div className="events-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h1>Admin - Event Management</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="add-event-btn" onClick={handleAddEvent}>
            Add New Event
          </button>
          <button className="logistics-map-btn" onClick={handleLogisticsMap}>
            Logistics Map
          </button>
          <button className="delete-event-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
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
          <div className="events-section">
            <h2>Upcoming Events</h2>
            {sortedUpcomingEvents.length === 0 ? (
              <div className="no-events">
                <p>No upcoming events. Create a new event to get started!</p>
              </div>
            ) : (
              <div className="events-grid">
                {sortedUpcomingEvents.map(event => (
                  <div key={event.id} className="event-card">
                    {event.imageUrl ? (
                      <div className="event-image" style={{ backgroundImage: `url(${event.imageUrl})` }}></div>
                    ) : (
                      <div className="event-image event-image-placeholder"></div>
                    )}
                    <div className="event-content">
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-date">{formatDate(event.date)}</p>
                      <p className="event-time">{event.time} - {event.endTime}</p>
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
          </div>

          <div className="events-section">
            <h2>Finished Events</h2>
            {sortedFinishedEvents.length === 0 ? (
              <div className="no-events">
                <p>No finished events yet.</p>
              </div>
            ) : (
              <div className="events-grid">
                {sortedFinishedEvents.map(event => (
                  <div key={event.id} className="event-card finished-event">
                    {event.imageUrl ? (
                      <div className="event-image" style={{ backgroundImage: `url(${event.imageUrl})` }}></div>
                    ) : (
                      <div className="event-image event-image-placeholder"></div>
                    )}
                    <div className="event-content">
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-date">{formatDate(event.date)}</p>
                      <p className="event-time">{event.time} - {event.endTime}</p>
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
          </div>
        </>
      )}
    </div>
  );
};

export default AdminEvents;
