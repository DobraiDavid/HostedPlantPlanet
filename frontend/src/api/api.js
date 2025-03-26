import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Change if needed

// Helper function to get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');  
};

// Set the token in the headers globally for axios
axios.defaults.headers.common['Authorization'] = `${getAuthToken()}`;

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

// Fetch a random plant
export const getRandomPlants = async (count = 3, excludeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/plants`);
    let plants = response.data;

    if (!Array.isArray(plants) || plants.length === 0) {
      throw new Error("No plants available");
    }

    // Ensure excludeId is properly compared (convert to number if needed)
    const filteredPlants = plants.filter((plant) => 
      plant.id !== parseInt(excludeId)
    );

    // Handle case where there aren't enough plants
    if (filteredPlants.length <= count) {
      return filteredPlants; 
    }

    // Use Fisher-Yates (Knuth) shuffle for randomization
    const shuffled = [...filteredPlants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return exactly 'count' number of plants
    return shuffled.slice(0, count);
  } catch (error) {
    console.error("Error fetching random plants:", error);
    return [];
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

// Update a cart item (quantity)
export const updateCartItem = async (userId, itemId, quantity) => {
  try {
    await axios.put(`${API_BASE_URL}/cart/update`, null, {
      params: {
        userId,
        plantId: itemId, 
        amount: quantity,
      },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,  
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
      params: { userId }
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

    if (response.data.token && response.data.user) {
      localStorage.setItem('authToken', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      return response.data;  
    }

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

// Get comments for a specific plant
export const getComments = async (plantId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments/${plantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

// Post a new comment
export const postComment = async (userId, plantId, commentText, rating) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/comments/post`, {
      userId,
      plantId,
      commentText,
      rating
    });
    return response.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};
