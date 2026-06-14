import { useState, useCallback, useEffect } from "react";

/**
 * useReadingProgress — متابعة تقدم القراءة
 * 
 * يخزن في localStorage:
 *   reading_progress → { currentSura: 1, lastUpdated: timestamp }
 * 
 * إذا لم يكن هناك محفوظات، يبدأ من السورة 1 (الفاتحة)
 */
const STORAGE_KEY = "reading_progress";

const useReadingProgress = () => {
    const [currentSura, setCurrentSura] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                return data.currentSura || 1; // Default to 1 (Al-Fatiha)
            }
            return 1; // Default to 1 (Al-Fatiha)
        } catch (error) {
            console.error("Error reading reading progress:", error);
            return 1; // Default to 1 on error
        }
    });

    // حفظ تقدم القراءة عند تغيير السورة
    const updateReadingProgress = useCallback((surah) => {
        try {
            const data = {
                currentSura: surah,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            setCurrentSura(surah);
        } catch (error) {
            console.error("Error saving reading progress:", error);
        }
    }, []);

    // الحصول على تقدم القراءة المحفوظ
    const getReadingProgress = useCallback(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : { currentSura: 1, lastUpdated: null };
        } catch (error) {
            console.error("Error fetching reading progress:", error);
            return { currentSura: 1, lastUpdated: null };
        }
    }, []);

    // مسح تقدم القراءة (اختياري)
    const clearReadingProgress = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setCurrentSura(1);
        } catch (error) {
            console.error("Error clearing reading progress:", error);
        }
    }, []);

    return {
        currentSura,
        updateReadingProgress,
        getReadingProgress,
        clearReadingProgress
    };
};

export default useReadingProgress;
