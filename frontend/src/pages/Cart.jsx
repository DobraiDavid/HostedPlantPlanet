import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart } = useCart();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          <Link to="/checkout" className="block mt-4 bg-green-600 text-white px-4 py-2 rounded">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
