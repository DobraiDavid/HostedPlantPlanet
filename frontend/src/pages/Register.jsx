import React, { useState } from "react";
import { register } from '../api/api.js';  
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 

    try {
      const response = await register(name, email, password); 
      if (response.success) {
        alert("Sikeres regisztráció!");
        navigate("/login"); 
      } else {
        setError("Hiba történt a regisztráció során.");
      }
    } catch (error) {
      setError("Hiba történt a regisztráció során.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Regisztráció</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>} 
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Név"
          value={name}
          onChange={(e) => setName(e.target.value)}  
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className={`w-full bg-green-600 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading} 
        >
          {loading ? "Regisztráció..." : "Regisztráció"}
        </button>
      </form>
    </div>
  );
};

export default Register;
