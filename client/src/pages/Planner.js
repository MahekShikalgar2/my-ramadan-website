import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCheck, FaStar, FaHandHoldingHeart, FaQuran, FaPrayingHands } from 'react-icons/fa';
import { format, addDays, isToday } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';

const Planner = () => {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState(1);
  const [checklist, setChecklist] = useState({});
  const [completedDays, setCompletedDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const tasks = [
    { id: 'fajr', name: 'Fajr Prayer', icon: <FaPrayingHands />, color: 'bg-blue-500' },
    { id: 'dhuhr', name: 'Dhuhr Prayer', icon: <FaPrayingHands />, color: 'bg-green-500' },
    { id: 'asr', name: 'Asr Prayer', icon: <FaPrayingHands />, color: 'bg-yellow-500' },
    { id: 'maghrib', name: 'Maghrib Prayer', icon: <FaPrayingHands />, color: 'bg-orange-500' },
    { id: 'isha', name: 'Isha Prayer', icon: <FaPrayingHands />, color: 'bg-purple-500' },
    { id: 'taraweeh', name: 'Taraweeh Prayer', icon: <FaStar />, color: 'bg-indigo-500' },
    { id: 'quran', name: 'Quran Reading (1 Juz)', icon: <FaQuran />, color: 'bg-emerald-500' },
    { id: 'charity', name: 'Charity/Sadaqah', icon: <FaHandHoldingHeart />, color: 'bg-pink-500' },
    { id: 'goodDeed', name: 'Good Deed', icon: <FaStar />, color: 'bg-amber-500' }
  ];

  useEffect(() => {
    // Calculate current Ramadan day
    const startDate = new Date('2024-03-10');
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setCurrentDay(Math.min(Math.max(diffDays, 1), 30));

    loadChecklist();
  }, []);

  const loadChecklist = async () => {
    setLoading(true);
    if (user) {
      try {
        const token = localStorage.getItem('token');
        console.log('Loading checklist for user:', user.email);
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/checklist`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('Checklist loaded:', response.data);
        
        // Ensure we have an object
        const loadedData = response.data || {};
        setChecklist(loadedData);
        
        // Calculate completed days from loaded data
        const completed = Object.keys(loadedData).filter(day => {
          const tasks = loadedData[day];
          return tasks && Object.values(tasks).every(v => v === true);
        });
        setCompletedDays(completed);
        
      } catch (error) {
        console.error('Error loading checklist:', error);
        toast.error('Failed to load your planner data');
        setChecklist({});
      }
    } else {
      // Load from localStorage for non-logged-in users
      const saved = localStorage.getItem('ramadan-checklist');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setChecklist(parsed);
          
          // Calculate completed days
          const completed = Object.keys(parsed).filter(day => {
            const tasks = parsed[day];
            return tasks && Object.values(tasks).every(v => v === true);
          });
          setCompletedDays(completed);
        } catch (e) {
          console.error('Error parsing localStorage data:', e);
          setChecklist({});
        }
      }
    }
    setLoading(false);
  };

  const toggleTask = async (day, taskId) => {
    // Create new checklist state
    const newChecklist = { ...checklist };
    if (!newChecklist[day]) {
      newChecklist[day] = {};
    }
    newChecklist[day][taskId] = !newChecklist[day]?.[taskId];
    
    // Update state
    setChecklist(newChecklist);

    // Calculate completed days
    const completed = Object.keys(newChecklist).filter(day => {
      const tasks = newChecklist[day];
      return tasks && Object.values(tasks).every(v => v === true);
    });
    setCompletedDays(completed);

    // Save to backend for logged-in users
    if (user) {
      try {
        const token = localStorage.getItem('token');
        
        console.log('Saving checklist:', newChecklist);
        
        await axios.post(
          `${process.env.REACT_APP_API_URL}/users/checklist`,
          newChecklist,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        toast.success('Progress saved!');
        
        // Trigger dashboard refresh
        window.dispatchEvent(new Event('dashboard-refresh'));
      } catch (error) {
        console.error('Error saving checklist:', error);
        toast.error('Failed to save progress');
      }
    } else {
      // Save to localStorage for non-logged-in users
      localStorage.setItem('ramadan-checklist', JSON.stringify(newChecklist));
      toast.success('Progress saved locally');
    }
  };

  const getDayProgress = (day) => {
    if (!checklist[day]) return 0;
    const tasksForDay = Object.values(checklist[day]);
    if (tasksForDay.length === 0) return 0;
    const completed = tasksForDay.filter(v => v).length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          30-Day Ramadan Planner
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your daily worship and good deeds throughout Ramadan
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Overall Progress
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-500"
                style={{ width: `${(completedDays.length / 30) * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {completedDays.length}/30 Days
          </span>
        </div>
      </div>

      {/* Login Prompt for non-logged-in users */}
      {!user && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
          <p className="text-yellow-800 dark:text-yellow-200">
            You're using local storage. <a href="/login" className="font-semibold underline">Login</a> to save your progress to the cloud!
          </p>
        </div>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current Day: {currentDay} | Saved Days: {Object.keys(checklist).length}
          </p>
        </div>
      )}

      {/* Daily Planner Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const isCurrentDay = day === currentDay;
          const progress = getDayProgress(day);
          const dayCompleted = completedDays.includes(day.toString());

          return (
            <div
              key={day}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all ${
                isCurrentDay ? 'ring-2 ring-primary-600 dark:ring-primary-400' : ''
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-4 ${
                  dayCompleted
                    ? 'bg-green-500'
                    : isCurrentDay
                    ? 'bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <h3 className="text-lg font-semibold text-white">
                  Day {day} - Ramadan {day}
                  {isCurrentDay && ' (Today)'}
                </h3>
                <p className="text-sm text-white/80">
                  {format(addDays(new Date('2024-03-10'), day - 1), 'MMMM d')}
                </p>
              </div>

              {/* Tasks */}
              <div className="p-4 space-y-3">
                {tasks.map(task => (
                  <label
                    key={task.id}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[day]?.[task.id] || false}
                      onChange={() => toggleTask(day, task.id)}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex items-center flex-1">
                      <span className={`w-6 h-6 ${task.color} rounded-full flex items-center justify-center text-white text-xs mr-2`}>
                        {task.icon}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {task.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Daily Progress</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {progress}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Planner;
