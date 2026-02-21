import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const Quran = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [playingVerse, setPlayingVerse] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    fetchSurahs();
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
      // Fetch both Arabic text and English translation
      const [arabicRes, englishRes, audioRes] = await Promise.all([
        axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`),
        axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
        axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`)
      ]);
      
      const arabicVerses = arabicRes.data.data.ayahs;
      const englishVerses = englishRes.data.data.ayahs;
      
      const combinedVerses = arabicVerses.map((verse, index) => ({
        number: verse.numberInSurah,
        arabic: verse.text,
        translation: englishVerses[index]?.text || '',
        audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verse.number}.mp3`
      }));
      
      setVerses(combinedVerses);
      setSelectedSurah(arabicRes.data.data);
      setLoading(false);
      
      // Stop any playing audio
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error fetching surah:', error);
      setLoading(false);
    }
  };

  const playVerse = (verseNumber, audioUrl) => {
    // Stop current audio if playing
    if (audio) {
      audio.pause();
    }

    // Create new audio
    const newAudio = new Audio(audioUrl);
    newAudio.volume = volume;
    
    newAudio.addEventListener('play', () => {
      setIsPlaying(true);
      setPlayingVerse(verseNumber);
    });
    
    newAudio.addEventListener('ended', () => {
      setIsPlaying(false);
      setPlayingVerse(null);
    });
    
    newAudio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      alert('Sorry, audio is not available for this verse. Please try another reciter.');
      setIsPlaying(false);
      setPlayingVerse(null);
    });

    newAudio.play().catch(error => {
      console.error('Playback error:', error);
      alert('Unable to play audio. Please check your internet connection.');
    });
    
    setAudio(newAudio);
  };

  const pauseVerse = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const changeVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const filteredSurahs = surahs.filter(surah =>
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.name.includes(searchTerm)
  );

  if (loading && !selectedSurah) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Surah List */}
      <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Surahs</h2>
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
              <div className="flex justify-between">
                <span className="font-medium">{surah.englishName}</span>
                <span className="text-sm opacity-75">{surah.number}</span>
              </div>
              <div className="text-sm opacity-75">{surah.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quran Display */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        {selectedSurah ? (
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedSurah.englishName}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} Verses
              </p>
              
              {/* Volume Control */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <FaVolumeMute className="text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={changeVolume}
                  className="w-32"
                />
                <FaVolumeUp className="text-gray-400" />
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {verses.map(verse => (
                <div key={verse.number} className="border-b dark:border-gray-700 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Verse {verse.number}
                    </span>
                    <button
                      onClick={() => {
                        if (isPlaying && playingVerse === verse.number) {
                          pauseVerse();
                        } else {
                          playVerse(verse.number, verse.audio);
                        }
                      }}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {isPlaying && playingVerse === verse.number ? (
                        <FaPause className="text-primary-600" />
                      ) : (
                        <FaPlay className="text-primary-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-2xl font-arabic mb-3 leading-loose text-right" dir="rtl">
                    {verse.arabic}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {verse.translation}
                  </p>
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
  );
};

export default Quran;
