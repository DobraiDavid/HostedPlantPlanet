import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getCartItems,
  removeFromCart,
  addToCart,
  getTotalPrice,
} from "../api/api";

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart items and total price when the component mounts
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const items = await getCartItems(userId);
        setCartItems(items);
        const price = await getTotalPrice(userId);
        setTotalPrice(price);
      } catch (err) {
        setError("Hiba történt a kosár betöltése során.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [userId]);

  // Remove an item from the cart
  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Hiba történt az elem eltávolítása során.");
    }
  };

  // Update the quantity of an item
  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await addToCart(userId, itemId, quantity);
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, amount: quantity } : item
        )
      );
    } catch (err) {
      setError("Hiba történt az elem mennyiségének frissítése során.");
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100">
      <Box className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <Typography variant="h4" align="center" color="green" mb={4}>
          Kosár
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Typography variant="body1" align="center">Betöltés...</Typography>
        ) : (
          <div>
            {cartItems.length === 0 ? (
              <Typography variant="h6" align="center">A kosarad üres.</Typography>
            ) : (
              cartItems.map((item) => (
                <Box key={item.id} sx={{ borderBottom: "1px solid #ddd", paddingBottom: 2, marginBottom: 2 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">Ár: {item.price} Ft</Typography>
                  <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                      sx={{ marginRight: 2 }}
                    >
                      Eltávolítás
                    </Button>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleUpdateQuantity(item.id, item.amount - 1)}
                        disabled={item.amount <= 1}
                      >
                        -
                      </Button>
                      <Typography variant="body1" sx={{ margin: "0 8px" }}>
                        Mennyiség: {item.amount}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleUpdateQuantity(item.id, item.amount + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </Box>
              ))
            )}

            {cartItems.length > 0 && (
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" align="right" sx={{ marginBottom: 2 }}>
                  Összesen: {totalPrice} Ft
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={handleCheckout}
                  sx={{ padding: "12px", fontSize: "16px" }}
                >
                  Fizetés
                </Button>
              </Box>
            )}
          </div>
        )}
      </Box>
    </Box>
  );
};

export default Cart;
