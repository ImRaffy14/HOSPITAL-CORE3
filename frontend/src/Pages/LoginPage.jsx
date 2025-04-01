import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImg from '../../assets/Nodado.jpg';  
import Logo from '../../assets/Nodado.jfif';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAToken, setTwoFAToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const urlAPI = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Check if already logged in
    const verify = async () => {
      try {
        const response = await axios.get(`${urlAPI}/auth-api/protected`, {
          withCredentials: true
        });
        if (response) {
          navigate('/dashboard/overview');
        }
      } catch (error) {
        console.log('Not authenticated:', error.response?.data?.message || error.message);
      }
    };
    verify();
  }, [navigate, urlAPI]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post(
        `${urlAPI}/auth-api/login`,
        { email: username, password },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        // Redirect to verification page with userId/email
        navigate('/verify-2fa', {
          state: {
            userId: response.data.userId,
            email: username // The email they logged in with
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${urlAPI}/auth-api/verify-2fa`, 
        { userId, token: twoFAToken }, 
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard/overview');
      }
    } catch (error) {
      console.error('2FA error:', error);
      setError(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section for logo and login */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        {/* Logo */}
        <div className="flex flex-col justify-center mb-6">
          <img src={Logo} alt="Finance Department" className="h-23 w-auto" />
          <h1 className="text-2xl font-bold mb-4 mt-2 ml-4">CORE 3 SYSTEM</h1>
        </div>

        {/* Sign In Form */}
        <h1 className="text-2xl font-bold mb-4">{show2FA ? 'Verify Identity' : 'Sign In'}</h1>
        
        {!show2FA ? (
          <form onSubmit={handleLogin} className="space-y-4 w-64">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded bg-gray-100"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded bg-gray-100"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${loading ? 'opacity-70' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending code...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FAVerification} className="space-y-4 w-64">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                We've sent a verification code to your email. Please enter it below.
              </p>
              <input
                type="text"
                placeholder="Verification Code"
                value={twoFAToken}
                onChange={(e) => setTwoFAToken(e.target.value)}
                className="w-full p-2 border rounded bg-gray-100"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${loading ? 'opacity-70' : ''}`}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={() => setShow2FA(false)}
              className="w-full text-blue-500 hover:text-blue-700 text-sm"
            >
              Back to login
            </button>
          </form>
        )}
      </div>

      {/* Right section with the background image */}
      <div className="w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url(${backgroundImg})` }}>
        {/* Additional content if needed */}
      </div>
    </div>
  );
};

export default LoginPage;