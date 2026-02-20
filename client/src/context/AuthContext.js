import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcode API URL for now (we'll fix env later)
  const API_URL = 'http://localhost:5000/api';

  // Configure axios
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Check for saved token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      console.log('📝 Registering with:', { name, email, password });
      console.log('API URL:', API_URL);
      
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });
      
      console.log('✅ Registration response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      
      toast.success('Registration successful! 🌙');
      return true;
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Make sure backend is running on port 5000');
        console.log('💡 Run this command in a new terminal: cd server && node server.js');
      } else if (error.response) {
        console.log('Server responded with:', error.response.data);
        toast.error(error.response.data.message || 'Registration failed');
      } else {
        toast.error('Registration failed. Check console for details.');
      }
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔑 Logging in with:', { email });
      
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      console.log('✅ Login response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      
      toast.success('Welcome back! 🌙');
      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server');
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
