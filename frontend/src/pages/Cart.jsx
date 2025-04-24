import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Alert, Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';  
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import YardIcon from '@mui/icons-material/Yard';
import {
  getCartItems,
  removeFromCart,
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

  // Load cart items - simplified to ensure it completes
  useEffect(() => {
    const fetchCartData = async () => {
      // Reset loading state at the beginning
      setLoading(true);
      
      if (!user) {
        setCartItems([]);
        setTotalPrice(0);
        setLoading(false);
        return;
      }

      try {
        const items = await getCartItems(user.id);
        
        // Always set cart items array even if empty
        setCartItems(Array.isArray(items) ? items : []);
        
        // Get total price if we have items
        if (Array.isArray(items) && items.length > 0) {
          const price = await getTotalPrice(user.id);
          setTotalPrice(price || 0);
        } else {
          setTotalPrice(0);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
        setError("An error occurred while loading the cart.");
        // Set empty array on error to prevent loading state
        setCartItems([]);
      } finally {
        // Always ensure loading is set to false
        setLoading(false);
      }
    };

    fetchCartData();
  }, [user]);

  // Remove a single item with direct API call
  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      
      // Update local state
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      // If we still have items, update the total price
      if (user && cartItems.length > 1) {
        const newTotalPrice = await getTotalPrice(user.id);
        setTotalPrice(newTotalPrice || 0);
      } else {
        setTotalPrice(0);
      }
    } catch (err) {
      console.error("Remove error:", err);
      setError("An error occurred while removing the item.");
    }
  };

  // Remove all items
  const handleRemoveAllItems = async () => {
    if (!user || !cartItems.length) return;
    
    try {
      // Process each item one by one
      for (const item of cartItems) {
        await removeFromCart(item.id);
      }
      
      // Clear local state
      setCartItems([]);
      setTotalPrice(0);
    } catch (err) {
      console.error("Remove all error:", err);
      setError("An error occurred while removing all items.");
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1 || !user) return;

    try {
      // Update server first
      await updateCartItem(user.id, itemId, quantity);
      
      // Then update local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, amount: quantity } : item
        )
      );
      
      // Get new total from server
      const updatedPrice = await getTotalPrice(user.id);
      setTotalPrice(updatedPrice || 0);
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred while updating the item quantity.");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Safe function to get item details
  const getItemDetails = (item) => {
    try {
      if (item.subscription) {
        return {
          name: item.subscriptionPlan?.name || "Subscription",
          images: parseJsonSafely(item.subscriptionPlan?.images) || [],
          description: item.subscriptionPlan?.description || "",
          type: "subscription"
        };
      } else {
        return {
          plant: item.plant ? {
            name: item.plant?.name || "Plant",
            price: item.plant?.price || 0,
            images: parseJsonSafely(item.plant?.images) || [],
            description: item.plant?.description || "",
            type: "plant"
          } : null,
          pot: item.pot ? {
            name: item.pot?.name || "Pot",
            price: item.pot?.price || 0,
            images: item.pot?.image || "",
            description: "",
            type: "pot"
          } : null,
          type: "cartItem"
        };
      }
    } catch (error) {
      console.error("Error parsing item details:", error);
      return { type: "unknown" };
    }
  };

  // Helper function to safely parse JSON
  const parseJsonSafely = (jsonString) => {
    if (!jsonString) return null;
    if (typeof jsonString !== 'string') return jsonString;
    
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON parse error:", e);
      return jsonString;
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
          maxWidth: "600px",
        }}
      >
        <Typography variant="h4" align="center" mb={4}>
          Cart
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1">Loading your cart...</Typography>
          </Box>
        ) : (
          <div>
            {!cartItems || cartItems.length === 0 ? (
              <Typography variant="h6" align="center">Cart is empty.</Typography>
            ) : (
              cartItems.map((item) => {
                const itemDetails = getItemDetails(item);
                
                return (
                  <Box key={item.id} sx={{ borderBottom: "1px solid #ddd", paddingBottom: 2, marginBottom: 2 }}>
                    {itemDetails.type === "subscription" ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                          <img
                            src={Array.isArray(itemDetails.images) && itemDetails.images.length > 0 
                              ? itemDetails.images[0] 
                              : "https://via.placeholder.com/80"}
                            alt={itemDetails.name}
                            style={{ width: 80, height: 80, objectFit: "cover", marginRight: 16 }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{itemDetails.name}</Typography>
                            <Chip 
                              icon={<CalendarMonthIcon />} 
                              label="Subscription" 
                              color="primary" 
                              size="small" 
                              sx={{ mb: 1 }}
                            />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "right" }}>
                            ${item.price}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Stack spacing={2}>
                        {itemDetails.plant && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <img
                              src={Array.isArray(itemDetails.plant.images) && itemDetails.plant.images.length > 0
                                ? itemDetails.plant.images[0]
                                : "https://via.placeholder.com/80"}
                              alt={itemDetails.plant.name}
                              style={{ width: 80, height: 80, objectFit: "cover", marginRight: 16 }}
                            />
                            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="h6">{itemDetails.plant.name}</Typography>
                                <Chip 
                                  icon={<LocalFloristIcon />} 
                                  label="Plant" 
                                  color="success" 
                                  size="small" 
                                  sx={{ mb: 1 }}
                                />
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                ${itemDetails.plant.price}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        
                        {itemDetails.pot && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <img
                              src={itemDetails.pot.images || "https://via.placeholder.com/80"}
                              alt={itemDetails.pot.name}
                              style={{ width: 80, height: 80, objectFit: "cover", marginRight: 16 }}
                            />
                            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="h6">{itemDetails.pot.name} Pot</Typography>
                                <Chip 
                                  icon={<YardIcon />} 
                                  label="Pot" 
                                  color="secondary" 
                                  size="small" 
                                  sx={{ mb: 1 }}
                                />
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {itemDetails.pot.price === 0 ? 'Free' : `$${itemDetails.pot.price}`}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            ${item.price}
                          </Typography>
                        </Box>
                      </Stack>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                      {itemDetails.type !== "subscription" ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Button
                            variant="outlined"
                            color="primary"
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
                            color="primary"
                            onClick={() => {
                              if (item.amount < 20) handleUpdateQuantity(item.id, item.amount + 1);
                            }}
                            disabled={item.amount >= 20}
                          >
                            +
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Recurring subscription
                        </Typography>
                      )}

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
                );
              })
            )}

            {cartItems && cartItems.length > 0 && (
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
                    mt: 2,
                    '&:hover': {
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