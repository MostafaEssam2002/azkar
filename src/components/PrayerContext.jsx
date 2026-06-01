import { createContext, useState, useEffect, useRef } from 'react';
import { KEYS } from '../utils/constants';
import { parseTime, formatCountdown, getNowMinutes, findNextPrayer } from '../utils/utils';

export const PrayerContext = createContext();

export const PrayerProvider = ({ children }) => {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [gregDate, setGregDate] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('--:--:--');
  const [ringOffset, setRingOffset] = useState(0);
  const [error, setError] = useState(false);
  const [selectedCountry, setSelectedCountryState] = useState('EG');
  const [selectedCity, setSelectedCityState] = useState('Cairo');
  const intervalRef = useRef(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedCountry = localStorage.getItem('prayerCountry');
    const savedCity = localStorage.getItem('prayerCity');
    
    if (savedCountry) {
      setSelectedCountryState(savedCountry);
    }
    if (savedCity) {
      setSelectedCityState(savedCity);
    }
  }, []);

  // Wrapper functions to save to localStorage
  const setSelectedCountry = (country) => {
    setSelectedCountryState(country);
    localStorage.setItem('prayerCountry', country);
  };

  const setSelectedCity = (city) => {
    setSelectedCityState(city);
    localStorage.setItem('prayerCity', city);
  };

  // Fetch prayer times
  useEffect(() => {
    async function fetchTimes() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const url = `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?country=${selectedCountry}&city=${selectedCity}&method=5`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (json.code === 200) {
          const t = json.data.timings;
          const times = {
            Fajr: t.Fajr,
            Sunrise: t.Sunrise,
            Dhuhr: t.Dhuhr,
            Asr: t.Asr,
            Maghrib: t.Maghrib,
            Isha: t.Isha
          };
          setPrayerTimes(times);
          const d = json.data.date;
          setGregDate(d.gregorian.weekday.en + '، ' + d.gregorian.date);
          const hijri = d.hijri;
          setHijriDate(`${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`);
        }
      } catch (e) {
        setError(true);
      }
    }
    fetchTimes();
  }, [selectedCountry, selectedCity]);

  // Update countdown
  useEffect(() => {
    if (Object.keys(prayerTimes).length === 0) return;
    function tick() {
      const next = findNextPrayer(prayerTimes, KEYS);
      if (next) {
        setNextPrayer(next);
        const secs = Math.round(next.minutes * 60);
        setCountdown(formatCountdown(secs));
        const circumference = 2 * Math.PI * 30;
        const fraction = 1 - (next.minutes / (next.total || 1));
        setRingOffset(circumference * fraction);
      }
    }
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [prayerTimes]);

  const value = {
    prayerTimes,
    gregDate,
    hijriDate,
    nextPrayer,
    countdown,
    ringOffset,
    error,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity
  };

  return (
    <PrayerContext.Provider value={value}>
      {children}
    </PrayerContext.Provider>
  );
};
