import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn,
  AttachMoney,
  ConfirmationNumber,
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  availableTickets: number;
  image?: string;
  organizer: {
    id: string;
    name: string;
  };
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      setError('Failed to load event details');
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setBookingError('');
      setBookingSuccess('');
      await axios.post('/api/bookings', {
        eventId: id,
        ticketCount,
      });
      setBookingSuccess('Booking successful!');
      fetchEventDetails(); // Refresh event details to update ticket count
    } catch (error) {
      setBookingError('Failed to book tickets. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Event not found'}
        </Alert>
      </Container>
    );
  }

  const isAvailable = event.availableTickets > 0;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3}>
          {event.image && (
            <Box
              component="img"
              src={event.image}
              alt={event.title}
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
              }}
            />
          )}
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {event.title}
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 2 }} color="action" />
                <Typography>
                  {format(new Date(event.date), 'PPP')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 2 }} color="action" />
                <Typography>{event.location}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 2 }} color="action" />
                <Typography>${event.price}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ConfirmationNumber sx={{ mr: 2 }} color="action" />
                <Typography>
                  {isAvailable
                    ? `${event.availableTickets} tickets available`
                    : 'Sold Out'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {user && user.role === 'user' && (
              <Box sx={{ mt: 3 }}>
                {bookingError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {bookingError}
                  </Alert>
                )}

                {bookingSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {bookingSuccess}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    type="number"
                    label="Number of Tickets"
                    value={ticketCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0 && value <= event.availableTickets) {
                        setTicketCount(value);
                      }
                    }}
                    disabled={!isAvailable}
                    InputProps={{ inputProps: { min: 1, max: event.availableTickets } }}
                    sx={{ width: 150 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Total: ${(event.price * ticketCount).toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleBooking}
                    disabled={!isAvailable}
                  >
                    Book Now
                  </Button>
                </Box>
              </Box>
            )}

            {!user && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                >
                  Login to Book Tickets
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EventDetails; 