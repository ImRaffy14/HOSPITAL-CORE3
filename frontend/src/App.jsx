import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import Dashboard from './Pages/Dashboard';
import { SocketProvider } from './context/socketContext'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Verify2FAPage from './Components/Verify2FAPage';

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/verify-2fa" element={<Verify2FAPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/*" element={<> <SocketProvider> <Dashboard /> </SocketProvider> </>} />
      </Routes>
    </Router>
    </>
  );
};

export default App;