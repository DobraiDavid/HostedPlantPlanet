import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <div className="border p-4 rounded shadow">
      <Link to={`/product/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded" />
        <h2 className="text-lg font-bold mt-2">{product.name}</h2>
        <p className="text-green-600 font-semibold">${product.price}</p>
      </Link>
      <button
        onClick={() => addItem(product, 1)}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
