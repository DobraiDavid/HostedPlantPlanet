import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addToCart, getPlantDetails } from '../api/api';
import { Button, TextField, Snackbar } from '@mui/material'; // Added Snackbar for feedback
import { useUser } from "../context/UserContext";  // Import useUser from UserContext


const PlantDetail = () => {
  const { id } = useParams(); 
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(1); // Track the amount of plants to add
  const [openSnackbar, setOpenSnackbar] = useState(false); // For Snackbar feedback

  const { userId } = useUser(); // Get userId from context

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const data = await getPlantDetails(id);  
        setPlant(data);
      } catch (error) {
        console.error('Error fetching plant details:', error);
        setError('Failed to load plant details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  const handleAddToCart = async () => {
    if (!userId) {
      console.error("User not logged in");
      setError("You need to be logged in to add to cart");
      return;
    }
    const cartItemId = null; // You may have cartItemId from a previous cart item or null for new items

    try {
      const response = await addToCart(userId, plant.id, amount, cartItemId);
      console.log('Item added to cart:', response);
      setOpenSnackbar(true); // Show success message
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError('Failed to add item to cart');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="product-container">
        {/* Product Image aligned to the left */}
        <div className="product-image">
          <img 
            src={plant.imageUrl} 
            alt={plant.name} 
            className="image"
          />
        </div>

        {/* Product Details aligned to the right */}
        <div className="product-details">
          <h1 className="product-name">{plant.name}</h1>
          <p className="product-description">{plant.description}</p>

          <div className="price-stock">
            <p className="price">${plant.price}</p>
            <p className="stock-status">In stock</p>
          </div>

          {/* MUI Add to Cart Button */}
          <div className="amount-selector">
            {/* Input field to select the amount */}
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              inputProps={{ min: 1 }}
            />
          </div>

          <Button
            variant="contained"
            color="success"
            size="large"
            className="add-to-cart-button"
            onClick={handleAddToCart} // Trigger add to cart
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Plant Care Tips */}
      <div className="plant-care-tips">
        <h2 className="section-title">Plant Care Tips</h2>
        <p className="care-description">
          To keep your {plant.name} thriving, make sure to water it every 2 weeks. It loves indirect sunlight and enjoys a humid environment. 
          Avoid placing it in direct sunlight to prevent leaf burn.
        </p>
      </div>

      {/* Related Products Section */}
      <div className="related-products">
        <h2 className="section-title">You May Also Like</h2>
        <div className="product-list">
          {/* Related product items */}
          <div className="related-product">
            <img 
              src="https://via.placeholder.com/250" 
              alt="Related plant"
              className="related-image"
            />
            <div className="related-product-details">
              <h3 className="related-product-name">Plant Name</h3>
              <p className="related-product-description">Short description of the plant.</p>
              <p className="related-product-price">$20.99</p>
            </div>
          </div>

          <div className="related-product">
            <img 
              src="https://via.placeholder.com/250" 
              alt="Related plant"
              className="related-image"
            />
            <div className="related-product-details">
              <h3 className="related-product-name">Plant Name</h3>
              <p className="related-product-description">Short description of the plant.</p>
              <p className="related-product-price">$18.49</p>
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Item added to cart!"
      />
    </div>
  );
};

export default PlantDetail;
