import React, { useState, useEffect } from "react";
import { login as loginApi } from "../api/api"; 
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from "../context/UserContext"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();

  // Handle toast from navigation state
  useEffect(() => {
    if (location.state?.toast) {
      const { message, type } = location.state.toast;
      
      // Use the appropriate toast method based on type
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      } else if (type === 'info') {
        toast.info(message);
      } else {
        toast(message);
      }

      // Clear the state to prevent toast from showing again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate email and password
    if (!email || !password) {
      toast.error("Please enter both email and password", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await loginApi(email, password);

      if (response && response.user) {
        // After successful login, call the login function from UserContext
        login(response.user);

        // Navigate with toast state
        navigate("/", { 
          state: { 
            toast: { 
              message: "Successful login!", 
              type: 'success' 
            } 
          },
          replace: false
        });
      } else {
        toast.error("Wrong email or password.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error("Login error:", err); 
      toast.error("An error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
      {/* Toast Notification Container */}
      <ToastContainer />

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
          Login
        </Typography>

        <form onSubmit={handleLogin}>
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
            label="Password"
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
            sx={{ padding: "12px", fontSize: "16px", mt: 2 }}
          >
            {loading ? "Login..." : "Login"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account yet?{" "}
          <a href="/register" style={{ color: "#2e7d32", fontWeight: "bold" }}>
            Register here!
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;