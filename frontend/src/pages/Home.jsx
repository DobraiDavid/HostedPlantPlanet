import React, { useEffect, useState, useMemo } from 'react';
import { getPlants } from '../api/api.js';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  CircularProgress, 
  Alert, 
  Grid, 
  Button, 
  Container, 
  Box, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  Slider,
} from '@mui/material';

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  // Filter states
  const [lightLevels, setLightLevels] = useState({
    Low: false,
    Medium: false,
    High: false
  });

  const [waterNeeds, setWaterNeeds] = useState({
    Low: false,
    Medium: false,
    High: false
  });

  // Temperature range state
  const [temperatureRange, setTemperatureRange] = useState([22, 24]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getPlants(); 
        setPlants(data);
      } catch (error) {
        console.error('Error loading plants.', error);
        setError('An error occurred while loading plants.');
      } finally {
        setLoading(false);  
      }
    };

    fetchPlants();
  }, []);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleLightLevelChange = (event) => {
    setLightLevels({
      ...lightLevels,
      [event.target.name]: event.target.checked
    });
  };

  const handleWaterNeedsChange = (event) => {
    setWaterNeeds({
      ...waterNeeds,
      [event.target.name]: event.target.checked
    });
  };

  const handleTemperatureChange = (event, newValue) => {
    setTemperatureRange(newValue);
  };

  const parseTemperature = (tempString) => {
    // Handle different possible temperature string formats
    if (!tempString) return null;

    // Try multiple regex patterns to handle various formats
    const tempPatterns = [
      /(\d+)\s*°C\s*(?:to|-)\s*(\d+)\s*°C/i,  // "18 °C to 24 °C" or "18°C-24°C"
      /(\d+)[-\s]*(?:to)?[-\s]*(\d+)°C/i,     // "18-24°C" or "18 to 24°C"
      /(\d+)°C/i                               // Single temperature like "18°C"
    ];

    for (let pattern of tempPatterns) {
      const match = tempString.match(pattern);
      
      if (match) {
        // If single temperature, use it as both min and max
        if (match.length === 2) {
          const temp = parseInt(match[1]);
          return { min: temp, max: temp };
        }
        
        // If range, parse min and max
        return {
          min: parseInt(match[1]),
          max: parseInt(match[2])
        };
      }
    }

    // If no match, return null
    return null;
  };

  const sortedPlants = useMemo(() => {
    let filtered = [...plants];

    // Sorting logic
    switch (sortBy) {
      case 'priceLowToHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    // Light Levels Filtering
    const selectedLightLevels = Object.keys(lightLevels).filter(level => lightLevels[level]);
    if (selectedLightLevels.length > 0) {
      filtered = filtered.filter(plant => 
        selectedLightLevels.includes(plant.light)
      );
    }

    // Water Needs Filtering
    const selectedWaterNeeds = Object.keys(waterNeeds).filter(need => waterNeeds[need]);
    if (selectedWaterNeeds.length > 0) {
      filtered = filtered.filter(plant => 
        selectedWaterNeeds.includes(plant.water)
      );
    }

    // Temperature Range Filtering
    filtered = filtered.filter(plant => {
      // Parse temperature
      const parsedTemp = parseTemperature(plant.temperature);
      
      // If no temperature data, include the plant
      if (!parsedTemp) return true;

      // Strict filtering: plant's entire temperature range must be within selected range
      return (
        parsedTemp.min <= temperatureRange[0] && 
        parsedTemp.max >= temperatureRange[1]
      );
    });

    return filtered;
  }, [plants, sortBy, lightLevels, waterNeeds, temperatureRange]);

  // Rest of the component remains the same as previous version
  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f5f5f5', borderRadius: 3, boxShadow: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'green', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
        🌿 Plants 🌿
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {/* Left Filter Panel */}
        <Box sx={{ width: '250px', mr: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Filter By</Typography>

          {/* Light Levels Filter */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Light Levels</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={lightLevels.Low}
                  onChange={handleLightLevelChange}
                  name="Low"
                />
              }
              label="Low Light"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={lightLevels.Medium}
                  onChange={handleLightLevelChange}
                  name="Medium"
                />
              }
              label="Medium Light"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={lightLevels.High}
                  onChange={handleLightLevelChange}
                  name="High"
                />
              }
              label="High Light"
            />
          </FormGroup>

          {/* Water Needs Filter */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 3 }}>Water Needs</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={waterNeeds.Low}
                  onChange={handleWaterNeedsChange}
                  name="Low"
                />
              }
              label="Low Water"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={waterNeeds.Medium}
                  onChange={handleWaterNeedsChange}
                  name="Medium"
                />
              }
              label="Medium Water"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={waterNeeds.High}
                  onChange={handleWaterNeedsChange}
                  name="High"
                />
              }
              label="High Water"
            />
          </FormGroup>

          {/* Temperature Range Filter */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 3 }}>Temperature Range (°C)</Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={temperatureRange}
              onChange={handleTemperatureChange}
              valueLabelDisplay="auto"
              min={0}
              max={40}
              step={1}
              marks={[
                { value: 0, label: '0°C' },
                { value: 40, label: '40°C' }
              ]}
            />
            <Typography variant="body2" align="center">
              {temperatureRange[0]}°C - {temperatureRange[1]}°C
            </Typography>
          </Box>
        </Box>

        {/* Right Plant List */}
        <Box sx={{ flex: 1 }}>
          {/* Sorting Dropdown */}
          <select 
            value={sortBy} 
            onChange={handleSortChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginBottom: '20px',
              borderRadius: '4px'
            }}
          >
            <option value="featured">Featured</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="az">A-Z</option>
          </select>

          {/* Plant List */}
          {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && (
            <Grid container spacing={4} justifyContent="center">
              {sortedPlants.map((plant) => {
                const images = JSON.parse(plant.images);
                const firstImage = images[0];

                return (
                  <Grid item xs={12} sm={6} md={4} key={plant.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 5, transition: '0.3s', '&:hover': { boxShadow: 8, transform: 'scale(1.02)' }, backgroundColor: '#ffffff' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={firstImage}
                        alt={plant.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#2e7d32' }}>
                          {plant.name}
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
                            maxHeight: '7.5em'
                          }}
                        >
                          {plant.description}
                        </Typography>

                        {/* This ensures the price and button are always positioned correctly */}
                        <Box sx={{ mt: 'auto', pt: 2, textAlign: 'center' }}>
                          <Typography variant="h6" color="green" sx={{ fontWeight: 'bold', mb: 1 }}>
                            ${plant.price.toFixed(2)}
                          </Typography>
                          <Button
                            component={Link}
                            to={`/plant/${plant.id}`}
                            variant="contained"
                            sx={{ borderRadius: 2, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
                          >
                            🌱 Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;