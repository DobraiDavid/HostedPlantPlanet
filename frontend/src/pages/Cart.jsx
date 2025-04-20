import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';  
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  getCartItems,
  removeFromCart,
  addToCart,
  updateCartItem,
  getTotalPrice,
} from "../api/api";

const Cart = () => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Watch for user change, which includes login and logout events
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setTotalPrice(0);
      setLoading(false);
      return;
    }

    const fetchCartData = async () => {
      try {
        setLoading(true);
        const items = await getCartItems(user.id);

        if (!items) {
          setCartItems([]);
        } else {
          setCartItems(items);
        }

        if (items && items.length > 0) {
          const price = await getTotalPrice(user.id);
          setTotalPrice(price);
        } else {
          setTotalPrice(0);
        }
      } catch (err) {
        setError("An error occurred while loading the cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [user]);

  // Remove a single item from the cart
  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);

      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);

      const newTotalPrice = updatedCartItems.length > 0
        ? await getTotalPrice(user.id)
        : 0;

      setTotalPrice(newTotalPrice);
    } catch (err) {
      setError("An error occurred while removing the item.");
    }
  };

  // Remove all items from the cart
  const handleRemoveAllItems = async () => {
    try {
      for (const item of cartItems) {
        await removeFromCart(item.id);
      }
      setCartItems([]);
      setTotalPrice(0);
    } catch (err) {
      setError("An error occurred while removing all items.");
    }
  };

  // Update the quantity of an item
  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      await updateCartItem(user.id, itemId, quantity);

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, amount: quantity } : item
        )
      );

      const updatedPrice = await getTotalPrice(user.id);
      setTotalPrice(updatedPrice);
    } catch (err) {
      setError("An error occurred while updating the item quantity.");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
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
          maxWidth: "600px",
        }}
      >
        <Typography variant="h4" align="center" mb={4}>
          Cart
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Typography variant="body1" align="center">Loading...</Typography>
        ) : (
          <div>
            {cartItems.length === 0 ? (
              <Typography variant="h6" align="center">Cart is empty.</Typography>
            ) : (
              cartItems.map((item) => (
                <Box key={item.id} sx={{ borderBottom: "1px solid #ddd", paddingBottom: 2, marginBottom: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%"  }}>
                      <img
                        src={JSON.parse(item.plant.images)}
                        alt={item.plant.name}
                        style={{ width: 80, height: 80, objectFit: "cover", marginRight: 16 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{item.plant.name}</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "right" }}>
                        ${item.price}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                    {/* Quantity */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleUpdateQuantity(item.id, item.amount - 1)}
                        disabled={item.amount <= 1}
                      >
                        -
                      </Button>
                      <Typography variant="body1" sx={{ margin: "0 8px" }}>
                        Quantity: {item.amount}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => {
                          if (item.amount < 20) handleUpdateQuantity(item.id, item.amount + 1);
                        }}
                        disabled={item.amount >= 20}
                      >
                        +
                      </Button>
                    </Box>

                    {/* Remove Button */}
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#ffecec',
                          borderColor: '#f44336',
                        },
                      }}
                      startIcon={<DeleteIcon />}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))
            )}

            {cartItems.length > 0 && (
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" align="right" sx={{ marginBottom: 2, fontWeight: "bold"}}>
                  Total: ${totalPrice}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={handleCheckout}
                  sx={{ padding: "12px", fontSize: "16px" }}
                  startIcon={<ShoppingCartCheckoutIcon />}
                >
                  Checkout
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleRemoveAllItems}
                  sx={{ 
                    padding: "12px", 
                    fontSize: "16px", 
                    mt: 2, '&:hover': {
                            backgroundColor: '#ffecec',
                            borderColor: '#f44336',
                          }, 
                        }}
                  startIcon={<RemoveShoppingCartIcon />}
                >
                  Remove All Items
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/")}
                  sx={{ 
                    padding: "12px", 
                    fontSize: "16px", 
                    mt: 2,
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      borderColor: '#2196f3',
                    }
                  }}
                  startIcon={<ArrowBackIcon />} 
                >
                  Continue shopping
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
