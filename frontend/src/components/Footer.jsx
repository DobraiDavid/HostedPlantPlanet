import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; 
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-6">
      <div className="flex justify-center space-x-6 mb-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-2xl hover:text-blue-600 transition duration-300" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-2xl hover:text-blue-400 transition duration-300" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-2xl hover:text-pink-600 transition duration-300" />
        </a>
      </div>
      <p>&copy; {new Date().getFullYear()} Plant Planet. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
