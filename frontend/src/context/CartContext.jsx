import React, { createContext, useContext, useState, useEffect } from "react";
import { getCartItems, addToCart, removeFromCart, getTotalPrice } from "../api/api";
import { useUser } from "../context/UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { user } = useUser() || {};

  // Function to refresh cart data
  const refreshCart = async () => {
    if (!user || !user.id) {
      setCart([]);
      return;
    }

    try {
      const items = await getCartItems(user.id);
      setCart(items || []);
      
      const price = await getTotalPrice(user.id);
      setTotalPrice(price || 0);
    } catch (error) {
      console.error("Error occurred while loading cart data", error);
      setCart([]);
    }
  };

  // Initial load and when user changes
  useEffect(() => {
    refreshCart();
  }, [user]);

  // Add item to cart
  const addItem = async (product, quantity = 1) => {
    if (!user || !user.id) {
      alert("Please log in to add items to cart");
      return;
    }
    
    try {
      await addToCart(user.id, product.id, quantity);
      // Manually update cart immediately for better UX
      setCart(prevCart => [...prevCart, { ...product, quantity }]);
      // Then refresh from server
      refreshCart();
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Error occurred while adding the product to the cart.");
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    if (!user || !user.id) return;
    
    try {
      await removeFromCart(itemId);
      // Manually update cart immediately
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
      // Then refresh from server
      refreshCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Error occurred while removing the product from the cart.");
    }
  };

// Clear cart
const clearCart = async () => {
  if (!user || !user.id) {
    setCart([]);
    setTotalPrice(0);
    return;
  }

  try {
    // Remove each item in the cart
    for (const item of cart) {
      await removeFromCart(item.id);
    }
    
    // Reset local state
    setCart([]);
    setTotalPrice(0);
  } catch (error) {
    console.error("Error clearing cart:", error);
    alert("Failed to clear cart. Please try again.");
  }
};

  const contextValue = {
    cart, 
    addItem, 
    removeItem, 
    totalPrice, 
    refreshCart,
    clearCart,
    cartCount: Array.isArray(cart) ? cart.length : 0
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);