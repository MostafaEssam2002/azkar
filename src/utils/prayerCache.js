/**
 * نظام تخزين مؤقت ذكي لأوقات الصلاة
 * يحفظ البيانات في local storage ويحدّثها كل 24 ساعة
 */

const PRAYER_CACHE_KEY = 'prayerTimesCache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 ساعة

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
 * التحقق من صلاحية الـ cache (الموقع، التاريخ، ومرور أقل من 24 ساعة)
 */
const isCacheEntryValid = (cache, country, city) => {
  if (!cache?.timestamp) return false;

  const today = getTodayDate();
  const isExpired = Date.now() - cache.timestamp > CACHE_TTL_MS;
  const isWrongLocation = cache.country !== country || cache.city !== city;
  const isWrongDate = cache.date !== today;

  return !isExpired && !isWrongLocation && !isWrongDate;
};

/**
 * الحصول على أوقات الصلاة من cache إذا كانت صالحة (أقل من 24 ساعة)
 */
export const getCachedPrayerTimes = (country, city) => {
  try {
    const cached = localStorage.getItem(PRAYER_CACHE_KEY);
    if (!cached) return null;

    const cache = JSON.parse(cached);

    if (!isCacheEntryValid(cache, country, city)) {
      clearPrayerCache();
      return null;
    }

    return cache.data;
  } catch (error) {
    console.error('خطأ في قراءة البيانات من cache:', error);
    clearPrayerCache();
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
 * التحقق من وجود بيانات محفوظة صالحة (أقل من 24 ساعة)
 */
export const isCacheValid = (country, city) => {
  return getCachedPrayerTimes(country, city) !== null;
};
