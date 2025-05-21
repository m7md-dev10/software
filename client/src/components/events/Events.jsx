import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      setLoading(false);
    }
  };

  const filteredEvents = events
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="events-loading">
        <div className="loader"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-error">
        <p>{error}</p>
        <button className="retry-button" onClick={fetchEvents}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>Available Events</h2>
        <p>Discover and book your next exciting event</p>
      </div>

      <div className="events-controls">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-controls">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-events">
          <p>No events found matching your search criteria.</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
              </div>
              <div className="event-details">
                <span className="event-category">{event.category}</span>
                <h3>{event.title}</h3>
                <div className="event-info">
                  <i>📅</i>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="event-info">
                  <i>📍</i>
                  <span>{event.location}</span>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-price">${event.price}</div>
                <div className="event-actions">
                  <Link to={`/events/${event._id}`} className="view-details">
                    View Details
                  </Link>
                  <span className={`event-status status-${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events; 