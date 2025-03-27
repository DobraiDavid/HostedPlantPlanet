import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa"; 
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center p-8 mt-auto border-t-2 border-gray-700">
      <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Plant Planet. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
