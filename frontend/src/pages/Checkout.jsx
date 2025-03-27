import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, CircularProgress, Alert } from "@mui/material";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/api.js"; // Adjust the import path as needed

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart(); // Added clearCart

  const [name, setName] = useState("");
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
    if (!name || !address || !city || !zipcode || !phoneNumber) {
      setError("Please fill in all the required fields.");
      return;
    }

    // Prepare order data
    const orderData = {
      name,
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
      
      // Optional: Redirect or show order confirmation
      // history.push('/order-confirmation');
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
          <Typography variant="body1" align="center">
            Thank you for your order. We'll process it shortly.
          </Typography>
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
        <Typography variant="h4" align="center" color="green" mb={4}>
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
                  <Box key={item.id} className="checkout-order-item" py={2} borderBottom="1px solid">
                    <Typography variant="body1" className="checkout-order-item-name">
                      {item.plant.name} (x{item.amount})
                    </Typography>
                    <Typography variant="body1" className="checkout-order-item-price">
                      ${(item.plant.price * item.amount).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box className="border-t pt-2 text-right">
                <Typography variant="h6" color="textPrimary" className="checkout-total">
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
              />

              <TextField
                label="Address"
                value={address}
                onChange={handleInputChange(setAddress)}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />

              <TextField
                label="City"
                value={city}
                onChange={handleInputChange(setCity)}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />

              <TextField
                label="Zip Code"
                value={zipcode}
                onChange={handleInputChange(setZipcode)}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />

              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={handleInputChange(setPhoneNumber)}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />

              <FormControl fullWidth className="checkout-input mb-4">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                  sx={{ mb: 2 }}
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
                disabled={isSubmitting}
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