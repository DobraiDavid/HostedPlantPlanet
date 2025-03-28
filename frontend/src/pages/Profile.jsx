import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Avatar, 
  Grid 
} from '@mui/material';
import { useUser } from '../context/UserContext';
import { changeUserDetails } from '../api/api.js';
import { logout } from '../api/api.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, login } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false,
    profileImage: false
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    profileImage: user?.profileImage || ''
  });

  const handleEditToggle = (field) => {
    setIsEditing(prev => ({
      ...Object.fromEntries(Object.keys(isEditing).map(k => [k, false])),
      [field]: !isEditing[field]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSave = async (field) => {
    try {
      const updateData = {};
      updateData[field] = formData[field];

      if (field === 'password') {
        const confirmPassword = prompt('Please confirm your new password');
        if (confirmPassword !== formData.password) {
          toast.error('Passwords do not match');
          return;
        }
      }

      const updatedUser = await changeUserDetails(updateData);
      
      login(updatedUser);
      
      setIsEditing(prev => ({...prev, [field]: false}));
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (error) {
      toast.error(error.message || `Failed to update ${field}`);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const updatedUser = await changeUserDetails({
            profileImage: reader.result
          });
          login(updatedUser);
          toast.success('Profile image updated');
        } catch (error) {
          toast.error('Failed to update profile image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box 
        sx={{ 
          backgroundColor: '#f0f4f0', 
          borderRadius: 3, 
          padding: '20px', 
          boxShadow: 3 
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            marginBottom: '20px', 
            color: '#2e7d32', 
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          User Profile
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user.profileImage}
            alt="Profile"
            sx={{ 
              width: 120, 
              height: 120, 
              mb: 2,
              border: '4px solid #4caf50'
            }}
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleProfileImageChange}
            style={{ display: 'none' }}
            id="profileImageUpload"
          />
          <Button
            variant="contained"
            component="label"
            htmlFor="profileImageUpload"
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#388e3c' }
            }}
          >
            Change Profile Picture
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Name Field */}
          <Grid item xs={12}>
            <Paper 
              elevation={2} 
              sx={{ 
                padding: '15px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  marginBottom: '10px', 
                  fontWeight: 'bold',
                  color: '#2e7d32'
                }}
              >
                Name
              </Typography>
              {isEditing.name ? (
                <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
                  <TextField
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                  <Button 
                    variant="contained" 
                    color="success"
                    onClick={() => handleSave('name')}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    onClick={() => handleEditToggle('name')}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <Typography>{user.name}</Typography>
                  <Button 
                    variant="contained"
                    sx={{
                      backgroundColor: '#4caf50',
                      '&:hover': { backgroundColor: '#388e3c' }
                    }}
                    onClick={() => handleEditToggle('name')}
                  >
                    Edit
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Email Field */}
          <Grid item xs={12}>
            <Paper 
              elevation={2} 
              sx={{ 
                padding: '15px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  marginBottom: '10px', 
                  fontWeight: 'bold',
                  color: '#2e7d32'
                }}
              >
                Email
              </Typography>
              {isEditing.email ? (
                <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
                  <TextField
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    type="email"
                  />
                  <Button 
                    variant="contained" 
                    color="success"
                    onClick={() => handleSave('email')}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    onClick={() => handleEditToggle('email')}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <Typography>{user.email}</Typography>
                  <Button 
                    variant="contained"
                    sx={{
                      backgroundColor: '#4caf50',
                      '&:hover': { backgroundColor: '#388e3c' }
                    }}
                    onClick={() => handleEditToggle('email')}
                  >
                    Edit
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Password Field */}
          <Grid item xs={12}>
            <Paper 
              elevation={2} 
              sx={{ 
                padding: '15px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  marginBottom: '10px', 
                  fontWeight: 'bold',
                  color: '#2e7d32'
                }}
              >
                Password
              </Typography>
              {isEditing.password ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
                  <TextField
                    fullWidth
                    name="password"
                    type="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="success"
                      onClick={() => handleSave('password')}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      onClick={() => handleEditToggle('password')}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <Typography>********</Typography>
                  <Button 
                    variant="contained"
                    sx={{
                      backgroundColor: '#4caf50',
                      '&:hover': { backgroundColor: '#388e3c' }
                    }}
                    onClick={() => handleEditToggle('password')}
                  >
                    Change Password
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Logout Button */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              maxWidth: 400,
              margin: '0 auto',
              backgroundColor: '#f44336',
              '&:hover': { backgroundColor: '#d32f2f' }
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;