import React, { useState } from 'react';

const Learn = () => {
  const [activeTab, setActiveTab] = useState('fasting');

  const topics = {
    fasting: {
      title: 'Fasting in Ramadan',
      content: [
        {
          subtitle: 'What is Fasting?',
          text: 'Fasting (Sawm) in Ramadan is one of the Five Pillars of Islam. It involves abstaining from food, drink, smoking, and marital relations from dawn (Fajr) until sunset (Maghrib).',
        },
        {
          subtitle: 'Who Must Fast?',
          text: 'Fasting is obligatory for every Muslim who has reached puberty, is of sound mind, and is physically able. Travelers, pregnant/nursing women, and those who are ill may postpone their fast.',
        },
        {
          subtitle: 'Benefits of Fasting',
          text: 'Fasting teaches self-discipline, develops empathy for the poor, brings spiritual growth, and has numerous health benefits when done properly.',
        }
      ]
    },
    quran: {
      title: 'The Holy Quran',
      content: [
        {
          subtitle: 'Revelation in Ramadan',
          text: 'The Quran was first revealed to Prophet Muhammad (peace be upon him) during the month of Ramadan, on the Night of Power (Laylatul Qadr).',
        },
        {
          subtitle: 'Importance of Reading Quran',
          text: 'Reading and reflecting on the Quran during Ramadan brings immense rewards. Each letter read is multiplied by 10 to 700 times in reward.',
        }
      ]
    },
    laylatulqadr: {
      title: 'Laylatul Qadr',
      content: [
        {
          subtitle: 'The Night of Power',
          text: 'Laylatul Qadr is the night when the Quran was first revealed. It is better than 1000 months of worship. Worship on this night brings more reward than worship over 83 years.',
        },
        {
          subtitle: 'When is it?',
          text: 'It is in the last 10 nights of Ramadan, most likely on odd nights: 21st, 23rd, 25th, 27th, or 29th night.',
        },
        {
          subtitle: 'What to do?',
          text: `Increase in prayer, Quran recitation, dhikr, and making dua, especially the dua: "Allahumma innaka afuwwun tuhibbul afwa fa'fu anni" (O Allah, You are Forgiving and love forgiveness, so forgive me).`,
        }
      ]
    },
    zakat: {
      title: 'Zakat & Charity',
      content: [
        {
          subtitle: 'Zakat al-Fitr',
          text: 'A special charity given before Eid prayer. It purifies the fast and helps the poor celebrate Eid.',
        },
        {
          subtitle: 'Sadaqah',
          text: 'Any voluntary charity given throughout Ramadan. Even a smile is charity!',
        }
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Learn About Ramadan</h1>
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(topics).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {topics[key].title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {topics[activeTab].title}
        </h2>
        <div className="space-y-6">
          {topics[activeTab].content.map((item, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {item.subtitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Featured Hadith */}
        <div className="mt-8 p-6 bg-primary-50 dark:bg-primary-900 rounded-xl">
          <p className="text-gray-700 dark:text-gray-200 italic mb-4">
            "Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven."
          </p>
          <p className="text-gray-600 dark:text-gray-300">- Prophet Muhammad (peace be upon him)</p>
        </div>
      </div>
    </div>
  );
};

export default Learn;
