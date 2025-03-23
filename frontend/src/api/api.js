import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Change if needed

// Fetch all products
export const getPlants = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/plants`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/plant/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Add item to cart
export const addToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart`, { productId, quantity });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
};

// Get cart items
export const getCartItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

// Remove item from cart
export const removeFromCart = async (itemId) => {
  try {
    await axios.delete(`${API_BASE_URL}/cart/${itemId}`);
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

// User authentication (Example: Login)
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

// User registration
export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/register`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;  // Rethrow error to be caught in the Register component
  }
};
