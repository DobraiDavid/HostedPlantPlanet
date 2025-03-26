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
  Paper
} from '@mui/material'; 
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import { useUser } from "../context/UserContext";  
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';  

import 'react-responsive-carousel/lib/styles/carousel.min.css';

const PlantDetail = () => {
  const { id } = useParams(); 
  const [plant, setPlant] = useState(null);
  const [relatedPlants, setRelatedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser(); 

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        // Fetch plant details
        const data = await getPlantDetails(id);  
        setPlant(data);

        // Fetch random related plants
        const relatedData = await getRandomPlants(3, id); 
        setRelatedPlants(relatedData);

        // Fetch comments specifically
        const fetchedComments = await getComments(id);
        setComments(fetchedComments);
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
      navigate('/login');
      setError("You need to be logged in to add to cart");
      return;
    }

    try {
      await addToCart(user.id, plant.id, amount);
      setOpenSnackbar(true); 
    } catch (error) {
      setError('Failed to add item to cart');
    }
  };

  const handleCommentSubmit = async () => {
    // Validate comment
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Post comment with user ID, plant ID, comment text, and rating
      const newCommentData = await postComment(user.id, id, newComment, rating);
      
      // Add the new comment to the comments list
      setComments(prevComments => [
        ...prevComments, 
        {
          username: user.name, // Use username from user context
          commentText: newComment,
          rating: rating
        }
      ]);

      // Reset form
      setNewComment('');
      setRating(0);
      setShowCommentForm(false);
    } catch (error) {
      setError('Failed to post comment');
      console.error(error);
    }
  };

  if (loading) return <div className="loading"><CircularProgress /></div>;
  if (error) return <div className="error"><Alert severity="error">{error}</Alert></div>;

  return (
    <div className="container">
      <div className="product-container">
        <div className="product-image">
          {/* Carousel */}
          <Carousel 
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={5000}
          >
            {JSON.parse(plant.images).map((image, index) => (
              <div key={index}>
                <img 
                  src={image} 
                  alt={`${plant.name} image ${index + 1}`} 
                  className="carousel-image" 
                  style={{ width: '730px', height: 'auto' }}
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="product-details">
          <h1 className="product-name">{plant.name}</h1>
          <p className="product-description">{plant.description}</p>

          <div className="price-stock">
            <p className="price">${plant.price}</p>
            <p className="stock-status">In stock</p>
          </div>

          <div className="amount-selector">
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.min(20, Math.max(1, Number(e.target.value))))}
              inputProps={{ min: 1, max: 20 }}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

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
        <h2 className="section-title">You May Also Like</h2>
        <Grid container spacing={4} justifyContent="center">
          {relatedPlants.map((relatedPlant) => {
            const images = JSON.parse(relatedPlant.images);
            const firstImage = images[0];

            return (
              <Grid item xs={12} sm={6} md={4} key={relatedPlant.id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: 5,
                    transition: '0.3s',
                    '&:hover': { boxShadow: 8, transform: 'scale(1.02)' },
                    backgroundColor: '#ffffff',
                    height: '100%'
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={firstImage}
                    alt={relatedPlant.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#2e7d32' }}>
                      {relatedPlant.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        mt: 1,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 5,
                        textOverflow: 'ellipsis',
                        lineHeight: '1.5',
                        maxHeight: '7.5em',
                      }}
                    >
                      {relatedPlant.description}
                    </Typography>
                    <Typography variant="h6" color="green" sx={{ mt: 2, fontWeight: 'bold' }}>
                      ${relatedPlant.price.toFixed(2)}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/plant/${relatedPlant.id}`}
                      variant="contained"
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        backgroundColor: '#4caf50',
                        '&:hover': { backgroundColor: '#388e3c' },
                      }}
                    >
                      🌱 Details
                    </Button>
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
            size="large"  // Made larger
            sx={{
              backgroundColor: '#2e7d32',  // Deeper green
              color: 'white',
              '&:hover': { 
                backgroundColor: '#1b5e20',  // Darker green on hover 
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'  // Added shadow for more emphasis
              },
              textTransform: 'none',
              borderRadius: 3,
              padding: '10px 20px',  // Increased padding
              fontSize: '1rem',  // Slightly larger font
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'  // Subtle shadow
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
            label="Add a Comment"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ marginTop: '10px' }}
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
                backgroundColor: '#2e7d32',  // Match page style
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
          <div key={index} className="comment" style={{ marginBottom: '10px' }}>
            <Typography variant="body1">
              <strong>{comment.username}:</strong> {comment.commentText}
            </Typography>
            <Rating 
              value={comment.rating} 
              readOnly 
              precision={1}
            />
          </div>
        ))
      ) : (
        !showCommentForm && (
          <Typography variant="body2" color="textSecondary">
            No comments yet.
          </Typography>
        )
      )}
    </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Item added to cart!"
      />
    </div>
  );
};

export default PlantDetail;