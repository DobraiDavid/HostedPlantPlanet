import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button, Alert } from "@mui/material";
import { FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setFormData({ name: "", email: "", message: "" });
      setSuccess(true);
      setError("");
    } catch (err) {
      setError("Something went wrong, please try again later.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center" sx={{ p: 4, boxShadow: 3, borderRadius: 3, backgroundColor: "#f1f8e9" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
          Contact Us 📩
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: "textSecondary" }}>
          Have any questions? Fill out the form below or reach us via email.
        </Typography>

        {success && <Alert severity="success" sx={{ mt: 2 }}>Message sent successfully!</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField fullWidth label="Your Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Your Email" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Message" name="message" multiline rows={4} value={formData.message} onChange={handleChange} margin="normal" required />
          <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}>
            Send Message
          </Button>
        </Box>

        {/* Contact Info */}
        <Box mt={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
            Get in Touch
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" gap={2} sx={{ mt: 1, color: "gray" }}>
            <FaPhone /> +36 30 123 4567
            <FaEnvelope /> plantplanetofficial@gmail.com
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
