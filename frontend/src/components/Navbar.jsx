import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import React from "react";

const Navbar = () => {
  const { cart } = useCart();

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <div className="lg:flex hidden space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? "text-green-200" : "hover:text-green-300 transition duration-200"}
        >
          Home
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) => isActive ? "text-green-200" : "hover:text-green-300 transition duration-200"}
        >
          Cart ({cart.length})
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) => isActive ? "text-green-200" : "hover:text-green-300 transition duration-200"}
        >
          Register
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) => isActive ? "text-green-200" : "hover:text-green-300 transition duration-200"}
        >
          Login
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
