import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaBookmark, FaPlay, FaPause } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Quran = () => {
  const { user } = useAuth();
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dailyVerse, setDailyVerse] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    fetchSurahs();
    setDailyVerse(getRandomVerse());
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await axios.get('https://api.alquran.cloud/v1/surah');
      setSurahs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surahs:', error);
      setLoading(false);
    }
  };

  const fetchSurah = async (surahNumber) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.asad`
      );
      const arabic = response.data.data[0].ayahs;
      const translation = response.data.data[1].ayahs;
      
      const combinedVerses = arabic.map((verse, index) => ({
        number: verse.numberInSurah,
        arabic: verse.text,
        translation: translation[index].text,
        audio: verse.audio
      }));
      
      setVerses(combinedVerses);
      setSelectedSurah(response.data.data[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surah:', error);
      setLoading(false);
    }
  };

  const getRandomVerse = () => {
    const verses = [
      {
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
        translation: "O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous",
        surah: "Al-Baqarah",
        verse: 183
      },
      {
        arabic: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ",
        translation: "The month of Ramadan [is that] in which was revealed the Qur'an, a guidance for the people and clear proofs of guidance and criterion",
        surah: "Al-Baqarah",
        verse: 185
      },
      {
        arabic: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
        translation: "Indeed, We sent the Qur'an down during the Night of Decree",
        surah: "Al-Qadr",
        verse: 1
      }
    ];
    return verses[Math.floor(Math.random() * verses.length)];
  };

  const playAudio = (audioUrl) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    audio.play();
    setAudioPlaying(true);
    audio.onended = () => {
      setAudioPlaying(false);
      setCurrentAudio(null);
    };
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setAudioPlaying(false);
    }
  };

  const filteredSurahs = surahs.filter(surah =>
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !selectedSurah) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Daily Verse */}
      {dailyVerse && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Verse of the Day</h2>
          <p className="text-3xl font-arabic mb-4 leading-loose text-right" dir="rtl">
            {dailyVerse.arabic}
          </p>
          <p className="text-lg mb-2">{dailyVerse.translation}</p>
          <p className="text-sm opacity-75">
            {dailyVerse.surah} - Verse {dailyVerse.verse}
          </p>
        </div>
      )}

      {/* 30-Day Quran Completion Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          30-Day Quran Completion Plan
        </h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {Array.from({ length: 30 }, (_, i) => (
            <button
              key={i}
              className="aspect-square bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-lg flex items-center justify-center text-primary-800 dark:text-primary-200 font-medium transition-colors"
              onClick={() => {
                // Navigate to the appropriate Juz
                const juzStart = i * 20 + 1;
                // Implement Juz navigation
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Complete one Juz per day to finish the Quran in Ramadan
        </p>
      </div>

      {/* Quran Reader */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Surah List */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
          <div className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Surah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredSurahs.map(surah => (
              <button
                key={surah.number}
                onClick={() => fetchSurah(surah.number)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedSurah?.number === surah.number
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{surah.englishName}</span>
                  <span className="text-sm opacity-75">{surah.number}</span>
                </div>
                <div className="flex justify-between text-sm opacity-75 mt-1">
                  <span>{surah.name}</span>
                  <span>{surah.numberOfAyahs} verses</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quran Display */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          {selectedSurah ? (
            <>
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedSurah.englishName}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} Verses
                </p>
              </div>

              <div className="space-y-6 max-h-96 overflow-y-auto">
                {verses.map(verse => (
                  <div key={verse.number} className="border-b dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Verse {verse.number}
                      </span>
                      <button
                        onClick={() => verse.audio && playAudio(verse.audio)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {audioPlaying && currentAudio ? <FaPause /> : <FaPlay />}
                      </button>
                    </div>
                    <p className="text-2xl font-arabic mb-3 leading-loose text-right" dir="rtl">
                      {verse.arabic}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {verse.translation}
                    </p>
                    {user && (
                      <button className="mt-2 text-primary-600 dark:text-primary-400 hover:underline text-sm flex items-center gap-1">
                        <FaBookmark /> Save to bookmarks
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Select a Surah to begin reading
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quran;