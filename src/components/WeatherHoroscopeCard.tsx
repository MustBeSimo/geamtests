import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedText from '@/components/AnimatedText';

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    feelslike_c: number;
  };
}

interface HoroscopeData {
  type: 'western' | 'chinese';
  sign?: string;
  description?: string;
  mood?: string;
  color?: string;
  lucky_number?: string;
  lucky_time?: string;
  compatibility?: string;
  date_range?: string;
}

interface HoroscopeSection {
  title: string;
  content: string;
  icon: string;
}

function parseHoroscopeDescription(description: string): HoroscopeSection[] {
  const sections: HoroscopeSection[] = [];
  const lines = description.split('\n\n');

  // Base prediction
  sections.push({
    title: 'Overview',
    content: lines[0] || 'Your journey continues with wisdom.',
    icon: '✨',
  });

  // Parse other sections
  lines.slice(1).forEach((line) => {
    if (line.startsWith('Career & Work:')) {
      sections.push({
        title: 'Career & Work',
        content: line.replace('Career & Work:', '').trim(),
        icon: '💼',
      });
    } else if (line.startsWith('Love & Relationships:')) {
      sections.push({
        title: 'Love & Relationships',
        content: line.replace('Love & Relationships:', '').trim(),
        icon: '❤️',
      });
    } else if (line.startsWith('Health & Wellness:')) {
      sections.push({
        title: 'Health & Wellness',
        content: line.replace('Health & Wellness:', '').trim(),
        icon: '🌟',
      });
    } else if (line.startsWith('Wealth & Finance:')) {
      sections.push({
        title: 'Wealth & Finance',
        content: line.replace('Wealth & Finance:', '').trim(),
        icon: '💰',
      });
    } else if (line.startsWith('Advice:')) {
      sections.push({
        title: 'Advice',
        content: line.replace('Advice:', '').trim(),
        icon: '🔮',
      });
    }
  });

  return sections;
}

const westernZodiacSigns = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

const days = ['yesterday', 'today', 'tomorrow'];

export default function WeatherHoroscopeCard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(
    null
  );
  const [selectedSign, setSelectedSign] = useState('aries');
  const [selectedDay, setSelectedDay] = useState('today');
  const [activeTab, setActiveTab] = useState<'weather' | 'horoscope'>(
    'weather'
  );
  const [horoscopeType, setHoroscopeType] = useState<'western' | 'chinese'>(
    'western'
  );
  const [birthYear, setBirthYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data
  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=b10164f2eafa4e0a85661404252804&q=auto:ip&aqi=no`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    }
    fetchWeather();
  }, []);

  // Fetch horoscope data
  useEffect(() => {
    async function fetchHoroscope() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/horoscope', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sign: selectedSign,
            day: selectedDay,
            type: horoscopeType,
            birthYear: horoscopeType === 'chinese' ? birthYear : undefined,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Horoscope API error:', {
            status: response.status,
            error: errorData,
          });
          throw new Error(errorData?.error || 'Failed to fetch horoscope data');
        }

        const data = await response.json();
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid horoscope data received');
        }
        console.log('Horoscope data:', data);
        setHoroscopeData(data);
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        setError('Unable to load horoscope. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchHoroscope();
  }, [selectedSign, selectedDay, horoscopeType, birthYear]);

  return (
    <div className="p-2">
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4">
        <motion.button
          className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-colors ${
            activeTab === 'weather'
              ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
              : 'bg-white/20 text-gray-600 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab('weather')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatedText text="Weather" className="inline-block" />
        </motion.button>
        <motion.button
          className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-colors ${
            activeTab === 'horoscope'
              ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-white'
              : 'bg-white/20 text-gray-600 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab('horoscope')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatedText text="Horoscope" className="inline-block" />
        </motion.button>
      </div>

      {/* Weather Content */}
      <motion.div
        initial={false}
        animate={{
          opacity: activeTab === 'weather' ? 1 : 0,
          x: activeTab === 'weather' ? 0 : -20,
        }}
        className={`space-y-4 ${activeTab !== 'weather' ? 'hidden' : ''}`}
      >
        {weatherData ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {weatherData.location.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {weatherData.location.region}, {weatherData.location.country}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">
                  {weatherData.current.temp_c}°C
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Feels like {weatherData.current.feelslike_c}°C
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center bg-white/10 dark:bg-black/20 rounded-xl p-4">
              <Image
                src={`https:${weatherData.current.condition.icon}`}
                alt={weatherData.current.condition.text}
                width={64}
                height={64}
                className="w-16 h-16"
              />
              <p className="ml-4 text-lg text-gray-800 dark:text-white">
                {weatherData.current.condition.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 dark:bg-black/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Humidity
                </p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {weatherData.current.humidity}%
                </p>
              </div>
              <div className="bg-white/10 dark:bg-black/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Wind Speed
                </p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {weatherData.current.wind_kph} km/h
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
          </div>
        )}
      </motion.div>

      {/* Horoscope Content */}
      <motion.div
        initial={false}
        animate={{
          opacity: activeTab === 'horoscope' ? 1 : 0,
          x: activeTab === 'horoscope' ? 0 : 20,
        }}
        className={`space-y-4 ${activeTab !== 'horoscope' ? 'hidden' : ''}`}
      >
        <div className="flex gap-2 mb-4">
          <motion.button
            className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-colors ${
              horoscopeType === 'western'
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                : 'bg-white/20 text-gray-600 dark:text-gray-300'
            }`}
            onClick={() => setHoroscopeType('western')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Western
          </motion.button>
          <motion.button
            className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-colors ${
              horoscopeType === 'chinese'
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                : 'bg-white/20 text-gray-600 dark:text-gray-300'
            }`}
            onClick={() => setHoroscopeType('chinese')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Chinese
          </motion.button>
        </div>

        <div className="flex gap-2">
          {horoscopeType === 'western' ? (
            <select
              value={selectedSign}
              onChange={(e) => setSelectedSign(e.target.value)}
              className="flex-1 bg-white/20 dark:bg-black/20 rounded-xl px-4 py-2 text-sm text-gray-800 dark:text-white border border-white/10"
            >
              {westernZodiacSigns.map((sign) => (
                <option key={sign} value={sign}>
                  {sign.charAt(0).toUpperCase() + sign.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value))}
              min="1900"
              max={new Date().getFullYear()}
              className="flex-1 bg-white/20 dark:bg-black/20 rounded-xl px-4 py-2 text-sm text-gray-800 dark:text-white border border-white/10"
              placeholder="Enter birth year"
            />
          )}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="flex-1 bg-white/20 dark:bg-black/20 rounded-xl px-4 py-2 text-sm text-gray-800 dark:text-white border border-white/10"
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        ) : horoscopeData ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-400/10 to-pink-400/10 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                {horoscopeType === 'western' ? (
                  <>
                    <span className="text-xl">♈</span>
                    {selectedSign.charAt(0).toUpperCase() +
                      selectedSign.slice(1)}{' '}
                    - {horoscopeData.date_range}
                  </>
                ) : (
                  <>
                    <span className="text-xl">🐲</span>
                    {horoscopeData.sign} Zodiac
                  </>
                )}
              </h4>

              <div className="space-y-3">
                {parseHoroscopeDescription(horoscopeData.description || '').map(
                  (section, index) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-sm rounded-lg p-3 shadow-sm"
                    >
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <span>{section.icon}</span>
                        {section.title}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {section.content}
                      </p>
                    </motion.div>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {horoscopeData.lucky_number && (
                <div className="bg-white/10 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                    Lucky Number
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    {horoscopeData.lucky_number}
                  </p>
                </div>
              )}
              {horoscopeData.lucky_time && (
                <div className="bg-white/10 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                    Lucky Time
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    {horoscopeData.lucky_time}
                  </p>
                </div>
              )}
              {horoscopeData.color && (
                <div className="bg-white/10 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                    Color
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    {horoscopeData.color}
                  </p>
                </div>
              )}
              {horoscopeData.mood && (
                <div className="bg-white/10 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                    Mood
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    {horoscopeData.mood}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
