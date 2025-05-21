import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

interface Booking {
  id: string;
  eventId: string;
  event: {
    title: string;
    date: string;
    location: string;
    price: number;
  };
  ticketCount: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

const UserBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
    } catch (error) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await axios.post(`/api/bookings/${bookingId}/cancel`);
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      setError('Failed to cancel booking');
      console.error('Error cancelling booking:', error);
    }
  };

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
          My Bookings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              You haven't made any bookings yet.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Browse Events
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Tickets</TableCell>
                  <TableCell align="right">Total Price</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Box
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                        onClick={() => navigate(`/events/${booking.eventId}`)}
                      >
                        {booking.event.title}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.event.date), 'PPP')}
                    </TableCell>
                    <TableCell>{booking.event.location}</TableCell>
                    <TableCell align="right">{booking.ticketCount}</TableCell>
                    <TableCell align="right">
                      ${booking.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={booking.status}
                        color={booking.status === 'confirmed' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {booking.status === 'confirmed' && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
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

export default UserBookings; 