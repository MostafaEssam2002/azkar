import { useState, useEffect } from "react";
import { isAzkarPeriodActive, AZKAR_TYPES, loadProgress } from "../utils/azkarStorage";

/**
 * يحدد نوع الأذكار الحالي (صباح / مساء) وتقدم المستخدم فيها
 * @param {object|null} prayerTimes - أوقات الصلاة من PrayerContext
 * @returns {{ azkarType: string, completed: number, total: number }}
 */
function useAzkarProgress(prayerTimes) {
  const [azkarType,     setAzkarType]     = useState(AZKAR_TYPES.MORNING);
  const [azkarProgress, setAzkarProgress] = useState({ completed: 0, total: 31 });

  useEffect(() => {
    if (!prayerTimes) return;

    const isEveningActive = isAzkarPeriodActive(AZKAR_TYPES.EVENING, prayerTimes);
    const currentType     = isEveningActive ? AZKAR_TYPES.EVENING : AZKAR_TYPES.MORNING;

    setAzkarType(currentType);

    const total        = currentType === AZKAR_TYPES.MORNING ? 31 : 30;
    const progressData = loadProgress(currentType, prayerTimes);
    const completed    = progressData?.readItems?.length || 0;

    setAzkarProgress({ completed, total });
  }, [prayerTimes]);

  return { azkarType, ...azkarProgress };
}

export default useAzkarProgress;
