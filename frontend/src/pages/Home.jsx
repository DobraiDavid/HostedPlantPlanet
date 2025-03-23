import React, { useEffect, useState } from 'react';
import { getPlants } from '../api/api.js';  
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, CircularProgress, Alert, Grid, Button, Container, Box } from '@mui/material';

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getPlants(); 
        setPlants(data);
      } catch (error) {
        console.error('Hiba történt a növények lekérésekor.', error);
        setError('Hiba történt a növények betöltésekor.');
      } finally {
        setLoading(false);  
      }
    };

    fetchPlants();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f5f5f5', borderRadius: 3, boxShadow: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'green', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
        🌿 Növények 🌿
      </Typography>
      
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Grid container spacing={4} justifyContent="center">
          {plants.map((plant) => (
            <Grid item xs={12} sm={6} md={4} key={plant.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 5, transition: '0.3s', '&:hover': { boxShadow: 8, transform: 'scale(1.02)' }, backgroundColor: '#ffffff' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={plant.imageUrl}
                  alt={plant.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#2e7d32' }}>{plant.name}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1, flexGrow: 1 }}>{plant.description}</Typography>
                  <Typography variant="h6" color="green" sx={{ mt: 2, fontWeight: 'bold' }}>${plant.price.toFixed(2)}</Typography>
                  <Button
                    component={Link}
                    to={`/plant/${plant.id}`}
                    variant="contained"
                    sx={{ mt: 2, borderRadius: 2, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
                  >
                    🌱 Részletek
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;