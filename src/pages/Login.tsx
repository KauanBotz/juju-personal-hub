import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (await login(username, password)) {
      navigate('/home');
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-200 to-red-200">
      <Card className="w-full max-w-sm bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl">
        <CardHeader className="text-center mt-8">
          <CardTitle className="text-3xl font-extrabold text-pink-600">
            Seja bem-vinda Julia!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-8">
            <div className="relative">
              <Label htmlFor="username" className="text-gray-700">
                Usuário
              </Label>
              <div className="flex items-center border border-pink-300 rounded-lg mt-1 focus-within:ring-2 focus-within:ring-pink-400">
                <span className="px-3 text-pink-400">
                  <User size={20} />
                </span>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="julia.pena"
                  className="flex-1 bg-transparent focus:outline-none py-2 pr-3 text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="password" className="text-gray-700">
                Senha
              </Label>
              <div className="flex items-center border border-pink-300 rounded-lg mt-1 focus-within:ring-2 focus-within:ring-pink-400">
                <span className="px-3 text-pink-400">
                  <Lock size={20} />
                </span>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent focus:outline-none py-2 pr-3 text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg py-2 transition duration-200"
            >
              Entrar
            </Button>
            <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-pink-600 hover:underline">
                Esqueci minha senha
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
