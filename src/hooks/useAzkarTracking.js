/**
 * useAzkarTracking — نظام تتبع الأذكار (صباح/مساء)
 *
 * يحدد فترة الذكر الحالية بناءً على أوقات الصلاة:
 * - أذكار الصباح: من أذان الفجر إلى أذان الظهر
 * - أذكار المساء: من أذان العصر إلى أذان الفجر (اليوم التالي)
 *
 * يخزن في localStorage:
 *   azkar_progress_{type} → { readItems: [], startedAt, expiresAt }
 *
 * ملحوظة: البيانات تُحذف تلقائياً عند تجاوز expiresAt
 * ولا يوجد إلا مفتاح واحد (صباح أو مساء) في التخزين في أي وقت
 */

import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { PrayerContext } from '../components/PrayerContext';
import { parseTime, getNowMinutes } from '../utils/utils';
import {
  AZKAR_TYPES,
  loadProgress,
  saveProgress,
  clearAzkarTypeStorage,
  purgeExpiredAzkarStorage,
  isProgressExpired,
  isAzkarPeriodActive,
} from '../utils/azkarStorage';

export { AZKAR_TYPES };

const emptyProgress = () => ({ readItems: [], startedAt: Date.now() });

/**
 * حساب فترة الذكر الحالي بناءً على أوقات الصلاة
 * @returns { type, startTime, endTime, isActive, timeRemaining }
 */
export const calculateCurrentAzkarPeriod = (prayerTimes) => {
  if (!prayerTimes || Object.keys(prayerTimes).length === 0) {
    return { type: null, isActive: false, timeRemaining: 0 };
  }

  const nowMinutes = getNowMinutes();

  const fajr = parseTime(prayerTimes.Fajr);
  const dhuhr = parseTime(prayerTimes.Dhuhr);
  const asr = parseTime(prayerTimes.Asr);

  // أذكار الصباح: من الفجر إلى الظهر
  if (nowMinutes >= fajr && nowMinutes < dhuhr) {
    const timeRemaining = dhuhr - nowMinutes;
    return {
      type: AZKAR_TYPES.MORNING,
      startTime: fajr,
      endTime: dhuhr,
      isActive: true,
      timeRemaining,
    };
  }

  // أذكار المساء: من العصر إلى الفجر (اليوم التالي)
  if (nowMinutes >= asr) {
    const timeRemaining = 24 * 60 - nowMinutes + fajr;
    return {
      type: AZKAR_TYPES.EVENING,
      startTime: asr,
      endTime: fajr,
      isActive: true,
      timeRemaining,
      crossesMidnight: true,
    };
  }

  // أذكار المساء قبل الفجر (من العصر أمس)
  if (nowMinutes < fajr) {
    const timeRemaining = fajr - nowMinutes;
    return {
      type: AZKAR_TYPES.EVENING,
      startTime: asr,
      endTime: fajr,
      isActive: true,
      timeRemaining,
      crossesMidnight: true,
    };
  }

  return {
    type: null,
    isActive: false,
    timeRemaining: 0,
  };
};

export default function useAzkarTracking(azkarType) {
  const prayerContextValue = useContext(PrayerContext);
  const prayerTimes = prayerContextValue?.prayerTimes || {};

  const [progress, setProgress] = useState(emptyProgress);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const [currentPeriod, setCurrentPeriod] = useState(() =>
    calculateCurrentAzkarPeriod(prayerTimes)
  );

  // تحميل التقدم المحفوظ عند تغيير نوع الصفحة أو أوقات الصلاة
  useEffect(() => {
    if (!azkarType) {
      setProgress(emptyProgress());
      return;
    }

    purgeExpiredAzkarStorage(prayerTimes, currentPeriod.type);
    const saved = loadProgress(azkarType, prayerTimes);
    setProgress(saved || emptyProgress());
  }, [azkarType, prayerTimes, currentPeriod.type]);

  // تحديث الفترة الزمنية الحالية (كل دقيقة)
  useEffect(() => {
    const updatePeriod = () => {
      const period = calculateCurrentAzkarPeriod(prayerTimes);
      setCurrentPeriod(period);
      purgeExpiredAzkarStorage(prayerTimes, period.type);
    };

    updatePeriod();
    const interval = setInterval(updatePeriod, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  // مسح التقدم عند انتهاء expiresAt
  useEffect(() => {
    if (!azkarType || !progress.expiresAt) return;

    const checkExpiry = () => {
      if (isProgressExpired(progress)) {
        clearAzkarTypeStorage(azkarType, { silent: true });
        setProgress((prev) => ({
          readItems: prev.readItems,
          startedAt: prev.startedAt,
        }));
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 30000);
    return () => clearInterval(interval);
  }, [azkarType, progress]);

  // حفظ التقدم في localStorage فقط داخل فترة الأذكار
  useEffect(() => {
    if (
      !azkarType ||
      !isAzkarPeriodActive(azkarType, prayerTimes) ||
      progress.readItems.length === 0
    ) {
      return;
    }

    saveProgress(azkarType, progress, prayerTimes);
  }, [progress, azkarType, prayerTimes]);

  // حفظ التقدم عند مغادرة الصفحة
  useEffect(() => {
    return () => {
      const current = progressRef.current;
      if (
        azkarType &&
        isAzkarPeriodActive(azkarType, prayerTimes) &&
        current.readItems.length > 0
      ) {
        saveProgress(azkarType, current, prayerTimes);
      }
    };
  }, [azkarType, prayerTimes]);

  const markAsRead = useCallback((itemIndex) => {
    setProgress((prev) => {
      if (prev.readItems.includes(itemIndex)) return prev;
      return {
        ...prev,
        readItems: [...prev.readItems, itemIndex].sort((a, b) => a - b),
      };
    });
  }, []);

  const unmarkAsRead = useCallback((itemIndex) => {
    setProgress((prev) => ({
      ...prev,
      readItems: prev.readItems.filter((i) => i !== itemIndex),
    }));
  }, []);

  const isItemRead = useCallback(
    (itemIndex) => progress.readItems.includes(itemIndex),
    [progress.readItems]
  );

  const getStats = useCallback(
    (totalItems) => ({
      read: progress.readItems.length,
      total: totalItems,
      percentage:
        totalItems > 0 ? (progress.readItems.length / totalItems) * 100 : 0,
      remaining: totalItems - progress.readItems.length,
    }),
    [progress.readItems]
  );

  const resetProgress = useCallback(() => {
    if (azkarType) {
      clearAzkarTypeStorage(azkarType);
    }
    setProgress(emptyProgress());
  }, [azkarType]);

  return {
    progress,
    currentPeriod,
    markAsRead,
    unmarkAsRead,
    isItemRead,
    getStats,
    resetProgress,
    canTrack: currentPeriod.isActive && currentPeriod.type === azkarType,
  };
}
