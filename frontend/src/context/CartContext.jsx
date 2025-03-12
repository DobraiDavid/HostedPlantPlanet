import { createContext, useContext, useState, useEffect } from "react";
import { getCartItems, addToCart, removeFromCart } from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart items when the app starts
  useEffect(() => {
    const fetchCart = async () => {
      const items = await getCartItems();
      setCart(items);
    };
    fetchCart();
  }, []);

  // Add item to cart
  const addItem = async (product, quantity = 1) => {
    const response = await addToCart(product.id, quantity);
    if (response) {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    await removeFromCart(itemId);
    setCart(cart.filter((item) => item.id !== itemId));
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart context
export const useCart = () => useContext(CartContext);
