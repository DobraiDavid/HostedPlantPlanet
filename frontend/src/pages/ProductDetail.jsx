import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/api";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-lg text-gray-700">{product.description}</p>
      <p className="text-xl font-semibold mt-4">${product.price}</p>
      <button
        onClick={() => addItem(product, 1)}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;
