
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
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getEventStatus = (date, endTime) => {
    if (!date || !endTime) return 'upcoming';
    const d = date.toDate ? date.toDate() : new Date(date);
    const [h, m] = endTime.split(':');
    const endDateTime = new Date(d);
    endDateTime.setHours(parseInt(h), parseInt(m));
    const now = new Date();

    if (endDateTime < now) return 'finished';
    if (d <= now && endDateTime >= now) return 'ongoing';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return '#10b981';
      case 'finished': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ongoing': return 'Happening Now';
      case 'finished': return 'Completed';
      default: return 'Upcoming';
    }
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
          <p className="loading-text">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  const upcoming = sortEvents(events.filter(e => getEventStatus(e.date, e.endTime) === 'upcoming'));
  const ongoing = sortEvents(events.filter(e => getEventStatus(e.date, e.endTime) === 'ongoing'));
  const finished = sortEvents(events.filter(e => getEventStatus(e.date, e.endTime) === 'finished'));

  const renderEventCard = (event) => {
    const status = getEventStatus(event.date, event.endTime);
    const statusColor = getStatusColor(status);

    return (
      <div key={event.id} className={`readonly-event-card ${status}`} style={{ borderColor: statusColor }}>
        <div className="event-image-container">
          {event.imageUrl ? (
            <div className="event-image" style={{ backgroundImage: `url(${event.imageUrl})` }}></div>
          ) : (
            <div className="event-image-placeholder">📅</div>
          )}
          <div className="event-status-badge" style={{ backgroundColor: statusColor }}>
            {getStatusText(status)}
          </div>
        </div>

        <div className="event-content">
          <div className="event-header">
            <h3 className="event-title">{event.title}</h3>
            <div className="event-date-badge">{formatDate(event.date)}</div>
          </div>

          <div className="event-details">
            {event.time && (
              <div className="event-detail-item">
                <span className="detail-icon">🕒</span>
                <span>{event.time} - {event.endTime}</span>
              </div>
            )}
            {event.location && (
              <div className="event-detail-item">
                <span className="detail-icon">📍</span>
                <span>{event.location}</span>
              </div>
            )}
            {event.organizer && (
              <div className="event-detail-item">
                <span className="detail-icon">👤</span>
                <span>Organized by {event.organizer}</span>
              </div>
            )}
          </div>

          {event.description && <p className="event-description">{event.description}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="readonly-events-container">
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span> {error}
        </div>
      )}

      {ongoing.length > 0 && (
        <div className="events-section ongoing-section">
          <h2 className="section-title">
            <span className="section-emoji">🔥</span> Happening Now
          </h2>
          <div className="events-grid">{ongoing.map(renderEventCard)}</div>
        </div>
      )}
      <div>
        <h2 className="main-title">
          <span className="section-emoji">✨</span> Upcoming Events
        </h2>
      </div>
      <div className="events-section upcoming-section">
        {upcoming.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">📭</div>
            <h3 className="no-events-title">No upcoming events</h3>
            <p className="no-events-text">Check back later for exciting new community events!</p>
          </div>
        ) : (
          <div className="events-grid">{upcoming.map(renderEventCard)}</div>
        )}
      </div>
      <div>
        <h2 className="main-title">
          <span className="section-emoji">📜</span> Past Events
        </h2>
      </div>
      {finished.length > 0 && (
        <div className="events-section finished-section">
          <div className="events-grid">{finished.map(renderEventCard)}</div>
        </div>
      )}
    </div>
  );
};

export default ReadOnlyEventsList;
