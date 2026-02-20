import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaRedo, FaSave, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Tasbeeh = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [dhikr, setDhikr] = useState('SubhanAllah');
  const [savedCounts, setSavedCounts] = useState([]);
  const [beads, setBeads] = useState([]);

  const dhikrList = [
    { name: 'SubhanAllah', meaning: 'Glory be to Allah', count: 33 },
    { name: 'Alhamdulillah', meaning: 'All praise is due to Allah', count: 33 },
    { name: 'Allahu Akbar', meaning: 'Allah is the Greatest', count: 34 },
    { name: 'La ilaha illallah', meaning: 'There is no god but Allah', count: 100 },
    { name: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah', count: 100 }
  ];

  useEffect(() => {
    // Create virtual beads
    setBeads(Array(target).fill(false));
  }, [target]);

  useEffect(() => {
    // Update beads based on count
    const newBeads = Array(target).fill(false).map((_, index) => index < count);
    setBeads(newBeads);
  }, [count, target]);

  const increment = () => {
    if (count < target) {
      setCount(count + 1);
      if (count + 1 === target) {
        // Play completion sound or show notification
        if (Notification.permission === 'granted') {
          new Notification('Tasbeeh Complete!', {
            body: `You've completed ${count + 1} ${dhikr}`,
            icon: '/crescent-moon.png'
          });
        }
      }
    }
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const reset = () => {
    setCount(0);
  };

  const saveCount = async () => {
    if (!user) return;

    try {
      await axios.post('/api/users/tasbeeh', {
        name: dhikr,
        count: count
      });
      
      setSavedCounts([...savedCounts, { name: dhikr, count, date: new Date() }]);
      reset();
    } catch (error) {
      console.error('Error saving tasbeeh:', error);
    }
  };

  const changeDhikr = (selected) => {
    setDhikr(selected.name);
    setTarget(selected.count);
    reset();
  };

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Tasbeeh Counter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Digital Tasbeeh
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          {dhikr} - {target} times
        </p>

        {/* Dhikr Selector */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {dhikrList.map(item => (
            <button
              key={item.name}
              onClick={() => changeDhikr(item)}
              className={`p-3 rounded-lg text-center transition-colors ${
                dhikr === item.name
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs opacity-75">{item.count}</div>
            </button>
          ))}
        </div>

        {/* Beads Display */}
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="flex flex-wrap justify-center gap-2">
            {beads.map((active, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full transition-colors cursor-pointer transform hover:scale-110 ${
                  active
                    ? 'bg-primary-600 shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => index < count ? setCount(index) : setCount(index + 1)}
              />
            ))}
          </div>
        </div>

        {/* Counter Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {count}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            out of {target}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={decrement}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-2xl transition-colors disabled:opacity-50"
            disabled={count === 0}
          >
            <FaMinus />
          </button>
          <button
            onClick={increment}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center text-2xl transition-colors"
          >
            <FaPlus />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <FaRedo /> Reset
          </button>
          {user && (
            <button
              onClick={saveCount}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              disabled={count === 0}
            >
              <FaSave /> Save
            </button>
          )}
        </div>
      </div>

      {/* Saved Counts */}
      {user && savedCounts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Tasbeeh
          </h3>
          <div className="space-y-3">
            {savedCounts.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasbeeh;