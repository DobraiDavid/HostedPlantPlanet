import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlantDetails } from '../api/api';
import { Button } from '@mui/material'; // Import MUI Button

const PlantDetail = () => {
  const { id } = useParams(); 
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <Button
            variant="contained"
            color="success"
            size="large"
            className="add-to-cart-button"
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
    </div>
  );
};

export default PlantDetail;
