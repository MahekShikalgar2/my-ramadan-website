import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSyncAlt } from 'react-icons/fa';

const DailyHadith = () => {
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHadith();
  }, []);

  const fetchHadith = async () => {
    try {
      setLoading(true);
      // Using a free hadith API
      const response = await axios.get('https://hadis-api-id.vercel.app/hadith/abu-dawud/random');
      
      // Transform API response to our format
      const data = {
        arabic: response.data.contents.arab,
        english: response.data.contents.id,
        narrator: response.data.data.perawi,
        source: `Hadith ${response.data.data.number}`
      };
      
      setHadith(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching hadith:', error);
      // Fallback hadith if API fails
      setHadith({
        arabic: 'عن أبي هريرة رضي الله عنه أن رسول الله صلى الله عليه وسلم قال: "إذا جاء رمضان فتحت أبواب الجنة وغلقت أبواب النار وصفدت الشياطين"',
        english: 'When Ramadan begins, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained',
        narrator: 'Abu Hurairah',
        source: 'Sahih Muslim'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Hadith</h2>
        <button 
          onClick={fetchHadith}
          className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
          title="Get new hadith"
        >
          <FaSyncAlt />
        </button>
      </div>
      {hadith && (
        <>
          <p className="text-right text-xl font-arabic mb-4 leading-loose" dir="rtl">
            {hadith.arabic}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {hadith.english}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hadith.narrator} - {hadith.source}
          </p>
        </>
      )}
    </div>
  );
};

export default DailyHadith;
