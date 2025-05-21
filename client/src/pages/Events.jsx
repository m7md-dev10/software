import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EventList from '../components/events/EventList';
import './Events.css';

function Events() {
  const { isOrganizer } = useAuth();
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>{isOrganizer ? 'Available Events' : 'Available Events'}</h1>
        {isOrganizer && (
          <button 
            className="create-event-button"
            onClick={handleCreateEvent}
          >
            Create New Event
          </button>
        )}
      </div>
      <EventList />
    </div>
  );
}

export default Events; 