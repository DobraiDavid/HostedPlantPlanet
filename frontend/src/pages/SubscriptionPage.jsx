import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const plans = [
    { id: 1, name: "Basic", price: "$9.99/month", benefits: ["1 növény gondozási terv", "Alapvető kellékek"] },
    { id: 2, name: "Standard", price: "$19.99/month", benefits: ["3 növény gondozási terv", "Extra kiegészítők"] },
    { id: 3, name: "Premium", price: "$29.99/month", benefits: ["Korlátlan növény gondozás", "Prémium eszközök és tápszerek"] }
  ];

  const handleSubscribe = async (plan) => {
    setLoading(true); 
    setError(""); 
    setSelectedPlan(plan);

    try {
      alert(`Sikeresen előfizettél a ${plan.name} csomagra!`);
      navigate("/dashboard");
    } catch (err) {
      setError("Hiba történt az előfizetés során. Kérjük, próbáld újra.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Válassz előfizetési csomagot</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>} 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-lg font-bold">{plan.price}</p>
            <ul className="list-disc ml-4">
              {plan.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan)}
              className={`mt-4 bg-green-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading} 
            >
              {loading ? "Töltés..." : "Előfizetés"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
