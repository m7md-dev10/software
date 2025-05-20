import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { showToast } from '../components/shared/Toast';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clear any existing auth state on mount
  useEffect(() => {
    setUser(null);
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/v1/users/profile', {
        withCredentials: true
      });
      // Only set user if we get a valid profile response
      if (response.data.success && response.data.profile) {
        setUser(response.data.profile);
      } else {
        setUser(null);
        // Clear any existing cookies
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      // Clear any existing cookies
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5001/api/v1/login', credentials, {
        withCredentials: true
      });
      // The backend sends user data directly in response.data.user
      if (response.data.user) {
      setUser(response.data.user);
      } else {
        setUser(null);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('User not found');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid credentials');
      }
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...registerData } = userData;
      
      const response = await axios.post('http://localhost:5001/api/v1/register', registerData, {
        withCredentials: true
      });

      if (!response.data || !response.data.user) {
        throw new Error(response.data?.message || 'Registration failed');
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 409) {
        throw new Error('User already exists');
      }
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5001/api/v1/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      // Clear any existing cookies
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      showToast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user data even if the server request fails
      setUser(null);
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      showToast.error('Failed to logout');
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/forgetPassword', { email });
      if (response.data.success) {
        showToast.success('Verification code sent to your email');
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to send verification code');
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Email not found');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to send verification code');
    }
  };

  const resetPassword = async (email, verificationCode, newPassword) => {
    try {
      const response = await api.post('/resetPassword', {
        email,
        verificationCode,
        newPassword
      });
      
      if (response.data.success) {
        showToast.success('Password reset successful');
      return response.data;
      }
      throw new Error(response.data.message || 'Failed to reset password');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid or expired verification code');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to reset password');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('http://localhost:5001/api/v1/users/profile', userData, {
        withCredentials: true
      });
      setUser(response.data.profile);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'System Admin',
    isOrganizer: user?.role === 'Organizer',
    isUser: user?.role === 'Standard User'
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 