import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UpdateProfileForm from './UpdateProfileForm';
import { showToast } from '../shared/Toast';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile, isOrganizer } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleUpdateProfile = async (data) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      showToast.success('Profile updated successfully');
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  if (!user) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {!isEditing ? (
        <div className="profile-view">
          <div className="profile-header">
            <h2>My Profile</h2>
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>

          <div className="profile-info">
            <div className="info-section">
              <h3>Personal Information</h3>
              <div className="info-group">
                <label>Name</label>
                <p>{user.name}</p>
              </div>
              <div className="info-group">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="info-section">
              <h3>Account Information</h3>
              <div className="info-group">
                <label>Role</label>
                <p className="user-role">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              </div>
            </div>

            {user.role === 'Organizer' && (
              <div className="info-section">
                <h3>Organizer Information</h3>
                <div className="info-group">
                  <label>Events Created</label>
                  <p>{user.eventsCreated || 0}</p>
                </div>
                <div className="info-group">
                  <label>Active Events</label>
                  <p>{user.activeEvents || 0}</p>
                </div>
              </div>
            )}

            {user.role === 'user' && (
              <div className="info-section">
                <h3>Booking Information</h3>
                <div className="info-group">
                  <label>Events Booked</label>
                  <p>{user.eventsBooked || 0}</p>
                </div>
                <div className="info-group">
                  <label>Upcoming Events</label>
                  <p>{user.upcomingEvents || 0}</p>
                </div>
              </div>
            )}
          </div>
          {isOrganizer && (
            <button onClick={() => navigate('/analytics')} className="analytics-button">
              View Event Analytics
            </button>
          )}
        </div>
      ) : (
        <UpdateProfileForm 
          user={user}
          onUpdate={handleUpdateProfile}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage; 