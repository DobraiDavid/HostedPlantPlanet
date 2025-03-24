import React from "react";
import { Container, Typography, Box } from "@mui/material";

const AboutUs = () => {
  return (
    <Container maxWidth="md">
      <Box my={4} textAlign="center">
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1">
          Welcome to Plant Planet! We are passionate about bringing nature closer to you.
          Our mission is to provide high-quality plants and gardening essentials to green up your space.
          Whether you're a beginner or a pro gardener, we've got something for you!
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
