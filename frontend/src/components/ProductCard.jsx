import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`}>
        <div className={`w-full h-40 rounded ${isImageLoaded ? "" : "bg-gray-300"}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded"
            onLoad={handleImageLoad}
          />
        </div>
        <h2 className="text-lg font-bold mt-2">{product.name}</h2>
        <p className="text-green-600 font-semibold">${product.price || "N/A"}</p>
      </Link>
      <button
        onClick={() => addItem(product, 1)}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
