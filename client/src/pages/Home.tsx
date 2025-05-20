import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import EventCard from '../components/events/EventCard';
import StyledGrid from '../components/shared/StyledGrid';

const GridItem = styled(Grid)({});

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  availableTickets: number;
  image?: string;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/events');
      setEvents(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upcoming Events
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search events by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : filteredEvents.length === 0 ? (
        <Typography align="center">
          {searchTerm ? 'No events found matching your search.' : 'No events available.'}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredEvents.map((event) => (
            <StyledGrid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </StyledGrid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home; 