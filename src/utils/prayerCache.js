/**
 * نظام تخزين مؤقت ذكي لأوقات الصلاة
 * يحفظ البيانات في local storage ويحدثها مرة واحدة يوميا فقط
 */

const PRAYER_CACHE_KEY = 'prayerTimesCache';

/**
 * الحصول على تاريخ اليوم بصيغة YYYY-MM-DD
 */
const getTodayDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * حفظ أوقات الصلاة في local storage مع التاريخ
 */
export const savePrayerTimesToCache = (country, city, prayerData) => {
  try {
    const cache = {
      country,
      city,
      date: getTodayDate(),
      data: prayerData,
      timestamp: Date.now(),
    };
    localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('خطأ في حفظ البيانات في cache:', error);
  }
};

/**
 * الحصول على أوقات الصلاة من cache إذا كانت لليوم الحالي
 */
export const getCachedPrayerTimes = (country, city) => {
  try {
    const cached = localStorage.getItem(PRAYER_CACHE_KEY);
    if (!cached) return null;

    const cache = JSON.parse(cached);
    const today = getTodayDate();

    // التحقق من أن البيانات للدولة والمدينة الحالية واليوم الحالي
    if (
      cache.country === country &&
      cache.city === city &&
      cache.date === today
    ) {
      return cache.data;
    }

    return null;
  } catch (error) {
    console.error('خطأ في قراءة البيانات من cache:', error);
    return null;
  }
};

/**
 * مسح cache أوقات الصلاة
 */
export const clearPrayerCache = () => {
  try {
    localStorage.removeItem(PRAYER_CACHE_KEY);
  } catch (error) {
    console.error('خطأ في مسح cache:', error);
  }
};

/**
 * التحقق من وجود بيانات محفوظة ولليوم الحالي
 */
export const isCacheValid = (country, city) => {
  return getCachedPrayerTimes(country, city) !== null;
};
