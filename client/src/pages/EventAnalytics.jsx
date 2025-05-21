import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import ErrorBoundary from '../components/ErrorBoundary';
import './Events.css';

const EventAnalytics = () => {
  const { isOrganizer } = useAuth();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/events/analytics');
      
      if (response.data?.success) {
        // Fetch detailed event data for each event
        const analyticsWithEventData = await Promise.all(
          response.data.analytics.map(async (eventAnalytics) => {
            const eventResponse = await api.get(`/events/${eventAnalytics.eventId}`);
            return {
              ...eventAnalytics,
              remainingTickets: eventResponse.data.remainingTickets,
              totalTickets: eventResponse.data.totalTickets
            };
          })
        );
        console.log('Analytics data with event details:', analyticsWithEventData);
        setAnalytics(analyticsWithEventData);
      } else {
        setError(response.data?.message || 'No analytics data available');
      }
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOrganizer) {
      // Initial fetch
      fetchData();

      // Set up polling every 5 seconds
      const pollInterval = setInterval(fetchData, 5000);

      // Cleanup interval on component unmount
      return () => clearInterval(pollInterval);
    }
  }, [isOrganizer]);

  // Add event listener for booking updates
  useEffect(() => {
    const handleBookingUpdate = () => {
      // Fetch data immediately when a booking is made
      fetchData();
    };

    // Listen for custom event when booking is made
    window.addEventListener('bookingUpdated', handleBookingUpdate);

    return () => {
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
    };
  }, []);

  if (!isOrganizer) {
    return (
      <div className="events-page">
        <div className="error-message">Access denied. Only organizers can view analytics.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="events-page">
        <div className="loading-message">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="error-message">{error}</div>
        <button onClick={fetchData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="events-page">
        <h1>Event Analytics</h1>
        <button 
          onClick={fetchData} 
          className="refresh-button" 
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Analytics'}
        </button>
        
        {analytics.length > 0 ? (
          <>
            <div className="analytics-container">
              <h2>Booking Analytics</h2>
              <div className="charts-grid">
                {/* Booking Percentage Chart */}
                <div className="chart-container">
                  <h3>Booking Percentage</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={analytics}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Booking Percentage']}
                        labelFormatter={(label) => `Event: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="percentageBooked" 
                        fill="#4f46e5" 
                        name="Booking Percentage" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Tickets Sold Chart */}
                <div className="chart-container">
                  <h3>Tickets Sold</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={analytics}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [value, 'Tickets']}
                        labelFormatter={(label) => `Event: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="ticketsSold" 
                        stroke="#2ecc71" 
                        name="Tickets Sold" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalTickets" 
                        stroke="#e74c3c" 
                        name="Total Tickets" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="analytics-summary">
              <h2>Summary</h2>
              <div className="summary-grid">
                {analytics.map(event => (
                  <div key={event.eventId} className="summary-card">
                    <h3>{event.title}</h3>
                    <p>Total Tickets: {event.totalTickets}</p>
                    <p>Tickets Sold: {event.ticketsSold}</p>
                    <p>Remaining Tickets: {event.remainingTickets}</p>
                    <p>Booking Percentage: {event.percentageBooked}%</p>
                    <p>Revenue: ${event.revenue?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="no-data-message">
            No analytics data available. Create and manage events to see analytics.
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default EventAnalytics;