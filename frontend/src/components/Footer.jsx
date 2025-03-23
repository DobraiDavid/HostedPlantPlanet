import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; 
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-white text-center p-6 mt-6 border-t-2 border-gray-600">
      <div className="flex justify-center space-x-6 mb-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-3xl hover:text-blue-600 transition duration-300" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-3xl hover:text-blue-400 transition duration-300" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-3xl hover:text-pink-600 transition duration-300" />
        </a>
      </div>
      <p className="text-lg text-black">&copy; {new Date().getFullYear()} Plant Planet. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
