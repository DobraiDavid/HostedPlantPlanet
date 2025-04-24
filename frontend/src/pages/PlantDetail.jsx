import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  addToCart, 
  getPlantDetails, 
  getRandomPlants, 
  getComments,  
  postComment 
} from '../api/api'; 
import { 
  Button, 
  TextField, 
  Snackbar, 
  CircularProgress, 
  Alert, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography,
  Rating,
  Box,
  Paper,
  Avatar,
  Chip
} from '@mui/material'; 
import { ToastContainer, toast } from 'react-toastify';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useUser } from "../context/UserContext";  
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';  
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';

const PlantDetail = () => {
  const { id } = useParams(); 
  const [plant, setPlant] = useState(null);
  const [relatedPlants, setRelatedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [newComment, setNewComment] = useState('');
  const [commentTitle, setCommentTitle] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser(); 
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        setLoading(true);
        setError(null);
    
        // Fetch plant details
        const data = await getPlantDetails(id);  
        setPlant(data);
    
        // Fetch random related plants
        const relatedData = await getRandomPlants(3, id); 
        setRelatedPlants(relatedData);
    
        // Fetch comments specifically
        const fetchedComments = await getComments(id);
        
        // Transform comments to ensure all required fields are present
        const processedComments = fetchedComments.map(comment => ({
          ...comment,
          profilePicture: comment.profilePicture,
          createdAt: comment.createdAt || new Date().toISOString(),
          rating: comment.rating || 0
        }));
        
        // Sort comments by most recent first
        const sortedComments = processedComments.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setComments(sortedComments);
      } catch (error) {
        console.error('Error fetching plant details:', error);
        setError('Failed to load plant details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', {
        state: {
          toast: {
            message: 'You need to log in first!',
            type: 'error',
          },
        },
      });
      return;
    }

    try {
      await addToCart(user.id, plant.id, amount);
      toast.success("Item added to cart!");
    } catch (error) {
      console.log(error)
      toast.error("Failed to add item to cart");
    }
  };
  const handleAddRelatedToCart = async (plant) => {
      if (!user) {
        navigate('/login', {
          state: {
            toast: {
              message: 'You need to log in first!',
              type: 'error',
            },
          },
        });
        return;
      }
    
      try {
        await addToCart(user.id, plant.id, 1); 
        toast.success("Item added to cart!");
      } catch (error) {
        console.log(error)
        toast.error("Failed to add item to cart");
      }
    };


  // Add a utility function to format relative time
  const formatRelativeTime = (createdAt) => {
    const now = new Date();
    const commentDate = new Date(createdAt);
    const diffMs = now - commentDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
  };

  const handleCommentSubmit = async () => {
    // Validate comment and title
    if (!newComment.trim()) {
      setSnackbarMessage("Comment cannot be empty!");
      setOpenSnackbar(true);
      return;
    }
    if (!commentTitle.trim()) {
      setSnackbarMessage("Comment title cannot be empty!");
      setOpenSnackbar(true);
      return;
    }
    if (!rating) {
      setSnackbarMessage("Comment rating cannot be!");
      setOpenSnackbar(true);
      return;
    }
  
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }
  
    try {
      const profilePicture = user.profileImage
      // Prepare comment data
      const commentData = {
        userId: user.id,
        plantId: id,
        title: commentTitle,
        commentText: newComment,
        rating: rating,
        profilePicture: user.profileImage
      };
  
      // Post comment to backend
      const newCommentResponse = await postComment(
        user.id, 
        id, 
        commentTitle, 
        newComment, 
        rating,
        profilePicture
      );
  
      // Construct full comment object
      const fullCommentData = {
        ...newCommentResponse,
        username: user.name,
        profilePicture: user.profileImage, 
        createdAt: new Date().toISOString(),
        title: commentTitle,
        commentText: newComment,
        rating: rating || 0
      };
  
      // Prepend the new comment to the existing comments
      setComments(prevComments => [fullCommentData, ...prevComments]);
  
      // Reset form
      setNewComment('');
      setCommentTitle('');
      setRating(0);
      setShowCommentForm(false);
  
      // Optional: Show success notification
      setSnackbarMessage("Comment posted!");
      setOpenSnackbar(true);
  
    } catch (error) {
      console.error('Failed to post comment:', error);
      
      // Set error message
      setError(
        error.response?.data?.message || 
        'Failed to post comment. Please try again.'
      );
    }
  };

    // Function to get light level icon color
    const getLightLevelColor = (level) => {
      switch(level) {
        case 'Low': return '#8BC34A';
        case 'Medium': return '#FFC107';
        case 'High': return '#FF9800';
        default: return '#757575';
      }
    };
  
    // Function to get water needs icon color
    const getWaterNeedsColor = (need) => {
      switch(need) {
        case 'Low': return '#90CAF9';
        case 'Medium': return '#2196F3';
        case 'High': return '#1565C0';
        default: return '#757575';
      }
    };

  if (loading) return <div className="loading"><CircularProgress /></div>;
  if (error) return <div className="error"><Alert severity="error">{error}</Alert></div>;

  return (
      <div className="container">
       <ToastContainer autoClose={1000}/>
        {isMobile ? (
        // MOBILE VIEW (Stacked layout)
        <>
          <Box sx={{ mb: 4 }}>
            <Carousel 
              showThumbs={true} 
              showStatus={false} 
              infiniteLoop 
              autoPlay 
              interval={5000}
              thumbWidth={60}
            >
              {JSON.parse(plant.images).map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`${plant.name} image ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </Box>

          <div className="product-details">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#2e7d32' }}>
            {plant.name}
            </Typography>
          </Box>
            <p className="product-description">{plant.description}</p>

            <div className="price-stock">
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
              ${plant.price}
            </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                icon={<VerifiedIcon />} 
                label="In Stock" 
                color="success" 
                size="small" 
                variant="outlined"
              />
              <Chip 
                icon={<LocalShippingIcon />} 
                label="Free Shipping" 
                size="small" 
                variant="outlined" 
                sx={{ ml: 1 }}
              />
            </Box>
            </div>

            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.min(20, Math.max(1, Number(e.target.value))))}
              inputProps={{ min: 1, max: 20 }}
            />

            <Button variant="contained" color="success" size="large" sx={{ mt: 2 }} onClick={handleAddToCart} startIcon={<ShoppingCartIcon />}>
            {'Add to Cart'}
            </Button>
          </div>
        </>
      ) : (
        // PC VIEW (Side-by-side layout)
        <div className="product-container" style={{ display: "flex", gap: "20px" }}>
          <div className="product-image" style={{ flex: 1 }}>
          <Carousel 
            showThumbs={true} 
            showStatus={false} 
            infiniteLoop 
            autoPlay 
            interval={5000}
            thumbWidth={80}
          >
            {JSON.parse(plant.images).map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`${plant.name} image ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    borderRadius: '12px',
                    objectFit: 'cover',
                    maxHeight: '500px'
                  }}
                />
              </div>
            ))}
          </Carousel>
          </div>

          <div className="product-details" style={{ flex: 1 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#2e7d32' }}>
            {plant.name}
            </Typography>
          </Box>
            <p className="product-description">{plant.description}</p>

            <div className="price-stock">
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
              ${plant.price}
            </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                icon={<VerifiedIcon />} 
                label="In Stock" 
                color="success" 
                size="small" 
                variant="outlined"
              />
              <Chip 
                icon={<LocalShippingIcon />} 
                label="Free Shipping" 
                size="small" 
                variant="outlined" 
                sx={{ ml: 1 }}
              />
            </Box>
            </div>

            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.min(20, Math.max(1, Number(e.target.value))))}
              inputProps={{ min: 1, max: 20 }}
            />

            <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleAddToCart}
                  startIcon={<ShoppingCartIcon />}
                  sx={{ borderRadius: 2, py: 1.5, px: 4, ml: 2, width: '90%', mt:5 }}
                >
                  Add to Cart
            </Button>
          </div>
        </div>
      )}
     

      <Box sx={{ 
        backgroundColor: '#f0f4f0', 
        borderRadius: 3, 
        padding: '20px', 
        marginTop: '20px' 
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            marginBottom: '20px', 
            color: '#2e7d32', 
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {plant.name} Care Guide
        </Typography>
        <Grid container spacing={3}>
          {[
            { 
              icon: <WbSunnyOutlinedIcon sx={{ color: '#ffc107', fontSize: 40 }} />, 
              label: 'Light', 
              value: plant.light 
            },
            { 
              icon: <WaterDropOutlinedIcon sx={{ color: '#2196f3', fontSize: 40 }} />, 
              label: 'Water', 
              value: plant.water 
            },
            { 
              icon: <OpacityOutlinedIcon sx={{ color: '#9c27b0', fontSize: 40 }} />, 
              label: 'Humidity', 
              value: plant.humidity 
            },
            { 
              icon: <DeviceThermostatOutlinedIcon sx={{ color: '#ff5722', fontSize: 40 }} />, 
              label: 'Temperature', 
              value: plant.temperature 
            },
            { 
              icon: <SpaOutlinedIcon sx={{ color: '#4caf50', fontSize: 40 }} />, 
              label: 'Fertilizing', 
              value: plant.fertilizing 
            },
            { 
              icon: <RepeatOutlinedIcon sx={{ color: '#795548', fontSize: 40 }} />, 
              label: 'Re-potting', 
              value: plant.rePotting 
            },
            { 
              icon: <CleaningServicesOutlinedIcon sx={{ color: '#607d8b', fontSize: 40 }} />, 
              label: 'Cleaning', 
              value: plant.cleaning 
            },
            { 
              icon: <LocalFloristOutlinedIcon sx={{ color: '#ff9800', fontSize: 40 }} />, 
              label: 'Propagation', 
              value: plant.propagation 
            }
          ].map((care, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  padding: '15px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 3
                  }
                }}
              >
                {care.icon}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    marginTop: '10px', 
                    marginBottom: '10px', 
                    fontWeight: 'bold',
                    color: '#2e7d32'
                  }}
                >
                  {care.label}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    textAlign: 'center',
                    color: '#616161'
                  }}
                >
                  {care.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Related Products Section */}
      <div className="related-products">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, borderBottom: '2px solid #eee', pb: 2, color: '#2e7d32' }}>
          Explore more
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {relatedPlants.map((relatedPlant) => {
            const images = JSON.parse(relatedPlant.images);
            const firstImage = images[0];

            return (
              <Grid item xs={12} sm={6} md={4} key={relatedPlant.id}>
                <Card
                  onClick={() => navigate(`/plant/${relatedPlant.id}`)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 12px 28px rgba(76,175,80,0.25)',
                      transform: 'translateY(-8px)',
                      '& .MuiCardMedia-root': {
                        transform: 'scale(1.05)',
                      }
                    },
                    backgroundColor: '#ffffff',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::after': {
                      opacity: 1,
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image={firstImage}
                    alt={relatedPlant.name}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                  
                  {/* Plant attribute indicators at the top of the card */}
                  <Box sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    display: 'flex',
                    gap: 0.5
                  }}>
                    <Chip
                      icon={<WbSunnyIcon sx={{ fontSize: '0.85rem !important', color: '#fff' }} />}
                      label={relatedPlant.light}
                      size="small"
                      sx={{
                        backgroundColor: getLightLevelColor(relatedPlant.light),
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }}
                    />
                    <Chip
                      icon={<OpacityIcon sx={{ fontSize: '0.85rem !important', color: '#fff' }} />}
                      label={relatedPlant.water}
                      size="small"
                      sx={{
                        backgroundColor: getWaterNeedsColor(relatedPlant.water),
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                  
                  <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3
                  }}>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{
                        color: '#2e7d32',
                        mb: 1,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {relatedPlant.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 4,
                        textOverflow: 'ellipsis',
                        lineHeight: '1.5',
                        maxHeight: '6em',
                        mb: 2
                      }}
                    >
                      {relatedPlant.description}
                    </Typography>

                    <Box sx={{
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid rgba(0,0,0,0.05)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: '#388e3c',
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        ${relatedPlant.price.toFixed(2)}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCartIcon />}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#388e3c',
                          '&:hover': {
                            backgroundColor: '#2e7d32',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 10px rgba(46, 125, 50, 0.2)',
                          '&:active': {
                            transform: 'scale(0.98)',
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddRelatedToCart(relatedPlant);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>

      {/* Comment Section */}
      <div className="comment-section">
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '15px',
            marginTop: '15px'  
          }}
        >
          <h2 className="section-title">Comments</h2>
          <Button 
            variant="contained" 
            size="large"
            sx={{
              backgroundColor: '#2e7d32',
              color: 'white',
              '&:hover': { 
                backgroundColor: '#1b5e20',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              },
              textTransform: 'none',
              borderRadius: 3,
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            onClick={() => {
              if (!user) {
                navigate('/login');
                return;
              }
              setShowCommentForm(true);
            }}
          >
            + Add a Comment
          </Button>
        </div>
  
      {/* Comment Form first if showCommentForm is true */}
      {showCommentForm && (
        <div className="add-comment">
          <TextField
            label="Comment Title"
            variant="outlined"
            fullWidth
            value={commentTitle}
            onChange={(e) => setCommentTitle(e.target.value)}
            sx={{ marginBottom: '10px' }}
            placeholder="Summarize your comment in a few words"
          />
          
          <TextField
            label="Add a Comment"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ marginTop: '10px' }}
            placeholder="Share your thoughts about this plant..."
          />
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginTop: '10px' 
          }}>
            <Typography variant="body1" sx={{ marginRight: '10px' }}>
              Rate this plant:
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                // Round down to nearest whole number
                setRating(Math.floor(newValue));
              }}
              precision={1}  // Whole stars only
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginBottom: '20px' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#2e7d32',
                color: 'white',
                '&:hover': { 
                  backgroundColor: '#1b5e20'
                },
                textTransform: 'none',
                borderRadius: 2,
                padding: '8px 16px'
              }}
              onClick={handleCommentSubmit}
            >
              Post Comment
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setShowCommentForm(false);
                setNewComment('');
                setCommentTitle('');
                setRating(0);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Comments display */}
      {comments.length > 0 ? (
    comments.map((comment, index) => (
      <Paper 
        key={index} 
        elevation={2} 
        sx={{ 
          padding: '15px', 
          marginBottom: '15px', 
          display: 'flex', 
          alignItems: 'flex-start',
          backgroundColor: '#f5f5f5'
        }}
      >
        {/* Profile Picture */}
        <Avatar 
          src={comment.profilePicture} 
          alt={`${comment.username}'s profile`}
          sx={{ 
            width: 56, 
            height: 56, 
            marginRight: '15px',
            border: '2px solid #2e7d32'
          }}
        />
        
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {comment.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatRelativeTime(comment.createdAt)}
              </Typography>
            </Box>
            
            <Rating 
              value={comment.rating} 
              readOnly 
              precision={1}
              size="small"
            />
          </Box>
          
          <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '5px' }}>
            {comment.title}
          </Typography>
          
          <Typography variant="body1" color="text.primary">
            {comment.commentText}
          </Typography>
        </Box>
      </Paper>
    ))
  ) : (
    !showCommentForm && (
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          textAlign: 'center', 
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}
      >
        No comments yet. Be the first to share your thoughts!
      </Typography>
    )
  )}
    </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default PlantDetail;