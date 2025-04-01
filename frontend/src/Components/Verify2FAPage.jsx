import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import backgroundImg from '../../assets/Nodado.jpg';  
import Logo from '../../assets/Nodado.jfif';

const Verify2FAPage = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get userId from location state (passed after login)
    const userId = location.state?.userId;
    const email = location.state?.email;
    const urlAPI = import.meta.env.VITE_API_URL;

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
        const response = await axios.post(
            `${urlAPI}/auth-api/verify-2fa`,
            { userId, token },
            { withCredentials: true }
        );

        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard/overview');
        }
        } catch (err) {
        setError(err.response?.data?.message || 'Verification failed');
        } finally {
        setLoading(false);
        }
    };

    if (!userId) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen flex">
        {/* Left section */}
        <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
            <div className="flex flex-col justify-center mb-6">
            <img src={Logo} alt="Your Logo" className="h-23 w-auto" />
            <h1 className="text-2xl font-bold mb-4 mt-2 ml-4">CORE 3 SYSTEM</h1>
            </div>

            <h1 className="text-2xl font-bold mb-4">Verify Identity</h1>
            
            <form onSubmit={handleVerify} className="space-y-4 w-64">
            <div>
                <p className="text-sm text-gray-600 mb-2">
                Enter the 6-digit code sent to <strong>{email}</strong>
                </p>
                <input
                type="text"
                placeholder="Verification Code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full p-2 border rounded bg-gray-100"
                required
                />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${loading ? 'opacity-70' : ''}`}
            >
                {loading ? 'Verifying...' : 'Verify'}
            </button>
            </form>
        </div>

        {/* Right section (background) */}
        <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImg})` }} />
        </div>
    );
};

export default Verify2FAPage;