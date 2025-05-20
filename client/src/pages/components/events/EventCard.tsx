import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { Event as EventIcon, LocationOn, AttachMoney } from '@mui/icons-material';
import { format } from 'date-fns';

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

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="140"
        image={event.image || 'https://source.unsplash.com/random?event'}
        alt={event.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {event.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EventIcon sx={{ mr: 1, fontSize: 20 }} color="action" />
          <Typography variant="body2">
            {format(new Date(event.date), 'PPP')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ mr: 1, fontSize: 20 }} color="action" />
          <Typography variant="body2">{event.location}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoney sx={{ mr: 1, fontSize: 20 }} color="action" />
          <Typography variant="body2">${event.price}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={
              event.availableTickets === 0
                ? 'Sold Out'
                : `${event.availableTickets} tickets left`
            }
            color={event.availableTickets === 0 ? 'error' : 'success'}
            size="small"
          />
          <Button
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/events/${event.id}`);
            }}
          >
            Learn More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard; 