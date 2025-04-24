import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { 
  Button, 
  TextField, 
  Snackbar,
  useMediaQuery, 
  CircularProgress, 
  Alert, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Divider, 
  Rating, 
  Chip,
  Paper,
  Avatar
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import { ToastContainer, toast } from 'react-toastify';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { 
  getSubscriptionById, 
  getRandomPlants, 
  addToCart, 
  getComments, 
  postComment,
  getCartItems,
  getUserSubscriptions
} from '../api/api';
import { useUser } from "../context/UserContext";

const SubscriptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [relatedPlants, setrelatedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(1);
  const isMobile = useMediaQuery('(max-width:600px)');
  const { user } = useUser();
  
  // New state variables for cart and subscription status
  const [inCart, setInCart] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Comment section states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentTitle, setCommentTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch subscription details
        const data = await getSubscriptionById(id);
        setPlan(data);
        
        // Fetch related plans (using getRandomPlants as in your example)
        const related = await getRandomPlants(3, id);
        setrelatedPlants(related);
        
        // Fetch comments
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
        
        // Check if user is logged in
        if (user) {
          // Check if subscription is in cart
          try {
            const cartItems = await getCartItems(user.id);
            
            const planInCart = cartItems.some(item => 
              item.subscription && 
              item.subscriptionPlan?.id === parseInt(id)
            );
            
            setInCart(planInCart);
          } catch (err) {
            console.error("Error checking cart status:", err);
          }
          
          // Check if user is already subscribed
          try {
            const subscriptions = await getUserSubscriptions();
            const alreadySubscribed = subscriptions.some(sub => 
              sub.plan.id === parseInt(id)
            );
            setIsSubscribed(alreadySubscribed);
          } catch (err) {
            console.error("Error checking subscription status:", err);
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err.message || 'Failed to load subscription details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

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
    
    // Check if already in cart or subscribed
    if (inCart) {
      navigate('/cart/view');
      return;
    }
    
    if (isSubscribed) {
      navigate('/profile');
      return;
    }

    try {
      await addToCart(user.id, plan.id, amount, null, true);
      setInCart(true); // Update button state immediately after successful addition
      toast.success("Subscription added to cart!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add subscription to cart");
    }
  };

  const handleAddRelatedToCart = async (relatedPlant) => {
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
      await addToCart(user.id, relatedPlant.id, 1); 
      toast.success("Item added to cart!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item to cart");
    }
  };

  // Generate button props based on current state
  const getButtonProps = () => {
    let buttonText = "Add to Cart";
    let buttonIcon = <ShoppingCartIcon />;
    let buttonColor = "success";
    
    if (isSubscribed) {
      buttonText = "Already Subscribed";
      buttonIcon = <SubscriptionsIcon />;
      buttonColor = "primary";
    } else if (inCart) {
      buttonText = "Already in Cart";
      buttonIcon = <CheckCircleIcon />;
      buttonColor = "info";
    }
    
    return { buttonText, buttonIcon, buttonColor };
  };

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
      setSnackbarMessage("Comment rating cannot be empty!");
      setOpenSnackbar(true);
      return;
    }
  
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }
  
    try {
      const profilePicture = user.profileImage;
      // Prepare comment data
      const commentData = {
        userId: user.id,
        planId: id,
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
  
      // Show success notification
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

  // Get button properties based on state
  const { buttonText, buttonIcon, buttonColor } = getButtonProps();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 4, maxWidth: 800, mx: 'auto' }}>
        {error}
      </Alert>
    );
  }

  if (!plan) {
    return (
      <Alert severity="warning" sx={{ m: 4, maxWidth: 800, mx: 'auto' }}>
        Subscription plan not found
      </Alert>
    );
  }

  let images = [];
  try {
    images = JSON.parse(plan.images);
  } catch (e) {
    console.error('Failed to parse images:', e);
    images = []; // Fallback to empty array if parsing fails
  }

  // Determine pricing display based on the plan ID
  const pricingDisplay = id === '1' ? `$${plan.price} per Quarter` : `$${plan.price} per Month`;

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

  return (
    <div className="container" style={{ padding: isMobile ? '16px' : '32px', maxWidth: 1200, margin: '0 auto' }}>
      <ToastContainer autoClose={1000}/>

      {isMobile ? (
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
              {images.map((img, i) => (
                <div key={i}>
                  <img
                    src={img}
                    alt={`${plan.name} image ${i + 1}`}
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
        
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#2e7d32' }}>
            {plan.name}
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
              {pricingDisplay}
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

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              {plan.description}
            </Typography>

            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Key Benefits:
                </Typography>
                {id === '1' ?
                <ul style={{ paddingLeft: '20px' }}>
                  <li><Typography variant="body1" sx={{ mb: 1 }}>Curated selection of premium plants</Typography></li>
                  <li><Typography variant="body1" sx={{ mb: 1 }}>Exclusive subscriber discounts</Typography></li>
                  <li><Typography variant="body1" sx={{ mb: 1 }}>Free shipping on all orders</Typography></li>
                  <li><Typography variant="body1" sx={{ mb: 1 }}>Cancel or skip anytime</Typography></li>
                </ul>
                :
                <ul style={{ paddingLeft: '20px' }}>
                <li><Typography variant="body1" sx={{ mb: 1 }}>Personalised care tips tailored to your plants</Typography></li>
                <li><Typography variant="body1" sx={{ mb: 1 }}>Free pots and supplements when your plants need them</Typography></li>
                <li><Typography variant="body1" sx={{ mb: 1 }}>Exclusive subscriber discounts</Typography></li>
                <li><Typography variant="body1" sx={{ mb: 1 }}>Cancel or skip anytime</Typography></li>
              </ul>
                }
              </Box>
            
            <Button
              variant="contained"
              color={buttonColor}
              size="large"
              fullWidth
              onClick={handleAddToCart}
              startIcon={buttonIcon}
              sx={{ borderRadius: 2, py: 1.5, mt:2}}
            >
              {buttonText}
            </Button>
          </Box>
        </>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Carousel 
              showThumbs={true} 
              showStatus={false} 
              infiniteLoop 
              autoPlay 
              interval={5000}
              thumbWidth={80}
            >
              {images.map((img, i) => (
                <div key={i}>
                  <img
                    src={img}
                    alt={`${plan.name} image ${i + 1}`}
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
          </Grid>


          <Grid item xs={12} md={6}>



            <Box sx={{ pl: { md: 4 } }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#2e7d32' }}>
                  {plan.name}
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 2 }}>
                {pricingDisplay}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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
                  sx={{ ml: 2 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
                {plan.description}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Key Benefits:
                </Typography>
                {id === '1' ?
                <ul style={{ paddingLeft: '20px' }}>
                  <li><Typography variant="body1" sx={{ mb: 1 }}>Curated selection of premium plants</Typography></li>
                  <li><Typography variant="body1" sx={{ mb: 1 }}>Exclusive subscriber discounts</Typography></li>
                  <li><Typography variant="body1" sx={{ mb: 1 }}>Free shipping on all orders</Typography></li>
                  <li><Typography variant="body1" sx={{ mb: 1 }}>Cancel or skip anytime</Typography></li>
                </ul>
                :
                <ul style={{ paddingLeft: '20px' }}>
                <li><Typography variant="body1" sx={{ mb: 1 }}>Personalised care tips tailored to your plants</Typography></li>
                <li><Typography variant="body1" sx={{ mb: 1 }}>Free pots and supplements when your plants need them</Typography></li>
                <li><Typography variant="body1" sx={{ mb: 1 }}>Exclusive subscriber discounts</Typography></li>
                <li><Typography variant="body1" sx={{ mb: 1 }}>Cancel or skip anytime</Typography></li>
              </ul>
                }
              </Box>
              
              <Box sx={{ display: 'flex', mt: 8, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  color={buttonColor}
                  size="large"
                  onClick={handleAddToCart}
                  startIcon={buttonIcon}
                  sx={{ borderRadius: 2, py: 1.5, px: 4, ml: 2, width: '90%' }}
                >
                  {buttonText}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Subscription FAQ Section */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, borderBottom: '2px solid #eee', pb: 2, color: '#2e7d32' }}>
          Frequently Asked Questions
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              How does the subscription work?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
              You'll receive a curated box of plants delivered to your door based on your selected frequency. You can skip, pause, or cancel anytime from your account.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              When will I be billed?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
              Your card will be charged immediately for your first box, and then on the same day each month/quarter based on your subscription plan.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Can I customize my subscription?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
              Yes! After signing up, you can customize your preferences from your account dashboard to ensure each box matches your needs and preferences.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              What if I need to return something?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
              We have a hassle-free 30-day return policy. Contact our customer support and we'll guide you through the return process.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Related Products Section */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, borderBottom: '2px solid #eee', pb: 2, color: '#2e7d32' }}>
          Explore individual plants
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {relatedPlants.map((relatedPlant) => {
            let relatedImages = [];
            try {
              relatedImages = JSON.parse(relatedPlant.images);
            } catch (e) {
              console.error('Failed to parse related plan images:', e);
              relatedImages = [];
            }
            const firstImage = relatedImages[0];

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
      </Box>

      {/* Comment Section */}
      <div className="comment-section">
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '15px',
            marginTop: '30px'  
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Comments
          </Typography>
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
              placeholder="Share your thoughts about this subscription plan..."
            />
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginTop: '10px' 
            }}>
              <Typography variant="body1" sx={{ marginRight: '10px' }}>
                Rate this plan:
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

export default SubscriptionDetails;