import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Event Management</Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/events">Events</Link>
        </li>
        
        {isAuthenticated ? (
          <>
            {user?.role === 'Organizer' && (
              <>
                <li>
                  <Link to="/my-events">My Events</Link>
                </li>
                <li>
                  <Link to="/create-event">Create Event</Link>
                </li>
              </>
            )}
            {user?.role === 'Standard User' && (
              <li>
                <Link to="/my-bookings">My Bookings</Link>
              </li>
            )}
            {user?.role === 'System Admin' && (
              <li>
                <Link to="/admin">Admin Dashboard</Link>
              </li>
            )}
            <li>
              <Link to="/profile" className="profile-link">
                <img 
                  src={user?.profilePicture || 'https://via.placeholder.com/32'} 
                  alt="Profile" 
                  className="profile-picture"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/32';
                  }}
                />
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register" className="register-button">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; 