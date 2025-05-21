import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './UserBookingsPage.css';

const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;
  console.log('Modal booking data:', JSON.stringify(booking, null, 2)); // Debug log
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Booking Details</h2>
        <p><strong>Event:</strong> {booking.eventId?.title || 'Event'}</p>
        <p><strong>Date:</strong> {booking.eventId?.date ? new Date(booking.eventId.date).toLocaleString() : 'N/A'}</p>
        <p><strong>Location:</strong> {booking.eventId?.location || 'N/A'}</p>
        <p><strong>Quantity:</strong> {booking.numberOfTickets}</p>
        <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
        <p><strong>Status:</strong> {booking.bookingStatus}</p>
        <button className="retry-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/bookings');
      console.log('API Response:', JSON.stringify(response.data, null, 2)); // Debug log
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelingId(bookingId);
    try {
      console.log('Attempting to cancel booking:', bookingId);
      const response = await api.delete(`/bookings/${bookingId}`);
      console.log('Cancel response:', response.data);
      setBookings(bookings => bookings.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error('Cancel error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
        stack: err.stack
      });
      let errorMessage = 'Failed to cancel booking.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message?.includes('validation failed')) {
        errorMessage = 'Unable to cancel booking at this time. Please try again later.';
      }
      
      alert(errorMessage);
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!bookings.length) {
    return <div className="no-data-message">You have no bookings yet.</div>;
  }

  return (
    <div className="user-bookings-page">
      <div className="user-bookings-header">
        <h1 className="neon-title">My Bookings</h1>
      </div>
      <div className="bookings-grid">
        {bookings.map(booking => {
          console.log('Individual booking:', JSON.stringify(booking, null, 2)); // Debug log
          return (
          <div
            key={booking._id}
            className="booking-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedBooking(booking)}
          >
            <h3>{booking.eventId?.title || 'Event'}</h3>
              <div className="event-details">
                <p>
                  <i className="far fa-calendar"></i>
                  {booking.eventId?.date ? new Date(booking.eventId.date).toLocaleString() : 'N/A'}
                </p>
                <p>
                  <i className="fas fa-map-marker-alt"></i>
                  {booking.eventId?.location || 'N/A'}
                </p>
                <p>
                  <i className="fas fa-ticket-alt"></i>
                  Quantity: {booking.numberOfTickets}
                </p>
                <p>
                  <i className="fas fa-dollar-sign"></i>
                  Total: ${booking.totalPrice}
                </p>
                <p>
                  <i className="fas fa-info-circle"></i>
                  Status: {booking.bookingStatus}
                </p>
              </div>
              {booking.bookingStatus !== 'Canceled' && (
              <button
                className="cancel-button"
                onClick={e => { e.stopPropagation(); handleCancel(booking._id); }}
                disabled={cancelingId === booking._id}
              >
                {cancelingId === booking._id ? 'Canceling...' : 'Cancel'}
              </button>
            )}
          </div>
          );
        })}
      </div>
      <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
};

export default UserBookingsPage; 