import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './Events.css';

const AdminDashboard = () => {
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState({ approved: [], pending: [], declined: [] });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'events') {
        const res = await api.get('/events/all');
        if (res.data.success) {
          setEvents({
            approved: res.data.approved,
            pending: res.data.pending,
            declined: res.data.declined,
          });
        } else {
          setError('Failed to load events.');
        }
      } else {
        const res = await api.get('/users');
        if (res.data.success) {
          setUsers(res.data.users);
        } else {
          setError('Failed to load users.');
        }
      }
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventStatus = async (eventId, status) => {
    setActionLoading(true);
    try {
      await api.patch(`/events/${eventId}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update event status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUserRole = async (userId, role) => {
    setActionLoading(true);
    try {
      await api.put(`/users/${userId}`, { role });
      fetchData();
    } catch (err) {
      alert('Failed to update user role.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/users/${userId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="events-page">
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={tab === 'events' ? 'retry-button' : ''} onClick={() => setTab('events')}>Events</button>
        <button className={tab === 'users' ? 'retry-button' : ''} onClick={() => setTab('users')}>Users</button>
      </div>
      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : tab === 'events' ? (
        <div>
          <h2>Pending Events</h2>
          <div className="summary-grid">
            {events.pending.map(event => (
              <div key={event._id} className="summary-card">
                <h3>{event.title}</h3>
                <p>Date: {event.date ? new Date(event.date).toLocaleString() : 'N/A'}</p>
                <p>Location: {event.location}</p>
                <p>Organizer: {event.organizerId?.name || 'N/A'} ({event.organizerId?.email || ''})</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    className="book-button"
                    disabled={actionLoading}
                    onClick={() => handleEventStatus(event._id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="cancel-button"
                    disabled={actionLoading}
                    onClick={() => handleEventStatus(event._id, 'Declined')}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
          <h2 style={{ marginTop: '2rem' }}>Approved Events</h2>
          <div className="summary-grid">
            {events.approved.map(event => (
              <div key={event._id} className="summary-card">
                <h3>{event.title}</h3>
                <p>Date: {event.date ? new Date(event.date).toLocaleString() : 'N/A'}</p>
                <p>Location: {event.location}</p>
                <p>Organizer: {event.organizerId?.name || 'N/A'} ({event.organizerId?.email || ''})</p>
                <span className="event-status" style={{ background: '#2ecc71' }}>Approved</span>
              </div>
            ))}
          </div>
          <h2 style={{ marginTop: '2rem' }}>Declined Events</h2>
          <div className="summary-grid">
            {events.declined.map(event => (
              <div key={event._id} className="summary-card">
                <h3>{event.title}</h3>
                <p>Date: {event.date ? new Date(event.date).toLocaleString() : 'N/A'}</p>
                <p>Location: {event.location}</p>
                <p>Organizer: {event.organizerId?.name || 'N/A'} ({event.organizerId?.email || ''})</p>
                <span className="event-status" style={{ background: '#e74c3c' }}>Declined</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2>Users</h2>
          <div className="summary-grid">
            {users.map(user => (
              <div key={user._id} className="summary-card">
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <select
                    value={user.role}
                    onChange={e => handleUserRole(user._id, e.target.value)}
                    disabled={actionLoading}
                  >
                    <option value="Standard User">Standard User</option>
                    <option value="Organizer">Organizer</option>
                    <option value="System Admin">System Admin</option>
                  </select>
                  <button
                    className="cancel-button"
                    disabled={actionLoading}
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 