import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_URL = 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();  
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await axios.get(`${API_URL}/plants/${id}`);
        setPlant(response.data);
        setLoading(false);  
      } catch (error) {
        setError('Hiba történt a növény adatainak lekérésekor.');
        setLoading(false);  
      }
    };

    fetchPlant();
  }, [id]);

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleAddToCart = () => {
    addItem(plant, 1);  
    alert(`${plant.name} kosárba helyezve!`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{plant.name}</h1>
      <div className="mb-4">
        {plant.imageUrl && (
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-64 object-cover rounded"
          />
        )}
      </div>
      <p className="mb-4">{plant.description}</p>
      <p className="text-lg font-semibold text-green-600">{plant.price} Ft</p>
      <button
        onClick={handleAddToCart}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Kosárba
      </button>
    </div>
  );
};

export default ProductDetail;
