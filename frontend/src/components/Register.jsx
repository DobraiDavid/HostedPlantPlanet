import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setErrorMessage('Minden mezőt ki kell tölteni!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Érvényes e-mail címet kell megadni!');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await axios.post(`${API_URL}/register`, { name, email, password });
      alert('Sikeres regisztráció!');
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setErrorMessage('Hiba történt a regisztráció során. Próbálja újra!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96">
        <CardHeader>Regisztráció</CardHeader>
        <CardContent>
          {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
          
          <Input 
            placeholder="Név" 
            className="mb-4" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <Input 
            placeholder="Email" 
            className="mb-4" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Jelszó" 
            className="mb-4" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <Button 
            className="w-full" 
            onClick={handleSubmit} 
            disabled={isLoading} 
          >
            {isLoading ? 'Regisztrálás...' : 'Regisztráció'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
