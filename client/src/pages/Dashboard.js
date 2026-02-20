import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaQuran, FaPrayingHands, FaHandHoldingHeart, FaStar, FaCalendar, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPrayers: 0,
    quranPages: 0,
    charity: 0,
    goodDeeds: 0,
    streak: 0
  });

  useEffect(() => {
    if (user) {
      // Load user stats from localStorage or API
      const savedStats = localStorage.getItem('userStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">Please login to view your dashboard</p>
        <Link to="/login" className="inline-block mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg">
          Login
        </Link>
      </div>
    );
  }

  const quickActions = [
    { name: 'Read Quran', icon: <FaQuran />, path: '/quran', color: 'bg-green-500' },
    { name: 'Prayer Times', icon: <FaPrayingHands />, path: '/prayer-times', color: 'bg-blue-500' },
    { name: 'Make Dua', icon: '🤲', path: '/dua', color: 'bg-yellow-500' },
    { name: 'Tasbeeh', icon: '📿', path: '/tasbeeh', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 🌙</h1>
        <p className="opacity-90">May your Ramadan be filled with blessings and peace</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FaPrayingHands className="text-2xl text-blue-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPrayers}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Prayers Tracked</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FaQuran className="text-2xl text-green-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.quranPages}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Quran Pages</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FaHandHoldingHeart className="text-2xl text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${stats.charity}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Charity Given</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FaStar className="text-2xl text-purple-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.goodDeeds}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Good Deeds</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`${action.color} hover:opacity-90 text-white p-4 rounded-xl text-center transition-transform transform hover:scale-105`}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="font-medium">{action.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Progress</h2>
          <FaChartLine className="text-2xl text-gray-400" />
        </div>
        <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Progress chart will appear here</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600 dark:text-gray-300 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
            <FaCalendar className="mr-3 text-primary-500" />
            <span>No recent activity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
