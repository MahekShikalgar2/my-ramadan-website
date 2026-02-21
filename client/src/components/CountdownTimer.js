import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeToIftar, setTimeToIftar] = useState('');
  const [timeToSuhoor, setTimeToSuhoor] = useState('');
  const [currentMeal, setCurrentMeal] = useState('');

  useEffect(() => {
    const timer = setInterval(calculateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimes = () => {
    const now = new Date();
    
    // Set iftar time (Maghrib) - typically around sunset
    const iftar = new Date();
    iftar.setHours(18, 30, 0, 0); // 6:30 PM example time
    
    // Set suhoor time (end of suhoor - before Fajr)
    const suhoor = new Date();
    suhoor.setHours(4, 30, 0, 0); // 4:30 AM example time
    
    // Adjust if we're past these times
    if (now > iftar) {
      iftar.setDate(iftar.getDate() + 1);
    }
    if (now > suhoor) {
      suhoor.setDate(suhoor.getDate() + 1);
    }

    // Calculate time differences
    const iftarDiff = Math.floor((iftar - now) / 1000);
    const suhoorDiff = Math.floor((suhoor - now) / 1000);

    // Format countdown
    const formatTime = (seconds) => {
      if (seconds < 0) return '00:00:00';
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    setTimeToIftar(formatTime(iftarDiff));
    setTimeToSuhoor(formatTime(suhoorDiff));
    
    // Determine which is next
    if (iftarDiff < suhoorDiff) {
      setCurrentMeal('Iftar');
    } else {
      setCurrentMeal('Suhoor');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Iftar Countdown */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Iftar Time</h3>
          <span className="text-2xl">🌅</span>
        </div>
        <p className="text-4xl font-bold mb-2">{timeToIftar}</p>
        {currentMeal === 'Iftar' ? (
          <p className="text-lg opacity-90">Time until Iftar</p>
        ) : (
          <p className="text-lg opacity-90">Next: Iftar</p>
        )}
      </div>

      {/* Suhoor Countdown */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Suhoor Time</h3>
          <span className="text-2xl">🌙</span>
        </div>
        <p className="text-4xl font-bold mb-2">{timeToSuhoor}</p>
        {currentMeal === 'Suhoor' ? (
          <p className="text-lg opacity-90">Time until Suhoor ends</p>
        ) : (
          <p className="text-lg opacity-90">Next: Suhoor</p>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
