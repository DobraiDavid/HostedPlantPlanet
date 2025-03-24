import React, { useState } from "react";
import { register, login } from '../api/api.js';  
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useUser } from '../context/UserContext'; 

const Register = () => {
  const [name, setName] = useState("");  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const { login: loginUser } = useUser();  

  // Email validáció regex
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");  

    // Email ellenőrzése
    if (!isValidEmail(email)) {
      setLoading(false);
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await register(name, email, password);
      
      if (response.id) {
        const loginResponse = await login(email, password); 
        
        if (loginResponse && loginResponse.user) {
          loginUser(loginResponse.user);  

          alert("Successful registration and login!");
          navigate("/");  
        } else {
          setError("An error occurred during login.");
        }
      } else {
        setError("An error occurred during registration.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("This email is already registered. Please try another one.");
      } else {
        setError("An error occurred during registration.");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 3,
          borderRadius: 3,
          padding: 4,
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Registration
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} 

        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}  
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
            sx={{ padding: "12px", fontSize: "16px", mt: 2 }}
          >
            {loading ? "Registration..." : "Registration"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#2e7d32", fontWeight: "bold" }}>
            Log in!
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
