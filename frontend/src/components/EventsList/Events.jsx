import React from 'react';
import ReadOnlyEventsList from './ReadOnlyEventsList';
import './Events.css';

const Events = () => {
  return (
    <section className="events-page">
      <div className="events-hero">
        <div className="events-text">
          <h1 className="events-title">
            Discover <span className="highlight">Community Events</span>
          </h1>
          <p className="events-description">
            Join us in making a difference through food sharing events in your community.
          </p>
        </div>
      </div>

      <ReadOnlyEventsList />

      {/* Floating shapes for subtle background motion */}
      <div className="floating-shapes">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>
  );
};

export default Events;
