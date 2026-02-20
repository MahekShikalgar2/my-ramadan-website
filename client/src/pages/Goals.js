import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaQuran, FaPrayingHands, FaHandHoldingHeart, FaStar } from 'react-icons/fa';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState({
    quranPages: user?.ramadanGoals?.quranPages || 0,
    prayers: user?.ramadanGoals?.prayers || 0,
    charity: user?.ramadanGoals?.charity || 0,
    goodDeeds: user?.ramadanGoals?.goodDeeds || 0
  });

  const [daily, setDaily] = useState({
    quran: '',
    prayer: '',
    charity: '',
    deed: ''
  });

  const handleGoalChange = (field, value) => {
    setGoals({ ...goals, [field]: parseInt(value) || 0 });
  };

  const handleDailySubmit = (e) => {
    e.preventDefault();
    // Save daily goals
    console.log('Daily goals:', daily);
    // Reset form
    setDaily({ quran: '', prayer: '', charity: '', deed: '' });
  };

  const progress = {
    quran: Math.min((goals.quranPages / 604) * 100, 100), // Quran has 604 pages
    prayers: Math.min((goals.prayers / 5) * 100, 100),
    charity: Math.min((goals.charity / 100) * 100, 100),
    deeds: Math.min((goals.goodDeeds / 10) * 100, 100)
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ramadan Goals Tracker</h1>

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
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Prayers completed: {goals.prayers}/5</p>
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
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Update Goals
          </button>
        </form>
      </div>
    </div>
  );
};

export default Goals;
