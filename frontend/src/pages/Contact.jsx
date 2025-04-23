import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import { FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const emailjsAPIKey = import.meta.env.VITE_EMAILJS_API_KEY;
  const emailjsTemplateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailjsServiceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      // Send email using EmailJS
      const response = await emailjs.send(
        emailjsServiceID,  
        emailjsTemplateID, 
        formData,           
        emailjsAPIKey  
      );
      

      // Reset form and show success message
      setFormData({ name: "", email: "", message: "" });
      
      // Show success toast
      toast.success("Message sent successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      // Handle email sending error
      console.error('Email send error:', err);
      toast.error("Something went wrong, please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      {/* Toast Notification Container */}
      <ToastContainer />

      <Box my={4} textAlign="center" sx={{ p: 4, boxShadow: 3, borderRadius: 3, backgroundColor: "#f1f8e9" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
          Contact Us 📩
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: "textSecondary" }}>
          Have any questions? Fill out the form below or reach us via email.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField 
            fullWidth 
            label="Your Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            margin="normal" 
            required 
          />
          <TextField 
            fullWidth 
            label="Your Email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            margin="normal" 
            required 
          />
          <TextField 
            fullWidth 
            label="Message" 
            name="message" 
            multiline 
            rows={4} 
            value={formData.message} 
            onChange={handleChange} 
            margin="normal" 
            required 
          />
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              mt: 2, 
              backgroundColor: "#4caf50", 
              "&:hover": { backgroundColor: "#388e3c" } 
            }}
          >
            Send Message
          </Button>
        </Box>
        
        {/* Contact Info */}
        <Box mt={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
            Get in Touch
          </Typography>
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="center" alignItems="center" gap={2} sx={{ mt: 1, color: "gray" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <FaPhone />
            <span>+36 30 123 4567</span>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <FaEnvelope />
            <span>plantplanetofficial@gmail.com</span>
          </Box>
          </Box>
        </Box>
        
        {/* Social Media Links */}
        <Box mt={3} display="flex" justifyContent="center" gap={3}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-3xl text-gray-700 hover:text-blue-600 transition duration-300" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-3xl text-gray-700 hover:text-blue-400 transition duration-300" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-3xl text-gray-700 hover:text-pink-500 transition duration-300" />
          </a>
        </Box>
      </Box>
    </Container>
  );
};

export default Contact;