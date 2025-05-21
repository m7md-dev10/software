import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../components/events/EventForm';
import api from '../api/axios';
import { toast } from 'react-toastify';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/users/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event details');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (eventData) => {
    try {
      await api.put(`/events/${id}`, eventData);
      toast.success('Event updated successfully');
      navigate('/events');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/events')} className="back-button">
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="edit-event-page">
      <EventForm 
        event={event} 
        onSubmit={handleSubmit} 
        isEditing={true} 
      />
    </div>
  );
};

export default EditEvent; 