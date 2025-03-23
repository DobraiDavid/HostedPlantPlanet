import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get(`${API_URL}/plants`);
        setPlants(response.data);
      } catch (error) {
        console.error('Hiba történt a növények lekérésekor.', error);
        setError('Hiba történt a növények betöltésekor.');
      } finally {
        setLoading(false);  
      }
    };

    fetchPlants();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-semibold">Növények</h1>

      {loading && <p>Betöltés...</p>}  
      {error && <p className="text-red-500">{error}</p>}  

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plants.map((plant) => (
            <div key={plant.id} className="border p-4 rounded-xl shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold">{plant.name}</h2>
              <p>{plant.description}</p>
              <Link to={`/product/${plant.id}`} className="text-blue-500 hover:underline">Részletek</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
