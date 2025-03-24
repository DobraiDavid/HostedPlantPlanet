import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, CircularProgress } from "@mui/material";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cart, totalPrice } = useCart();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const [loading, setLoading] = useState(true); // Loading state for cart data

  useEffect(() => {
    if (cart.length > 0) {
      setLoading(false);
    }
  }, [cart]);

  const handleCheckout = async () => {
    if (!name || !address || !city || !zipcode || !phoneNumber) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order", error);
      alert("An error occurred while placing your order.");
    }
  };

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
          maxWidth: "600px",  // Set a max-width to ensure it looks good on larger screens
        }}
      >
        <Typography variant="h4" align="center" color="green" mb={4}>
          Checkout
        </Typography>

        {/* Check if the cart is loading */}
        {loading ? (
          <Box className="flex justify-center py-4">
            <CircularProgress />
          </Box>
        ) : (
          <Box className="checkout-order-summary mb-6">
            <Typography variant="h6" color="textPrimary" mb={2}>Your Order</Typography>
            <Box className="border-t pt-2">
              {cart.map((item) => (
                <Box key={item.id} className="checkout-order-item" py={2} borderBottom="1px solid">
                  <Typography variant="body1" className="checkout-order-item-name">{item.plant.name} (x{item.amount})</Typography>
                  <Typography variant="body1" className="checkout-order-item-price">${(item.price * item.amount).toFixed(2)}</Typography>
                </Box>
              ))}
            </Box>
            <Box className="border-t pt-2 text-right">
              <Typography variant="h6" color="textPrimary" className="checkout-total">Total: ${totalPrice}</Typography>
            </Box>
          </Box>
        )}

        <Box className="checkout-section mb-6">
          <Typography variant="h6" color="textPrimary" mb={2}>Shipping Information</Typography>

          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }} // margin-bottom for spacing between fields
          />

          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }} // margin-bottom for spacing between fields
          />

          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }} // margin-bottom for spacing between fields
          />

          <TextField
            label="Zip Code"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }} // margin-bottom for spacing between fields
          />

          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }} // margin-bottom for spacing between fields
          />

          <FormControl fullWidth className="checkout-input mb-4">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment Method"
              sx={{ mb: 2 }} // margin-bottom for spacing between fields
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
          >
            Place Order
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Checkout;
