import React, { useState, useEffect } from 'react';
import { differenceInSeconds, parse } from 'date-fns';

const CountdownTimer = () => {
  const [iftarTime, setIftarTime] = useState('');
  const [suhoorTime, setSuhoorTime] = useState('');
  const [timeToIftar, setTimeToIftar] = useState('');
  const [timeToSuhoor, setTimeToSuhoor] = useState('');
  const [currentMeal, setCurrentMeal] = useState('');

  useEffect(() => {
    // In production, fetch actual iftar/suhoor times based on location
    // For demo, using example times
    setIftarTime('18:42');
    setSuhoorTime('04:30');
  }, []);

  useEffect(() => {
    if (iftarTime && suhoorTime) {
      const timer = setInterval(calculateTimes, 1000);
      return () => clearInterval(timer);
    }
  }, [iftarTime, suhoorTime]);

  const calculateTimes = () => {
    const now = new Date();
    const today = new Date();
    
    // Parse iftar time
    const [iftarHour, iftarMinute] = iftarTime.split(':').map(Number);
    const iftar = new Date(today);
    iftar.setHours(iftarHour, iftarMinute, 0, 0);

    // Parse suhoor time (suhoor is before Fajr, so it's for the next day if we're past it)
    const [suhoorHour, suhoorMinute] = suhoorTime.split(':').map(Number);
    const suhoor = new Date(today);
    suhoor.setHours(suhoorHour, suhoorMinute, 0, 0);

    // Adjust if we're past suhoor
    if (now > suhoor) {
      suhoor.setDate(suhoor.getDate() + 1);
    }

    // Determine which is next
    const iftarDiff = iftar > now ? differenceInSeconds(iftar, now) : null;
    const suhoorDiff = suhoor > now ? differenceInSeconds(suhoor, now) : null;

    if (iftarDiff && (iftarDiff < suhoorDiff || !suhoorDiff)) {
      setCurrentMeal('Iftar');
      const hours = Math.floor(iftarDiff / 3600);
      const minutes = Math.floor((iftarDiff % 3600) / 60);
      const seconds = iftarDiff % 60;
      setTimeToIftar(`${hours}h ${minutes}m ${seconds}s`);
      setTimeToSuhoor('');
    } else if (suhoorDiff) {
      setCurrentMeal('Suhoor');
      const hours = Math.floor(suhoorDiff / 3600);
      const minutes = Math.floor((suhoorDiff % 3600) / 60);
      const seconds = suhoorDiff % 60;
      setTimeToSuhoor(`${hours}h ${minutes}m ${seconds}s`);
      setTimeToIftar('');
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
        <p className="text-4xl font-bold mb-2">{iftarTime}</p>
        {currentMeal === 'Iftar' ? (
          <div>
            <p className="text-lg opacity-90">Time until Iftar:</p>
            <p className="text-3xl font-mono font-bold">{timeToIftar}</p>
          </div>
        ) : (
          <p className="text-lg opacity-90">Iftar will be at {iftarTime}</p>
        )}
      </div>

      {/* Suhoor Countdown */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Suhoor Time</h3>
          <span className="text-2xl">🌙</span>
        </div>
        <p className="text-4xl font-bold mb-2">{suhoorTime}</p>
        {currentMeal === 'Suhoor' ? (
          <div>
            <p className="text-lg opacity-90">Time until Suhoor:</p>
            <p className="text-3xl font-mono font-bold">{timeToSuhoor}</p>
          </div>
        ) : (
          <p className="text-lg opacity-90">Suhoor ends at {suhoorTime} tomorrow</p>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;