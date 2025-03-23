import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart } = useCart();

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center text-lg text-gray-600">
          <p>Your cart is empty.</p>
          <Link to="/" className="mt-4 text-green-600 hover:underline">
            Go back to shopping
          </Link>
        </div>
      ) : (
        <div>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          <div className="mt-4 border-t pt-4 text-right">
            <p className="text-lg font-semibold">Total: ${totalAmount}</p>
            <Link
              to="/checkout"
              className={`mt-4 px-4 py-2 rounded ${
                cart.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white"
              }`}
              style={{ pointerEvents: cart.length === 0 ? "none" : "auto" }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
