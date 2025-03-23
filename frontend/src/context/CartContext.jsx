import { createContext, useContext, useState, useEffect } from "react";
import { getCartItems, addToCart, removeFromCart } from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCartItems();
        setCart(items);
      } catch (error) {
        console.error("Hiba történt a kosár adatainak betöltésekor", error);
      }
    };
    fetchCart();
  }, []);

  const addItem = async (product, quantity = 1) => {
    try {
      setCart((prevCart) => [
        ...prevCart,
        { ...product, quantity }
      ]);

      const response = await addToCart(product.id, quantity);
      if (!response) {
        throw new Error("Hiba történt a termék hozzáadása során");
      }
    } catch (error) {
      console.error(error);
      setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
      alert("Hiba történt a termék hozzáadása során.");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Hiba történt a termék eltávolításakor", error);
      alert("Hiba történt a termék eltávolítása során.");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
