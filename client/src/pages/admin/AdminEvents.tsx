import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Chip,
  ButtonGroup,
  Tabs,
  Tab,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

interface Event {
  id: string;
  title: string;
  organizer: {
    id: string;
    name: string;
  };
  date: string;
  location: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/events');
      setEvents(response.data);
    } catch (error) {
      setError('Failed to load events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId: string, status: 'approved' | 'declined') => {
    try {
      await axios.put(`/api/admin/events/${eventId}/status`, { status });
      fetchEvents();
    } catch (error) {
      setError('Failed to update event status');
      console.error('Error updating event status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredEvents = events.filter((event) => {
    switch (activeTab) {
      case 0: // All events
        return true;
      case 1: // Pending
        return event.status === 'pending';
      case 2: // Approved
        return event.status === 'approved';
      case 3: // Declined
        return event.status === 'declined';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Events
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All Events" />
            <Tab label="Pending" />
            <Tab label="Approved" />
            <Tab label="Declined" />
          </Tabs>
        </Paper>

        {filteredEvents.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No events found in this category.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Organizer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Tickets</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.organizer.name}</TableCell>
                    <TableCell>{format(new Date(event.date), 'PPP')}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell align="right">${event.price}</TableCell>
                    <TableCell align="right">
                      {event.totalTickets - event.availableTickets} / {event.totalTickets}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={event.status}
                        color={getStatusColor(event.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {event.status === 'pending' && (
                        <ButtonGroup size="small">
                          <Button
                            color="success"
                            onClick={() => handleStatusChange(event.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handleStatusChange(event.id, 'declined')}
                          >
                            Decline
                          </Button>
                        </ButtonGroup>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default AdminEvents; 