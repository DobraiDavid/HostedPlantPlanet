import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, CircularProgress, Alert, InputAdornment } from "@mui/material";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/api.js"; 
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

  useEffect(() => {
    if (cart.length > 0) {
      setLoading(false);
    }
  }, [cart]);

  const handleCheckout = async () => {
    // Validation
    if (!name || !email || !address || !city || !zipcode || !phoneNumber) {
      setError("Please fill in all the required fields.");
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
      orderItems: cart.map(item => ({
        plantName: item.plant.name,
        amount: item.amount,
        price: item.plant.price
      }))
    };

    try {
      setIsSubmitting(true);
      setError(null);

      // Place the order
      const response = await placeOrder(orderData);
      
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

  // Reset error message when user starts typing
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(null);
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
                {cart.map((item) => (
                  <Box key={item.id} display="flex" alignItems="flex-start" gap={2} py={2} borderBottom="1px solid #ccc">
                    <img
                      src={JSON.parse(item.plant.images)}
                      alt={item.plant.name}
                      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                    />
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {item.plant.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Quantity: {item.amount}
                      </Typography>
                    </Box>
                    <Typography fontWeight="bold" color="textPrimary">
                      ${(item.plant.price * item.amount).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
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
                onChange={handleInputChange(setName)}
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
              />

              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={handleInputChange(setEmail)}
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
              />

              <TextField
                label="Address"
                value={address}
                onChange={handleInputChange(setAddress)}
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
                onChange={handleInputChange(setCity)}
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
              />

              <TextField
                label="Zip Code"
                value={zipcode}
                onChange={handleInputChange(setZipcode)}
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
              />

              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={handleInputChange(setPhoneNumber)}
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