import React, { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Grid,
  Paper,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { changeUserDetails, logout } from '../api/api';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, login, logout: logoutUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    profileImage: user?.profileImage || ''
  });
  const [editingField, setEditingField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleSave = async (field) => {
    try {
      const updateData = { [field]: formData[field] };

      if (field === 'password') {
        const confirm = prompt('Please confirm your new password');
        if (confirm !== formData.password) return toast.error('Passwords do not match');
      }

      const updatedUser = await changeUserDetails(updateData);
      login(updatedUser);
      toast.success(`${field} updated`);
      setEditingField(null);
    } catch (err) {
      toast.error(`Failed to update ${field}`);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onloadend = async () => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 128;
  
        canvas.width = size;
        canvas.height = size;
  
        // Clear canvas (important for PNG transparency)
        ctx.clearRect(0, 0, size, size);
  
        // Draw image scaled to 128x128
        ctx.drawImage(img, 0, 0, size, size);
  
        // Detect original file type (JPEG or PNG)
        const mimeType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
  
        const resizedBase = canvas.toDataURL(mimeType, 0.8); 
  
        try {
          const updatedUser = await changeUserDetails({ profileImage: resizedBase });
          login(updatedUser);
          toast.success('Profile image updated');
        } catch (err) {
          toast.error('Failed to update image');
          console.error("Error during profile image update:", err);
        }
      };
  
      img.onerror = () => toast.error("Invalid image");
      img.src = reader.result;
    };
  
    reader.readAsDataURL(file);
  };  

  const handleLogout = async () => {
    try {
      await logout();
      logoutUser();
      navigate('/', { state: { toast: { message: 'Successful logout!', type: 'success' } } });
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ padding: 4, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom>
              You're not logged in
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Please log in to access your profile and update your information.
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Log In
            </Button>
            <Button
              variant="outlined"
              color='success'
              sx={{ 
                marginRight: 2, 
                '&:hover': {
                  backgroundColor: '#e8f5e9',  
                  borderColor: '#4caf50',      
                },
                borderRadius: 2,  
                borderWidth: 2,   
              }}
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
      <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 3, boxShadow: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" align="center" mb={4}>Profile</Typography>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar src={user.profileImage} sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }} />
          <input type="file" id="upload" hidden accept="image/*" onChange={handleImageUpload} />
          <Button
            component="label"
            htmlFor="upload"
            variant="outlined"
            color="success"
            startIcon={<PhotoCameraIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              '&:hover': {
                backgroundColor: '#f0f0f0', // Hover effect
                borderColor: '#4caf50',
              },
            }}
          >
            Change Profile Picture
          </Button>
        </Box>

        <Grid container spacing={2}>
          {['name', 'email', 'password'].map((field) => (
            <Grid item xs={12} key={field}>
              <Paper sx={{ padding: 2, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>{field.charAt(0).toUpperCase() + field.slice(1)}</Typography>
                {editingField === field ? (
                  <>
                    <TextField
                      fullWidth
                      name={field}
                      type={field === 'password' ? 'password' : 'text'}
                      value={formData[field]}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleSave(field)}
                        startIcon={<SaveIcon />}
                        sx={{ borderRadius: 2, px: 3 }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancel}
                        startIcon={<CloseIcon />}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          borderWidth: 2,
                          '&:hover': {
                            backgroundColor: '#ffecec',
                            borderColor: '#f44336',
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{field === 'password' ? '********' : user[field]}</Typography>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleEdit(field)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Button
          fullWidth
          variant="contained"
          color="error"
          sx={{ mt: 4, padding: 1.5 }}
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;
