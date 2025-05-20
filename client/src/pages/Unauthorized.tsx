import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have permission to access this page. Please contact your administrator
            if you believe this is a mistake.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized; 