import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight, FaQuran, FaHeart, FaHandHoldingHeart } from 'react-icons/fa';
import { GiPrayer, GiStarFormation } from 'react-icons/gi';
import { MdAccessTime, MdMenuBook } from 'react-icons/md';
import PrayerTimesWidget from '../components/PrayerTimesWidget';
import CountdownTimer from '../components/CountdownTimer';
import DailyHadith from '../components/DailyHadith';
import RamadanProgress from '../components/RamadanProgress';

const Home = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ramadanDay, setRamadanDay] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Calculate current Ramadan day (simplified - you'd want to use actual Hijri date)
    const startDate = new Date('2024-03-10'); // Example start date
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setRamadanDay(Math.min(diffDays, 30));

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: 'Prayer Times',
      description: 'Accurate prayer times based on your location',
      icon: <GiPrayer className="text-4xl text-primary-600" />,
      link: '/prayer-times',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Holy Quran',
      description: 'Read Quran with translation and 30-day plan',
      icon: <FaQuran className="text-4xl text-gold-600" />,
      link: '/quran',
      color: 'from-gold-500 to-gold-600'
    },
    {
      title: 'Daily Duas',
      description: 'Essential duas for Ramadan and daily life',
      icon: <FaHeart className="text-4xl text-red-500" />,
      link: '/dua',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Digital Tasbeeh',
      description: 'Count your dhikr with ease',
      icon: '📿',
      link: '/tasbeeh',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Ramadan Planner',
      description: '30-day worship planner and checklist',
      icon: <MdAccessTime className="text-4xl text-blue-600" />,
      link: '/planner',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Learn Islam',
      description: 'Understanding fasting and Ramadan rules',
      icon: <MdMenuBook className="text-4xl text-teal-600" />,
      link: '/learn',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Qibla Finder',
      description: 'Find direction to Kaaba',
      icon: <GiStarFormation className="text-4xl text-orange-600" />,
      link: '/qibla',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Charity Tracker',
      description: 'Track your sadaqah and zakat',
      icon: <FaHandHoldingHeart className="text-4xl text-pink-600" />,
      link: '/goals',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16 px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 font-arabic">
            رمضان كريم
          </h1>
          <p className="text-2xl md:text-3xl mb-8">Ramadan Kareem</p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gold-500 hover:bg-gold-600 text-gray-900 px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                Start Your Journey <FaArrowRight />
              </Link>
              <Link
                to="/learn"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          )}
        </div>

        {/* Decorative Mosque Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full">
            <path fill="white" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Welcome Message for Logged-in Users */}
      {user && (
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}! 🌙
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Day {ramadanDay} of Ramadan. May this blessed month bring peace and prosperity to you and your family.
          </p>
        </section>
      )}

      {/* Prayer Times Widget */}
      <PrayerTimesWidget />

      {/* Countdown Timer */}
      <CountdownTimer />

      {/* Daily Hadith */}
      <DailyHadith />

      {/* Ramadan Progress */}
      <RamadanProgress />

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Essential Ramadan Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              <div className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">Explore</span>
                  <FaArrowRight className="ml-2 text-xs" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Nights Banner */}
      <section className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Laylatul Qadr</h2>
        <p className="text-xl mb-6">The Night of Power - Better than 1000 months</p>
        <p className="text-lg opacity-90">Seek it in the last 10 nights of Ramadan</p>
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Link
            to="/dua?category=laylatul-qadr"
            className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
          >
            Special Duas
          </Link>
          <Link
            to="/learn/laylatul-qadr"
            className="border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-purple-900 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;