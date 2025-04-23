import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Change if needed

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

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

// Add or update an item in the cart (plant or subscription)
export const addToCart = async (userId, itemId, amount, cartItemId, isSubscription = false) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/add`, null, {
      params: {
        userId,
        itemId, // renamed from plantId to be more generic
        amount,
        cartItemId,
        isSubscription, // new flag to differentiate item types
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
export const register = async (name, email, password, profileImage) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/register`, { name, email, password, profileImage });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error; 
    } else {
      throw new Error("Network error or server unreachable");
    }
  }
};

// Logout user
export const logout = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    // If no token, just return
    if (!token) {
      return null;
    }

    // Send logout request
    const response = await axios.post(`${API_BASE_URL}/user/logout`);

    // Remove token and clear authorization header
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Clear user from localStorage
    delete axios.defaults.headers.common['Authorization'];

    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    
    // Even if logout fails, clear local storage and auth header
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Clear user from localStorage
    delete axios.defaults.headers.common['Authorization'];

    return null;
  }
};

// Change user details
export const changeUserDetails = async (userDetails) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(`${API_BASE_URL}/user/change`, userDetails, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return {
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    console.error("Change user details error:", error);
    
    if (error.response) {
      if (error.response.status === 409) {
        throw new Error("This email is already in use");
      }
      throw error.response.data.message || error.response.data || "Update failed";
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("Error setting up the request");
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
export const postComment = async (userId, plantId, title, commentText, rating, profilePicture) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/comments/post`, {
      userId,
      plantId,
      title,
      commentText,
      rating,
      profilePicture
    });
    return response.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};

// Place an order
export const placeOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

// Fetch all subscription plans
export const getSubscriptions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subscriptions/plans`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }
};

// Fetch a subscription plan by ID
export const getSubscriptionById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subscriptions/plans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subscription plan with ID ${id}:`, error);
    throw error;
  }
};


// Subscribe a user to a plan
export const subscribeUser = async (planId, intervalDays) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const subscribeRequest = {
      planId: planId,
      intervalDays: intervalDays
    };

    const response = await axios.post(
      `${API_BASE_URL}/subscriptions/subscribe`, 
      subscribeRequest,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Subscription error:", error);
    
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
};

// Get user's subscriptions
export const getUserSubscriptions = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${API_BASE_URL}/subscriptions/my-subscriptions`);
    return response.data;
  } catch (error) {
    console.error("Get subscriptions error:", error);
    
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
};

// Cancel a subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.delete(`${API_BASE_URL}/subscriptions/cancel/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error("Cancel subscription error:", error);
    
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
};
