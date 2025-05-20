import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/events/EventForm';
import api from '../api/axios';
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSubmit = async (eventData) => {
    try {
      await api.post('/events', eventData);
      toast.success('Event created successfully');
      navigate('/events');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="create-event-page">
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateEvent; 