import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaSyncAlt } from 'react-icons/fa';

const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          setError('Please enable location access for accurate prayer times');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

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
        `http://api.aladhan.com/v1/timings/${Math.floor(date.getTime() / 1000)}`,
        {
          params: {
            latitude: location.lat,
            longitude: location.lng,
            method: 2
          }
        }
      );
      
      setPrayerTimes(response.data.data.timings);
      setError(null);
    } catch (err) {
      setError('Failed to fetch prayer times');
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
      const diff = Math.floor((next.date - now) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    } else {
      // If no next prayer today, get Fajr for tomorrow
      const fajrTomorrow = { ...prayerDates[0] };
      fajrTomorrow.date.setDate(fajrTomorrow.date.getDate() + 1);
      setNextPrayer(fajrTomorrow);
      const diff = Math.floor((fajrTomorrow.date - now) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <button 
          onClick={fetchPrayerTimes}
          className="flex items-center gap-2 mx-auto text-primary-600 dark:text-primary-400 hover:underline"
        >
          <FaSyncAlt /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Prayer Times</h1>
      
      {/* Next Prayer Countdown */}
      {nextPrayer && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white mb-6">
          <p className="text-lg opacity-90 mb-2">Next Prayer: {nextPrayer.name}</p>
          <p className="text-4xl font-mono font-bold">{countdown}</p>
        </div>
      )}

      {/* Prayer Times List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        {location && (
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300 mb-4 pb-4 border-b dark:border-gray-700">
            <FaMapMarkerAlt className="mr-1 text-primary-600" />
            Location: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
          </div>
        )}

        {prayerTimes && ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => (
          <div key={prayer} className="flex justify-between items-center py-3 border-b dark:border-gray-700 last:border-0">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{prayer}</span>
            <span className="text-gray-900 dark:text-white font-semibold">{prayerTimes[prayer]}</span>
          </div>
        ))}
      </div>

      {/* Date Info */}
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Prayer times for today, {new Date().toLocaleDateString()}</p>
        <p className="mt-2">Method: Islamic Society of North America (ISNA)</p>
      </div>
    </div>
  );
};

export default PrayerTimes;
