import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const Navbar = () => {
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Plant Planet
      </Link>

      <div className="lg:flex hidden space-x-4">
        <NavLink
          to="/"
          className="hover:text-green-300 transition duration-200"
          activeClassName="text-green-200"
        >
          Home
        </NavLink>
        <NavLink
          to="/cart"
          className="hover:text-green-300 transition duration-200"
          activeClassName="text-green-200"
        >
          Cart ({cart.length})
        </NavLink>
        <NavLink
          to="/login"
          className="hover:text-green-300 transition duration-200"
          activeClassName="text-green-200"
        >
          Login
        </NavLink>
      </div>

      <div className="lg:hidden flex items-center">
        <button onClick={toggleMenu} className="text-white">
          {isMobileMenuOpen ? "Close" : "Menu"}
        </button>
        {isMobileMenuOpen && (
          <div className="absolute top-16 right-0 bg-green-600 p-4 flex flex-col space-y-4">
            <NavLink
              to="/"
              className="hover:text-green-300 transition duration-200"
              activeClassName="text-green-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/cart"
              className="hover:text-green-300 transition duration-200"
              activeClassName="text-green-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart ({cart.length})
            </NavLink>
            <NavLink
              to="/login"
              className="hover:text-green-300 transition duration-200"
              activeClassName="text-green-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
