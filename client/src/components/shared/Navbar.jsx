import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="EventHub Logo" />
          EventHub
        </Link>

        <button 
          className="mobile-menu-button" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'show' : ''}`}>
          <Link 
            to="/events" 
            className={`nav-link ${isActive('/events') ? 'active' : ''}`}
          >
            Events
          </Link>
          
          {user && user.role === 'Standard User' && (
            <Link 
              to="/my-bookings" 
              className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
            >
              My Bookings
            </Link>
          )}

          {user?.role === 'Organizer' && (
            <Link 
              to="/my-events" 
              className={`nav-link ${isActive('/my-events') ? 'active' : ''}`}
            >
              My Events
            </Link>
          )}

          {user?.role === 'System Admin' && (
            <Link 
              to="/admin" 
              className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
            >
              Admin
            </Link>
          )}

          {user ? (
            <div className="user-menu">
              <button 
                className="user-button" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img 
                  src={user.avatar || '/default-avatar.png'} 
                  alt="User Avatar" 
                  className="user-avatar"
                />
                <span>{user.name}</span>
              </button>
              
              <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                <Link to="/profile" className="dropdown-item">
                  <i>👤</i> Profile
                </Link>
                {user.role === 'Organizer' && (
                  <Link to="/create-event" className="dropdown-item">
                    <i>➕</i> Create Event
                  </Link>
                )}
                <button onClick={handleLogout} className="dropdown-item">
                  <i>🚪</i> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">Login</Link>
              <Link to="/register" className="register-button">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 