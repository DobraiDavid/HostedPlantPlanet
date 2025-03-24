import React, { useState } from "react";
import { login as loginApi } from "../api/api";  // Assuming you have an API function to authenticate
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useUser } from "../context/UserContext";  // Import useUser to access context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useUser();  // Get the login function from UserContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginApi(email, password); // Call your login API to authenticate
      console.log("Login response:", response); // Debugging: log the entire response

      if (response && response.user) {
        // After successful login, call the login function from UserContext
        login(response.user.id);  // Pass the user ID to the context
        alert("Sikeres bejelentkezés!"); // Successful login alert
        navigate("/"); // Redirect to homepage or wherever you want
      } else {
        setError("Hibás felhasználónév vagy jelszó.");
      }
    } catch (err) {
      console.error("Login error:", err); // Log the error for debugging
      setError("Hiba történt. Kérjük próbálja meg később.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100">
      <Box className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <Typography variant="h4" align="center" color="green" mb={4}>
          Bejelentkezés
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin} className="space-y-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Jelszó"
            variant="outlined"
            type="password"
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
            {loading ? "Bejelentkezés..." : "Bejelentkezés"}
          </Button>
        </form>

        <Typography variant="body2" align="center" mt={2}>
          Még nincs fiókod? <a href="/register" className="text-green-600 font-semibold">Regisztrálj itt!</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
