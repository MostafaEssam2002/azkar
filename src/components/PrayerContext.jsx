import { createContext, useState, useEffect, useRef } from 'react';
import { KEYS } from '../utils/constants';
import { parseTime, formatCountdown, getNowMinutes, findNextPrayer } from '../utils/utils';
import { getCachedPrayerTimes, savePrayerTimesToCache } from '../utils/prayerCache';
import { API_CONFIG, buildApiUrl } from '../config/api';
export const PrayerContext = createContext();
// Map each prayer to its specific adhan audio file
const PRAYER_AUDIO_MAP = {
  Fajr: '1.mp3',
  Dhuhr: '2.mp3',
  Asr: '3.mp3',
  Maghrib: '4.mp3',
  Isha: '5.mp3',
};
const getPrayerAudioFile = (prayerKey) => {
  return `/audio/${PRAYER_AUDIO_MAP[prayerKey] || '3.mp3'}`;
};

// Reads the muezzin chosen in Athan Settings (saved by AthanSettings.jsx).
// Falls back to the default azan.mp3 if nothing was selected yet.
const getSelectedAzanAudioFile = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('selectedMuezzin'));
    if (saved?.file) {
      return encodeURI(`/audio/${saved.file}`);
    }
  } catch {
    // تجاهل أي بيانات تالفة في localStorage والرجوع للأذان الافتراضي
  }
  return '/audio/azan.mp3';
};
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
  const lastPlayedRef = useRef({ playId: '' });

  const [isAudioMuted, setIsAudioMuted] = useState(() => {
    return localStorage.getItem('prayerAudioMuted') === 'true';
  });
  const pendingAudioRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioPlayFailed, setAudioPlayFailed] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);

      // Play any pending adhan that was blocked due to autoplay policy (within the last 5 minutes)
      if (pendingAudioRef.current) {
        const { pKey, timestamp } = pendingAudioRef.current;
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() - timestamp < fiveMinutes) {
          const audioFile = getPrayerAudioFile(pKey);
          const audio = new Audio(audioFile);
          const needsAzan = ['Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(pKey);
          if (needsAzan) {
            audio.addEventListener('ended', () => {
              const azanAudio = new Audio(getSelectedAzanAudioFile());
              azanAudio.play().catch(err => {
                console.warn('Error playing azan audio after interaction:', err);
              });
            });
          }
          audio.play().catch(err => {
            console.warn('Error playing prayer audio after interaction:', err);
          });
        }
        pendingAudioRef.current = null;
      }

      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const unlockAudio = () => {
    const audio = new Audio('/audio/3.mp3');
    audio.volume = 0;
    audio.play().then(() => {
      audio.pause();
      setIsAudioMuted(false);
      localStorage.setItem('prayerAudioMuted', 'false');
      setAudioPlayFailed(false);
    }).catch(err => {
      console.warn("Could not unlock audio:", err);
    });
  };

  const toggleMute = () => {
    if (isAudioMuted) {
      unlockAudio();
    } else {
      setIsAudioMuted(true);
      localStorage.setItem('prayerAudioMuted', 'true');
    }
  };

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

  // Fetch prayer times (with caching to update only once per day)
  useEffect(() => {
    async function fetchTimes() {
      // التحقق من وجود بيانات محفوظة ليوم اليوم
      const cachedData = getCachedPrayerTimes(selectedCountry, selectedCity);

      if (cachedData) {
        // استخدام البيانات المحفوظة
        setPrayerTimes(cachedData.times);
        setGregDate(cachedData.gregDate);
        setHijriDate(cachedData.hijriDate);
        setError(false);
        return; // الخروج بدون استدعاء API
      }

      // إذا لم توجد بيانات محفوظة، استدعاء API
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const url = `${buildApiUrl(API_CONFIG.aladhan, 'v1/timingsByCity')}/${dd}-${mm}-${yyyy}?country=${selectedCountry}&city=${selectedCity}&method=5`;
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
          const d = json.data.date;
          const gregDateStr = d.gregorian.weekday.en + '، ' + d.gregorian.date;
          const hijriDateStr = `${d.hijri.day} ${d.hijri.month.ar} ${d.hijri.year} هـ`;

          // حفظ البيانات في cache
          savePrayerTimesToCache(selectedCountry, selectedCity, {
            times,
            gregDate: gregDateStr,
            hijriDate: hijriDateStr,
          });

          setPrayerTimes(times);
          setGregDate(gregDateStr);
          setHijriDate(hijriDateStr);
          setError(false);
        }
      } catch (e) {
        console.error('خطأ في جلب أوقات الصلاة:', e);
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

        // Check if current time matches any prayer time (within 60 seconds)
        const nowMin = getNowMinutes();
        const ADHAN_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        for (const pKey of ADHAN_KEYS) {
          if (!prayerTimes[pKey]) continue;
          const prayerMin = parseTime(prayerTimes[pKey]);
          const diff = nowMin - prayerMin;
          // If within 0 to 1 minute after prayer time
          if (diff >= 0 && diff < 1) {
            const todayStr = new Date().toDateString();
            const playId = `${pKey}-${todayStr}`;
            if (lastPlayedRef.current.playId !== playId) {
              lastPlayedRef.current.playId = playId;
              if (!isAudioMuted) {
                const audioFile = getPrayerAudioFile(pKey);
                const audio = new Audio(audioFile);
                // For Dhuhr, Asr, Maghrib, Isha: play azan.mp3 after the intro finishes
                const needsAzan = ['Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(pKey);
                if (needsAzan) {
                  audio.addEventListener('ended', () => {
                    const azanAudio = new Audio(getSelectedAzanAudioFile());
                    azanAudio.play().catch(err => {
                      console.error('Error playing azan audio:', err);
                    });
                  });
                }
                audio.play()
                  .then(() => {
                    setAudioPlayFailed(false);
                  })
                  .catch(err => {
                    if (err.name === 'NotAllowedError') {
                      console.log('Autoplay blocked. Adhan will play on first user interaction.');
                      pendingAudioRef.current = { pKey, timestamp: Date.now() };
                    } else {
                      console.error('Error playing prayer audio:', err);
                      setAudioPlayFailed(true);
                    }
                  });
              }
            }
            break;
          }
        }


        const circumference = 2 * Math.PI * 30;
        const fraction = 1 - (next.minutes / (next.total || 1));
        setRingOffset(circumference * fraction);
      }
    }
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [prayerTimes, isAudioMuted]);

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
    setSelectedCity,
    isAudioMuted,
    toggleMute,
    hasInteracted,
    unlockAudio,
    audioPlayFailed
  };

  return (
    <PrayerContext.Provider value={value}>
      {children}
    </PrayerContext.Provider>
  );
};
