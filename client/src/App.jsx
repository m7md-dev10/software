import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ProfilePage from './components/profile/ProfilePage';
import Events from './pages/Events';
import EventDetails from './components/events/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';
import EventAnalytics from './pages/EventAnalytics';
import UserBookingsPage from './pages/UserBookingsPage';
import AdminDashboard from './pages/AdminDashboard';

// Styles
import './index.css';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/events" replace /> : 
                <LoginForm />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
                <Navigate to="/events" replace /> : 
                <RegisterForm />
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              isAuthenticated ? 
                <Navigate to="/events" replace /> : 
                <ForgotPassword />
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              isAuthenticated ? 
                <Navigate to="/events" replace /> : 
                <ResetPassword />
            } 
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Organizer Routes */}
          <Route
            path="/my-events"
            element={
              <ProtectedRoute allowedRoles={['Organizer']}>
                <MyEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute allowedRoles={['Organizer']}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['Organizer']}>
                <EditEvent />
              </ProtectedRoute>
            }
          />

          {/* User Bookings Route */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <UserBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to events */}
          <Route
            path="/"
            element={<Navigate to="/events" replace />}
          />

          {/* Catch all route - redirect to events */}
          <Route
            path="*"
            element={<Navigate to="/events" replace />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['System Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Event Analytics Route */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['Organizer']}>
                <EventAnalytics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
