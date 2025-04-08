import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {

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
          <ListItem button onClick={() => scrollToSection("information-we-collect")}>
            <ListItemText primary="1. Information We Collect" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("how-we-use-info")}>
            <ListItemText primary="2. How We Use Your Information" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("protect-info")}>
            <ListItemText primary="3. How We Protect Your Information" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("sharing-info")}>
            <ListItemText primary="4. Sharing Your Information" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("cookies-policy")}>
            <ListItemText primary="5. Cookies Policy" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("data-protection-rights")}>
            <ListItemText primary="6. Your Data Protection Rights" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("data-retention")}>
            <ListItemText primary="7. Data Retention" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("data-controller")}>
            <ListItemText primary="8. Data Controller" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("policy-changes")}>
            <ListItemText primary="9. Changes to This Privacy Policy" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("contact-us")}>
            <ListItemText primary="10. Contact Us" />
          </ListItem>
        </List>
      </Box>

      {/* Privacy Policy Content */}
      <Box sx={{ width: "70%", paddingLeft: 4 }}>
        <Typography variant="h4" align="center" mb={4} sx={{ color: "#333" }}>
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          Last updated: 2025.04.09.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          Welcome to Plant Planet. We value your privacy and are committed to protecting your personal data. This privacy policy outlines how we collect, use, and protect your information when you visit our website.
        </Typography>

        <Typography variant="h6" id="information-we-collect" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          1. Information We Collect
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          - <strong>Personal Information:</strong> When you make a purchase or interact with our services, we may collect personal information such as your name, email address, phone number, shipping address, and payment details.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          - <strong>Usage Data:</strong> We may collect information about how you use our website, such as your IP address, browser type, and pages visited.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          - <strong>Cookies:</strong> We use cookies to enhance your experience on our website. Cookies help us track user behavior and improve functionality.
        </Typography>

        <Typography variant="h6" id="how-we-use-info" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          2. How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          We use the information we collect for the following purposes:
          <ul>
            <li>To process and complete your orders.</li>
            <li>To improve the performance of our website and personalize your experience.</li>
            <li>To communicate with you regarding your orders, updates, and marketing offers.</li>
            <li>To conduct market research and analyze trends to improve our services.</li>
          </ul>
        </Typography>

        <Typography variant="h6" id="protect-info" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          3. How We Protect Your Information
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          We take reasonable steps to protect your personal data from unauthorized access, alteration, or disclosure. We use encryption and secure servers to store your data. Access to your personal data is restricted to necessary personnel only.
        </Typography>

        <Typography variant="h6" id="sharing-info" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          4. Sharing Your Information
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          We may share your data with trusted third-party service providers to perform services on our behalf:
          <ul>
            <li><strong>Payment Processors:</strong> For processing payments through credit cards, PayPal, or other methods.</li>
            <li><strong>Shipping Providers:</strong> To facilitate the delivery of your orders.</li>
            <li><strong>Analytics Providers:</strong> To help us track and analyze user behavior on our website.</li>
          </ul>
        </Typography>

        <Typography variant="h6" id="cookies-policy" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          5. Cookies Policy
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          Our website uses cookies to improve user experience. Cookies are small data files stored on your device that allow us to remember your preferences and actions. You can control the use of cookies through your browser settings, but disabling cookies may affect the functionality of some parts of our website.
        </Typography>

        <Typography variant="h6" id="data-protection-rights" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          6. Your Data Protection Rights
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          Depending on your location, you may have the following rights regarding your personal data:
          <ul>
            <li>The right to access your personal data.</li>
            <li>The right to correct any inaccuracies in your personal data.</li>
            <li>The right to delete your personal data under certain conditions.</li>
            <li>The right to restrict or object to the processing of your personal data.</li>
            <li>The right to withdraw consent for processing personal data.</li>
          </ul>
        </Typography>

        <Typography variant="h6" id="data-retention" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          7. Data Retention
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
        </Typography>

        <Typography variant="h6" id="data-controller" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          8. Data Controller
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          The data controller for the purposes of this privacy policy is Plant Planet, located at 123 Green Street, EcoCity, EC 12345, Hungary.
        </Typography>

        <Typography variant="h6" id="policy-changes" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          9. Changes to This Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will post the updated policy on this page with the revised "Last Updated" date.
        </Typography>

        <Typography variant="h6" id="contact-us" paragraph sx={{ fontWeight: "bold", color: "#333" }}>
          10. Contact Us
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#555" }}>
          If you have any questions or concerns about this privacy policy, please <Link to="/contact">contact us</Link>.
        </Typography>

      </Box>
    </Box>
  );
};

export default PrivacyPolicy;
