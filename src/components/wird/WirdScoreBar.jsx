/**
 * WirdScoreBar
 * ────────────
 * شريط التقدم اليومي + احتفال الكونفتي + بانر الأيام المتأخرة
 */
import { useEffect, useRef, useState } from "react";
import WirdSettingsPopup from "./WirdSettingsPopup";
import Confetti from "./Confetti";

/* ── Format time display ────────────────────────────────────── */
const formatTimeRemaining = (totalSeconds) => {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (totalMinutes < 60) {
        // أقل من ساعة: عرض بالدقائق فقط
        return `${totalMinutes} دقيقة و${seconds} ثانية`;
    }
    
    if (totalMinutes < 1440) {
        // أقل من 24 ساعة: عرض بالساعات والدقائق
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const hourText = hours === 1 ? "ساعة" : `${hours} ساعات`;
        return `${hourText}${minutes > 0 ? ` و${minutes} دقيقة` : ""}`;
    }
    
    // أكثر من 24 ساعة: عرض باليوم والساعات والدقائق
    const days = Math.floor(totalMinutes / 1440);
    const remainingMinutes = totalMinutes % 1440;
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    
    let result = `${days === 1 ? "يوم" : `${days} أيام`}`;
    if (hours > 0) {
        const hourText = hours === 1 ? "ساعة" : `${hours} ساعات`;
        result += ` و${hourText}`;
    }
    if (minutes > 0) {
        result += ` و${minutes} دقيقة`;
    }
    
    return result;
};

/* ── Format interval display ────────────────────────────────── */
const formatIntervalDisplay = (intervalMinutes) => {
    if (intervalMinutes < 60) {
        return `${intervalMinutes} دقيقة`;
    }
    
    if (intervalMinutes < 1440) {
        const hours = intervalMinutes / 60;
        const isWhole = hours === Math.floor(hours);
        return isWhole ? `${Math.floor(hours)} ساعات` : `${hours.toFixed(1)} ساعة`;
    }
    
    const days = intervalMinutes / 1440;
    const isWhole = days === Math.floor(days);
    return isWhole ? `${Math.floor(days)} أيام` : `${days.toFixed(1)} يوم`;
};

/* ── WirdScoreBar ────────────────────────────────────────────── */
export default function WirdScoreBar({
    score,
    isComplete,
    activeRange,
    missedDays,
    isCatchingUp,
    onFinishCatchUp,
    currentDayIndex,
    settings,
    onSaveSettings,
    onTimeExpired,
    accumulatedMissedPages,
    onMoveToNext,
    onCompleteLastWird,
    onMarkComplete,      // يُستدعى عند الضغط على "إنهاء" في آخر صفحة
    lastSettingsUpdateTime,
    currentPage,         // الصفحة الحالية المعروضة
}) {
    const [showCelebration, setShowCelebration] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(180); // افتراضي 3 دقائق
    const prevComplete = useRef(false);
    const timeExpiredRef = useRef(false); // لتجنب استدعاء الـ callback مرتين

    const TOTAL_PAGES = 604; // عدد صفحات القرآن الكريم
    const isLastWird = activeRange && activeRange.end >= TOTAL_PAGES; // هل نحن في آخر ورد؟

    const effectiveUpdateInterval = (settings?.updateInterval || 3) * Math.max(1, (settings?.pagesPerDay || 1) + (accumulatedMissedPages || 0)) / Math.max(1, settings?.pagesPerDay || 1);

    // حساب الدقائق المتبقية والثواني
    useEffect(() => {
        const updateTimer = () => {
            const updateIntervalMinutes = effectiveUpdateInterval;
            const updateIntervalMs = updateIntervalMinutes * 60 * 1000;

            const now = Date.now();
            const timeElapsedSinceUpdate = now - (lastSettingsUpdateTime || now);
            const remainingMs = Math.max(0, updateIntervalMs - (timeElapsedSinceUpdate % updateIntervalMs));
            const remaining = Math.ceil(remainingMs / 1000);

            setTimeRemaining(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [effectiveUpdateInterval, lastSettingsUpdateTime]);

    // احتفال عند الإتمام
    useEffect(() => {
        if (isComplete && !prevComplete.current) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 5000);
        }
        prevComplete.current = isComplete;
    }, [isComplete]);

    // إعادة تعيين flag عندما يتغير currentDayIndex
    useEffect(() => {
        timeExpiredRef.current = false;
    }, [currentDayIndex]);

    // تحديث الصفحات عندما ينتهي الوقت
    useEffect(() => {
        if (timeRemaining === 0 && !timeExpiredRef.current && onTimeExpired) {
            timeExpiredRef.current = true;
            onTimeExpired();
            setTimeout(() => {
                timeExpiredRef.current = false;
            }, 1000);
        }
    }, [timeRemaining, onTimeExpired]);

    return (
        <>
            <Confetti active={showCelebration} />

            <div className="wird-score-bar-wrapper" dir="rtl">
                {/* ── بانر الأيام المتأخرة ── */}
                {activeRange && missedDays > 0 && (
                    <div className="wird-catchup-banner">
                        <span className="wird-catchup-icon">⚠️</span>
                        <div className="wird-catchup-text">
                            <strong>أنت متأخر {missedDays} {missedDays === 1 ? "يوم" : "أيام"}!</strong>
                            <span>سيتم دمج الأوراد تلقائياً حتى تلحق بالركب.</span>
                        </div>
                        {isCatchingUp && (
                            <span className="wird-catchup-badge">جارٍ اللحاق…</span>
                        )}
                    </div>
                )}

                {/* ── معلومات اليوم ── */}
                <div className="wird-score-info">
                    {!activeRange ? (
                        /* لا توجد إعدادات محفوظة */
                        <div className="wird-empty-state">
                            <div className="wird-empty-state__icon">📖</div>
                            <p className="wird-empty-state__title">
                                لم تقم بإعداد الورد اليومي بعد
                            </p>
                            <p className="wird-empty-state__hint">
                                اضغط على الترس أدناه لبدء إعدادك الورد
                            </p>
                            <WirdSettingsPopup settings={settings} onSave={onSaveSettings} />
                        </div>
                    ) : (
                        <>
                            <div className="wird-day-label">
                                <WirdSettingsPopup settings={settings} onSave={onSaveSettings} />

                                {isCatchingUp ? (
                                    <span className="wird-catchup-tag">📚 قضاء يوم فائت</span>
                                ) : (
                                    <span>📅 اليوم {currentDayIndex + 1}</span>
                                )}
                                <span className="wird-range-label">
                                    الصفحات {activeRange.start} – {activeRange.end}
                                    {accumulatedMissedPages > 0 && !isCatchingUp && (
                                        <span className="wird-missed-pages-badge">
                                            (+{accumulatedMissedPages} محفوظة)
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* عرض الوقت المتبقي للورد القادم */}
                            <div className="wird-next-update-timer">
                                <span className="wird-timer-label">⏱️ الورد القادم خلال:</span>
                                <span className="wird-timer-display">
                                    {formatTimeRemaining(timeRemaining)}
                                </span>
                                {/* <span className="wird-timer-info">(كل {formatIntervalDisplay(Math.ceil(effectiveUpdateInterval))})</span> */}
                            </div>

                            {/* شريط التقدم */}
                            <div className="wird-progress-track">
                                <div
                                    className={`wird-progress-fill ${isComplete ? "complete" : ""}`}
                                    style={{ width: `${score}%` }}
                                />
                                <span className="wird-score-pct">{score}%</span>
                            </div>

                            {/* زرار الإجراء */}
                            <div className="wird-action-area">
                                {isComplete ? (
                                    isLastWird ? (
                                        <div className="wird-complete-msg">
                                            🎉 ما شاء الله! أتممتَ القرآن الكريم!
                                        </div>
                                    ) : (
                                        <div className="wird-complete-msg">
                                            🎉 ما شاء الله! أتممتَ وردك اليوم
                                            <button
                                                className="wird-next-catchup-btn"
                                                onClick={isCatchingUp ? onFinishCatchUp : onMoveToNext}
                                            >
                                                {isCatchingUp ? "قضاء المتأخر →" : "الورد التالي →"}
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <span className="wird-reading-hint">📖 واصل القراءة حتى آخر صفحة</span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
