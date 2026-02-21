import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Get city and country from coordinates (using reverse geocoding)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          setLocation({
            lat: latitude,
            lng: longitude,
            city: data.city || data.locality || 'Unknown',
            country: data.countryName || 'Unknown'
          });
          setError(null);
        } catch (err) {
          setError('Error getting location details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Please enable location access for accurate prayer times');
        setLoading(false);
        console.error(err);
      }
    );
  }, []);

  return { location, error, loading };
};
