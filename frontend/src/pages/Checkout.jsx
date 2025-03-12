const Checkout = () => {
    const handleCheckout = () => {
      alert("Order placed successfully!");
    };
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <button onClick={handleCheckout} className="bg-green-600 text-white px-4 py-2 rounded">
          Place Order
        </button>
      </div>
    );
  };
  
  export default Checkout;
  