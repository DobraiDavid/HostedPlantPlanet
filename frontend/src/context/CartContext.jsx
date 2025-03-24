import React, { createContext, useContext, useState, useEffect } from "react";
import { getCartItems, addToCart, removeFromCart, getTotalPrice } from "../api/api";

// Creating the context for the cart
const CartContext = createContext();

// CartProvider component that wraps the app and provides cart-related state and functions
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const userId = 1; // Set this dynamically based on the logged-in user

  // Fetch cart items from the backend when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCartItems(userId);
        setCart(items);
        const price = await getTotalPrice(userId);
        setTotalPrice(price);
      } catch (error) {
        console.error("Error occurred while loading cart data", error);
      }
    };
    fetchCart();
  }, [userId]); // Rerun when userId changes

  // Add or update an item in the cart
  const addItem = async (product, quantity = 1) => {
    try {
      // Optimistically update the cart UI
      setCart((prevCart) => [
        ...prevCart,
        { ...product, quantity }
      ]);

      // Call the API to add the item to the cart
      const response = await addToCart(userId, product.id, quantity);
      if (!response) {
        throw new Error("Error occurred while adding the product to the cart");
      }
    } catch (error) {
      console.error(error);
      // Rollback cart UI update if API fails
      setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
      alert("Error occurred while adding the product to the cart.");
    }
  };

  // Remove an item from the cart
  const removeItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error occurred while removing the product from the cart", error);
      alert("Error occurred while removing the product from the cart.");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
