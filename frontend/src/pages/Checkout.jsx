import React, { useState } from "react";
import { useCart } from "../context/CartContext"; 

const Checkout = () => {
  const { cart } = useCart();
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = async () => {
    if (!name || !address) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      alert("Order placed successfully!");

    } catch (error) {
      console.error("Error placing order", error);
      alert("There was an error placing your order.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Order</h2>
        <div className="border-t pt-2">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <p>{item.name} (x{item.quantity})</p>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t pt-2 text-right">
          <p className="font-semibold">Total: ${totalAmount}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
      
        <div className="mb-4">
          <label className="mr-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank-transfer">Bank Transfer</option>
          </select>
        </div>

        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
