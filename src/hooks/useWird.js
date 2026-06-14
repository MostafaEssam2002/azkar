/**
 * useWird — ورد القرآن اليومي
 *
 * يخزن في localStorage:
 *   wird_settings  → { pagesPerDay, reminderTime, startPage, startDate }
 *   wird_progress  → { lastVisitDate, currentDayIndex, completedPages: [], nextPageStart, ... }
 *   wird_current_page → رقم الصفحة الحالية المعروضة (منفصل)
 *
 * الإصلاح: بدل الحساب الرياضي بـ dayIndex، بنخزن nextPageStart
 * عشان كل ورد يبدأ من حيث الأخير وقف بالظبط.
 */
import { useState, useEffect, useCallback, useMemo } from "react";

const TOTAL_PAGES = 604;
const STORAGE_SETTINGS = "wird_settings";
const STORAGE_PROGRESS = "wird_progress";
const STORAGE_CURRENT_PAGE = "wird_current_page";

/* ── helpers ──────────────────────────────────────────────────── */
const todayStr = () => new Date().toISOString().slice(0, 10);

const getCurrentMinutesSinceStart = () => Math.floor(Date.now() / 60000);

const daysBetween = (a, b) => {
    const msA = new Date(a).setHours(0, 0, 0, 0);
    const msB = new Date(b).setHours(0, 0, 0, 0);
    return Math.round((msB - msA) / 86_400_000);
};

const getEffectiveUpdateIntervalMinutes = (settings, accumulatedMissedPages = 0) => {
    const baseMinutes = settings?.updateInterval || 3;
    const pagesPerDay = Math.max(1, settings?.pagesPerDay || 1);
    const totalPages = pagesPerDay + Math.max(0, accumulatedMissedPages || 0);
    return Math.max(1, Math.ceil((baseMinutes * totalPages) / pagesPerDay));
};

/**
 * احسب نطاق الورد الحالي بناءً على nextPageStart المخزنة
 * بدل الحساب الرياضي اللي كان بيعمل overflow
 */
const buildRange = (nextPageStart, pagesPerDay, accumulatedMissedPages = 0) => {
    const totalPages = pagesPerDay + Math.max(0, accumulatedMissedPages);
    // تأكد إن nextPageStart في النطاق الصح
    const start = Math.min(Math.max(1, nextPageStart), TOTAL_PAGES);
    const end = Math.min(start + totalPages - 1, TOTAL_PAGES);
    return { start, end };
};

/* ── default progress ─────────────────────────────────────────── */
const defaultProgress = (startPage = 1) => ({
    lastVisitDate: null,
    currentDayIndex: 0,
    completedPages: [],
    catchUpQueue: [],
    isCatchingUp: false,
    catchUpDone: 0,
    lastMinutesCheck: getCurrentMinutesSinceStart(),
    accumulatedMissedPages: 0,
    lastSettingsUpdateTime: Date.now(),
    wirdCompleted: false,
    nextPageStart: startPage,   // ← الجديد: نقطة البداية الفعلية
});

/* ── hook ─────────────────────────────────────────────────────── */
export default function useWird(currentPage = null) {
    const [settings, setSettings] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_SETTINGS)) || null; }
        catch { return null; }
    });

    const [progress, setProgress] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_PROGRESS));
            if (!stored) return defaultProgress(1);
            // migration: لو مفيش nextPageStart من قبل، احسبها من القديم
            if (stored.nextPageStart == null) {
                const s = JSON.parse(localStorage.getItem(STORAGE_SETTINGS));
                if (s) {
                    const pagesPerDay = s.pagesPerDay || 1;
                    const startPage = s.startPage || 1;
                    stored.nextPageStart = ((startPage - 1) + (stored.currentDayIndex * pagesPerDay) - (stored.accumulatedMissedPages || 0));
                    stored.nextPageStart = Math.max(1, Math.min(TOTAL_PAGES, stored.nextPageStart));
                } else {
                    stored.nextPageStart = 1;
                }
            }
            return stored;
        } catch {
            return defaultProgress(1);
        }
    });

    /* persist */
    useEffect(() => {
        if (settings) localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(progress));
    }, [progress]);

    /* ── تحديث الورد بناءً على الفترة المحددة ──── */
    useEffect(() => {
        if (!settings) return;

        const updateDayIndex = () => {
            const currentMinutes = getCurrentMinutesSinceStart();

            setProgress(prev => {
                const updateIntervalMinutes = getEffectiveUpdateIntervalMinutes(settings, prev.accumulatedMissedPages);
                const lastMinutes = prev.lastMinutesCheck || 0;
                const minutesElapsed = currentMinutes - lastMinutes;
                const intervalsElapsed = Math.floor(minutesElapsed / updateIntervalMinutes);

                if (intervalsElapsed === 0) return prev;

                let newAccumulatedPages = prev.accumulatedMissedPages;
                let newNextPageStart = prev.nextPageStart ?? settings.startPage ?? 1;

                if (prev.wirdCompleted) {
                    // الورد مكتمل والـ timer انقضى → تقدم للورد الجديد تلقائياً
                    // نفس منطق moveToNextWird بالظبط
                    const completedRange = buildRange(newNextPageStart, settings.pagesPerDay, prev.accumulatedMissedPages);
                    newNextPageStart = Math.min(completedRange.end + 1, TOTAL_PAGES);
                    newAccumulatedPages = 0;
                } else {
                    // الورد لم يكتمل → نضيف pagesPerDay × عدد الـ intervals
                    // nextPageStart يفضل زي ما هو (الصفحات بتتراكم على نفس الورد)
                    newAccumulatedPages = prev.accumulatedMissedPages + (settings.pagesPerDay * intervalsElapsed);
                }

                const newDayIndex = prev.currentDayIndex + intervalsElapsed;

                return {
                    ...prev,
                    currentDayIndex: newDayIndex,
                    completedPages: [],
                    lastMinutesCheck: lastMinutes + (intervalsElapsed * updateIntervalMinutes),
                    lastVisitDate: todayStr(),
                    accumulatedMissedPages: newAccumulatedPages,
                    lastSettingsUpdateTime: Date.now(),
                    wirdCompleted: false,  // الورد الجديد يبدأ غير مكتمل
                    nextPageStart: newNextPageStart,
                };
            });
        };

        updateDayIndex();

        // نستخدم interval ثابت بناءً على settings بس عشان منعملش re-subscribe كل ما accumulatedMissedPages تتغير
        // الـ interval الفعلي بيتحسب جوه updateDayIndex من prev.accumulatedMissedPages
        const intervalMs = (settings?.updateInterval || 3) * 60 * 1000;
        const interval = setInterval(updateDayIndex, intervalMs);
        return () => clearInterval(interval);
    }, [settings]);

    /* ── on mount / day change: detect missed days ──────────────── */
    useEffect(() => {
        if (!settings) return;
        const today = todayStr();
        if (progress.lastVisitDate === today) return;

        const last = progress.lastVisitDate;
        const missed = last ? Math.max(0, daysBetween(last, today) - 1) : 0;

        setProgress(prev => {
            const newDayIndex = prev.currentDayIndex + (last ? daysBetween(last, today) : 0);
            const queue = [];
            for (let i = 1; i <= missed; i++) queue.push(prev.currentDayIndex + i);

            const missedPageCount = missed * settings.pagesPerDay;

            return {
                ...prev,
                lastVisitDate: today,
                currentDayIndex: newDayIndex,
                completedPages: [],
                catchUpQueue: queue,
                isCatchingUp: queue.length > 0,
                catchUpDone: 0,
                accumulatedMissedPages: prev.accumulatedMissedPages + missedPageCount,
                // nextPageStart بيفضل زي ما هو — الصفحات المتراكمة بتتضاف على نفس الورد
            };
        });
    }, [settings]);

    /* ── activeRange: المحور الرئيسي للإصلاح ─────────────────────── */
    const activeRange = useMemo(() => {
        if (!settings) return null;

        if (progress.isCatchingUp && progress.catchUpQueue.length > 0) {
            // catch-up: ورد واحد فايت مع دمج الصفحات المتراكمة
            const catchStart = progress.nextPageStart ?? (settings.startPage || 1);
            return { ...buildRange(catchStart, settings.pagesPerDay, progress.accumulatedMissedPages), isCatchUp: true };
        }

        // الورد العادي: يبدأ من nextPageStart + الصفحات المتراكمة
        const start = progress.nextPageStart ?? (settings.startPage || 1);
        return {
            ...buildRange(start, settings.pagesPerDay, progress.accumulatedMissedPages),
            isCatchUp: false,
        };
    }, [settings, progress]);

    /* ── score ───────────────────────────────────────────────────── */
    const score = useMemo(() => {
        if (!activeRange) return 0;
        if (progress.wirdCompleted) return 100;
        if (currentPage == null) return 0;
        const { start, end } = activeRange;
        const totalPages = end - start + 1;
        if (totalPages <= 0) return 0;
        // الصفحة الحالية بتعكس عدد الصفحات اللي المستخدم شافها
        // لو على الصفحة start → 0%، لو على end → آخر صفحة قبل 100%
        const pagesRead = Math.max(0, Math.min(currentPage - start, totalPages));
        return Math.round((pagesRead / totalPages) * 100);
    }, [activeRange, progress.wirdCompleted, currentPage]);

    const isComplete = score === 100 || progress.wirdCompleted;

    const markPageRead = useCallback((_page) => {}, []);

    /* ── finish catch-up day ─────────────────────────────────────── */
    const finishCatchUp = useCallback(() => {
        setProgress(prev => {
            const queue = prev.catchUpQueue.slice(1);
            const isLastCatchUp = queue.length === 0;
            const pagesPerDay = settings?.pagesPerDay || 1;
            
            // لما تخلص ورد من catch-up، اطرح pagesPerDay من accumulatedMissedPages
            const remainingAccumulated = Math.max(0, prev.accumulatedMissedPages - pagesPerDay);
            
            // لو كان آخر ورد catch-up، تقدم nextPageStart للورد الجديد
            const catchStart = prev.nextPageStart ?? (settings?.startPage || 1);
            const catchRange = buildRange(catchStart, pagesPerDay, 0);
            const newNextPageStart = isLastCatchUp
                ? Math.min(catchRange.end + 1, TOTAL_PAGES)
                : prev.nextPageStart;

            return {
                ...prev,
                catchUpQueue: queue,
                isCatchingUp: queue.length > 0,
                catchUpDone: prev.catchUpDone + 1,
                completedPages: [],
                accumulatedMissedPages: remainingAccumulated,
                lastMinutesCheck: getCurrentMinutesSinceStart(), // ابدأ الـ interval من الصفر للورد الجديد
                lastSettingsUpdateTime: Date.now(),
                wirdCompleted: false,
                nextPageStart: newNextPageStart,
            };
        });
    }, [settings]);

    /* ── save settings ──────────────────────────────────────────── */
    const saveSettings = useCallback((newSettings) => {
        setSettings(newSettings);
        const today = todayStr();
        const currentMinutes = getCurrentMinutesSinceStart();
        setProgress({
            ...defaultProgress(newSettings.startPage || 1),
            lastVisitDate: today,
            lastMinutesCheck: currentMinutes,
            lastSettingsUpdateTime: Date.now(),
            nextPageStart: newSettings.startPage || 1,
        });
    }, []);

    const missedDays = progress.catchUpQueue.length;

    /* ── forceCheckUpdate ────────────────────────────────────────── */
    const forceCheckUpdate = useCallback(() => {
        if (!settings) return;
        const currentMinutes = getCurrentMinutesSinceStart();

        setProgress(prev => {
            const updateIntervalMinutes = getEffectiveUpdateIntervalMinutes(settings, prev.accumulatedMissedPages);
            const lastMinutes = prev.lastMinutesCheck || 0;
            const minutesElapsed = currentMinutes - lastMinutes;
            const intervalsElapsed = Math.floor(minutesElapsed / updateIntervalMinutes);
            if (intervalsElapsed === 0) return prev;

            let newAccumulatedPages = prev.accumulatedMissedPages;
            let newNextPageStart = prev.nextPageStart ?? (settings.startPage || 1);

            if (prev.wirdCompleted) {
                // الورد مكتمل → تقدم للورد الجديد تلقائياً
                const completedRange = buildRange(newNextPageStart, settings.pagesPerDay, prev.accumulatedMissedPages);
                newNextPageStart = Math.min(completedRange.end + 1, TOTAL_PAGES);
                newAccumulatedPages = 0;
            } else {
                // الورد لم يكتمل → نضيف pagesPerDay × عدد الـ intervals
                newAccumulatedPages = prev.accumulatedMissedPages + (settings.pagesPerDay * intervalsElapsed);
            }

            return {
                ...prev,
                currentDayIndex: prev.currentDayIndex + intervalsElapsed,
                completedPages: [],
                lastMinutesCheck: lastMinutes + (intervalsElapsed * updateIntervalMinutes),
                lastVisitDate: todayStr(),
                accumulatedMissedPages: newAccumulatedPages,
                lastSettingsUpdateTime: Date.now(),
                wirdCompleted: false,
                nextPageStart: newNextPageStart,
            };
        });
    }, [settings]);

    /* ── markComplete ────────────────────────────────────────────── */
    const markComplete = useCallback(() => {
        setProgress(prev => ({ ...prev, wirdCompleted: true }));
    }, []);

    // يُستدعى لما المستخدم يضغط "التالي" في آخر صفحة من الورد
    const markLastPageComplete = useCallback(() => {
        setProgress(prev => ({ ...prev, wirdCompleted: true }));
    }, []);

    /* ── moveToNextWird ──────────────────────────────────────────── */
    const moveToNextWird = useCallback(() => {
        if (!settings) return;

        setProgress(prev => {
            const start = prev.nextPageStart ?? (settings.startPage || 1);
            const currentRange = buildRange(start, settings.pagesPerDay, prev.accumulatedMissedPages);
            // الورد التالي يبدأ من بعد نهاية الورد الحالي
            const newNextPageStart = Math.min(currentRange.end + 1, TOTAL_PAGES);

            return {
                ...prev,
                currentDayIndex: prev.currentDayIndex + 1,
                completedPages: [],
                accumulatedMissedPages: 0,        // صفّر المتراكم بعد إتمام الورد
                lastMinutesCheck: getCurrentMinutesSinceStart(), // ابدأ الـ interval من الصفر
                lastSettingsUpdateTime: Date.now(),
                wirdCompleted: false,
                nextPageStart: newNextPageStart,
            };
        });
    }, [settings]);

    /* ── completeLastWird ────────────────────────────────────────── */
    const completeLastWird = useCallback(() => {
        setProgress(prev => ({ ...prev, wirdCompleted: true }));
    }, []);

    /* ── resetWird ───────────────────────────────────────────────── */
    const resetWird = useCallback(() => {
        setSettings(null);
        setProgress(defaultProgress(1));
        localStorage.removeItem(STORAGE_SETTINGS);
        localStorage.removeItem(STORAGE_PROGRESS);
        localStorage.removeItem(STORAGE_CURRENT_PAGE);
    }, []);

    /* ── saveCurrentPage و getCurrentPage ────────────────────────── */
    const saveCurrentPage = useCallback((page) => {
        if (page >= 1 && page <= TOTAL_PAGES) {
            localStorage.setItem(STORAGE_CURRENT_PAGE, JSON.stringify({ page, timestamp: Date.now() }));
        }
    }, []);

    const getCurrentPage = useCallback(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PAGE));
            if (stored && stored.page >= 1 && stored.page <= TOTAL_PAGES) {
                return stored.page;
            }
        } catch {
            // تجاهل الأخطاء
        }
        return null;
    }, []);

    const clearCurrentPage = useCallback(() => {
        localStorage.removeItem(STORAGE_CURRENT_PAGE);
    }, []);

    return {
        settings,
        saveSettings,
        activeRange,
        score,
        isComplete,
        markPageRead,
        finishCatchUp,
        missedDays,
        isCatchingUp: progress.isCatchingUp,
        currentDayIndex: progress.currentDayIndex,
        forceCheckUpdate,
        accumulatedMissedPages: progress.accumulatedMissedPages,
        moveToNextWird,
        completeLastWird,
        markComplete,
        markLastPageComplete,
        resetWird,
        lastSettingsUpdateTime: progress.lastSettingsUpdateTime,
        saveCurrentPage,
        getCurrentPage,
        clearCurrentPage,
    };
}