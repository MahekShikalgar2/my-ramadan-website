import React, { useState, useEffect } from 'react';
import { FaCompass } from 'react-icons/fa';

const Qibla = () => {
  const [direction, setDirection] = useState(0);
  const [location, setLocation] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          calculateQibla(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError('Please enable location access to find Qibla direction');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  const calculateQibla = (lat, lng) => {
    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    // Convert to radians
    const lat1 = toRadians(lat);
    const lng1 = toRadians(lng);
    const lat2 = toRadians(kaabaLat);
    const lng2 = toRadians(kaabaLng);

    // Calculate direction
    const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
    
    let qibla = toDegrees(Math.atan2(y, x));
    qibla = (qibla + 360) % 360; // Normalize to 0-360
    
    setQiblaDirection(Math.round(qibla));
  };

  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const toDegrees = (radians) => radians * (180 / Math.PI);

  const handleCompass = (e) => {
    if (e.alpha) {
      setDirection(e.alpha);
    }
  };

  useEffect(() => {
    window.addEventListener('deviceorientation', handleCompass);
    return () => window.removeEventListener('deviceorientation', handleCompass);
  }, []);

  const getDirectionName = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Qibla Direction Finder</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {/* Compass */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Compass Circle */}
          <div className="absolute inset-0 border-4 border-gray-300 dark:border-gray-600 rounded-full"></div>
          
          {/* Compass Directions */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-bold text-gray-400">N</div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rotate-90">
            <div className="text-2xl font-bold text-gray-400">E</div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rotate-180">
            <div className="text-2xl font-bold text-gray-400">S</div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center -rotate-90">
            <div className="text-2xl font-bold text-gray-400">W</div>
          </div>

          {/* Compass Needle */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
            style={{ transform: `rotate(${qiblaDirection || 0}deg)` }}
          >
            <div className="relative">
              <div className="w-1 h-24 bg-red-500 absolute left-1/2 -top-12 -translate-x-1/2"></div>
              <FaCompass className="text-4xl text-primary-600" />
            </div>
          </div>
        </div>

        {/* Qibla Info */}
        {qiblaDirection && (
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Qibla Direction:
            </p>
            <p className="text-4xl font-bold text-primary-600 mb-2">
              {qiblaDirection}° {getDirectionName(qiblaDirection)}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Face this direction for prayer
            </p>
          </div>
        )}

        {location && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your Location: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>💡 For best results:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Place your device on a flat surface</li>
            <li>Stay away from magnetic interference</li>
            <li>Calibrate your compass by moving your phone in a figure-8 motion</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Qibla;
