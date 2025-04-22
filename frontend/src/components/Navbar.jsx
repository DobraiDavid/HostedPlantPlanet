import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
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
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import StarsIcon from "@mui/icons-material/Stars";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { cart, refreshCart } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    <AppBar position="static" sx={{ backgroundColor: "#2e7d32", boxShadow: 6 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ display: { sm: "none" }, animation: "slideIn 0.5s ease-out" }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src={logo}
            alt="PlantPlanet Logo"
            style={{ height: 50, marginRight: 10, borderRadius: 10, boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)" }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "none",
              color: "white",
              "&:hover": { color: "#81c784", transition: "color 0.3s ease-in-out" },
            }}
            component={Link}
            to="/"
          >
            Plant Planet
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          {user ? (
            <Typography variant="h6" sx={{ color: "white", mx: 1 }}>
              Hello, {user.name}
            </Typography>
          ) : (
            navLinks.map((item) => (
              <Button
                key={item.title}
                component={NavLink}
                to={item.path}
                sx={{
                  color: "white",
                  mx: 1,
                  "&.active": { textDecoration: "underline", fontWeight: "bold" },
                  "&:hover": { color: "#81c784", transform: "scale(1.05)", transition: "transform 0.2s ease-in-out" },
                }}
              >
                {item.title}
              </Button>
            ))
          )}

          <Button
            component={NavLink}
            to="/subscriptions"
            variant="contained"
            color="secondary"
            startIcon={<StarsIcon />}
            sx={{
              mx: 1,
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0 2px 10px rgba(255, 215, 0, 0.5)",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 15px rgba(255, 215, 0, 0.7)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            Subscriptions
          </Button>

          {/* About & Contact icons */}
          <Tooltip title="About Us">
            <IconButton 
              component={Link} 
              to="/about" 
              color="inherit"
              sx={{ 
                mx: 0.5,
                "&:hover": { color: "#81c784", transition: "color 0.3s ease-in-out" } 
              }}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Contact Us">
            <IconButton 
              component={Link} 
              to="/contact" 
              color="inherit"
              sx={{ 
                mx: 0.5,
                "&:hover": { color: "#81c784", transition: "color 0.3s ease-in-out" } 
              }}
            >
              <EmailIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Profile and Cart Icons */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Profile">
            <IconButton 
              component={Link}
              to="/profile"
              color="inherit"
              sx={{ 
                mr: 1,
                "&:hover": { color: "#81c784", transition: "color 0.3s ease-in-out" } 
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Shopping Cart">
            <IconButton 
              component={Link} 
              to="/cart/view" 
              color="inherit"
              sx={{ 
                "&:hover": { color: "#81c784", transition: "color 0.3s ease-in-out" } 
              }}
            >
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#2e7d32",
            color: "white",
            boxShadow: "5px 0 10px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
          {user ? (
            <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
              <AccountCircleIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Hello, {user.name}</Typography>
            </Box>
          ) : (
            <List>
              {navLinks.map((item) => (
                <ListItem component={Link} to={item.path} key={item.title} sx={{ "&:hover": { backgroundColor: "#81c784", transform: "scale(1.05)" } }}>
                  <ListItemText primary={item.title} sx={{ color: "white" }}/>
                </ListItem>
              ))}
            </List>
          )}
          <Divider />
          <List>
            <ListItem 
              component={Link} 
              to="/subscriptions" 
              sx={{ 
                "&:hover": { backgroundColor: "#81c784" }, backgroundColor:"purple"
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <StarsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Subscriptions" 
                sx={{ 
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </ListItem>
            <ListItem component={Link} to="/about" sx={{ "&:hover": { backgroundColor: "#81c784" } }}>
              <ListItemIcon sx={{ color: "white" }}>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About Us" sx={{ color: "white" }}/>
            </ListItem>
            <ListItem component={Link} to="/contact" sx={{ "&:hover": { backgroundColor: "#81c784" } }}>
              <ListItemIcon sx={{ color: "white" }}>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Contact" sx={{ color: "white" }}/>
            </ListItem>
            {user && (
              <ListItem component={Link} to="/profile" sx={{ "&:hover": { backgroundColor: "#81c784" } }}>
                <ListItemIcon sx={{ color: "white" }}>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" sx={{ color: "white" }}/>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;