import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './Events.css';

const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;
  const event = booking.eventId || {};
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Booking Details</h2>
        <p><strong>Event:</strong> {event.title || 'Event'}</p>
        <p><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleString() : 'N/A'}</p>
        <p><strong>Location:</strong> {event.location || 'N/A'}</p>
        <p><strong>Quantity:</strong> {booking.numberOfTickets}</p>
        <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
        <p><strong>Status:</strong> {booking.status}</p>
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
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelingId(bookingId);
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(bookings => bookings.filter(b => b._id !== bookingId));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to cancel booking.';
      alert(msg);
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
    <div className="events-page">
      <h1>My Bookings</h1>
      <div className="summary-grid">
        {bookings.map(booking => (
          <div
            key={booking._id}
            className="summary-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedBooking(booking)}
          >
            <h3>{booking.eventId?.title || 'Event'}</h3>
            <p>Quantity: {booking.numberOfTickets}</p>
            <p>Price: ${booking.totalPrice}</p>
            {booking.status !== 'Canceled' && (
              <button
                className="cancel-button"
                onClick={e => { e.stopPropagation(); handleCancel(booking._id); }}
                disabled={cancelingId === booking._id}
              >
                {cancelingId === booking._id ? 'Canceling...' : 'Cancel'}
              </button>
            )}
          </div>
        ))}
      </div>
      <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
};

export default UserBookingsPage; 