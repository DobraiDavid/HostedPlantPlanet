import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PlantDetail from './pages/PlantDetail';
import Cart from './pages/Cart';
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/cart/view" element={<Cart />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
