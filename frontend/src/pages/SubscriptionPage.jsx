import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getSubscriptions, addToCart, getCartItems, getUserSubscriptions } from "../api/api.js";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Fade,
  Divider
} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useUser } from "../context/UserContext";
import { ToastContainer, toast } from 'react-toastify';


const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSubscriptions();
        setPlans(data);
        
        if (user) {
          // Fetch cart items
          try {
            const cartData = await getCartItems(user.id);
            setCartItems(cartData);
          } catch (err) {
            console.error("Error loading cart items:", err);
          }
          
          // Fetch user subscriptions
          try {
            const subscriptionsData = await getUserSubscriptions();
            setUserSubscriptions(subscriptionsData);
          } catch (err) {
            console.error("Error loading user subscriptions:", err);
          }
        }
      } catch (err) {
        console.error("Error loading subscriptions:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const isPlanInCart = (planId) => {
    return cartItems.some(item => 
      item.subscription && 
      item.subscriptionPlan?.id === planId
    );
  };

  const isUserSubscribed = (planId) => {
    return userSubscriptions.some(sub => 
      sub.plan.id === planId
    );
  };

  const handleAddToCart = async (plan, e) => {
    e.stopPropagation(); // Prevent card click from navigating
    
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
    
    if (isUserSubscribed(plan.id)) {
      // User is already subscribed, redirect to profile
      navigate('/profile');
      return;
    }
    
    if (isPlanInCart(plan.id)) {
      // Plan is already in cart, redirect to cart view
      navigate('/cart/view');
      return;
    }
  
    try {
      // Pass isSubscription=true to indicate this is a subscription, not a plant
      await addToCart(user.id, plan.id, 1, null, true); 
      toast.success("Subscription added to cart!");
      
      // Update cart items after adding
      const updatedCart = await getCartItems(user.id);
      setCartItems(updatedCart);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add subscription to cart");
    }
  };

  const getButtonProps = (plan) => {
    if (isUserSubscribed(plan.id)) {
      return {
        text: "Already Subscribed",
        icon: <CheckCircleOutlineIcon />,
        color: "#388e3c",
        hoverColor: "#2e7d32",
      };
    } else if (isPlanInCart(plan.id)) {
      return {
        text: "Already in Cart",
        icon: <ShoppingCartCheckoutIcon />,
        color: "#1976d2",
        hoverColor: "#1565c0",
      };
    } else {
      return {
        text: "Add to Cart",
        icon: <ShoppingCartOutlinedIcon />,
        color: "#2e7d32",
        hoverColor: "#1b5e20",
      };
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        mt: 12, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        justifyContent: "center",
        height: "60vh"
      }}>
        <CircularProgress size={60} sx={{ color: "#2e7d32" }} />
        <Typography variant="h6" sx={{ mt: 3, color: "#666" }}>
          Loading subscription plans...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <Alert 
          severity="error" 
          sx={{ 
            width: "80%", 
            maxWidth: 600,
            boxShadow: 2,
            borderRadius: 2
          }}
        >
          <Typography variant="subtitle1">
            We couldn't load the subscription plans at the moment.
          </Typography>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outlined" 
            color="error" 
            size="small" 
            sx={{ mt: 1 }}
          >
            Try Again
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 6, pb: 8 }}>
      <ToastContainer autoClose={1000}/>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            background: "linear-gradient(45deg, #2e7d32 30%, #388e3c 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          Choose Your Perfect Plan
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
          Find the subscription that brings beautiful indoor house plants to your space, creating a healthier and more vibrant home environment.
        </Typography>
      </Box>

      <Grid container spacing={10} justifyContent="center">
        {plans.map((plan, index) => {
          const imageArray = JSON.parse(plan.images);
          const isFirstPlan = index === 0;
          const buttonProps = getButtonProps(plan);
          
          return (
            <Grid item xs={12} sm={6} md={5} key={plan.id}>
              <Fade in={true} timeout={500 + index * 200}>
                <Card
                  onClick={() => navigate(`/subscriptions/plans/${plan.id}`)}
                  sx={{
                    height: "900px",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    position: "relative",
                    overflow: "visible",
                    boxShadow: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
                      transform: 'scale(1.02)',
                      cursor: "pointer",
                    },
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Box sx={{ 
                    height: 0, 
                    paddingTop: '130%', 
                    position: 'relative'
                  }}>
                    <CardMedia
                      component="img"
                      image={imageArray[0]}
                      alt={plan.name}
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: "cover",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      p: 3
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{ 
                        color: "#2e7d32",
                        mb: 1
                      }}
                    >
                      {plan.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography
                        variant="h4"
                        sx={{ 
                          fontWeight: "bold", 
                          color: "#388e3c"
                        }}
                      >
                        ${plan.price.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ 
                          ml: 1, 
                          color: "text.secondary",
                          alignSelf: 'flex-end',
                          mb: 0.5
                        }}
                      >
                        {isFirstPlan ? '/ Quarter' : '/ Month'}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        flexGrow: 1,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        WebkitLineClamp: 4,
                        textOverflow: "ellipsis",
                        lineHeight: "1.6",
                      }}
                    >
                      {plan.description}
                    </Typography>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={buttonProps.icon}
                        sx={{
                          py: 1.2,
                          borderRadius: 2,
                          backgroundColor: buttonProps.color,
                          "&:hover": {
                            backgroundColor: buttonProps.hoverColor,
                          },
                          boxShadow: 1,
                        }}
                        onClick={(e) => handleAddToCart(plan, e)}
                      >
                        {buttonProps.text}
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          py: 1.2,
                          borderRadius: 2,
                          color: "#2e7d32",
                          borderColor: "#2e7d32",
                          "&:hover": {
                            backgroundColor: "#f1f8e9",
                            borderColor: "#1b5e20",
                          },
                          minWidth: '44px',
                          width: '44px',
                          flexShrink: 0
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/subscriptions/plans/${plan.id}`);
                        }}
                      >
                        <InfoOutlinedIcon />
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Subscriptions;