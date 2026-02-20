import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from '../hooks/useLocation';
import { format, differenceInSeconds } from 'date-fns';
import { FaMapMarkerAlt, FaSyncAlt } from 'react-icons/fa';

const PrayerTimesWidget = () => {
  const { location, error: locationError } = useLocation();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      fetchPrayerTimes();
    }
  }, [location]);

  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer();
      const timer = setInterval(calculateNextPrayer, 1000);
      return () => clearInterval(timer);
    }
  }, [prayerTimes]);

  const fetchPrayerTimes = async () => {
    try {
      setLoading(true);
      const date = new Date();
      const response = await axios.get(
        `http://api.aladhan.com/v1/timings/${date.getTime()         /1000}?latitude=${location.lat}&longitude=${location.lng}&method=2`
      );
      
      const timings = response.data.data.timings;
      setPrayerTimes(timings);
      setError(null);
    } catch (err) {
      setError('Failed to fetch prayer times');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPrayer = () => {
    if (!prayerTimes) return;

    const now = new Date();
    const prayers = [
      { name: 'Fajr', time: prayerTimes.Fajr },
      { name: 'Sunrise', time: prayerTimes.Sunrise },
      { name: 'Dhuhr', time: prayerTimes.Dhuhr },
      { name: 'Asr', time: prayerTimes.Asr },
      { name: 'Maghrib', time: prayerTimes.Maghrib },
      { name: 'Isha', time: prayerTimes.Isha }
    ];

    // Convert prayer times to Date objects for today
    const prayerDates = prayers.map(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return { ...prayer, date };
    });

    // Find next prayer
    const next = prayerDates.find(prayer => prayer.date > now);
    
    if (next) {
      setNextPrayer(next);
      const diff = differenceInSeconds(next.date, now);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    } else {
      // If no next prayer today, get Fajr for tomorrow
      const fajrTomorrow = { ...prayerDates[0] };
      fajrTomorrow.date.setDate(fajrTomorrow.date.getDate() + 1);
      setNextPrayer(fajrTomorrow);
      const diff = differenceInSeconds(fajrTomorrow.date, now);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || locationError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <p className="text-red-500 dark:text-red-400">
          {error || locationError}. Please enable location access or try again later.
        </p>
        <button 
          onClick={fetchPrayerTimes}
          className="mt-4 flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
        >
          <FaSyncAlt /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prayer Times</h2>
        {location && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FaMapMarkerAlt className="mr-1 text-primary-600" />
            {location.city}, {location.country}
          </div>
        )}
      </div>

      {nextPrayer && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-xl p-4 mb-6">
          <p className="text-sm text-primary-700 dark:text-primary-300">Next Prayer: {nextPrayer.name}</p>
          <p className="text-3xl font-mono font-bold text-primary-800 dark:text-primary-200">{countdown}</p>
        </div>
      )}

      <div className="space-y-3">
        {prayerTimes && ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => (
          <div key={prayer} className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-0">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{prayer}</span>
            <span className="text-gray-900 dark:text-white font-semibold">{prayerTimes[prayer]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimesWidget;