import React, { useState } from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      // Store the tokens in localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Verify the token and update user data in AuthContext
      const userResponse = await axios.post('http://127.0.0.1:8000/api/verify-token/', {}, {
        headers: { Authorization: `Bearer ${access}` },
      });
      
      setUser(userResponse.data.decoded); // Set the user data in AuthContext

      // Navigate to the homepage or dashboard after successful login
      navigate({ to: '/' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || 'Login failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-blue-500 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl text-center mb-6">Log in</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Log in
            </button>
            <Link to="/register" className="text-white hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
