import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import './Events.css';

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/events');
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load your events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${eventId}`);
        setEvents(events.filter(event => event._id !== eventId));
        toast.success('Event deleted successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  if (loading) {
    return (
      <div className="events-loading">
        <div className="loader"></div>
        <p>Loading your events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-error">
        <p>{error}</p>
        <button onClick={fetchMyEvents} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>My Events</h1>
        <button 
          className="create-event-button"
          onClick={handleCreateEvent}
        >
          Create New Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>You haven't created any events yet.</p>
          <button 
            className="create-event-button"
            onClick={handleCreateEvent}
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-image">
                <img 
                  src={event.image || 'https://via.placeholder.com/300x200'} 
                  alt={event.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200';
                  }}
                />
                <div className="event-status" style={{
                  backgroundColor: 
                    event.status === 'Approved' ? '#2ecc71' :
                    event.status === 'Pending' ? '#f1c40f' :
                    '#e74c3c'
                }}>
                  {event.status}
                </div>
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-details">
                  <p>
                    <i className="far fa-calendar"></i>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p>
                    <i className="fas fa-map-marker-alt"></i>
                    {event.location}
                  </p>
                  <p>
                    <i className="fas fa-ticket-alt"></i>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(event.ticketPrice)}
                  </p>
                  <p>
                    <i className="fas fa-users"></i>
                    {event.remainingTickets} tickets remaining
                  </p>
                </div>
                <div className="event-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(event._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(event._id)}
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
  );
};

export default MyEvents; 