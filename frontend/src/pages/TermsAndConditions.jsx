import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {

  // Scroll to the specific section when clicked
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: 4,
      }}
    >
      {/* Sidebar Navigation */}
      <Box
        sx={{
          width: "25%",
          paddingRight: 4,
          position: "sticky",
          top: 0, 
          height: "100vh",
          overflowY: "auto", 
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
          Table of Contents
        </Typography>
        <List>
          <ListItem button onClick={() => scrollToSection("acceptance-of-terms")}>
            <ListItemText primary="1. Acceptance of Terms" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("use-of-services")}>
            <ListItemText primary="2. Use of Services" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("user-obligations")}>
            <ListItemText primary="3. User Obligations" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("intellectual-property")}>
            <ListItemText primary="4. Intellectual Property" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("disclaimer-of-liability")}>
            <ListItemText primary="5. Disclaimer of Liability" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("termination-of-use")}>
            <ListItemText primary="6. Termination of Use" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("modifications-to-terms")}>
            <ListItemText primary="7. Modifications to Terms" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("governing-law")}>
            <ListItemText primary="8. Governing Law" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("contact-us")}>
            <ListItemText primary="9. Contact Us" />
          </ListItem>
        </List>
      </Box>

      {/* Terms and Conditions Content */}
      <Box sx={{ width: "70%", paddingLeft: 4 }}>
        <Typography variant="h4" align="center" mb={4} sx={{ color: "#333" }}>
          Terms and Conditions
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          Last updated: 2025.04.09.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          These Terms and Conditions govern your use of the services provided by Plant Planet. By accessing or using our services, you agree to be bound by these terms.
        </Typography>

        <Typography variant="h6" id="acceptance-of-terms" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          By accessing or using the services provided by Plant Planet, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with these terms, you should not use our services.
        </Typography>

        <Typography variant="h6" id="use-of-services" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          2. Use of Services
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          You may use our services only for lawful purposes and in accordance with these Terms and Conditions. You are responsible for ensuring that your use of the services complies with applicable laws.
        </Typography>

        <Typography variant="h6" id="user-obligations" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          3. User Obligations
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          As a user of our services, you agree to provide accurate and complete information during registration and to keep your account details up-to-date. You are also responsible for maintaining the confidentiality of your account credentials.
        </Typography>

        <Typography variant="h6" id="intellectual-property" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          4. Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          All content, trademarks, and intellectual property associated with the services are owned by Plant Planet or its licensors. You agree not to infringe upon or misuse any intellectual property.
        </Typography>

        <Typography variant="h6" id="disclaimer-of-liability" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          5. Disclaimer of Liability
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
        Plant Planet will not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our services, even if we have been advised of the possibility of such damages.
        </Typography>

        <Typography variant="h6" id="termination-of-use" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          6. Termination of Use
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          We may terminate or suspend your access to our services at any time, without notice, if you violate these Terms and Conditions or engage in any conduct that we deem inappropriate.
        </Typography>

        <Typography variant="h6" id="modifications-to-terms" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          7. Modifications to Terms
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          We reserve the right to modify or update these Terms and Conditions at any time. Any changes will be posted on this page, and the "Last updated" date will be revised accordingly.
        </Typography>

        <Typography variant="h6" id="governing-law" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          8. Governing Law
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          These Terms and Conditions will be governed by and construed in accordance with the laws of Hungary. Any legal actions arising from the use of our services will be filed in the appropriate courts within Hungary.
        </Typography>

        <Typography variant="h6" id="contact-us" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          9. Contact Us
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          If you have any questions about these Terms and Conditions, please <Link to="/contact">contact us</Link>.
        </Typography>
      </Box>
    </Box>
  );
};

export default TermsAndConditions;
