import React, { useState, useEffect } from 'react';
import { Save as SaveIcon, X as CloseIcon, Edit as EditIcon } from 'lucide-react';
import { LogOut as ExitToAppIcon, Camera as PhotoCameraIcon } from 'lucide-react';
import { XCircle as CancelIcon, Library as SubscriptionsIcon } from 'lucide-react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Grid,
  Paper,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { changeUserDetails, logout, getUserSubscriptions, cancelSubscription } from '../api/api';
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
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoadingSubscriptions(true);
        setSubscriptionError(null);
        const data = await getUserSubscriptions();
        // Filter out cancelled subscriptions
        const activeSubscriptions = data.filter(sub => sub.status !== 'CANCELLED');
        setSubscriptions(activeSubscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        setSubscriptionError(error.message || "Failed to load subscriptions");
      } finally {
        setLoadingSubscriptions(false);
      }
    };

    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

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
  
      const { user: updatedUser, token: newToken } = await changeUserDetails(updateData);
      
      // Update user context with new data and token
      login(updatedUser, newToken);
      
      // Update form state
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
        password: '', // Clear password field
        profileImage: updatedUser.profileImage
      });
      
      const fieldDisplayName = field.charAt(0).toUpperCase() + field.slice(1);
      toast.success(`${fieldDisplayName} updated successfully`);
      setEditingField(null);
  
      // Special handling for email changes
      if (field === 'email') {
        try {
          setLoadingSubscriptions(true);
          const data = await getUserSubscriptions();
          setSubscriptions(data.filter(sub => sub.status !== 'CANCELLED'));
        } catch (error) {
          setSubscriptionError("Failed to refresh subscriptions");
          console.error("Subscription refresh error:", error);
        } finally {
          setLoadingSubscriptions(false);
        }
      }
    } catch (error) {
      if (error.message === "This email is already in use") {
        toast.error(error.message);
        // Keep the email field in edit mode so user can try again
        if (editingField === 'email') {
          setEditingField('email');
        }
      } else {
        toast.error(error.message || `Failed to update ${field}`);
      }
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

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      setCancellingId(subscriptionId);
      await cancelSubscription(subscriptionId);
      // Update the subscriptions list after cancellation
      const updatedSubscriptions = subscriptions.filter(sub => sub.plan.id !== subscriptionId);
      setSubscriptions(updatedSubscriptions);
      toast.success('Subscription cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel subscription');
      console.error("Error cancelling subscription:", err);
    } finally {
      setCancellingId(null);
    }
  };

  // Convert interval days to readable format
  const getBillingCycleName = (intervalDays) => {
    if (intervalDays === 30) return "Monthly";
    if (intervalDays === 90) return "Quarterly";
    if (intervalDays === 365) return "Yearly";
    return `${intervalDays} days`; // Fallback for any other value
  };

  // Format the date as YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    // Add 1 to month because getMonth() returns 0-11
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
          <Paper 
            elevation={4}
            sx={{ 
              padding: 4, 
              textAlign: 'center', 
              borderRadius: 3, 
              bgcolor: '#fff',
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="500">
              You're not logged in
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              Please log in to access your profile and update your information.
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate('/login')}
              sx={{ 
                mr: 2, 
                borderRadius: 2, 
                px: 3, 
                py: 1,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              Log In
            </Button>
            <Button
              variant="outlined"
              color='success'
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1,
                borderWidth: 2,
                '&:hover': {
                  backgroundColor: '#e8f5e9',  
                  borderColor: '#4caf50',      
                },
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
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#f4f6f8', 
        py: 5,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <Card 
          elevation={3}
          sx={{ 
            borderRadius: 3, 
            overflow: 'visible', 
            position: 'relative',
            mb: 4
          }}
        >
          {/* Banner and Profile Picture */}
          <Box 
            sx={{ 
              height: 120, 
              bgcolor: 'success.main', 
              borderTopLeftRadius: 12, 
              borderTopRightRadius: 12 
            }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: { xs: 'center', sm: 'flex-start' }, 
            px: 3, 
            pb: 3, 
            pt: 1,
            position: 'relative'
          }}>
            <Avatar 
              src={user.profileImage} 
              sx={{ 
                width: 120, 
                height: 120, 
                border: '4px solid white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                mt: -8,
                mb: 2
              }} 
            />
            
            <Box sx={{ 
              ml: { xs: 0, sm: 3 }, 
              mt: { xs: 0, sm: 2 },
              textAlign: { xs: 'center', sm: 'left' },
              flexGrow: 1
            }}>
              <Typography variant="h4" fontWeight="500">{user.name}</Typography>
              <Typography color="text.secondary" variant="body1" sx={{ mb: 2 }}>{user.email}</Typography>
              
              <input type="file" id="upload" hidden accept="image/*" onChange={handleImageUpload} />
              <Button
                component="label"
                htmlFor="upload"
                variant="outlined"
                color="success"
                startIcon={<PhotoCameraIcon size={18} />}
                size="small"
                sx={{
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#f0f7f0',
                    borderColor: '#4caf50',
                  },
                }}
              >
                Change Profile Picture
              </Button>
            </Box>
            
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              startIcon={<ExitToAppIcon size={18} />}
              sx={{
                borderRadius: 2,
                alignSelf: { xs: 'center', sm: 'flex-start' },
                mt: { xs: 2, sm: 2 },
                '&:hover': {
                  backgroundColor: '#ffebee',
                  borderColor: '#f44336',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Card>

        <Grid container spacing={3}>
          {/* Personal Information Card */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <CardHeader 
                title="Personal Information" 
                sx={{ 
                  bgcolor: '#f5f5f5', 
                  borderBottom: '1px solid #e0e0e0',
                  py: 2
                }}
              />
              <CardContent>
                {['name', 'email', 'password'].map((field) => (
                  <Box 
                    key={field} 
                    sx={{ 
                      mb: 3, 
                      pb: 2, 
                      borderBottom: field !== 'password' ? '1px solid #eee' : 'none'
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary" 
                      sx={{ mb: 1, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Typography>
                    
                    {editingField === field ? (
                      <>
                        <TextField
                          fullWidth
                          name={field}
                          type={field === 'password' ? 'password' : 'text'}
                          value={formData[field]}
                          onChange={handleChange}
                          size="small"
                          sx={{ mb: 2 }}
                          autoFocus
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleSave(field)}
                            startIcon={<SaveIcon size={16} />}
                            size="small"
                            sx={{ borderRadius: 2 }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={handleCancel}
                            startIcon={<CloseIcon size={16} />}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              '&:hover': {
                                backgroundColor: '#ffecec',
                              },
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight={field === 'password' ? 'normal' : '500'}>
                          {field === 'password' ? '••••••••' : user[field]}
                        </Typography>
                        <Button
                          variant="text"
                          color="success"
                          onClick={() => handleEdit(field)}
                          startIcon={<EditIcon size={16} />}
                          size="small"
                          sx={{ borderRadius: 2 }}
                        >
                          Edit
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Subscriptions Card */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SubscriptionsIcon size={20} color="#4caf50" style={{ marginRight: 8 }} />
                    <Typography variant="h6">My Subscriptions</Typography>
                  </Box>
                }
                sx={{ 
                  bgcolor: '#f5f5f5', 
                  borderBottom: '1px solid #e0e0e0',
                  py: 2
                }}
              />
              <CardContent sx={{ minHeight: 300 }}>
                {loadingSubscriptions ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <CircularProgress color="success" />
                  </Box>
                ) : subscriptionError ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {subscriptionError}
                  </Alert>
                ) : subscriptions.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography color="text.secondary" gutterBottom>
                      You don't have any active subscriptions yet.
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => navigate('/subscriptions')}
                      sx={{ mt: 2, borderRadius: 2 }}
                    >
                      Browse Subscription Plans
                    </Button>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {subscriptions.map((subscription) => (
                      <Paper
                        key={subscription.id}
                        elevation={1}
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid #e0e0e0',
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {subscription.plan.name}
                            </Typography>
                            <Chip 
                              label={subscription.status}
                              size="small"
                              color={subscription.status === 'ACTIVE' ? 'success' : 'warning'}
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Billing cycle
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {getBillingCycleName(subscription.intervalDays)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Price
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              ${subscription.plan.price}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Next billing date
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {formatDate(subscription.nextTriggerDate)}
                            </Typography>
                          </Box>
                          
                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleCancelSubscription(subscription.plan.id)}
                            disabled={cancellingId === subscription.id}
                            startIcon={cancellingId === subscription.id ? <CircularProgress size={16} /> : <CancelIcon size={16} />}
                            sx={{
                              borderRadius: 2,
                              mt: 1,
                              '&:hover': {
                                backgroundColor: '#ffecec',
                                borderColor: '#f44336',
                              },
                            }}
                          >
                            {cancellingId === subscription.id ? 'Cancelling...' : 'Cancel Subscription'}
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;