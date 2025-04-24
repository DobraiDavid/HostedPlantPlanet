import React, { useEffect, useState, useMemo } from 'react';
import { getPlants, addToCart, getCartItems } from '../api/api.js';
import { useToast } from '../context/ToastContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useMediaQuery, useTheme } from '@mui/material';
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
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SortIcon from '@mui/icons-material/Sort';
import { useUser } from "../context/UserContext";  
import InputAdornment from '@mui/material/InputAdornment';
import { alpha } from '@mui/material/styles';

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState("");
  const [plantsInCart, setPlantsInCart] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const showToast = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filtersVisible, setFiltersVisible] = useState(!isMobile);
  const { user } = useUser(); 

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
  const [temperatureRange, setTemperatureRange] = useState([0, 40]);

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

  useEffect(() => {
    // Fetch cart items when user changes or on initial load
    const fetchCartItems = async () => {
      if (user) {
        try {
          const cartItems = await getCartItems(user.id);
          // Create a map of plant IDs in cart
          const cartMap = {};
          cartItems.forEach(item => {
            cartMap[item.plantId] = true;
          });
          setPlantsInCart(cartMap);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      } else {
        // Clear cart map when user logs out
        setPlantsInCart({});
      }
    };

    fetchCartItems();
  }, [user]);

  useEffect(() => {
    // Set filters visibility based on screen size
    setFiltersVisible(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (location.state?.toast) {
      const { message, type } = location.state.toast;      
      // Use the destructured showToast from useToast
      showToast(message, type);
  
      const timeoutId = setTimeout(() => {
        navigate(location.pathname, {
          replace: true,
          state: null
        });
      }, 1000);
  
      return () => clearTimeout(timeoutId);
    }
  }, [location, showToast, navigate]);

  const getCartButtonProps = (plantId) => {
    const isInCart = plantsInCart[plantId];
    
    if (isInCart) {
      return {
        text: "View in Cart",
        icon: <ShoppingCartCheckoutIcon />,
        color: "#1976d2",
        hoverColor: "#1565c0",
        action: () => navigate('/cart')
      };
    } else {
      return {
        text: "Add to Cart",
        icon: <ShoppingCartOutlinedIcon />,
        color: "#388e3c",
        hoverColor: "#2e7d32",
        action: (plant) => handleAddToCart(plant)
      };
    }
  };

  const handleAddToCart = async (plant) => {
    if (!user) {
      navigate('/login', {
        state: {
          toast: {
            message: 'You need to log in first!',
            type: 'error',
          },
        },
      });
      return;
    }
  
    try {
      await addToCart(user.id, plant.id, 1); 
      // Update local state to reflect item is now in cart
      setPlantsInCart(prev => ({
        ...prev,
        [plant.id]: true
      }));
      toast.success("Item added to cart!");
    } catch (error) {
      console.log(error)
      toast.error("Failed to add item to cart");
    }
  };

  const handleSortChange = (event) => 
    setSortBy(event.target.value);

  const handleSearchChange = (event) => 
    setSearchQuery(event.target.value.toLowerCase());

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

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
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

    if (searchQuery) {
      filtered = filtered.filter(plant => 
        plant.name.toLowerCase().includes(searchQuery)
      );
    }

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
        parsedTemp.min >= temperatureRange[0] && 
        parsedTemp.max <= temperatureRange[1]
      );
    });

    return filtered;
  }, [plants, searchQuery, sortBy, lightLevels, waterNeeds, temperatureRange]);

  // Get the filter count (active filters)
  const activeFilterCount = 
    Object.values(lightLevels).filter(Boolean).length + 
    Object.values(waterNeeds).filter(Boolean).length + 
    (temperatureRange[0] !== 0 || temperatureRange[1] !== 40 ? 1 : 0);

  // Function to get light level icon color
  const getLightLevelColor = (level) => {
    switch(level) {
      case 'Low': return '#8BC34A';
      case 'Medium': return '#FFC107';
      case 'High': return '#FF9800';
      default: return '#757575';
    }
  };

  // Function to get water needs icon color
  const getWaterNeedsColor = (need) => {
    switch(need) {
      case 'Low': return '#90CAF9';
      case 'Medium': return '#2196F3';
      case 'High': return '#1565C0';
      default: return '#757575';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 0, sm: 2 }, backgroundColor: '#f8f9fa', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', my: 1 }}>
      <ToastContainer autoClose={1500} position="top-right" />
      
      <Box sx={{ 
        textAlign: 'center', 
        mb: 5, 
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '10%',
          top: 0,
          width: '80%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle, rgba(76,175,80,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0
        }
      }}>
        <Typography 
          variant="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#2e7d32', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1,
            fontFamily: "'Montserrat', sans-serif",
            '&::before, &::after': {
              content: '""',
              display: 'inline-block',
              width: { xs: '20px', sm: '30px' },
              height: { xs: '20px', sm: '30px' },
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%234CAF50\'%3E%3Cpath d=\'M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z\'/%3E%3C/svg%3E")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              transform: 'rotate(45deg)',
              margin: { xs: '0 5px', sm: '0 10px' },
              verticalAlign: 'middle',
              opacity: 0.8
            }
          }}
        >
          Plant Planet
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#555', 
            maxWidth: '700px', 
            mx: 'auto',
            position: 'relative',
            zIndex: 1,
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 'normal',
            mb: 3
          }}
        >
          Discover the perfect plants for your space
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 4 }}>
        {/* Filter Section */}
        <Box sx={{ 
          width: isMobile ? '100%' : '280px',
          transition: 'all 0.3s ease',
        }}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: '#ffffff',
              mb: 3,
              transition: 'all 0.3s ease',
              border: '1px solid rgba(76,175,80,0.2)',
            }}
          >
            <TextField
              fullWidth
              label="Search Plants"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#4CAF50',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2e7d32',
                  },
                },
              }} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#4CAF50' }} />
                  </InputAdornment>
                )
              }}
            />

            {/* Mobile filter toggle button */}
            {isMobile && (
              <Button 
                fullWidth
                variant="outlined"
                startIcon={<FilterListIcon />}
                endIcon={activeFilterCount > 0 ? <Chip size="small" label={activeFilterCount} color="primary" /> : null}
                onClick={toggleFilters}
                sx={{ 
                  mb: 2, 
                  borderColor: '#4CAF50',
                  color: '#2e7d32',
                  '&:hover': {
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46,125,50,0.04)',
                  }
                }}
              >
                {filtersVisible ? 'Hide Filters' : 'Show Filters'}
              </Button>
            )}

            {/* Collapsible filter sections */}
            {(filtersVisible || !isMobile) && (
              <Box sx={{ 
                animation: filtersVisible ? 'fadeIn 0.4s ease' : 'none',
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(-10px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: '#2e7d32',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <FilterListIcon /> Filters
                  </Typography>
                  
                  {activeFilterCount > 0 && (
                    <Button 
                      size="small" 
                      variant="text"
                      onClick={() => {
                        setLightLevels({ Low: false, Medium: false, High: false });
                        setWaterNeeds({ Low: false, Medium: false, High: false });
                        setTemperatureRange([0, 40]);
                      }}
                      sx={{ color: '#f44336', fontSize: '0.75rem' }}
                    >
                      Clear All
                    </Button>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Light Levels Filter - Accordion for mobile */}
                {isMobile ? (
                  <Accordion 
                    defaultExpanded 
                    elevation={0}
                    sx={{ 
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px', 
                      mb: 2,
                      '&::before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: 0,
                        mb: 2
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="light-levels-content"
                      id="light-levels-header"
                      sx={{
                        backgroundColor: alpha('#4CAF50', 0.05),
                        borderRadius: '8px',
                        '&.Mui-expanded': {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WbSunnyIcon sx={{ color: '#FFA000' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Light Levels</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 2 }}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={lightLevels.Low}
                              onChange={handleLightLevelChange}
                              name="Low"
                              sx={{ 
                                color: getLightLevelColor('Low'),
                                '&.Mui-checked': {
                                  color: getLightLevelColor('Low'),
                                }
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>Low Light</Typography>
                              <Chip 
                                size="small" 
                                icon={<WbSunnyIcon sx={{ fontSize: '0.85rem !important' }} />} 
                                label="Low" 
                                sx={{ 
                                  backgroundColor: alpha(getLightLevelColor('Low'), 0.1),
                                  color: getLightLevelColor('Low'),
                                  borderColor: getLightLevelColor('Low'),
                                  fontSize: '0.7rem'
                                }}
                                variant="outlined"
                              />
                            </Box>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={lightLevels.Medium}
                              onChange={handleLightLevelChange}
                              name="Medium"
                              sx={{ 
                                color: getLightLevelColor('Medium'),
                                '&.Mui-checked': {
                                  color: getLightLevelColor('Medium'),
                                }
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>Medium Light</Typography>
                              <Chip 
                                size="small" 
                                icon={<WbSunnyIcon sx={{ fontSize: '0.85rem !important' }} />} 
                                label="Medium" 
                                sx={{ 
                                  backgroundColor: alpha(getLightLevelColor('Medium'), 0.1),
                                  color: getLightLevelColor('Medium'),
                                  borderColor: getLightLevelColor('Medium'),
                                  fontSize: '0.7rem'
                                }}
                                variant="outlined"
                              />
                            </Box>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={lightLevels.High}
                              onChange={handleLightLevelChange}
                              name="High"
                              sx={{ 
                                color: getLightLevelColor('High'),
                                '&.Mui-checked': {
                                  color: getLightLevelColor('High'),
                                }
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>High Light</Typography>
                              <Chip 
                                size="small" 
                                icon={<WbSunnyIcon sx={{ fontSize: '0.85rem !important' }} />} 
                                label="High" 
                                sx={{ 
                                  backgroundColor: alpha(getLightLevelColor('High'), 0.1),
                                  color: getLightLevelColor('High'),
                                  borderColor: getLightLevelColor('High'),
                                  fontSize: '0.7rem'
                                }}
                                variant="outlined"
                              />
                            </Box>
                          }
                        />
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                ) : (
                  /* Light Levels Filter - Regular for desktop */
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <WbSunnyIcon sx={{ color: '#FFA000' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>Light Levels</Typography>
                    </Box>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={lightLevels.Low}
                            onChange={handleLightLevelChange}
                            name="Low"
                            sx={{ 
                              color: getLightLevelColor('Low'),
                              '&.Mui-checked': {
                                color: getLightLevelColor('Low'),
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>Low Light</Typography>
                            <Chip 
                              size="small" 
                              icon={<WbSunnyIcon sx={{ fontSize: '0.85rem !important' }} />} 
                              label="Low" 
                              sx={{ 
                                backgroundColor: alpha(getLightLevelColor('Low'), 0.1),
                                color: getLightLevelColor('Low'),
                                borderColor: getLightLevelColor('Low'),
                                fontSize: '0.7rem'
                              }}
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={lightLevels.Medium}
                            onChange={handleLightLevelChange}
                            name="Medium"
                            sx={{ 
                              color: getLightLevelColor('Medium'),
                              '&.Mui-checked': {
                                color: getLightLevelColor('Medium'),
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>Medium Light</Typography>
                            <Chip 
                              size="small" 
                              icon={<WbSunnyIcon sx={{ fontSize: '0.85rem !important' }} />} 
                              label="Medium" 
                              sx={{ 
                                backgroundColor: alpha(getLightLevelColor('Medium'), 0.1),
                                color: getLightLevelColor('Medium'),
                                borderColor: getLightLevelColor('Medium'),
                                fontSize: '0.7rem'
                              }}
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={lightLevels.High}
                            onChange={handleLightLevelChange}
                            name="High"
                            sx={{ 
                              color: getLightLevelColor('High'),
                              '&.Mui-checked': {
                                color: getLightLevelColor('High'),
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>High Light</Typography>
                            <Chip 
                              size="small" 
                              icon={<WbSunnyIcon sx={{ fontSize: '0.85rem !important' }} />} 
                              label="High" 
                              sx={{ 
                                backgroundColor: alpha(getLightLevelColor('High'), 0.1),
                                color: getLightLevelColor('High'),
                                borderColor: getLightLevelColor('High'),
                                fontSize: '0.7rem'
                              }}
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </FormGroup>
                  </Box>
                )}

                {/* Water Needs Filter - Accordion for mobile */}
                {isMobile ? (
                  <Accordion 
                    defaultExpanded
                    elevation={0}
                    sx={{ 
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px', 
                      mb: 2,
                      '&::before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: 0,
                        mb: 2
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="water-needs-content"
                      id="water-needs-header"
                      sx={{
                        backgroundColor: alpha('#2196F3', 0.05),
                        borderRadius: '8px',
                        '&.Mui-expanded': {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <OpacityIcon sx={{ color: '#2196F3' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Water Needs</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 2 }}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={waterNeeds.Low}
                              onChange={handleWaterNeedsChange}
                              name="Low"
                              sx={{ 
                                color: getWaterNeedsColor('Low'),
                                '&.Mui-checked': {
                                  color: getWaterNeedsColor('Low'),
                                }
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>Low Water</Typography>
                              <Chip 
                                size="small" 
                                icon={<OpacityIcon sx={{ fontSize: '0.85rem !important' }} />} 
                                label="Low" 
                                sx={{ 
                                  backgroundColor: alpha(getWaterNeedsColor('Low'), 0.1),
                                  color: getWaterNeedsColor('Low'),
                                  borderColor: getWaterNeedsColor('Low'),
                                  fontSize: '0.7rem'
                                }}
                                variant="outlined"
                              />
                            </Box>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={waterNeeds.Medium}
                              onChange={handleWaterNeedsChange}
                              name="Medium"
                              sx={{ 
                                color: getWaterNeedsColor('Medium'),
                                '&.Mui-checked': {
                                  color: getWaterNeedsColor('Medium'),
                                }
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>Medium Water</Typography>
                              <Chip 
                                size="small" 
                                icon={<OpacityIcon sx={{ fontSize: '0.85rem !important' }} />} 
                                label="Medium" 
                                sx={{ 
                                  backgroundColor: alpha(getWaterNeedsColor('Medium'), 0.1),
                                  color: getWaterNeedsColor('Medium'),
                                  borderColor: getWaterNeedsColor('Medium'),
                                  fontSize: '0.7rem'
                                }}
                                variant="outlined"
                              />
                            </Box>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={waterNeeds.High}
                              onChange={handleWaterNeedsChange}
                              name="High"
                              sx={{ 
                                color: getWaterNeedsColor('High'),
                                '&.Mui-checked': {
                                  color: getWaterNeedsColor('High'),
                                }
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>High Water</Typography>
                              <Chip 
                                size="small" 
                                icon={<OpacityIcon sx={{ fontSize: '0.85rem !important' }} />} 
                                label="High" 
                                sx={{ 
                                  backgroundColor: alpha(getWaterNeedsColor('High'), 0.1),
                                  color: getWaterNeedsColor('High'),
                                  borderColor: getWaterNeedsColor('High'),
                                  fontSize: '0.7rem'
                                }}
                                variant="outlined"
                              />
                            </Box>
                          }
                        />
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                ) : (
                  /* Water Needs Filter - Regular for desktop */
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <OpacityIcon sx={{ color: '#2196F3' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>Water Needs</Typography>
                    </Box>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={waterNeeds.Low}
                            onChange={handleWaterNeedsChange}
                            name="Low"
                            sx={{ 
                              color: getWaterNeedsColor('Low'),
                              '&.Mui-checked': {
                                color: getWaterNeedsColor('Low'),
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>Low Water</Typography>
                            <Chip 
                              size="small" 
                              icon={<OpacityIcon sx={{ fontSize: '0.85rem !important' }} />} 
                              label="Low" 
                              sx={{ 
                                backgroundColor: alpha(getWaterNeedsColor('Low'), 0.1),
                                color: getWaterNeedsColor('Low'),
                                borderColor: getWaterNeedsColor('Low'),
                                fontSize: '0.7rem'
                              }}
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={waterNeeds.Medium}
                            onChange={handleWaterNeedsChange}
                            name="Medium"
                            sx={{ 
                              color: getWaterNeedsColor('Medium'),
                              '&.Mui-checked': {
                                color: getWaterNeedsColor('Medium'),
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>Medium Water</Typography>
                            <Chip 
                              size="small" 
                              icon={<OpacityIcon sx={{ fontSize: '0.85rem !important' }} />} 
                              label="Medium" 
                              sx={{ 
                                backgroundColor: alpha(getWaterNeedsColor('Medium'), 0.1),
                                color: getWaterNeedsColor('Medium'),
                                borderColor: getWaterNeedsColor('Medium'),
                                fontSize: '0.7rem'
                              }}
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={waterNeeds.High}
                            onChange={handleWaterNeedsChange}
                            name="High"
                            sx={{ 
                              color: getWaterNeedsColor('High'),
                              '&.Mui-checked': {
                                color: getWaterNeedsColor('High'),
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>High Water</Typography>
                            <Chip 
                              size="small" 
                              icon={<OpacityIcon sx={{ fontSize: '0.85rem !important' }} />} 
                              label="High" 
                              sx={{ 
                                backgroundColor: alpha(getWaterNeedsColor('High'), 0.1),
                                color: getWaterNeedsColor('High'),
                                borderColor: getWaterNeedsColor('High'),
                                fontSize: '0.7rem'
                              }}
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </FormGroup>
                  </Box>
                )}

                {/* Temperature Range Filter - Accordion for mobile */}
                {isMobile ? (
                  <Accordion 
                    defaultExpanded
                    elevation={0}
                    sx={{ 
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px', 
                      mb: 2,
                      '&::before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: 0,
                        mb: 2
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="temperature-content"
                      id="temperature-header"
                      sx={{
                        backgroundColor: alpha('#FF9800', 0.05),
                        borderRadius: '8px',
                        '&.Mui-expanded': {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ThermostatIcon sx={{ color: '#FF9800' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Temperature Range (°C)</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 2 }}>
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
                            { value: 20, label: '20°C' },
                            { value: 40, label: '40°C' }
                          ]}
                          sx={{
                            color: '#FF9800',
                            '& .MuiSlider-thumb': {
                              '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0px 0px 0px 8px ${alpha('#FF9800', 0.16)}`,
                              },
                              '&.Mui-active': {
                                boxShadow: `0px 0px 0px 14px ${alpha('#FF9800', 0.16)}`,
                              },
                            },
                          }}
                        />
                        <Typography variant="body2" align="center" sx={{ mt: 1, color: '#FF9800', fontWeight: 'bold' }}>
                          {temperatureRange[0]}°C - {temperatureRange[1]}°C
                        </Typography>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ) : (
                  /* Temperature Range Filter - Regular for desktop */
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <ThermostatIcon sx={{ color: '#FF9800' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>Temperature Range (°C)</Typography>
                    </Box>
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
                          { value: 20, label: '20°C' },
                          { value: 40, label: '40°C' }
                        ]}
                        sx={{
                          color: '#FF9800',
                          '& .MuiSlider-thumb': {
                            '&:hover, &.Mui-focusVisible': {
                              boxShadow: `0px 0px 0px 8px ${alpha('#FF9800', 0.16)}`,
                            },
                            '&.Mui-active': {
                              boxShadow: `0px 0px 0px 14px ${alpha('#FF9800', 0.16)}`,
                            },
                          },
                        }}
                      />
                      <Typography variant="body2" align="center" sx={{ mt: 1, color: '#FF9800', fontWeight: 'bold' }}>
                        {temperatureRange[0]}°C - {temperatureRange[1]}°C
                      </Typography>
                    </Box>
                  </Box>
                )}
                </Box>
                )}
                </Paper>

                {!isMobile && (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    {activeFilterCount > 0 && (
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#4CAF50', mt: 1 }}>
                        {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
                      </Typography>
                    )}
                  </Box>
                )}
                </Box>

                {/* Right Plant List */}
                <Box sx={{ flex: 1 }}>
                {/* Sorting Dropdown */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 3,
                  backgroundColor: '#fff',
                  p: 2,
                  borderRadius: 2,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(76,175,80,0.2)',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SortIcon sx={{ color: '#4CAF50', mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333', mr: 2 }}>
                      Sort By:
                    </Typography>
                  </Box>
                  <select 
                    value={sortBy} 
                    onChange={handleSortChange}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '4px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#f9f9f9',
                      minWidth: '160px',
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: 'inherit',
                      color: '#333'
                    }}
                  >
                    <option value="featured">Featured</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                    <option value="az">A-Z</option>
                  </select>
                </Box>

                {/* Results Info */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2,
                  mt: 0
                }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {sortedPlants.length} plants found
                  </Typography>
                  {isMobile && activeFilterCount > 0 && (
                    <Chip 
                      label={`${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''}`} 
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>

                {/* Plant List */}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <CircularProgress sx={{ color: '#4CAF50' }} />
                  </Box>
                )}

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 2,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {!loading && !error && sortedPlants.length === 0 && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 8, 
                    px: 4,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 4,
                    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
                    border: '1px dashed #ccc'
                  }}>
                    <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>No plants match your filters</Typography>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => {
                        setLightLevels({ Low: false, Medium: false, High: false });
                        setWaterNeeds({ Low: false, Medium: false, High: false });
                        setTemperatureRange([0, 40]);
                        setSearchQuery('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Box>
                )}

                {!loading && !error && sortedPlants.length > 0 && (
                  <Grid container spacing={3} justifyContent="flex-start">
                    {sortedPlants.map((plant) => {
                      const images = JSON.parse(plant.images);
                      const firstImage = images[0];

                      return (
                        <Grid item xs={12} sm={6} md={4} key={plant.id}>
                          <Card 
                            onClick={() => navigate(`/plant/${plant.id}`)} 
                            sx={{ 
                              height: '100%', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              borderRadius: 3, 
                              boxShadow: '0 8px 20px rgba(0,0,0,0.1)', 
                              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', 
                              overflow: 'hidden',
                              '&:hover': { 
                                boxShadow: '0 12px 28px rgba(76,175,80,0.25)', 
                                transform: 'translateY(-8px)',
                                '& .MuiCardMedia-root': {
                                  transform: 'scale(1.05)',
                                }
                              },
                              backgroundColor: '#ffffff',
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '4px',
                                background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                              },
                              '&:hover::after': {
                                opacity: 1,
                              }
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="220"
                              image={firstImage}
                              alt={plant.name}
                              sx={{ 
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease'
                              }}
                            />
                            
                            {/* Plant attribute indicators at the top of the card */}
                            <Box sx={{ 
                              position: 'absolute', 
                              top: 10, 
                              right: 10, 
                              display: 'flex', 
                              gap: 0.5 
                            }}>
                              <Chip 
                                icon={<WbSunnyIcon sx={{ fontSize: '0.85rem !important', color: '#fff' }} />} 
                                label={plant.light} 
                                size="small"
                                sx={{ 
                                  backgroundColor: getLightLevelColor(plant.light),
                                  color: '#fff',
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem'
                                }}
                              />
                              <Chip 
                                icon={<OpacityIcon sx={{ fontSize: '0.85rem !important', color: '#fff' }} />} 
                                label={plant.water} 
                                size="small"
                                sx={{ 
                                  backgroundColor: getWaterNeedsColor(plant.water),
                                  color: '#fff',
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>
                            
                            <CardContent sx={{ 
                              flexGrow: 1, 
                              display: 'flex', 
                              flexDirection: 'column',
                              p: 3
                            }}>
                              <Typography 
                                variant="h5" 
                                fontWeight="bold" 
                                sx={{ 
                                  color: '#2e7d32',
                                  mb: 1,
                                  fontFamily: "'Montserrat', sans-serif",
                                }}
                              >
                                {plant.name}
                              </Typography>
                              
                              <Typography 
                                variant="body2" 
                                color="textSecondary" 
                                sx={{ 
                                  flexGrow: 1, 
                                  display: '-webkit-box', 
                                  WebkitBoxOrient: 'vertical', 
                                  overflow: 'hidden', 
                                  WebkitLineClamp: 4,
                                  textOverflow: 'ellipsis',
                                  lineHeight: '1.5', 
                                  maxHeight: '6em',
                                  mb: 2
                                }}
                              >
                                {plant.description}
                              </Typography>

                              {/* This ensures the price and button are always positioned correctly */}
                              <Box sx={{ 
                                mt: 'auto', 
                                pt: 2, 
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#388e3c',
                                    fontFamily: "'Montserrat', sans-serif",
                                  }}
                                >
                                  ${plant.price.toFixed(2)}
                                </Typography>
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={getCartButtonProps(plant.id).icon}
                                  sx={{
                                    borderRadius: 2,
                                    backgroundColor: getCartButtonProps(plant.id).color,
                                    '&:hover': {
                                      backgroundColor: getCartButtonProps(plant.id).hoverColor,
                                      transform: 'scale(1.05)'
                                    },
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 10px rgba(46, 125, 50, 0.2)',
                                    '&:active': {
                                      transform: 'scale(0.98)',
                                    }
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(plant);
                                  }}
                                >
                                  {getCartButtonProps(plant.id).text}
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