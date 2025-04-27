import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import ExploreIcon from '@mui/icons-material/Explore';
import TD from "../assets/TD.jpg";
import DD from "../assets/DD.jpg";
import TK from "../assets/TK.jpg";

const AboutUs = () => {
  const navigate = useNavigate(); 

  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          textAlign: "center", 
          my: 4, 
          p: 3, 
          backgroundColor: "#e8f5e9", 
          borderRadius: 3, 
          boxShadow: 4 
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "green" }}>
          About Us 🌿
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
          Bringing nature closer to you with high-quality plants and gardening essentials.
        </Typography>
      </Box>

      <Box my={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
          Our Mission
        </Typography>
        <Typography variant="body1" align="center">
          We are committed to making green spaces accessible to everyone. Whether you're an urban dweller 
          looking for indoor plants or a gardening enthusiast, we provide everything you need to cultivate 
          a thriving green environment.
        </Typography>
      </Box>

      <Grid container spacing={4} my={4}>
        {[
          { title: "Sustainability", desc: "We promote eco-friendly practices and sustainable gardening." },
          { title: "Quality", desc: "We provide healthy, high-quality plants that thrive in various conditions." },
          { title: "Community", desc: "We believe in sharing knowledge and fostering a love for plants." }
        ].map((value, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ boxShadow: 4, borderRadius: 3, p: 2, textAlign: "center", backgroundColor: "#f1f8e9" }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#388e3c" }}>
                  {value.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {value.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box my={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
          Meet the Team 👨‍🌾👩‍🌾
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
          {[
            { name: "Dávid Dobrai", role: "Founder & Plant Expert", img: DD },
            { name: "Dominik Tóth", role: "Horticulturist", img: TD },
            { name: "Károly Türk", role: "Customer Support", img: TK }
          ].map((member, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ textAlign: "center", boxShadow: 4, borderRadius: 3 }}>
                <CardMedia 
                  component="img" 
                  sx={{ 
                    width: 480, 
                    height: 853,
                    objectFit: "cover" 
                  }} 
                  image={member.img} 
                  alt={member.name} 
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {member.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box textAlign="center" my={4}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Join Our Green Community!
        </Typography>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
          onClick={() => navigate("/")} 
          startIcon={<ExploreIcon />}
        >
          Explore Our Plants
        </Button>
      </Box>
    </Container>
  );
};

export default AboutUs;