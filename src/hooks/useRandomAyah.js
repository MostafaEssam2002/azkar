import { useState, useEffect, useCallback } from "react";
import { API_CONFIG, buildApiUrl } from "../config/api";

const FALLBACK_AYAH = {
  text:       "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
  surah:      "الشرح",
  ayahNumber: "5-6",
  tafsir:     "مع الشدة تأتي الراحة، ومع المشقة تأتي اليسر",
};

const STORAGE_KEY = "daily_ayah";
const HOURS_24 = 24 * 60 * 60 * 1000; // 24 ساعة بالميليثانية

/**
 * تحديث الآية فقط كل 24 ساعة مع حفظ في localStorage
 * - يفحص الآية المحفوظة عند التحميل
 * - إذا مرت 24 ساعة أو لا توجد آية، يجلب واحدة جديدة
 * - يحفظ الآية مع الوقت في localStorage
 * @returns {{ ayah: object|null, loading: boolean, refresh: Function }}
 */
function useRandomAyah() {
  const [ayah, setAyah] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * فحص الآية المحفوظة
   * - إذا كانت موجودة وعمرها أقل من 24 ساعة، استخدمها
   * - إذا انقضت 24 ساعة، احذفها وجلب جديدة
   */
  const checkAndLoadAyah = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();
        const age = now - data.timestamp;

        // إذا الآية عمرها أقل من 24 ساعة، استخدمها
        if (age < HOURS_24) {
          setAyah(data.ayah);
          return true; // لا تحتاج تحديث
        }
      } catch (err) {
        console.error("خطأ في قراءة الآية المحفوظة:", err);
      }
    }
    
    return false; // تحتاج تحديث
  }, []);

  /**
   * جلب آية جديدة من API وحفظها مع الوقت
   */
  const fetchAndSaveAyah = useCallback(async () => {
    setLoading(true);
    try {
      const number = Math.floor(Math.random() * 6236) + 1;
      const ayahRes = await fetch(buildApiUrl(API_CONFIG.alquran, `ayah/${number}`));
      const ayahData = await ayahRes.json();

      if (ayahData.code === 200) {
        const { data } = ayahData;
        const tafsirRes = await fetch(
          buildApiUrl(API_CONFIG.alquran, `ayah/${data.number}/ar.muyassar`)
        );
        const tafsirData = await tafsirRes.json();

        const newAyah = {
          text: data.text,
          surah: data.surah.name,
          ayahNumber: data.numberInSurah,
          tafsir: tafsirData.data?.text || "التفسير غير متاح حالياً",
        };

        // حفظ الآية مع الوقت
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ayah: newAyah,
            timestamp: Date.now(),
          })
        );

        setAyah(newAyah);
      }
    } catch (err) {
      console.error("useRandomAyah error:", err);
      setAyah(FALLBACK_AYAH);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * عند التحميل الأول:
   * - فحص الآية المحفوظة
   * - إذا صلاحيتها انتهت، جلب جديدة
   */
  useEffect(() => {
    const needsUpdate = !checkAndLoadAyah();
    if (needsUpdate) {
      fetchAndSaveAyah();
    }
  }, [checkAndLoadAyah, fetchAndSaveAyah]);

  /**
   * تحديث يدوي (زر التحديث)
   * يجلب آية جديدة فوراً
   */
  const manualRefresh = useCallback(() => {
    // حذف الآية المحفوظة لفرض جلب جديدة
    localStorage.removeItem(STORAGE_KEY);
    fetchAndSaveAyah();
  }, [fetchAndSaveAyah]);

  return { ayah, loading, refresh: manualRefresh };
}

export default useRandomAyah;
