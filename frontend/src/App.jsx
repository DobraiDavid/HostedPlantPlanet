import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PlantDetail from './pages/PlantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import "./App.css";

function App() {
  return (
    <UserProvider> 
    <CartProvider>
      <Router>
        <div className="app-container">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/plant/:id" element={<PlantDetail />} />
            <Route path="/cart/view" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
        </div>
      </Router>
    </CartProvider>
    </UserProvider>
  );
}

export default App;
