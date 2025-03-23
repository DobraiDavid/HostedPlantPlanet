import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { removeItem } = useCart();

  if (!item || !item.id || !item.name || !item.price || !item.quantity) {
    return <div className="text-red-500">Invalid item data.</div>;
  }

  return (
    <div className="flex items-center justify-between border-b py-2">
      <div>
        <h2 className="text-lg font-bold">{item.name}</h2>
        <p className="text-green-600 font-semibold">
          ${item.price.toFixed(2)} x {item.quantity}
        </p>
      </div>
      <button
        onClick={() => removeItem(item.id)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-200"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
