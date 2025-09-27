import React, { useState, useEffect } from 'react';
import { getEvents } from '../../../../Backend/firebase/eventService.js';
import './ReadOnlyEventsList.css';

const ReadOnlyEventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time;
  };

  const getEventStatus = (date, endTime) => {
    if (!date || !endTime) return 'upcoming';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    const [hours, minutes] = endTime.split(':');
    const endDateTime = new Date(dateObj);
    endDateTime.setHours(parseInt(hours), parseInt(minutes));
    const now = new Date();
    
    if (endDateTime < now) return 'finished';
    if (dateObj <= now && endDateTime >= now) return 'ongoing';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return '#4CAF50';
      case 'finished': return '#757575';
      default: return '#2196F3';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ongoing': return 'Happening Now';
      case 'finished': return 'Completed';
      default: return 'Upcoming';
    }
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

  if (loading && events.length === 0) {
    return (
      <div className="readonly-events-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading amazing events...</p>
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => getEventStatus(event.date, event.endTime) === 'upcoming');
  const ongoingEvents = events.filter(event => getEventStatus(event.date, event.endTime) === 'ongoing');
  const finishedEvents = events.filter(event => getEventStatus(event.date, event.endTime) === 'finished');
  
  const sortedUpcomingEvents = sortEvents(upcomingEvents);
  const sortedOngoingEvents = sortEvents(ongoingEvents);
  const sortedFinishedEvents = sortEvents(finishedEvents);

  const renderEventCard = (event, status) => {
    const eventStatus = getEventStatus(event.date, event.endTime);
    
    return (
      <div key={event.id} className={`readonly-event-card ${eventStatus}`}>
        <div className="event-image-container">
          {event.imageUrl ? (
            <div className="event-image" style={{ backgroundImage: `url(${event.imageUrl})` }}></div>
          ) : (
            <div className="event-image event-image-placeholder">
              <div className="placeholder-icon">📅</div>
            </div>
          )}
          <div className="event-status-badge" style={{ backgroundColor: getStatusColor(eventStatus) }}>
            {getStatusText(eventStatus)}
          </div>
        </div>
        
        <div className="event-content">
          <div className="event-header">
            <h3 className="event-title">{event.title}</h3>
            <div className="event-date-badge">
              {formatDate(event.date)}
            </div>
          </div>
          
          <div className="event-details">
            <div className="event-detail-item">
              <span className="detail-icon">🕒</span>
              <span className="detail-text">{formatTime(event.time)} - {event.endTime}</span>
            </div>
            <div className="event-detail-item">
              <span className="detail-icon">📍</span>
              <span className="detail-text">{event.location}</span>
            </div>
            <div className="event-detail-item">
              <span className="detail-icon">👤</span>
              <span className="detail-text">Organized by {event.organizer}</span>
            </div>
          </div>
          
          <p className="event-description">{event.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="readonly-events-container">

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {sortedOngoingEvents.length > 0 && (
        <div className="events-section ongoing-section">
          <h2 className="section-title">
            <span className="section-icon">🔥</span>
            Happening Now
          </h2>
          <div className="events-grid">
            {sortedOngoingEvents.map(event => renderEventCard(event, 'ongoing'))}
          </div>
        </div>
      )}

      <div className="events-section upcoming-section">
        <h2 className="section-title">
          <span className="section-icon">📅</span>
          Upcoming Events
        </h2>
        {sortedUpcomingEvents.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">📭</div>
            <h3>No upcoming events</h3>
            <p>Check back later for exciting new community events!</p>
          </div>
        ) : (
          <div className="events-grid">
            {sortedUpcomingEvents.map(event => renderEventCard(event, 'upcoming'))}
          </div>
        )}
      </div>

      {sortedFinishedEvents.length > 0 && (
        <div className="events-section finished-section">
          <h2 className="section-title">
            <span className="section-icon">✅</span>
            Past Events
          </h2>
          <div className="events-grid">
            {sortedFinishedEvents.map(event => renderEventCard(event, 'finished'))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadOnlyEventsList;
