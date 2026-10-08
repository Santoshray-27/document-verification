import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { triggerToast } from '../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      triggerToast('Login successful', 'success');
      
      if (res.user.role === 'admin') navigate('/admin/issuers');
      else if (res.user.role === 'issuer') navigate('/issuer/dashboard');
      else if (res.user.role === 'verifier') navigate('/verify');
      else navigate('/');
    } catch (err) {
      triggerToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Agnitia</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-semibold mb-1">Mock accounts (pwd: password):</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>admin@agnitia.test</li>
            <li>issuer@agnitia.test</li>
            <li>verifier@agnitia.test</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default Login;
