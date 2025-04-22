import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, CircularProgress, Alert, InputAdornment } from "@mui/material";
import { useCart } from "../context/CartContext";
import { placeOrder, subscribeUser } from "../api/api.js"; 
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PinIcon from "@mui/icons-material/Pin";
import PhoneIcon from "@mui/icons-material/Phone";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import EmailIcon from "@mui/icons-material/Email";

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart(); // Added clearCart

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Validation functions
  const isTextOnly = (value) => /^[a-zA-Z\s]*$/.test(value);
  const isNumberOnly = (value) => /^[0-9]*$/.test(value);
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  useEffect(() => {
    if (cart.length > 0) {
      setLoading(false);
    }
  }, [cart]);

  // Function to get item details based on whether it's a plant or subscription
  const getItemDetails = (item) => {
    if (item.subscription) {
      return {
        name: item.subscriptionPlan.name,
        images: JSON.parse(item.subscriptionPlan.images),
        price: item.price,
        isSubscription: true,
        subscriptionPlanId: item.subscriptionPlan.id // Added to track the plan ID
      };
    } else {
      return {
        name: item.plant.name,
        images: JSON.parse(item.plant.images),
        price: item.plant.price,
        isSubscription: false
      };
    }
  };

  // Function to handle subscription process
  const handleSubscriptions = async (cartItems) => {
    const subscriptionPromises = cartItems
      .filter(item => item.subscription)
      .map(item => {
        const details = getItemDetails(item);
        const planId = details.subscriptionPlanId;
        // Set interval to 90 days for subscription plan with ID 1, otherwise 30 days
        const intervalDays = planId === 1 ? 90 : 30;
        
        return subscribeUser(planId, intervalDays);
      });

    if (subscriptionPromises.length > 0) {
      await Promise.all(subscriptionPromises);
    }
  };

  const handleCheckout = async () => {
    // Enhanced validation
    if (!name || !email || !address || !city || !zipcode || !phoneNumber) {
      setError("Please fill in all the required fields.");
      return;
    }

    if (!isTextOnly(name)) {
      setError("Name can only contain letters and spaces.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isTextOnly(city)) {
      setError("City can only contain letters and spaces.");
      return;
    }

    if (!isNumberOnly(zipcode)) {
      setError("Zip code can only contain numbers.");
      return;
    }

    if (!isNumberOnly(phoneNumber)) {
      setError("Phone number can only contain numbers.");
      return;
    }

    // Prepare order data
    const orderData = {
      name,
      email,
      address,
      city,
      zipcode,
      phoneNumber,
      paymentMethod,
      totalPrice,
      orderDate: new Date().toISOString(),
      orderItems: cart.map(item => {
        const details = getItemDetails(item);
        
        // Adjust the structure for both plant and subscription items
        return {
          itemName: details.name,
          amount: item.amount,
          price: details.isSubscription ? item.price : details.price,
          isSubscription: details.isSubscription,
          plantName: details.name
        };
      })
    };

    try {
      setIsSubmitting(true);
      setError(null);

      // Place the order
      const response = await placeOrder(orderData);
      
      // Handle subscriptions for subscription items in the cart
      await handleSubscriptions(cart);
      
      // Clear cart and show success message
      await clearCart();
      setSuccess(true);
      
    } catch (error) {
      console.error("Error placing order", error);
      setError(error.response?.data?.message || "An error occurred while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced input change handlers with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (isTextOnly(value) || value === "") {
      setName(value);
      if (error) setError(null);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (error) setError(null);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    if (isTextOnly(value) || value === "") {
      setCity(value);
      if (error) setError(null);
    }
  };

  const handleZipcodeChange = (e) => {
    const value = e.target.value;
    if (isNumberOnly(value) || value === "") {
      setZipcode(value);
      if (error) setError(null);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (isNumberOnly(value) || value === "") {
      setPhoneNumber(value);
      if (error) setError(null);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f4f4f4",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: 3,
            padding: 4,
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <Typography variant="h4" align="center" color="green" mb={4}>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" align="center" mb={3}>
            Thank you for your order. We'll process it shortly.
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="success"
              href="/"
              sx={{
                textTransform: "none",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: 2,
                transition: "all 0.3s ease",
                '&:hover': {
                  backgroundColor: "#43a047", 
                  boxShadow: 4,
                },
              }}
              startIcon={<HomeIcon />}
            >
              Return to Homepage
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 3,
          borderRadius: 3,
          padding: 4,
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <Typography variant="h4" align="center" mb={4}>
          Checkout
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading state */}
        {loading ? (
          <Box className="flex justify-center py-4">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Order Summary */}
            <Box className="checkout-order-summary mb-6">
              <Typography variant="h6" color="textPrimary" mb={2}>Your Order</Typography>
              <Box className="border-t pt-2">
                {cart.map((item) => {
                  const itemDetails = getItemDetails(item);
                  
                  return (
                    <Box key={item.id} display="flex" alignItems="flex-start" gap={2} py={2} borderBottom="1px solid #ccc">
                      <img
                        src={Array.isArray(itemDetails.images) ? itemDetails.images[0] : itemDetails.images}
                        alt={itemDetails.name}
                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                      />
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {itemDetails.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {itemDetails.isSubscription ? "Subscription" : "Plant"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Quantity: {item.amount}
                        </Typography>
                      </Box>
                      <Typography fontWeight="bold" color="textPrimary">
                        ${(itemDetails.isSubscription ? item.price * item.amount : itemDetails.price * item.amount).toFixed(2)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
              <Box className="border-t pt-2 text-right">
                <Typography variant="h6" color="textPrimary" className="checkout-total" fontWeight="bold">
                  Total: ${totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Shipping Information Form */}
            <Box className="checkout-section mb-6">
              <Typography variant="h6" color="textPrimary" mb={2}>Shipping Information</Typography>

              <TextField
                label="Full Name"
                value={name}
                onChange={handleNameChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                }}
                error={name && !isTextOnly(name)}
                helperText={name && !isTextOnly(name) ? "Name can only contain letters" : ""}
              />

              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                error={email && !isValidEmail(email)}
                helperText={email && !isValidEmail(email) ? "Please enter a valid email address" : ""}
              />

              <TextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="City"
                value={city}
                onChange={handleCityChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon />
                    </InputAdornment>
                  ),
                }}
                error={city && !isTextOnly(city)}
                helperText={city && !isTextOnly(city) ? "City can only contain letters" : ""}
              />

              <TextField
                label="Zip Code"
                value={zipcode}
                onChange={handleZipcodeChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PinIcon />
                    </InputAdornment>
                  ),
                }}
                error={zipcode && !isNumberOnly(zipcode)}
                helperText={zipcode && !isNumberOnly(zipcode) ? "Zip code can only contain numbers" : ""}
              />

              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
                error={phoneNumber && !isNumberOnly(phoneNumber)}
                helperText={phoneNumber && !isNumberOnly(phoneNumber) ? "Phone number can only contain numbers" : ""}
              />

            <FormControl fullWidth className="checkout-input mb-4">
              <InputLabel id="payment-method-label">Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                labelId="payment-method-label"
                label="Payment Method"
                sx={{ mb: 2 }}
                startAdornment={
                  <InputAdornment position="start">
                    <PaymentIcon sx={{ marginRight: 1 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="credit-card">Credit Card</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="bank-transfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>


            <Button
              onClick={handleCheckout}
              variant="contained"
              color="success"
              fullWidth
              className="checkout-button"
              startIcon={<ShoppingCartCheckoutIcon />}
              disabled={isSubmitting}
              sx={{ py: 2, fontSize: "1rem", mt: 2 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Place Order"}
            </Button>

            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Checkout;