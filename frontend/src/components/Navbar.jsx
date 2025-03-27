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
  Box,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
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
        <Box sx={{ display: { xs: "none", sm: "block" }, ml: 2 }}>
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
        </Box>

        <Box sx={{ display: { xs: "none", sm: "block" }, ml: 2 }}>
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            sx={{
              "&:hover": { color: "#81c784", transition: "color 0.3s ease-in-out" },
              transition: "transform 0.2s ease-in-out",
            }}
          >
            More
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem component={Link} to="/about" onClick={handleMenuClose}>
              About Us
            </MenuItem>
            <MenuItem component={Link} to="/contact" onClick={handleMenuClose}>
              Contact
            </MenuItem>
          </Menu>
        </Box>

        <IconButton component={Link} to="/cart/view" color="inherit">
          <Badge badgeContent={cartItemCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
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
          <List>
            {navLinks.map((item) => (
              <ListItem component={Link} to={item.path} key={item.title} sx={{ "&:hover": { backgroundColor: "#81c784", transform: "scale(1.05)" } }}>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem component={Link} to="/about">
              <ListItemText primary="About Us" />
            </ListItem>
            <ListItem component={Link} to="/contact">
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
