import React, { useState, useEffect } from 'react';
import { FaSearch, FaHeart, FaCopy, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dua = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [duas, setDuas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [feeling, setFeeling] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const categories = [
    { id: 'all', name: 'All Duas', icon: '📖' },
    { id: 'fasting', name: 'Fasting', icon: '🌙' },
    { id: 'forgiveness', name: 'Forgiveness', icon: '🤲' },
    { id: 'laylatul-qadr', name: 'Laylatul Qadr', icon: '✨' },
    { id: 'daily-life', name: 'Daily Life', icon: '☀️' },
    { id: 'general', name: 'General', icon: '❤️' }
  ];

  useEffect(() => {
    fetchDuas();
  }, []);

  const fetchDuas = async () => {
    try {
      // In production, fetch from your backend
      // For demo, using sample data
      const sampleDuas = [
        {
          id: 1,
          category: 'fasting',
          title: 'Dua for Suhoor',
          arabic: 'وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
          transliteration: 'Wa bi-sawmi ghadin nawaytu min shahri Ramadan',
          translation: 'I intend to keep the fast for tomorrow in the month of Ramadan',
          reference: 'Abu Dawud'
        },
        {
          id: 2,
          category: 'fasting',
          title: 'Dua for Breaking Fast',
          arabic: 'اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
          transliteration: 'Allahumma inni laka sumtu wa bika aamantu wa ala rizq-ika aftartu',
          translation: 'O Allah! I fasted for You and I believe in You and I break my fast with Your sustenance',
          reference: 'Abu Dawud'
        },
        {
          id: 3,
          category: 'forgiveness',
          title: 'Dua for Forgiveness',
          arabic: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا',
          transliteration: 'Rabbana-ghfir lana dhunubana wa israfana fi amrina',
          translation: 'Our Lord, forgive us our sins and the excess in our affairs',
          reference: 'Quran 3:147'
        },
        {
          id: 4,
          category: 'laylatul-qadr',
          title: 'Dua for Laylatul Qadr',
          arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
          transliteration: 'Allahumma innaka afuwwun tuhibbul afwa fafu anni',
          translation: 'O Allah, You are Forgiving and love forgiveness, so forgive me',
          reference: 'Tirmidhi'
        },
        {
          id: 5,
          category: 'daily-life',
          title: 'Dua for Entering Morning',
          arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ',
          transliteration: 'Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu',
          translation: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die',
          reference: 'Tirmidhi'
        }
      ];
      setDuas(sampleDuas);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching duas:', error);
      setLoading(false);
    }
  };

    const feeling_lower = feeling.toLowerCase();
    if (feeling_lower.includes('sad') || feeling_lower.includes('upset')) {
      setAiSuggestions(suggestions.sad);
    } else if (feeling_lower.includes('stress') || feeling_lower.includes('anxious')) {
      setAiSuggestions(suggestions.stressed);
    } else if (feeling_lower.includes('thank') || feeling_lower.includes('grateful')) {
      setAiSuggestions(suggestions.grateful);
    } else {
      setAiSuggestions([]);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDuas = duas.filter(dua => {
    const matchesCategory = selectedCategory === 'all' || dua.category === selectedCategory;
    const matchesSearch = dua.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dua.translation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI Dua Suggestion Tool */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">AI Dua Suggestion</h2>
        <p className="mb-4">Tell us how you're feeling, and we'll suggest relevant duas</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            placeholder="e.g., I'm feeling sad, stressed, grateful..."
            className="flex-1 px-4 py-2 rounded-lg text-gray-900"
          />
          <button
            onClick={getAISuggestions}
            className="bg-gold-500 hover:bg-gold-600 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Get Suggestions
          </button>
        </div>
        {aiSuggestions.length > 0 && (
          <div className="mt-4 bg-white/10 rounded-lg p-4">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <p className="text-xl font-arabic mb-2" dir="rtl">{suggestion.arabic}</p>
                <p>{suggestion.translation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search duas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Duas Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredDuas.map(dua => (
          <div
            key={dua.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {dua.title}
              </h3>
              <div className="flex gap-2">
                {user && (
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <FaHeart />
                  </button>
                )}
                <button
                  onClick={() => copyToClipboard(dua.arabic, dua.id)}
                  className="text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {copiedId === dua.id ? <FaCheck className="text-green-500" /> : <FaCopy />}
                </button>
              </div>
            </div>
            
            <p className="text-2xl font-arabic mb-4 leading-loose text-right" dir="rtl">
              {dua.arabic}
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-2 italic">
              {dua.transliteration}
            </p>
            
            <p className="text-gray-800 dark:text-gray-200 mb-3">
              {dua.translation}
            </p>
            
            {dua.reference && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reference: {dua.reference}
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredDuas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No duas found</p>
        </div>
      )}
    </div>
  );

export default Dua;