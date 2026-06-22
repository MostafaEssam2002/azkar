import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrayerContext } from "./prayer/PrayerContext";
import { parseTime, getNowMinutes } from "../utils/utils";
import { AZKAR_TYPES, calculateCurrentAzkarPeriod } from "../hooks/useAzkarTracking";

const KAHF_STORAGE_KEY = "friday_kahf_prompt";
const SALAWAT_STORAGE_KEY = "friday_salawat_prompt";
const MORNING_AZKAR_STORAGE_KEY = "daily_morning_azkar_prompt";
const EVENING_AZKAR_STORAGE_KEY = "daily_evening_azkar_prompt";

const getFridayKey = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

const isFriday = (date = new Date()) => date.getDay() === 5;

const isWithinFridayWindow = (date = new Date(), prayerTimes = {}) => {
  if (!isFriday(date)) return false;
  if (!prayerTimes?.Fajr || !prayerTimes?.Maghrib) return true;

  const nowMinutes = getNowMinutes();
  const fajr = parseTime(prayerTimes.Fajr);
  const maghrib = parseTime(prayerTimes.Maghrib);

  return nowMinutes >= fajr && nowMinutes <= maghrib;
};

const isAfterFridayMaghrib = (date = new Date(), prayerTimes = {}) => {
  if (!isFriday(date) || !prayerTimes?.Maghrib) return false;

  const nowMinutes = getNowMinutes();
  const maghrib = parseTime(prayerTimes.Maghrib);

  return nowMinutes > maghrib;
};

const getPromptState = (storageKey) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setPromptState = (storageKey, state) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
};

const shouldShowPrompt = (storageKey, prayerTimes) => {
  if (!isFriday()) return false;
  if (!isWithinFridayWindow(new Date(), prayerTimes)) return false;
  const state = getPromptState(storageKey);
  const todayKey = getFridayKey();
  return state?.date !== todayKey || state?.answered !== "yes";
};

const shouldShowDailyReminder = (storageKey, period) => {
  if (!period?.isActive || !period?.type) return false;
  const state = getPromptState(storageKey);
  const todayKey = getFridayKey();
  return state?.date !== todayKey || state?.answered !== "yes";
};

const FridayKahfPrompt = () => {
  const navigate = useNavigate();
  const { prayerTimes } = useContext(PrayerContext) || {};
  const [showKahf, setShowKahf] = useState(false);
  const [showSalawat, setShowSalawat] = useState(false);
  const [showMorningReminder, setShowMorningReminder] = useState(false);
  const [showEveningReminder, setShowEveningReminder] = useState(false);

  useEffect(() => {
    if (!isFriday()) {
      window.localStorage.removeItem(KAHF_STORAGE_KEY);
      window.localStorage.removeItem(SALAWAT_STORAGE_KEY);
      setShowKahf(false);
      setShowSalawat(false);
    } else if (isAfterFridayMaghrib(new Date(), prayerTimes)) {
      window.localStorage.removeItem(KAHF_STORAGE_KEY);
      window.localStorage.removeItem(SALAWAT_STORAGE_KEY);
      setShowKahf(false);
      setShowSalawat(false);
    } else {
      setShowKahf(shouldShowPrompt(KAHF_STORAGE_KEY, prayerTimes));
      setShowSalawat(shouldShowPrompt(SALAWAT_STORAGE_KEY, prayerTimes));
    }

    const azkarPeriod = calculateCurrentAzkarPeriod(prayerTimes);
    if (azkarPeriod.type === AZKAR_TYPES.MORNING && azkarPeriod.isActive) {
      setShowMorningReminder(shouldShowDailyReminder(MORNING_AZKAR_STORAGE_KEY, azkarPeriod));
      setShowEveningReminder(false);
    } else if (azkarPeriod.type === AZKAR_TYPES.EVENING && azkarPeriod.isActive) {
      setShowEveningReminder(shouldShowDailyReminder(EVENING_AZKAR_STORAGE_KEY, azkarPeriod));
      setShowMorningReminder(false);
    } else {
      setShowMorningReminder(false);
      setShowEveningReminder(false);
    }
  }, [prayerTimes]);

  const handleAnswer = (storageKey, answer, route, setter) => {
    const todayKey = getFridayKey();
    setPromptState(storageKey, { date: todayKey, answered: answer });
    setter(false);

    if (route) {
      navigate(route);
    }
  };

  const handleDismiss = (storageKey, setter) => {
    setPromptState(storageKey, { date: getFridayKey(), answered: "dismissed" });
    setter(false);
  };

  return (
    <div className="friday-kahf-toast-stack">
      {showKahf && (
        <div className="friday-kahf-toast" dir="rtl">
          <button
            type="button"
            className="friday-kahf-toast__close"
            aria-label="إغلاق الإشعار"
            onClick={() => handleDismiss(KAHF_STORAGE_KEY, setShowKahf)}
          >
            ×
          </button>
          <div className="friday-kahf-toast__text">هل قرأت سورة الكهف اليوم؟</div>
          <div className="friday-kahf-toast__actions">
            <button
              type="button"
              className="friday-kahf-toast__button friday-kahf-toast__button--no"
              onClick={() => handleAnswer(KAHF_STORAGE_KEY, "no", "/quran?surah=18", setShowKahf)}
            >
              لا
            </button>
            <button
              type="button"
              className="friday-kahf-toast__button friday-kahf-toast__button--yes"
              onClick={() => handleAnswer(KAHF_STORAGE_KEY, "yes", null, setShowKahf)}
            >
              نعم
            </button>
          </div>
        </div>
      )}

      {showSalawat && (
        <div className="friday-kahf-toast" dir="rtl">
          <button
            type="button"
            className="friday-kahf-toast__close"
            aria-label="إغلاق الإشعار"
            onClick={() => handleDismiss(SALAWAT_STORAGE_KEY, setShowSalawat)}
          >
            ×
          </button>
          <div className="friday-kahf-toast__text">هل صليت على النبي اليوم؟</div>
          <div className="friday-kahf-toast__actions">
            <button
              type="button"
              className="friday-kahf-toast__button friday-kahf-toast__button--no"
              onClick={() => handleAnswer(SALAWAT_STORAGE_KEY, "no", "/azkar/تسابيح?scrollTo=9", setShowSalawat)}
            >
              لا
            </button>
            <button
              type="button"
              className="friday-kahf-toast__button friday-kahf-toast__button--yes"
              onClick={() => handleAnswer(SALAWAT_STORAGE_KEY, "yes", null, setShowSalawat)}
            >
              نعم
            </button>
          </div>
        </div>
      )}

      {showMorningReminder && (
        <div className="friday-kahf-toast" dir="rtl">
          <button
            type="button"
            className="friday-kahf-toast__close"
            aria-label="إغلاق الإشعار"
            onClick={() => handleDismiss(MORNING_AZKAR_STORAGE_KEY, setShowMorningReminder)}
          >
            ×
          </button>
          <div className="friday-kahf-toast__text">هل تريد قراءة أذكار الصباح الآن؟</div>
          <div className="friday-kahf-toast__actions">
            <button
              type="button"
              className="friday-kahf-toast__button friday-kahf-toast__button--no"
              onClick={() => handleAnswer(MORNING_AZKAR_STORAGE_KEY, "no", null, setShowMorningReminder)}
            >
              لا
            </button>
            <button
              type="button"
              className="friday-kahf-toast__button friday-kahf-toast__button--yes"
              onClick={() => handleAnswer(MORNING_AZKAR_STORAGE_KEY, "yes", "/azkar/أذكار-الصباح", setShowMorningReminder)}
            >
              نعم
            </button>
          </div>
        </div>
      )}

      {showEveningReminder && (
        <div className="friday-kahf-toast" dir="rtl">
          <button
            type="button"
            className="friday-kahf-toast__close"
            aria-label="إغلاق الإشعار"
            onClick={() => handleDismiss(EVENING_AZKAR_STORAGE_KEY, setShowEveningReminder)}
          >
            ×
          </button>
          <div className="friday-kahf-toast__text">هل تريد قراءة أذكار المساء الآن؟</div>
          <div className="friday-kahf-toast__actions">
            <button
              type="button"
              className="friday-kahf-toast__button friday-kahf-toast__button--no"
              onClick={() => handleAnswer(EVENING_AZKAR_STORAGE_KEY, "no", null, setShowEveningReminder)}
            >
              لا
            </button>
            <button
              type="button"
              className="friday-kahf-toast__button friday-kahf-toast__button--yes"
              onClick={() => handleAnswer(EVENING_AZKAR_STORAGE_KEY, "yes", "/azkar/أذكار-المساء", setShowEveningReminder)}
            >
              نعم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FridayKahfPrompt;
