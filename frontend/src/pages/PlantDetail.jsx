import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addToCart, getPlantDetails, getRandomPlants } from '../api/api'; // Import getRandomPlants function
import { Button, TextField, Snackbar } from '@mui/material'; 
import { useUser } from "../context/UserContext";  
import { Link } from 'react-router-dom'; // Import Link

const PlantDetail = () => {
  const { id } = useParams(); 
  const [plant, setPlant] = useState(null);
  const [relatedPlants, setRelatedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { userId } = useUser(); 

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const data = await getPlantDetails(id);  
        setPlant(data);

        // Fetch random plants (excluding the current one)
        const relatedData = await getRandomPlants(2, id); // Get 2 random plants excluding current
        setRelatedPlants(relatedData);
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
    const cartItemId = null; 

    try {
      await addToCart(userId, plant.id, amount, cartItemId);
      setOpenSnackbar(true); 
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
        <div className="product-image">
          <img src={plant.imageUrl} alt={plant.name} className="image" />
        </div>

        <div className="product-details">
          <h1 className="product-name">{plant.name}</h1>
          <p className="product-description">{plant.description}</p>

          <div className="price-stock">
            <p className="price">${plant.price}</p>
            <p className="stock-status">In stock</p>
          </div>

          <div className="amount-selector">
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
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>

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
          {relatedPlants.map((relatedPlant) => (
            <Link to={`/plant/${relatedPlant.id}`} key={relatedPlant.id} className="related-product-link">
              <div className="related-product">
                <img 
                  src={relatedPlant.imageUrl} 
                  alt={relatedPlant.name}
                  className="related-image"
                />
                <div className="related-product-details">
                  <h3 className="related-product-name">{relatedPlant.name}</h3>
                  <p className="related-product-description">{relatedPlant.description}</p>
                  <p className="related-product-price">${relatedPlant.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>


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
