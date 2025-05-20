import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import axios from 'axios';
import StyledGrid from '../../components/shared/StyledGrid';

interface EventStats {
  eventId: string;
  title: string;
  totalTickets: number;
  soldTickets: number;
  availableTickets: number;
  revenue: number;
  bookingsByDay: {
    date: string;
    count: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EventAnalytics: React.FC = () => {
  const location = useLocation();
  const eventId = new URLSearchParams(location.search).get('eventId');
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventId) {
      fetchEventStats();
    }
  }, [eventId]);

  const fetchEventStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/${eventId}/stats`);
      setStats(response.data);
    } catch (error) {
      setError('Failed to load event statistics');
      console.error('Error fetching event stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Event statistics not found'}
        </Alert>
      </Container>
    );
  }

  const pieData = [
    { name: 'Sold Tickets', value: stats.soldTickets },
    { name: 'Available Tickets', value: stats.availableTickets },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics: {stats.title}
        </Typography>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <StyledGrid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" color="primary">
                ${stats.revenue.toFixed(2)}
              </Typography>
            </Paper>
          </StyledGrid>
          <StyledGrid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Tickets Sold
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.soldTickets} / {stats.totalTickets}
              </Typography>
            </Paper>
          </StyledGrid>
          <StyledGrid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Sold Percentage
              </Typography>
              <Typography variant="h4" color="primary">
                {((stats.soldTickets / stats.totalTickets) * 100).toFixed(1)}%
              </Typography>
            </Paper>
          </StyledGrid>

          {/* Charts */}
          <StyledGrid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Daily Bookings
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.bookingsByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Bookings" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </StyledGrid>

          <StyledGrid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ticket Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </StyledGrid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EventAnalytics; 