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

// Fetch cart items for a user
export const getCartItems = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/view`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// Add or update an item in the cart
export const addToCart = async (userId, plantId, amount, cartItemId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/add`, null, {
      params: {
        userId,
        plantId,
        amount,
        cartItemId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding/updating cart item:", error);
    throw error;
  }
};

// Remove an item from the cart
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cart/remove/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

// Get the total price of the user's cart
export const getTotalPrice = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/total`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching total price:", error);
    throw error;
  }
};

// User login
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
    if (error.response) {
      throw error; 
    } else {
      throw new Error("Network error or server unreachable");
    }
  }
};

// Get plant details
export const getPlantDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/plant/${id}`);  
    if (!response.ok) {
      throw new Error('Failed to fetch plant details');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
