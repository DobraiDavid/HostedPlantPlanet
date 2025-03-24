import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Drawer, List, ListItem, ListItemText, Box, Menu, MenuItem } from "@mui/material";
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

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <List>
        {navLinks.map((item) => (
          <ListItem button component={Link} to={item.path} key={item.title}>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
    <AppBar position="static" sx={{ backgroundColor: "#2e7d32" }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ display: { sm: "none" } }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img src={logo} alt="PlantPlanet Logo" style={{ height: 40, marginRight: 10, borderRadius: 10 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", cursor: "pointer", textDecoration: "none" }}
            component={Link}
            to="/"
            color="inherit"
            underline="none"
          >
            Plant Planet
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
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
                sx={{ color: "white", mx: 1, "&.active": { textDecoration: "underline" } }}
              >
                {item.title}
              </Button>
            ))
          )}
        </Box>

        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Button color="inherit" onClick={handleMenuOpen}>
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

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
