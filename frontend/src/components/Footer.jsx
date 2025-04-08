import React from "react";
import { Link } from "react-router-dom"; 

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center p-8 mt-auto border-t-2 border-gray-700">
      <p className="text-gray-400 text-sm mt-4">
        &copy; {new Date().getFullYear()} Plant Planet. All rights reserved.
      </p>

      <div className="flex flex-col items-center space-y-4 mt-4">
        <Link to="/privacy-policy" className="text-gray-400 hover:text-white">
          Privacy Policy
        </Link>
        <Link to="/terms-and-conditions" className="text-gray-400 hover:text-white">
          Terms & Conditions
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
