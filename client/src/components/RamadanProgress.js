import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const RamadanProgress = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState({
    completedDays: 0,
    totalTasks: 0,
    completedTasks: 0,
    currentDay: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateCurrentDay();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const calculateCurrentDay = () => {
    // Calculate current Ramadan day
    const startDate = new Date('2024-03-10');
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const currentDay = Math.min(Math.max(diffDays, 1), 30);
    
    setUserProgress(prev => ({ ...prev, currentDay }));
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user's checklist data
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/checklist`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const checklist = response.data || {};
      
      // Calculate statistics
      let completedDays = 0;
      let totalTasks = 0;
      let completedTasks = 0;
      
      Object.keys(checklist).forEach(day => {
        const dayTasks = checklist[day];
        if (dayTasks) {
          const dayCompletedTasks = Object.values(dayTasks).filter(v => v === true).length;
          totalTasks += Object.keys(dayTasks).length;
          completedTasks += dayCompletedTasks;
          
          // Check if all tasks for this day are completed
          if (dayCompletedTasks === Object.keys(dayTasks).length && Object.keys(dayTasks).length > 0) {
            completedDays++;
          }
        }
      });
      
      setUserProgress({
        completedDays,
        totalTasks,
        completedTasks,
        currentDay: userProgress.currentDay
      });
      
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const progress = (userProgress.currentDay / 30) * 100;
  const taskProgress = userProgress.totalTasks > 0 
    ? (userProgress.completedTasks / userProgress.totalTasks) * 100 
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ramadan Progress</h2>
        <span className="text-lg font-semibold text-primary-600">
          Day {userProgress.currentDay} of 30
        </span>
      </div>
      
      {/* Main Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Month Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* User-specific progress (only shown when logged in) */}
      {user && (
        <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Your Personal Progress
          </h3>
          
          {/* Completed Days */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">Days Completed</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {userProgress.completedDays}/30
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(userProgress.completedDays / 30) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Tasks Completed */}
          {userProgress.totalTasks > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Tasks Completed</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {userProgress.completedTasks}/{userProgress.totalTasks}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${taskProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Updating progress...
            </div>
          )}
        </div>
      )}

      {/* Login Prompt for non-logged-in users */}
      {!user && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <a href="/login" className="text-primary-600 hover:underline font-medium">Login</a> to track your personal progress
          </p>
        </div>
      )}
      
      {/* Milestones */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-4">
        <div className={`text-center ${userProgress.currentDay >= 10 ? 'text-primary-600 font-semibold' : ''}`}>
          <div className="text-lg mb-1">10</div>
          <div className="text-xs">First Ashra</div>
          <div className="text-xs text-gray-500">Mercy</div>
          {user && userProgress.completedDays >= 10 && (
            <FaCheckCircle className="text-green-500 mx-auto mt-1" />
          )}
        </div>
        <div className={`text-center ${userProgress.currentDay >= 20 ? 'text-primary-600 font-semibold' : ''}`}>
          <div className="text-lg mb-1">20</div>
          <div className="text-xs">Second Ashra</div>
          <div className="text-xs text-gray-500">Forgiveness</div>
          {user && userProgress.completedDays >= 20 && (
            <FaCheckCircle className="text-green-500 mx-auto mt-1" />
          )}
        </div>
        <div className={`text-center ${userProgress.currentDay >= 30 ? 'text-primary-600 font-semibold' : ''}`}>
          <div className="text-lg mb-1">30</div>
          <div className="text-xs">Third Ashra</div>
          <div className="text-xs text-gray-500">Salvation</div>
          {user && userProgress.completedDays >= 30 && (
            <FaCheckCircle className="text-green-500 mx-auto mt-1" />
          )}
        </div>
      </div>

      {/* Special Nights Indicator */}
      {userProgress.currentDay >= 21 && (
        <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-lg text-center">
          <p className="text-purple-800 dark:text-purple-200 font-semibold">
            ✨ Last 10 Nights - Seek Laylatul Qadr ✨
          </p>
          {user && (
            <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
              You've completed {userProgress.completedDays} days so far
            </p>
          )}
        </div>
      )}

      {/* Summary for logged-in users */}
      {user && userProgress.completedDays > 0 && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            🎉 You've completed {userProgress.completedDays} full days of worship!
          </p>
        </div>
      )}
    </div>
  );
};

export default RamadanProgress;
