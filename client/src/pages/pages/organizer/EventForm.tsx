import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  Grid,
  InputAdornment,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from '../../utils/axios';
import StyledGrid from '../../components/shared/StyledGrid';

interface EventFormData {
  title: string;
  description: string;
  date: Date;
  location: string;
  ticketPrice: number;
  totalTickets: number;
  category: string;
  image?: string;
}

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: new Date(),
    location: '',
    ticketPrice: 0,
    totalTickets: 0,
    category: '',
    image: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/events/${id}`);
      const event = response.data;
      setFormData({
        ...event,
        date: new Date(event.date),
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load event');
      console.error('Error fetching event:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'ticketPrice' || name === 'totalTickets' ? Math.floor(Number(value)) : value,
    }));
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setFormData((prev) => ({
        ...prev,
        date: newDate,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Format the data to match the server schema
      const eventData = {
        ...formData,
        status: 'Pending',
        remainingTickets: formData.totalTickets
      };

      if (isEditing) {
        await axios.put(`/events/${id}`, eventData);
        setSuccess('Event updated successfully!');
      } else {
        await axios.post('/events', eventData);
        setSuccess('Event created successfully!');
      }

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        navigate('/my-events');
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || (isEditing ? 'Failed to update event' : 'Failed to create event');
      setError(errorMessage);
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {isEditing ? 'Edit Event' : 'Create Event'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <StyledGrid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  name="title"
                  label="Event Title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </StyledGrid>

              <StyledGrid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="description"
                  name="description"
                  label="Event Description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </StyledGrid>

              <StyledGrid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Event Date & Time"
                    value={formData.date}
                    onChange={handleDateChange}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </StyledGrid>

              <StyledGrid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="location"
                  name="location"
                  label="Event Location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </StyledGrid>

              <StyledGrid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  id="ticketPrice"
                  name="ticketPrice"
                  label="Ticket Price"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  inputProps={{
                    min: 0,
                    step: 1
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </StyledGrid>

              <StyledGrid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  id="totalTickets"
                  name="totalTickets"
                  label="Total Tickets"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  inputProps={{
                    min: 1,
                    step: 1
                  }}
                />
              </StyledGrid>

              <StyledGrid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="category"
                  name="category"
                  label="Event Category"
                  value={formData.category}
                  onChange={handleChange}
                  helperText="e.g., Concert, Conference, Workshop, etc."
                />
              </StyledGrid>

              <StyledGrid item xs={12}>
                <TextField
                  fullWidth
                  id="image"
                  name="image"
                  label="Image URL"
                  value={formData.image}
                  onChange={handleChange}
                  helperText="Enter a URL for the event image (optional)"
                />
              </StyledGrid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {isEditing ? 'Update Event' : 'Create Event'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/my-events')}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EventForm; 