import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaQuran, FaPrayingHands, FaHandHoldingHeart, FaStar } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState({
    quranPages: 0,
    prayers: 0,
    charity: 0,
    goodDeeds: 0
  });
  const [daily, setDaily] = useState({
    quran: '',
    prayer: '',
    charity: '',
    deed: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch goals when component mounts
  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.ramadanGoals) {
        setGoals(response.data.ramadanGoals);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleGoalChange = (field, value) => {
    setGoals({ ...goals, [field]: parseInt(value) || 0 });
  };

  const saveGoals = async () => {
    if (!user) {
      toast.error('Please login to save goals');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/goals`,
        goals,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Goals saved successfully!');
      
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('dashboard-refresh'));
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.error('Failed to save goals');
    } finally {
      setSaving(false);
    }
  };

  const handleDailySubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to update progress');
      return;
    }

    try {
      setSaving(true);
      
      // Update goals with daily progress
      const updatedGoals = {
        quranPages: goals.quranPages + (parseInt(daily.quran) || 0),
        prayers: goals.prayers + (parseInt(daily.prayer) || 0),
        charity: goals.charity + (parseInt(daily.charity) || 0),
        goodDeeds: goals.goodDeeds + (parseInt(daily.deed) || 0)
      };

      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/goals`,
        updatedGoals,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGoals(updatedGoals);
      toast.success('Daily progress updated!');
      
      // Reset form
      setDaily({ quran: '', prayer: '', charity: '', deed: '' });
      
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('dashboard-refresh'));
    } catch (error) {
      console.error('Error updating daily progress:', error);
      toast.error('Failed to update progress');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">Please login to track your Ramadan goals</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const progress = {
    quran: Math.min((goals.quranPages / 604) * 100, 100),
    prayers: Math.min((goals.prayers / 150) * 100, 100), // 5 prayers × 30 days
    charity: Math.min((goals.charity / 500) * 100, 100),
    deeds: Math.min((goals.goodDeeds / 300) * 100, 100)
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ramadan Goals Tracker</h1>
        <button
          onClick={saveGoals}
          disabled={saving}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Goals'}
        </button>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quran Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FaQuran className="text-3xl text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quran Reading</h3>
            </div>
            <span className="text-2xl font-bold text-primary-600">{goals.quranPages}</span>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 transition-all" style={{ width: `${progress.quran}%` }}></div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Pages read: {goals.quranPages}/604</p>
        </div>

        {/* Prayers Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FaPrayingHands className="text-3xl text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Prayers</h3>
            </div>
            <span className="text-2xl font-bold text-primary-600">{goals.prayers}</span>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress.prayers}%` }}></div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Prayers completed: {goals.prayers}/150</p>
        </div>

        {/* Charity Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FaHandHoldingHeart className="text-3xl text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Charity</h3>
            </div>
            <span className="text-2xl font-bold text-primary-600">${goals.charity}</span>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-600 transition-all" style={{ width: `${progress.charity}%` }}></div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Total donated: ${goals.charity}</p>
        </div>

        {/* Good Deeds Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FaStar className="text-3xl text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Good Deeds</h3>
            </div>
            <span className="text-2xl font-bold text-primary-600">{goals.goodDeeds}</span>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 transition-all" style={{ width: `${progress.deeds}%` }}></div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Deeds completed: {goals.goodDeeds}</p>
        </div>
      </div>

      {/* Daily Goals Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Daily Progress</h2>
        <form onSubmit={handleDailySubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Quran Pages Read</label>
              <input
                type="number"
                value={daily.quran}
                onChange={(e) => setDaily({ ...daily, quran: e.target.value })}
                className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter number of pages"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Prayers Completed</label>
              <input
                type="number"
                value={daily.prayer}
                onChange={(e) => setDaily({ ...daily, prayer: e.target.value })}
                className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter number of prayers"
                min="0"
                max="5"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Charity Amount ($)</label>
              <input
                type="number"
                value={daily.charity}
                onChange={(e) => setDaily({ ...daily, charity: e.target.value })}
                className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter amount"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Good Deeds</label>
              <input
                type="number"
                value={daily.deed}
                onChange={(e) => setDaily({ ...daily, deed: e.target.value })}
                className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter number of deeds"
                min="0"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Daily Progress'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Goals;
