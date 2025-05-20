import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import StyledGrid from '../../components/shared/StyledGrid';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const capitalizeRole = (role?: string) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <StyledGrid item xs={12}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Profile
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <StyledGrid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </StyledGrid>
                  <StyledGrid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </StyledGrid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Role: {capitalizeRole(user?.role)}
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={loading}
                >
                  Update Profile
                </Button>
              </Box>
            </Paper>
          </StyledGrid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 