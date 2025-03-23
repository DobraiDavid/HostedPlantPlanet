import React, { useState } from "react";
import { register } from '../api/api.js';  
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";

const Register = () => {
  const [name, setName] = useState("");  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");  

    try {
      const response = await register(name, email, password); 
      if (response.id) {
        alert("Sikeres regisztráció!");
        navigate("/");  
      } else {
        setError("Hiba történt a regisztráció során.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Ez az email már regisztrálva van. Kérjük próbálj meg egy másikat.");
      } else {
        setError("Hiba történt a regisztráció során.");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100">
      <Box className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <Typography variant="h4" align="center" color="green" mb={4}>
          Regisztráció
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} 

        <form onSubmit={handleRegister} className="space-y-4">
          <TextField
            fullWidth
            label="Név"
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
            label="Jelszó"
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
            sx={{ padding: "12px", fontSize: "16px" }}
          >
            {loading ? "Regisztráció..." : "Regisztráció"}
          </Button>
        </form>

        <Typography variant="body2" align="center" mt={2}>
          Már van fiókod? <a href="/login" className="text-green-600 font-semibold">Jelentkezz be!</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
