import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrayerContext } from "./prayer/PrayerContext";
import { AZKAR_TYPES, calculateCurrentAzkarPeriod } from "../hooks/useAzkarTracking";
import ToastPrompt from "./ToastPrompt";
import {
  KAHF_STORAGE_KEY,
  SALAWAT_STORAGE_KEY,
  MORNING_AZKAR_STORAGE_KEY,
  EVENING_AZKAR_STORAGE_KEY,
  getFridayKey,
  isFriday,
  isAfterFridayMaghrib,
  setPromptState,
  shouldShowPrompt,
  shouldShowDailyReminder,
} from "../utils/toastHelpers";

// ─── Toast Definitions ────────────────────────────────────────────────────────
// لو حبيت تضيف toast جديد، بس أضف object هنا

const TOAST_CONFIGS = [
  {
    key: KAHF_STORAGE_KEY,
    text: "هل قرأت سورة الكهف اليوم؟",
    yesRoute: null,
    noRoute: "/quran?surah=18",
  },
  {
    key: SALAWAT_STORAGE_KEY,
    text: "هل صليت على النبي اليوم؟",
    yesRoute: null,
    noRoute: "/azkar/تسابيح?scrollTo=9",
  },
  {
    key: MORNING_AZKAR_STORAGE_KEY,
    text: "هل تريد قراءة أذكار الصباح الآن؟",
    yesRoute: "/azkar/أذكار-الصباح",
    noRoute: null,
  },
  {
    key: EVENING_AZKAR_STORAGE_KEY,
    text: "هل تريد قراءة أذكار المساء الآن؟",
    yesRoute: "/azkar/أذكار-المساء",
    noRoute: null,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const FridayKahfPrompt = () => {
  const navigate = useNavigate();
  const { prayerTimes } = useContext(PrayerContext) || {};

  // visibility state لكل toast — mapped by storageKey
  const [visibility, setVisibility] = useState({
    [KAHF_STORAGE_KEY]: false,
    [SALAWAT_STORAGE_KEY]: false,
    [MORNING_AZKAR_STORAGE_KEY]: false,
    [EVENING_AZKAR_STORAGE_KEY]: false,
  });

  const setToast = (key, value) =>
    setVisibility((prev) => ({ ...prev, [key]: value }));

  // ─── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const fridayPassed = !isFriday() || isAfterFridayMaghrib(new Date(), prayerTimes);

    if (fridayPassed) {
      // نظف الـ storage ويخفي الـ friday toasts
      window.localStorage.removeItem(KAHF_STORAGE_KEY);
      window.localStorage.removeItem(SALAWAT_STORAGE_KEY);
      setToast(KAHF_STORAGE_KEY, false);
      setToast(SALAWAT_STORAGE_KEY, false);
    } else {
      setToast(KAHF_STORAGE_KEY, shouldShowPrompt(KAHF_STORAGE_KEY, prayerTimes));
      setToast(SALAWAT_STORAGE_KEY, shouldShowPrompt(SALAWAT_STORAGE_KEY, prayerTimes));
    }

    const azkarPeriod = calculateCurrentAzkarPeriod(prayerTimes);

    if (azkarPeriod.type === AZKAR_TYPES.MORNING && azkarPeriod.isActive) {
      setToast(MORNING_AZKAR_STORAGE_KEY, shouldShowDailyReminder(MORNING_AZKAR_STORAGE_KEY, azkarPeriod));
      setToast(EVENING_AZKAR_STORAGE_KEY, false);
    } else if (azkarPeriod.type === AZKAR_TYPES.EVENING && azkarPeriod.isActive) {
      setToast(EVENING_AZKAR_STORAGE_KEY, shouldShowDailyReminder(EVENING_AZKAR_STORAGE_KEY, azkarPeriod));
      setToast(MORNING_AZKAR_STORAGE_KEY, false);
    } else {
      setToast(MORNING_AZKAR_STORAGE_KEY, false);
      setToast(EVENING_AZKAR_STORAGE_KEY, false);
    }
  }, [prayerTimes]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleAnswer = (storageKey, answer, route) => {
    setPromptState(storageKey, { date: getFridayKey(), answered: answer });
    setToast(storageKey, false);
    if (route) navigate(route);
  };

  const handleDismiss = (storageKey) => {
    setPromptState(storageKey, { date: getFridayKey(), answered: "dismissed" });
    setToast(storageKey, false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="friday-kahf-toast-stack">
      {TOAST_CONFIGS.filter((t) => visibility[t.key]).map((t) => (
        <ToastPrompt
          key={t.key}
          storageKey={t.key}
          text={t.text}
          yesRoute={t.yesRoute}
          noRoute={t.noRoute}
          onAnswer={handleAnswer}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

export default FridayKahfPrompt;