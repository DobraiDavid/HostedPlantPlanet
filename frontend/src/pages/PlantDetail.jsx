import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addToCart, getPlantDetails, getRandomPlants } from '../api/api'; 
import { Button, TextField, Snackbar, CircularProgress, Alert, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material'; 
import { useUser } from "../context/UserContext";  
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';  // Importing a carousel library

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

const PlantDetail = () => {
  const { id } = useParams(); 
  const [plant, setPlant] = useState(null);
  const [relatedPlants, setRelatedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser(); 

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const data = await getPlantDetails(id);  
        setPlant(data);

        // Fetch random plants (excluding the current one)
        const relatedData = await getRandomPlants(3, id); 
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
    if (!user) {
      navigate('/login');
      setError("You need to be logged in to add to cart");
      return;
    }

    try {
      await addToCart(user.id, plant.id, amount);
      setOpenSnackbar(true); 
    } catch (error) {
      setError('Failed to add item to cart');
    }
  };

  if (loading) return <div className="loading"><CircularProgress /></div>;
  if (error) return <div className="error"><Alert severity="error">{error}</Alert></div>;

  return (
    <div className="container">
      <div className="product-container">
        <div className="product-image">
          {/* Carousel */}
          <Carousel 
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={5000}
          >
            {JSON.parse(plant.images).map((image, index) => (
              <div key={index}>
                <img 
                  src={image} 
                  alt={`${plant.name} image ${index + 1}`} 
                  className="carousel-image" 
                  style={{ width: '730px', height: 'auto' }}
                />
              </div>
            ))}
          </Carousel>
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
              onChange={(e) => setAmount(Math.min(20, Math.max(1, Number(e.target.value))))}  // Limit the amount to 20
              inputProps={{ min: 1, max: 20 }} // Max value set to 20
            />
          </div>

          {/* Space between the amount and button */}
          <div style={{ marginTop: '10px' }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="plant-care-tips">
        <h2 className="section-title">{plant.name} Care Guide</h2>
        <p>Light: {plant.light}</p>
        <p>Water: {plant.water}</p>
        <p>Humidity: {plant.humidity}</p>
        <p>Temperature: {plant.temperature}</p>
        <p>Fertilizing: {plant.fertilizing}</p>
        <p>Re-potting: {plant.rePotting}</p>
        <p>Cleaning: {plant.cleaning}</p>
        <p>Propagation: {plant.propagation}</p>
      </div>

      {/* Related Products Section */}
      <div className="related-products">
        <h2 className="section-title">You May Also Like</h2>
        <Grid container spacing={4} justifyContent="center">
          {relatedPlants.map((relatedPlant) => {
            const images = JSON.parse(relatedPlant.images);
            const firstImage = images[0];

            return (
              <Grid item xs={12} sm={6} md={4} key={relatedPlant.id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: 5,
                    transition: '0.3s',
                    '&:hover': { boxShadow: 8, transform: 'scale(1.02)' },
                    backgroundColor: '#ffffff',
                    height: '100%'  // Ensure the Card takes up full height within the grid cell
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={firstImage}
                    alt={relatedPlant.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1, // Ensures that the content area takes up available space
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#2e7d32' }}>
                      {relatedPlant.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        mt: 1,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 5,
                        textOverflow: 'ellipsis',
                        lineHeight: '1.5',
                        maxHeight: '7.5em',
                      }}
                    >
                      {relatedPlant.description}
                    </Typography>
                    <Typography variant="h6" color="green" sx={{ mt: 2, fontWeight: 'bold' }}>
                      ${relatedPlant.price.toFixed(2)}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/plant/${relatedPlant.id}`}
                      variant="contained"
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        backgroundColor: '#4caf50',
                        '&:hover': { backgroundColor: '#388e3c' },
                      }}
                    >
                      🌱 Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
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
