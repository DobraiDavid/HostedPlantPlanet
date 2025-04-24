import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  addToCart, 
  getPlantDetails, 
  getRandomPlants, 
  getComments,  
  postComment,
  getPots,
  getCartItems,
  getProductById
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
  Chip,
  IconButton,
  Container
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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useUser } from "../context/UserContext";  
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';  
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
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
  const [relatedPlantsInCart, setRelatedPlantsInCart] = useState({});
  const [inCart, setInCart] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser(); 
  const [pots, setPots] = useState([]);
  const [selectedPot, setSelectedPot] = useState(null);
  const [potsLoading, setPotsLoading] = useState(false);


  // Update inCart status when selectedPot changes
  useEffect(() => {
    if (user && plant) {
      const checkCartStatus = async () => {
        try {
          const cartItems = await getCartItems(user.id);
          // Check if this specific plant and pot combination exists in the cart
          const plantInCart = cartItems.some(item => 
            item.plant.id === plant.id && 
            (selectedPot ? item.pot?.id === selectedPot : !item.pot)
          );
          setInCart(plantInCart);
        } catch (err) {
          console.error("Error checking cart status:", err);
        }
      };
      checkCartStatus();
    }
  }, [selectedPot, user, plant]);

  // Generate button props based on current state
  const getButtonProps = () => {
    if (!plant || !selectedPot) {
      return {
        text: "Select Options",
        icon: <ShoppingCartOutlinedIcon />,
        color: "#cccccc",
        hoverColor: "#cccccc",
        disabled: true
      };
    }

    if (inCart) {
      return {
        text: "Already in Cart",
        icon: <ShoppingCartCheckoutIcon />,
        color: "#1976d2",
        hoverColor: "#1565c0",
        disabled: false
      };
    } else {
      return {
        text: "Add to Cart",
        icon: <ShoppingCartOutlinedIcon />,
        color: "#2e7d32",
        hoverColor: "#1b5e20",
        disabled: false
      };
    }
  };

  const buttonProps = getButtonProps();

  useEffect(() => {
    if (user && relatedPlants.length > 0) {
      const checkRelatedPlantsCartStatus = async () => {
        try {
          const cartItems = await getCartItems(user.id);
          const inCartStatus = {};
          
          relatedPlants.forEach(relatedPlant => {
            // For each related plant, check if it's in the cart
            const isInCart = cartItems.some(item => item.plant.id === relatedPlant.id);
            inCartStatus[relatedPlant.id] = isInCart;
          });
          
          setRelatedPlantsInCart(inCartStatus);
        } catch (err) {
          console.error("Error checking related plants cart status:", err);
        }
      };
      
      checkRelatedPlantsCartStatus();
    }
  }, [user, relatedPlants]);


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

  // UseEffect to fetch pots
  useEffect(() => {
    const fetchPots = async () => {
      try {
        setPotsLoading(true);
        const potsData = await getPots();
        setPots(potsData);
        if (potsData.length > 0) {
          setSelectedPot(potsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching pots:', error);
        toast.error("Failed to load pot options");
      } finally {
        setPotsLoading(false);
      }
    };

    fetchPots();
  }, []);

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

    if (inCart) {
      navigate('/cart/view');
      return;
    }

    try {
      await addToCart(
        user.id,       
        plant.id,      
        amount,        
        null,          
        false,         
        selectedPot    
      );
      setInCart(true);
      toast.success("Item added to cart!");
    } catch (error) {
      console.log(error);
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

    if (relatedPlantsInCart[plant.id]) {
      navigate('/cart/view');
      return;
    }
  
    try {
      await addToCart(
        user.id,       // userId
        plant.id,      // itemId
        1,             // amount (default 1 for related plants)
        null,          // cartItemId
        false,         // isSubscription
        selectedPot    // potId (use the selected pot if any)
      );

      setRelatedPlantsInCart(prev => ({
        ...prev,
        [plant.id]: true
      }));

      toast.success("Item added to cart!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item to cart");
    }
  };

  const getRelatedButtonProps = (plantId) => {
    const isInCart = relatedPlantsInCart[plantId];
    
    if (isInCart) {
      return {
        text: "View in Cart",
        icon: <ShoppingCartCheckoutIcon />,
        color: "#1976d2",
        hoverColor: "#1565c0"
      };
    } else {
      return {
        text: "Add to Cart",
        icon: <ShoppingCartOutlinedIcon />,
        color: "#388e3c",
        hoverColor: "#2e7d32"
      };
    }
  };

  // Increment amount
  const incrementAmount = () => {
    if (amount < 20) {
      setAmount(prevAmount => prevAmount + 1);
    }
  };

  // Decrement amount
  const decrementAmount = () => {
    if (amount > 1) {
      setAmount(prevAmount => prevAmount - 1);
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
      const profilePicture = user.profileImage;
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

  // Render the pot selection component with images
  const renderPotSelection = () => {
    if (potsLoading) {
      return <CircularProgress size={24} />;
    }

    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
          Select a pot (optional):
        </Typography>
        
        <Grid container spacing={2}>
          {pots.map((pot) => (
            <Grid item xs={6} sm={3} key={pot.id}>
              <Paper 
                elevation={selectedPot === pot.id ? 8 : 1}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: selectedPot === pot.id ? '2px solid #2e7d32' : '1px solid #e0e0e0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%'
                }}
                onClick={() => setSelectedPot(pot.id === selectedPot ? null : pot.id)}
              >
                <img 
                  src={pot.image} 
                  alt={pot.name}
                  style={{ 
                    width: '100%', 
                    height: '80px', 
                    objectFit: 'contain',
                    marginBottom: '8px'
                  }}
                />
                <Typography variant="body2" align="center" sx={{ fontWeight: 'medium' }}>
                  {pot.name}
                </Typography>
                <Typography variant="body2" color="primary" align="center" sx={{ fontWeight: 'bold' }}>
                  ${pot.price.toFixed(2)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Improved amount selector
  const renderAmountSelector = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 'medium' }}>
          Quantity:
        </Typography>
        <Paper 
          elevation={2} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <IconButton 
            onClick={decrementAmount} 
            disabled={amount <= 1}
            sx={{ borderRadius: 0 }}
          >
            <RemoveIcon />
          </IconButton>
          
          <Box 
            sx={{ 
              width: '50px', 
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              py: 1
            }}
          >
            {amount}
          </Box>
          
          <IconButton 
            onClick={incrementAmount} 
            disabled={amount >= 20}
            sx={{ borderRadius: 0 }}
          >
            <AddIcon />
          </IconButton>
        </Paper>
      </Box>
    );
  };

  if (loading) return <Box className="loading" sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Box className="error" sx={{ p: 2 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Container maxWidth="xl">
      <ToastContainer autoClose={1000}/>
      {isMobile ? (
      // MOBILE VIEW (Stacked layout)
      <>
        <Box sx={{
          '& .thumb.selected': {
            border: '2px solid #2e7d32',
            borderRadius: '4px'
          },
          '& .thumb:hover:not(.selected)': {
            border: '1px solid #2e7d32',
            opacity: 0.8
          }
        }}>
        <Box sx={{ mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#2e7d32', textAlign:'center' }}>
              {plant.name}
            </Typography>
          </Box>
          <Carousel 
            showThumbs={true} 
            showStatus={false} 
            infiniteLoop 
            autoPlay 
            interval={5000}
            thumbWidth={60}
            renderArrowPrev={(onClickHandler, hasPrev, label) => (
              <button
                onClick={onClickHandler}
                title={label}
                style={{
                  position: 'absolute',
                  left: 15,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  fontSize: 24,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ‹
              </button>
            )}
            renderArrowNext={(onClickHandler, hasNext, label) => (
              <button
                onClick={onClickHandler}
                title={label}
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  fontSize: 24,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ›
              </button>
            )}
            renderThumbs={(children) => 
              children.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  height:'60px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  padding: 0,
                  margin: 0,
                  overflow: 'hidden',
                  border:0,
                  borderRadius: '4px'
                }}>
                  {item}
                </div>
              ))
            }
          >
            {JSON.parse(plant.images).map((image, index) => (
              <Box key={index} sx={{
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <img
                  src={image}
                  alt={`${plant.name} image ${index + 1}`}
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            ))}
          </Carousel>
        </Box>

        <Box className="product-details" sx={{ mb: 4 }}>

          <Typography variant="body1" sx={{ mb: 2 }}>{plant.description}</Typography>

          <Box className="price-stock" sx={{ mb: 2 }}>
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
          </Box>

          {renderAmountSelector()}
          {renderPotSelection()}

          <Button 
            variant="contained" 
            size="large" 
            sx={{ 
              mt: 2, 
              width: '100%', 
              py: 1.5, 
              borderRadius: 2,
              backgroundColor: buttonProps.color,
              "&:hover": {
                backgroundColor: buttonProps.hoverColor,
              }
            }} 
            onClick={handleAddToCart} 
            startIcon={buttonProps.icon}
            disabled={buttonProps.disabled}
          >
            {buttonProps.text}
          </Button>
        </Box>
      </>
    ) : (
      // PC VIEW (Side-by-side layout)
      <Box 
      sx={{ 
        display: "flex", 
        gap: "32px", 
        mb: 6,
        alignItems: "flex-start"
      }}
      >
      {/* Image section - 45% width */}
      <Box sx={{ width:'45%',
          '& .thumb.selected': {
          border: '2px solid #2e7d32',
          borderRadius: '5px'
        },
        '& .thumb:hover:not(.selected)': {
          border: '1px solid #2e7d32',
          opacity: 0.8
        }}} >
        <Carousel
          showThumbs={true}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={5000}
          thumbWidth={80}
          renderThumbs={(children) => 
            children.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                height:'80px',
                justifyContent: 'center',
                alignItems: 'center',
                width: '80px',
                padding: 0,
                margin: 0,
                overflow: 'hidden',
                border:0,
                borderRadius: '4px'
              }}>
                {item}
              </div>
            ))
          }
          renderArrowPrev={(onClickHandler, hasPrev, label) => (
            <button
              onClick={onClickHandler}
              title={label}
              style={{
                position: 'absolute',
                left: 15,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ‹
            </button>
          )}
          renderArrowNext={(onClickHandler, hasNext, label) => (
            <button
              onClick={onClickHandler}
              title={label}
              style={{
                position: 'absolute',
                right: 15,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ›
            </button>
          )}
        >
          {JSON.parse(plant.images).map((img, i) => (
            <div key={i}>
              <img
                src={img}
                alt={`${plant.name} image ${i + 1}`}
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '12px',
                  objectFit: 'cover',
                  maxHeight: '620px'
                }}
              />
            </div>
          ))}
        </Carousel>
      </Box>

      {/* Details section - 55% width */}
      <Box sx={{ width: '55%', pl: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#2e7d32' }}>
            {plant.name}
          </Typography>
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 2 }}>
          ${plant.price}
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
        
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
          {plant.description}
        </Typography>

        {renderAmountSelector()}
        {renderPotSelection()}

        <Button
          variant="contained"
          size="large"
          onClick={handleAddToCart}
          startIcon={buttonProps.icon}
          sx={{ 
            backgroundColor: buttonProps.color,
            "&:hover": {
              backgroundColor: buttonProps.hoverColor,
            },
            boxShadow: 1,
            borderRadius: 2, 
            py: 1.5, 
            px: 4, 
            width: '100%', 
            mt: 3, 
            mb: 2 
          }}
          disabled={buttonProps.disabled}
        >
          {buttonProps.text}
        </Button>
      </Box>
      </Box>
      )}

      {/* Care Guide Section */}
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
      <Box sx={{ mt: 8, mb: 8 }}>
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
                          startIcon={getRelatedButtonProps(relatedPlant.id).icon}
                          sx={{
                            borderRadius: 2,
                            backgroundColor: getRelatedButtonProps(relatedPlant.id).color,
                            '&:hover': {
                              backgroundColor: getRelatedButtonProps(relatedPlant.id).hoverColor,
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
                          {getRelatedButtonProps(relatedPlant.id).text}
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
      <Box sx={{ mt: 6, mb: 8 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            mt: 3  
          }}
        >
          <Typography variant="h4" fontWeight="bold">Comments</Typography>
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
        </Box>
  
      {/* Comment Form first if showCommentForm is true */}
      {showCommentForm && (
        <Box sx={{ mb: 4, p: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
          <TextField
            label="Comment Title"
            variant="outlined"
            fullWidth
            value={commentTitle}
            onChange={(e) => setCommentTitle(e.target.value)}
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
            placeholder="Share your thoughts about this plant..."
          />
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3 
          }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Rate this plant:
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(Math.floor(newValue));
              }}
              precision={1} 
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
          </Box>
        </Box>
      )}

      {/* Comments display */}
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <Paper 
            key={index} 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 2, 
              display: 'flex', 
              alignItems: 'flex-start',
              backgroundColor: '#f5f5f5',
              borderRadius: 2
            }}
          >
            {/* Profile Picture */}
            <Avatar 
              src={comment.profilePicture} 
              alt={`${comment.username}'s profile`}
              sx={{ 
                width: 56, 
                height: 56, 
                mr: 2,
                border: '2px solid #2e7d32'
              }}
            />
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1
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
              
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
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
          <Box 
            sx={{ 
              textAlign: 'center', 
              p: 4,
              backgroundColor: '#f5f5f5',
              borderRadius: 2
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No comments yet. Be the first to share your thoughts!
            </Typography>
          </Box>
        )
      )}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default PlantDetail;