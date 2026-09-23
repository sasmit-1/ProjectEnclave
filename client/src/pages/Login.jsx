import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface p-10 rounded-xl shadow-xl border border-border w-full max-w-lg">
        <h2 className="text-4xl font-bold mb-8 text-primary text-center">Welcome Back</h2>
        {error && <p className="text-red-600 bg-red-50 p-3 rounded mb-6 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-text">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-4 rounded-lg bg-background border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-text">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="p-4 rounded-lg bg-background border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg transition-shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-primary hover:bg-blue-700 text-white p-4 rounded-lg font-bold text-xl transition-colors mt-2 shadow-md">
            Login
          </button>
        </form>
        <p className="mt-8 text-center text-muted text-lg">
          Don't have an account? <Link to="/register" className="text-primary hover:underline font-semibold">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
