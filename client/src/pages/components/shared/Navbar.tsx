import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Event Ticketing
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              {/* Role-specific navigation */}
              {user.role === 'System Admin' && (
                <>
                  <Button color="inherit" component={RouterLink} to="/admin/events">
                    Manage Events
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/admin/users">
                    Manage Users
                  </Button>
                </>
              )}

              {user.role === 'Organizer' && (
                <>
                  <Button color="inherit" component={RouterLink} to="/my-events">
                    My Events
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/my-events/analytics">
                    Analytics
                  </Button>
                </>
              )}

              {user.role === 'Standard User' && (
                <Button color="inherit" component={RouterLink} to="/bookings">
                  My Bookings
                </Button>
              )}

              {/* User menu */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user.name ? (
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 