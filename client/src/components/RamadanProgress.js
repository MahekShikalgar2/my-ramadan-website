import React from 'react';
import { useAuth } from '../context/AuthContext';

const RamadanProgress = () => {
  const { user } = useAuth();
  
  // Calculate current Ramadan day (simplified)
  const startDate = new Date('2024-03-10');
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const currentDay = Math.min(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 30);
  
  const progress = (currentDay / 30) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ramadan Progress</h2>
        <span className="text-lg font-semibold text-primary-600">
          Day {currentDay} of 30
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Milestones */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-4">
        <div className={`text-center ${currentDay >= 10 ? 'text-primary-600 font-semibold' : ''}`}>
          <div className="text-lg mb-1">10</div>
          <div className="text-xs">First Ashra</div>
          <div className="text-xs text-gray-500">Mercy</div>
        </div>
        <div className={`text-center ${currentDay >= 20 ? 'text-primary-600 font-semibold' : ''}`}>
          <div className="text-lg mb-1">20</div>
          <div className="text-xs">Second Ashra</div>
          <div className="text-xs text-gray-500">Forgiveness</div>
        </div>
        <div className={`text-center ${currentDay >= 30 ? 'text-primary-600 font-semibold' : ''}`}>
          <div className="text-lg mb-1">30</div>
          <div className="text-xs">Third Ashra</div>
          <div className="text-xs text-gray-500">Salvation</div>
        </div>
      </div>

      {/* Special Nights Indicator */}
      {currentDay >= 21 && (
        <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-lg text-center">
          <p className="text-purple-800 dark:text-purple-200 font-semibold">
            ✨ Last 10 Nights - Seek Laylatul Qadr ✨
          </p>
        </div>
      )}
    </div>
  );
};

export default RamadanProgress;
