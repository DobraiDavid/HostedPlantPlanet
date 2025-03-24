import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button, Alert } from "@mui/material";

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

    // Ellenőrzés: minden mező ki van-e töltve?
    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required!");
      return;
    }

    try {
      // Itt küldheted egy backend API-ra (pl. Node.js Express vagy Firebase)
      const response = await fetch("http://localhost:8080", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      // Ha sikerült, töröljük az űrlapot és megjelenítjük a sikerüzenetet
      setFormData({ name: "", email: "", message: "" });
      setSuccess(true);
      setError("");
    } catch (err) {
      setError("Something went wrong, please try again later.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          Have any questions? Fill out the form below or email us at support@plantplanet.com.
        </Typography>
        {success && <Alert severity="success">Message sent successfully!</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
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
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Send Message
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Contact;
