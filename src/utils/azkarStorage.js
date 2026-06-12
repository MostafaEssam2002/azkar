/**
 * إدارة تخزين تقدم أذكار الصباح/المساء في localStorage
 *
 * - azkar_progress_morning: من الفجر إلى الظهر
 * - azkar_progress_evening: من العصر إلى الفجر
 * - يُخزَّن expiresAt (وقت الانتهاء) ويُمسح التقدم تلقائياً بعده
 * - مفتاح واحد فقط (صباح أو مساء) يكون موجوداً في أي وقت
 */

import { parseTime, getNowMinutes } from './utils';

export const AZKAR_TYPES = {
  MORNING: 'morning',
  EVENING: 'evening',
};

const ALL_TYPES = [AZKAR_TYPES.MORNING, AZKAR_TYPES.EVENING];
const CATEGORY_COUNTERS_TTL_MS = 24 * 60 * 60 * 1000;

const getProgressKey = (type) => `azkar_progress_${type}`;
const getCountersKey = (type) => `azkar_counters_${type}`;

export const getCategoryCountersKey = (categoryKey) => `azkar_counters_${categoryKey}`;

function minutesToTimestamp(minutesFromMidnight, dayOffset = 0) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  if (dayOffset) {
    date.setDate(date.getDate() + dayOffset);
  }
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = Math.floor(minutesFromMidnight % 60);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
}

/**
 * هل الوقت الحالي داخل فترة هذا النوع من الأذكار؟
 */
export function isAzkarPeriodActive(type, prayerTimes) {
  if (!prayerTimes?.Fajr || !prayerTimes?.Dhuhr || !prayerTimes?.Asr) {
    return false;
  }

  const nowMinutes = getNowMinutes();
  const fajr = parseTime(prayerTimes.Fajr);
  const dhuhr = parseTime(prayerTimes.Dhuhr);
  const asr = parseTime(prayerTimes.Asr);

  if (type === AZKAR_TYPES.MORNING) {
    return nowMinutes >= fajr && nowMinutes < dhuhr;
  }

  if (type === AZKAR_TYPES.EVENING) {
    return nowMinutes >= asr || nowMinutes < fajr;
  }

  return false;
}

/**
 * حساب وقت انتهاء الفترة (timestamp بالميلي ثانية)
 */
export function getPeriodExpiresAt(type, prayerTimes) {
  if (!isAzkarPeriodActive(type, prayerTimes)) {
    return null;
  }

  const nowMinutes = getNowMinutes();
  const fajr = parseTime(prayerTimes.Fajr);
  const dhuhr = parseTime(prayerTimes.Dhuhr);

  if (type === AZKAR_TYPES.MORNING) {
    return minutesToTimestamp(dhuhr);
  }

  if (type === AZKAR_TYPES.EVENING) {
    if (nowMinutes >= parseTime(prayerTimes.Asr)) {
      return minutesToTimestamp(fajr, 1);
    }
    return minutesToTimestamp(fajr);
  }

  return null;
}

export function isProgressExpired(data) {
  if (!data?.expiresAt) return true;
  return Date.now() >= data.expiresAt;
}

export function clearAzkarTypeStorage(type, { silent = false } = {}) {
  try {
    localStorage.removeItem(getProgressKey(type));
    localStorage.removeItem(getCountersKey(type));
    if (!silent) {
      window.dispatchEvent(
        new CustomEvent('azkar-storage-cleared', { detail: { type } })
      );
    }
  } catch (error) {
    console.error('Error clearing azkar storage:', error);
  }
}

export function clearOtherAzkarType(activeType) {
  const otherType =
    activeType === AZKAR_TYPES.MORNING
      ? AZKAR_TYPES.EVENING
      : AZKAR_TYPES.MORNING;
  clearAzkarTypeStorage(otherType);
}

export function loadProgress(type, prayerTimes) {
  try {
    const saved = localStorage.getItem(getProgressKey(type));
    if (!saved) return null;

    const data = JSON.parse(saved);
    if (isProgressExpired(data)) {
      clearAzkarTypeStorage(type, { silent: true });
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error loading azkar progress:', error);
    return null;
  }
}

export function saveProgress(type, data, prayerTimes) {
  try {
    if (!isAzkarPeriodActive(type, prayerTimes)) return;

    const expiresAt = getPeriodExpiresAt(type, prayerTimes);
    if (!expiresAt) return;

    clearOtherAzkarType(type);

    localStorage.setItem(
      getProgressKey(type),
      JSON.stringify({
        readItems: data.readItems || [],
        startedAt: data.startedAt || Date.now(),
        expiresAt,
      })
    );
  } catch (error) {
    console.error('Error saving azkar progress:', error);
  }
}

/**
 * مسح البيانات المنتهية وضمان وجود نوع واحد فقط في التخزين
 */
export function purgeExpiredAzkarStorage(prayerTimes, currentPeriodType = null) {
  ALL_TYPES.forEach((type) => {
    try {
      const saved = localStorage.getItem(getProgressKey(type));
      if (!saved) return;

      const data = JSON.parse(saved);
      if (isProgressExpired(data)) {
        clearAzkarTypeStorage(type, { silent: true });
      }
    } catch (error) {
      console.error('Error purging azkar storage:', error);
      clearAzkarTypeStorage(type, { silent: true });
    }
  });

  const morningExists = localStorage.getItem(getProgressKey(AZKAR_TYPES.MORNING));
  const eveningExists = localStorage.getItem(getProgressKey(AZKAR_TYPES.EVENING));

  if (morningExists && eveningExists) {
    if (currentPeriodType === AZKAR_TYPES.MORNING) {
      clearAzkarTypeStorage(AZKAR_TYPES.EVENING);
    } else if (currentPeriodType === AZKAR_TYPES.EVENING) {
      clearAzkarTypeStorage(AZKAR_TYPES.MORNING);
    } else {
      clearAzkarTypeStorage(AZKAR_TYPES.MORNING);
      clearAzkarTypeStorage(AZKAR_TYPES.EVENING);
    }
  }
}

export function loadCounters(type, prayerTimes) {
  if (!ALL_TYPES.includes(type)) return null;

  if (!isAzkarPeriodActive(type, prayerTimes)) {
    return null;
  }

  try {
    const saved = localStorage.getItem(getCountersKey(type));
    if (!saved) return null;

    const data = JSON.parse(saved);

    if (data.expiresAt && Date.now() >= data.expiresAt) {
      clearAzkarTypeStorage(type, { silent: true });
      return null;
    }

    if (!data.expiresAt) {
      const progress = loadProgress(type, prayerTimes);
      if (!progress) {
        clearAzkarTypeStorage(type, { silent: true });
        return null;
      }
    }

    return data.counters ?? data;
  } catch (error) {
    console.error('Error loading azkar counters:', error);
    return null;
  }
}

export function saveCounters(type, counters, prayerTimes) {
  if (!ALL_TYPES.includes(type)) return;

  try {
    if (!isAzkarPeriodActive(type, prayerTimes)) return;

    const expiresAt = getPeriodExpiresAt(type, prayerTimes);
    if (!expiresAt) return;

    clearOtherAzkarType(type);

    localStorage.setItem(
      getCountersKey(type),
      JSON.stringify({ counters, expiresAt })
    );
  } catch (error) {
    console.error('Error saving azkar counters:', error);
  }
}

/**
 * مسح عدادات فئة أذكار (غير الصباح/المساء)
 */
export function clearCategoryCounters(categoryKey, { silent = false } = {}) {
  try {
    localStorage.removeItem(getCategoryCountersKey(categoryKey));
    if (!silent) {
      window.dispatchEvent(
        new CustomEvent('azkar-storage-cleared', { detail: { type: categoryKey } })
      );
    }
  } catch (error) {
    console.error('Error clearing category counters:', error);
  }
}

/**
 * تحميل عدادات فئة — تُمسح تلقائياً بعد 24 ساعة من startedAt
 */
export function loadCategoryCounters(categoryKey) {
  try {
    const saved = localStorage.getItem(getCategoryCountersKey(categoryKey));
    if (!saved) return null;

    const data = JSON.parse(saved);

    if (data.expiresAt !== undefined) {
      if (Date.now() >= data.expiresAt) {
        clearCategoryCounters(categoryKey, { silent: true });
        return null;
      }
      return data.counters ?? null;
    }

    // تنسيق قديم بدون expiresAt — يُعاد كما هو حتى أول حفظ جديد
    return data;
  } catch (error) {
    console.error('Error loading category counters:', error);
    return null;
  }
}

/**
 * حفظ عدادات فئة — startedAt يُثبت عند أول حفظ، expiresAt = startedAt + 24 ساعة
 */
export function saveCategoryCounters(categoryKey, counters) {
  try {
    const key = getCategoryCountersKey(categoryKey);
    const saved = localStorage.getItem(key);
    let startedAt = Date.now();

    if (saved) {
      const existing = JSON.parse(saved);
      if (
        existing.startedAt &&
        existing.expiresAt &&
        Date.now() < existing.expiresAt
      ) {
        startedAt = existing.startedAt;
      }
    }

    localStorage.setItem(
      key,
      JSON.stringify({
        counters,
        startedAt,
        expiresAt: startedAt + CATEGORY_COUNTERS_TTL_MS,
      })
    );
  } catch (error) {
    console.error('Error saving category counters:', error);
  }
}
