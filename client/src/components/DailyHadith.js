import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailyHadith = () => {
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHadith();
  }, []);

  const fetchHadith = async () => {
    try {
      // In production, fetch from your backend
      // For now, using sample data
      const hadiths = [
        {
          arabic: 'عن أبي هريرة رضي الله عنه أن رسول الله صلى الله عليه وسلم قال: "إذا جاء رمضان فتحت أبواب الجنة وغلقت أبواب النار وصفدت الشياطين"',
          english: 'When Ramadan begins, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained',
          narrator: 'Abu Hurairah',
          source: 'Sahih Muslim'
        },
        {
          arabic: 'قال رسول الله صلى الله عليه وسلم: "من صام رمضان إيمانا واحتسابا غفر له ما تقدم من ذنبه"',
          english: 'Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven',
          narrator: 'Abu Hurairah',
          source: 'Sahih Bukhari'
        },
        {
          arabic: 'قال رسول الله صلى الله عليه وسلم: "تحروا ليلة القدر في العشر الأواخر من رمضان"',
          english: 'Seek Laylatul Qadr in the last ten nights of Ramadan',
          narrator: 'Aisha',
          source: 'Sahih Bukhari'
        }
      ];
      
      const randomIndex = Math.floor(Math.random() * hadiths.length);
      setHadith(hadiths[randomIndex]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hadith:', error);
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Daily Hadith</h2>
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
