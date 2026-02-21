import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FaQuran,
  FaPrayingHands,
  FaHandHoldingHeart,
  FaStar,
  FaCalendar,
  FaChartLine,
  FaFire,
  FaBookOpen,
  FaDonate,
  FaHeart,
  FaMosque,
  FaClock
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [stats, setStats] = useState({
    totalPrayers: 0,
    quranPages: 0,
    charity: 0,
    goodDeeds: 0,
    streak: 0,
    totalTasbeeh: 0,
    completedDays: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [goals, setGoals] = useState({
    quranPages: 0,
    prayers: 0,
    charity: 0,
    goodDeeds: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  // Refresh data function
  const refreshData = () => {
    if (user && token) {
      fetchUserData();
    }
  };

  // Listen for refresh events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dashboard-refresh', refreshData);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dashboard-refresh', refreshData);
    };
  }, [user, token]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching user data with token:', token);
      console.log('API URL:', process.env.REACT_APP_API_URL);

      // Fetch user profile with goals and checklist
      const profileRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Profile response:', profileRes.data);
      const userData = profileRes.data;

      // Set goals
      if (userData.ramadanGoals) {
        console.log('Setting goals:', userData.ramadanGoals);
        setGoals(userData.ramadanGoals);
      }

      // Calculate stats from user data
      let totalPrayers = 0;
      let completedDays = 0;

      // Get prayers from daily checklist
      if (userData.dailyChecklist && userData.dailyChecklist.length > 0) {
        console.log('Daily checklist:', userData.dailyChecklist);
        userData.dailyChecklist.forEach(day => {
          if (day.completed) {
            // Count all prayers that are true
            const prayersCount = Object.values(day.completed).filter(v => v === true).length;
            totalPrayers += prayersCount;
            if (prayersCount >= 5) completedDays++;
          }
        });
      } else {
        console.log('No daily checklist found');
      }

      // If no checklist data, try to get prayers from goals as fallback
      if (totalPrayers === 0 && userData.ramadanGoals?.prayers) {
        totalPrayers = userData.ramadanGoals.prayers;
        console.log('Using goals for prayers:', totalPrayers);
      }

      // Get recent tasbeeh counts
      let tasbeehData = [];
      try {
        console.log('Fetching recent tasbeeh...');
        const tasbeehRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/tasbeeh/recent`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Tasbeeh response:', tasbeehRes.data);
        tasbeehData = tasbeehRes.data;
        setRecentActivity(tasbeehData);
      } catch (err) {
        console.log('No tasbeeh data yet or error:', err.message);
        setRecentActivity([]);
      }

      // Calculate total tasbeeh count
      const totalTasbeeh = tasbeehData.reduce((sum, item) => sum + item.count, 0);

      console.log('Final stats:', {
        totalPrayers,
        quranPages: userData.ramadanGoals?.quranPages || 0,
        charity: userData.ramadanGoals?.charity || 0,
        goodDeeds: userData.ramadanGoals?.goodDeeds || 0,
        streak: calculateStreak(userData.dailyChecklist),
        totalTasbeeh,
        completedDays
      });

      setStats({
        totalPrayers: totalPrayers,
        quranPages: userData.ramadanGoals?.quranPages || 0,
        charity: userData.ramadanGoals?.charity || 0,
        goodDeeds: userData.ramadanGoals?.goodDeeds || 0,
        streak: calculateStreak(userData.dailyChecklist),
        totalTasbeeh: totalTasbeeh,
        completedDays: completedDays
      });

      // Generate weekly data for chart
      generateWeeklyData(userData.dailyChecklist);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
        setError(`Server error: ${error.response.data.message || 'Unknown error'}`);
        toast.error('Failed to load dashboard data');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('Cannot connect to server. Make sure backend is running.');
        toast.error('Cannot connect to server');
      } else {
        console.error('Error setting up request:', error.message);
        setError('Failed to load dashboard data. Please try again.');
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (checklist) => {
    if (!checklist || checklist.length === 0) return 0;

    let streak = 0;
    const sorted = [...checklist].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
      const day = sorted[i];
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      // Check if dates are consecutive
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (dayDate.getTime() !== expectedDate.getTime()) {
        break;
      }

      const completed = day.completed ?
        Object.values(day.completed).filter(v => v === true).length : 0;

      if (completed >= 3) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const generateWeeklyData = (checklist) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayData = checklist?.find(item => {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate.getTime() === date.getTime();
      });

      const prayersCount = dayData?.completed ?
        Object.values(dayData.completed).filter(v => v === true).length : 0;

      data.push({
        day: days[date.getDay()],
        prayers: prayersCount,
        date: date.toLocaleDateString()
      });
    }

    setWeeklyData(data);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FaMosque className="text-6xl text-primary-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Please login to view your dashboard
          </p>
          <Link
            to="/login"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Login to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchUserData}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  const quickActions = [
    { name: 'Read Quran', icon: <FaQuran />, path: '/quran', color: 'bg-green-500', description: 'Continue reading' },
    { name: 'Prayer Times', icon: <FaClock />, path: '/prayer-times', color: 'bg-blue-500', description: 'Check prayer times' },
    { name: 'Make Dua', icon: '🤲', path: '/dua', color: 'bg-yellow-500', description: 'Daily duas' },
    { name: 'Tasbeeh', icon: '📿', path: '/tasbeeh', color: 'bg-purple-500', description: 'Count dhikr' },
  ];

  const achievements = [
    {
      name: 'Prayer Warrior',
      icon: <FaPrayingHands />,
      achieved: stats.totalPrayers >= 50,
      progress: Math.min((stats.totalPrayers / 50) * 100, 100)
    },
    {
      name: 'Quran Reader',
      icon: <FaBookOpen />,
      achieved: stats.quranPages >= 100,
      progress: Math.min((stats.quranPages / 100) * 100, 100)
    },
    {
      name: 'Generous Heart',
      icon: <FaDonate />,
      achieved: stats.charity >= 100,
      progress: Math.min((stats.charity / 100) * 100, 100)
    },
    {
      name: 'Dhikr Lover',
      icon: <FaHeart />,
      achieved: stats.totalTasbeeh >= 1000,
      progress: Math.min((stats.totalTasbeeh / 1000) * 100, 100)
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.name}! 🌙
          </h1>
          <p className="text-xl opacity-90 mb-4">
            Day {new Date().getDate()} of Ramadan
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaFire className="text-yellow-300" />
              <span className="font-semibold">{stats.streak} day streak</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaCalendar className="text-green-300" />
              <span className="font-semibold">{stats.completedDays}/30 days completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FaPrayingHands className="text-2xl text-blue-500" />}
          value={stats.totalPrayers}
          label="Prayers Tracked"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          icon={<FaQuran className="text-2xl text-green-500" />}
          value={stats.quranPages}
          label="Quran Pages"
          bgColor="bg-green-50 dark:bg-green-900/20"
        />
        <StatCard
          icon={<FaHandHoldingHeart className="text-2xl text-yellow-500" />}
          value={`$${stats.charity}`}
          label="Charity Given"
          bgColor="bg-yellow-50 dark:bg-yellow-900/20"
        />
        <StatCard
          icon={<FaStar className="text-2xl text-purple-500" />}
          value={stats.goodDeeds}
          label="Good Deeds"
          bgColor="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* Weekly Progress Chart */}
      {weeklyData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Weekly Prayer Progress
            </h2>
            <FaChartLine className="text-2xl text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="prayers"
                  stroke="#2E7D32"
                  strokeWidth={3}
                  dot={{ fill: '#2E7D32', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`${action.color} hover:opacity-90 text-white p-4 rounded-xl text-center transition-all transform hover:scale-105 hover:shadow-xl`}
            >
              <div className="text-4xl mb-2">{action.icon}</div>
              <div className="font-semibold">{action.name}</div>
              <div className="text-xs opacity-75 mt-1">{action.description}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Tasbeeh */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Tasbeeh
          </h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📿</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.date).toLocaleDateString()} at{' '}
                        {new Date(item.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">
                    {item.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <span className="text-5xl mb-4 block">📿</span>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No tasbeeh recorded yet
                </p>
                <Link
                  to="/tasbeeh"
                  className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Start Tasbeeh
                </Link>
              </div>
            )}
          </div>

          {recentActivity.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                to="/tasbeeh"
                className="text-primary-600 hover:underline text-sm"
              >
                View all tasbeeh →
              </Link>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Achievements
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xl ${achievement.achieved ? 'text-yellow-500' : 'text-gray-400'
                      }`}>
                      {achievement.icon}
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {achievement.name}
                    </span>
                  </div>
                  {achievement.achieved && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Achieved! 🏆
                    </span>
                  )}
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all duration-500"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(achievement.progress)}% complete
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Ramadan Goals Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GoalProgress
            label="Quran Pages"
            current={stats.quranPages}
            target={604}
            color="bg-green-500"
          />
          <GoalProgress
            label="Daily Prayers"
            current={stats.totalPrayers}
            target={150}
            color="bg-blue-500"
          />
          <GoalProgress
            label="Charity ($)"
            current={stats.charity}
            target={500}
            color="bg-yellow-500"
          />
          <GoalProgress
            label="Good Deeds"
            current={stats.goodDeeds}
            target={300}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Debug Info</h3>
          <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
            {JSON.stringify({ stats, goals, recentActivity }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, value, label, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-4 transition-transform hover:scale-105`}>
    <div className="flex items-center justify-between mb-2">
      {icon}
      <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
  </div>
);

const GoalProgress = ({ label, current, target, color }) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="font-semibold text-gray-900 dark:text-white">
          {current}/{target}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Dashboard;
