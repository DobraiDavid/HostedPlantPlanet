import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { removeItem } = useCart();

  return (
    <div className="flex items-center justify-between border-b py-2">
      <div>
        <h2 className="text-lg font-bold">{item.name}</h2>
        <p className="text-green-600 font-semibold">${item.price} x {item.quantity}</p>
      </div>
      <button
        onClick={() => removeItem(item.id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
