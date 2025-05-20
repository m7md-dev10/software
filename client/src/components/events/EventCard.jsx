import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event._id}`);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format price to include currency symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="event-card" onClick={handleClick}>
      <div className="event-image">
        <img 
          src={event.image || 'https://via.placeholder.com/300x200'} 
          alt={event.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200';
          }}
        />
      </div>
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-details">
          <p className="event-date">
            <i className="far fa-calendar"></i> {formatDate(event.date)}
          </p>
          <p className="event-location">
            <i className="fas fa-map-marker-alt"></i> {event.location}
          </p>
          <p className="event-price">
            <i className="fas fa-ticket-alt"></i> {formatPrice(event.ticketPrice)}
          </p>
        </div>
        {event.availableTickets <= 10 && event.availableTickets > 0 && (
          <div className="event-tickets-warning">
            Only {event.availableTickets} tickets left!
          </div>
        )}
        {event.availableTickets === 0 && (
          <div className="event-sold-out">
            Sold Out
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard; 