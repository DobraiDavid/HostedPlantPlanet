import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const { cart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { title: "Register", path: "/register" },
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
          <img src={logo} alt="PlantPlanet Logo" style={{ height: 40, marginRight: 10 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", cursor: "pointer", textDecoration: "none"}}
            component={Link}
            to="/"
            color="inherit"
            underline="none"
          >
            PlantPlanet
          </Typography>
        </Box>
        
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {navLinks.map((item) => (
            <Button
              key={item.title}
              component={NavLink}
              to={item.path}
              sx={{ color: "white", mx: 1, "&.active": { textDecoration: "underline" } }}
            >
              {item.title}
            </Button>
          ))}
        </Box>
        
        <IconButton component={Link} to="/cart" color="inherit">
          <Badge badgeContent={cart.length} color="error">
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