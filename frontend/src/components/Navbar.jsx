import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Tooltip,
  Divider,
  Fade,
  useScrollTrigger,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import StarsIcon from "@mui/icons-material/Stars";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const { user } = useUser();
  const { cart, refreshCart } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const isSubscriptionPage = location.pathname === "/subscriptions";
  const userDisplayName = user ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : '';


  // Add scroll behavior
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { title: "Registration", path: "/register" },
    { title: "Login", path: "/login" },
  ];

  useEffect(() => {
    if (user && Array.isArray(cart)) {
      setCartItemCount(cart.length);
    } else {
      setCartItemCount(0);
    }
  }, [cart, user]);

  useEffect(() => {
    if (user) {
      refreshCart();
      const handleFocus = () => refreshCart();
      window.addEventListener("focus", handleFocus);
      return () => {
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [refreshCart, user]);

  return (
    <AppBar 
      position="sticky" 
      elevation={trigger ? 4 : 0}
      sx={{ 
        backgroundColor: "#2e7d32", 
        transition: "box-shadow 0.3s, background-color 0.3s",
        boxShadow: trigger ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ 
              mr: 2, 
              display: { sm: "none" }, 
              animation: "pulse 1.5s infinite ease-in-out alternate",
              "@keyframes pulse": {
                "0%": { opacity: 0.7 },
                "100%": { opacity: 1 },
              }
            }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          
          <Box
            component={Link}
            to="/"
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              textDecoration: "none",
              "&:hover": { 
                transform: "scale(1.02)", 
                transition: "transform 0.3s ease" 
              }
            }}
          >
            <Fade in={true} timeout={1000}>
              <img
                src={logo}
                alt="PlantPlanet Logo"
                style={{ 
                  height: 50, 
                  marginRight: 12, 
                  borderRadius: 10, 
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)"
                }}
              />
            </Fade>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "white",
                letterSpacing: 0.5,
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                fontFamily: "'Montserrat', sans-serif",
                "&:hover": { 
                  color: "#e8f5e9", 
                  transition: "color 0.3s ease-in-out" 
                },
              }}
            >
              Plant Planet
            </Typography>
          </Box>
        </Box>
        
        {/* Desktop Navigation */}
        <Box 
          sx={{ 
            display: { xs: "none", md: "flex" }, 
            alignItems: "center", 
            gap: 1 
          }}
        >
          {user ? (
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: "#e8f5e9", 
                mr: 2,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
              }}
            >
              Hello, {userDisplayName}
            </Typography>
          ) : (
            <Box sx={{ display: "flex" }}>
              {navLinks.map((item) => (
                <Button
                  key={item.title}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    color: "white",
                    mx: 0.5,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    "&.active": { 
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      fontWeight: 700,
                    },
                    "&:hover": { 
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>
          )}

          <Button
            component={NavLink}
            to={isSubscriptionPage ? "/" : "/subscriptions"}
            variant="contained"
            color={isSubscriptionPage ? "success" : "secondary"}
            startIcon={isSubscriptionPage ? <LocalFloristIcon /> : <StarsIcon />}
            sx={{
              mx: 1,
              px: 2,
              py: 1,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              backgroundColor: isSubscriptionPage ? "#81c784" : "#9c27b0",
              boxShadow: isSubscriptionPage 
                ? "0 2px 10px rgba(129, 199, 132, 0.5)" 
                : "0 2px 10px rgba(156, 39, 176, 0.5)",
              "&:hover": {
                transform: "scale(1.05)",
                backgroundColor: isSubscriptionPage ? "#66bb6a" : "#8e24aa",
                boxShadow: isSubscriptionPage 
                  ? "0 4px 15px rgba(129, 199, 132, 0.7)" 
                  : "0 4px 15px rgba(156, 39, 176, 0.7)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            {isSubscriptionPage ? "Plants" : "Subscriptions"}
          </Button>

          {/* Navigation Icons */}
          <Box sx={{ display: "flex", ml: 1 }}>
            <Tooltip title="About Us" arrow>
              <IconButton 
                component={Link} 
                to="/about" 
                color="inherit"
                sx={{ 
                  mx: 0.5,
                  "&:hover": { 
                    color: "#e8f5e9", 
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease" 
                  } 
                }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Contact Us" arrow>
              <IconButton 
                component={Link} 
                to="/contact" 
                color="inherit"
                sx={{ 
                  mx: 0.5,
                  "&:hover": { 
                    color: "#e8f5e9", 
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease" 
                  } 
                }}
              >
                <EmailIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Profile and Cart Icons - Always visible */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Profile" arrow>
            <IconButton 
              component={Link}
              to="/profile"
              color="inherit"
              sx={{ 
                mr: 1,
                "&:hover": { 
                  color: "#e8f5e9", 
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease" 
                } 
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Shopping Cart" arrow>
            <IconButton 
              component={Link} 
              to="/cart/view" 
              color="inherit"
              sx={{ 
                position: "relative",
                "&:hover": { 
                  color: "#e8f5e9", 
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease" 
                },
                animation: cartItemCount > 0 ? "gentle-bounce 2s infinite" : "none",
                "@keyframes gentle-bounce": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-3px)" }
                }
              }}
            >
              <Badge 
                badgeContent={cartItemCount} 
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                  }
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundImage: "linear-gradient(to bottom, #2e7d32, #1b5e20)",
            color: "white",
            boxShadow: "5px 0 15px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ 
            p: 2, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            mb: 1,
          }}>
            <img
              src={logo}
              alt="PlantPlanet Logo"
              style={{ 
                height: 40, 
                marginRight: 10, 
                borderRadius: 8, 
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)" 
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Plant Planet
            </Typography>
          </Box>
          
          {user ? (
            <Box sx={{ p: 2, display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <AccountCircleIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Hello, {userDisplayName}</Typography>
            </Box>
          ) : (
            <List>
              {navLinks.map((item) => (
                <ListItem 
                  component={Link} 
                  to={item.path} 
                  key={item.title} 
                  onClick={handleDrawerToggle}
                  sx={{ 
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    "&:hover": { 
                      backgroundColor: "rgba(255,255,255,0.15)",
                      transform: "translateX(4px)",
                      transition: "all 0.2s ease"
                    } 
                  }}
                >
                  <ListItemText 
                    primary={item.title} 
                    sx={{ 
                      color: "white",
                      "& .MuiTypography-root": {
                        fontWeight: 500
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)", my: 1 }} />
          
          <List>
            <ListItem 
              component={Link} 
              to={isSubscriptionPage ? "/" : "/subscriptions"}
              onClick={handleDrawerToggle}
              sx={{ 
                backgroundColor: isSubscriptionPage ? "#81c784" : "#9c27b0",
                color: "white",
                borderRadius: 1,
                mx: 1,
                my: 1,
                "&:hover": { 
                  backgroundColor: isSubscriptionPage ? "#66bb6a" : "#8e24aa",
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease"
                } 
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                {isSubscriptionPage ? <LocalFloristIcon /> : <StarsIcon />}
              </ListItemIcon>
              <ListItemText 
                primary={isSubscriptionPage ? "Plants" : "Subscriptions"}
                sx={{ 
                  color: "white",
                  "& .MuiTypography-root": {
                    fontWeight: 600
                  }
                }}
              />
            </ListItem>
            
            <ListItem 
              component={Link} 
              to="/about" 
              onClick={handleDrawerToggle}
              sx={{ 
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                "&:hover": { 
                  backgroundColor: "rgba(255,255,255,0.15)",
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease"
                } 
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText 
                primary="About Us" 
                sx={{ 
                  color: "white",
                  "& .MuiTypography-root": {
                    fontWeight: 500
                  }
                }}
              />
            </ListItem>
            
            <ListItem 
              component={Link} 
              to="/contact" 
              onClick={handleDrawerToggle}
              sx={{ 
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                "&:hover": { 
                  backgroundColor: "rgba(255,255,255,0.15)",
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease"
                } 
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Contact" 
                sx={{ 
                  color: "white",
                  "& .MuiTypography-root": {
                    fontWeight: 500
                  }
                }}
              />
            </ListItem>
            
            <ListItem 
              component={Link} 
              to="/profile" 
              onClick={handleDrawerToggle}
              sx={{ 
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                "&:hover": { 
                  backgroundColor: "rgba(255,255,255,0.15)",
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease"
                } 
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Profile" 
                sx={{ 
                  color: "white",
                  "& .MuiTypography-root": {
                    fontWeight: 500
                  }
                }}
              />
            </ListItem>
            
            <ListItem 
              component={Link} 
              to="/cart/view" 
              onClick={handleDrawerToggle}
              sx={{ 
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                "&:hover": { 
                  backgroundColor: "rgba(255,255,255,0.15)",
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease"
                } 
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="Shopping Cart" 
                sx={{ 
                  color: "white",
                  "& .MuiTypography-root": {
                    fontWeight: 500
                  }
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;