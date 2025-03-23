import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const Register = () => {
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
      const response = await axios.post(`${API_URL}/register`, { email, password });
      if (response.data.success) {
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
