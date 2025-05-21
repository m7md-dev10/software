import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import './Events.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load event details. Please try again later.');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleBookEvent = async () => {
    try {
      await api.post('/bookings', {
        eventId: id,
        numberOfTickets: ticketCount
      });
      
      // Update the event's remaining tickets
      setEvent(prev => ({
        ...prev,
        remainingTickets: prev.remainingTickets - ticketCount
      }));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('bookingUpdated'));

      alert('Booking successful!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book event');
    }
  };

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="loader"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-details-error">
        <p>{error}</p>
        <button onClick={() => navigate('/events')} className="back-button">
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-not-found">
        <h2>Event not found</h2>
        <button onClick={() => navigate('/events')} className="back-button">
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <button onClick={() => navigate('/events')} className="back-button">
        <i className="fas fa-arrow-left"></i> Back to Events
      </button>

      <div className="event-details-content">
        <div className="event-details-header">
          <div className="event-image-large">
            <img 
              src={event.image || 'https://via.placeholder.com/800x400'} 
              alt={event.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x400';
              }}
            />
          </div>
          <h1>{event.title}</h1>
        </div>

        <div className="event-info-grid">
          <div className="event-info-section">
            <h2>Event Details</h2>
            <p className="event-description">{event.description}</p>
            
            <div className="event-meta">
              <div className="meta-item">
                <i className="far fa-calendar"></i>
                <span>{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              
              <div className="meta-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>{event.location}</span>
              </div>
              
              <div className="meta-item">
                <i className="fas fa-ticket-alt"></i>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(event.ticketPrice)}
                </span>
              </div>
              
              <div className="meta-item">
                <i className="fas fa-users"></i>
                <span>{event.remainingTickets} tickets remaining</span>
              </div>
            </div>
          </div>

          {user && user.role === 'Standard User' && event.status === 'Approved' && (
            <div className="booking-section">
              <h2>Book Tickets</h2>
              {event.remainingTickets > 0 ? (
                <div className="booking-form">
                  <div className="ticket-quantity">
                    <label htmlFor="ticketCount">Number of Tickets:</label>
                    <input
                      id="ticketCount"
                      type="number"
                      min="1"
                      max={event.remainingTickets}
                      value={ticketCount}
                      onChange={(e) => setTicketCount(Math.min(
                        Math.max(1, parseInt(e.target.value) || 1),
                        event.remainingTickets
                      ))}
                    />
                  </div>
                  
                  <div className="total-price">
                    <span>Total Price:</span>
                    <span className="price">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(event.ticketPrice * ticketCount)}
                    </span>
                  </div>
                  
                  <button 
                    className="book-button"
                    onClick={handleBookEvent}
                  >
                    Book Now
                  </button>
                </div>
              ) : (
                <div className="sold-out-message">
                  <i className="fas fa-exclamation-circle"></i>
                  This event is sold out!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 