import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PrayerTimes from './pages/PrayerTimes';
import Quran from './pages/Quran';
import Dua from './pages/Dua';
import Tasbeeh from './pages/Tasbeeh';
import Planner from './pages/Planner';
import Goals from './pages/Goals';
import Learn from './pages/Learn';
import Qibla from './pages/Qibla';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/prayer-times" element={<PrayerTimes />} />
                <Route path="/quran" element={<Quran />} />
                <Route path="/dua" element={<Dua />} />
                <Route path="/tasbeeh" element={<Tasbeeh />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/qibla" element={<Qibla />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;