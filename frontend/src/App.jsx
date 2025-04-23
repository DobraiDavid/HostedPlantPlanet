import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SupportBot from "./components/SupportBot";
import PlantDetail from './pages/PlantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import { ToastContainer } from 'react-toastify';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Subscriptions from "./pages/SubscriptionPage";
import SubscriptionDetails from "./pages/SubscriptionDetails";


function App() {
  return (
    <UserProvider> 
    <CartProvider>
    <ToastProvider>
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
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/subscriptions/plans/:id" element={<SubscriptionDetails />} />
          </Routes>
        </main>
        <SupportBot />
        <Footer />
        </div>
        <ToastContainer autoClose={1000}/>
      </Router>
    </ToastProvider>
    </CartProvider>
    </UserProvider>
  );
}

export default App;
