import React from 'react';
import ReadOnlyEventsList from './ReadOnlyEventsList';
import './Events.css';

const Events = () => {
  return (
    <div className="events-page">
      <div className="events-hero">
        <h1>Community Events</h1>
        <p>Join us in making a difference through food sharing events in your community</p>
      </div>
      <ReadOnlyEventsList />
    </div>
  );
};

export default Events;