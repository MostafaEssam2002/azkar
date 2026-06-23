import { parseTime, getNowMinutes } from "../utils/utils";

// ─── Storage Keys ────────────────────────────────────────────────────────────

export const KAHF_STORAGE_KEY = "friday_kahf_prompt";
export const SALAWAT_STORAGE_KEY = "friday_salawat_prompt";
export const MORNING_AZKAR_STORAGE_KEY = "daily_morning_azkar_prompt";
export const EVENING_AZKAR_STORAGE_KEY = "daily_evening_azkar_prompt";

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export const getFridayKey = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

export const isFriday = (date = new Date()) => date.getDay() === 5;

export const isWithinFridayWindow = (date = new Date(), prayerTimes = {}) => {
  if (!isFriday(date)) return false;
  if (!prayerTimes?.Fajr || !prayerTimes?.Maghrib) return true;
  const nowMinutes = getNowMinutes();
  const fajr = parseTime(prayerTimes.Fajr);
  const maghrib = parseTime(prayerTimes.Maghrib);
  return nowMinutes >= fajr && nowMinutes <= maghrib;
};

export const isAfterFridayMaghrib = (date = new Date(), prayerTimes = {}) => {
  if (!isFriday(date) || !prayerTimes?.Maghrib) return false;

  const nowMinutes = getNowMinutes();
  const maghrib = parseTime(prayerTimes.Maghrib);

  return nowMinutes > maghrib;
};

// ─── LocalStorage Helpers ─────────────────────────────────────────────────────

export const getPromptState = (storageKey) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setPromptState = (storageKey, state) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
};

// ─── Visibility Logic ─────────────────────────────────────────────────────────

export const shouldShowPrompt = (storageKey, prayerTimes) => {
  if (!isFriday()) return false;
  if (!isWithinFridayWindow(new Date(), prayerTimes)) return false;
  const state = getPromptState(storageKey);
  const todayKey = getFridayKey();
  return state?.date !== todayKey || state?.answered !== "yes";
};

export const shouldShowDailyReminder = (storageKey, period) => {
  if (!period?.isActive || !period?.type) return false;
  const state = getPromptState(storageKey);
  const todayKey = getFridayKey();
  return state?.date !== todayKey || state?.answered !== "yes";
};