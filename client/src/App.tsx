import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';

// Layout Components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import EventDetails from './pages/events/EventDetails';
import Unauthorized from './pages/Unauthorized';

// Protected Pages
import Profile from './pages/profile/Profile';
import UserBookings from './pages/bookings/UserBookings';
import MyEvents from './pages/organizer/MyEvents';
import EventForm from './pages/organizer/EventForm';
import EventAnalytics from './pages/organizer/EventAnalytics';
import AdminEvents from './pages/admin/AdminEvents';
import AdminUsers from './pages/admin/AdminUsers';

// Route Guards
import PrivateRoute from './components/shared/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Protected Routes - User */}
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute roles={['Standard User', 'Organizer', 'System Admin']}>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-bookings"
                    element={
                      <PrivateRoute roles={['Standard User']}>
                        <UserBookings />
                      </PrivateRoute>
                    }
                  />

                  {/* Protected Routes - Organizer */}
                  <Route
                    path="/my-events"
                    element={
                      <PrivateRoute roles={['Organizer']}>
                        <MyEvents />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-events/new"
                    element={
                      <PrivateRoute roles={['Organizer']}>
                        <EventForm />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-events/:id/edit"
                    element={
                      <PrivateRoute roles={['Organizer']}>
                        <EventForm />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-events/analytics"
                    element={
                      <PrivateRoute roles={['Organizer']}>
                        <EventAnalytics />
                      </PrivateRoute>
                    }
                  />

                  {/* Protected Routes - Admin */}
                  <Route
                    path="/admin/events"
                    element={
                      <PrivateRoute roles={['System Admin']}>
                        <AdminEvents />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <PrivateRoute roles={['System Admin']}>
                        <AdminUsers />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
            <ToastContainer position="bottom-right" />
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
