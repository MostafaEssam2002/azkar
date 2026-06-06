/**
 * WirdScoreBar
 * ────────────
 * شريط التقدم اليومي + احتفال الكونفتي + بانر الأيام المتأخرة
 */
import { useEffect, useRef, useState } from "react";
import WirdSettingsPopup from "./WirdSettingsPopup";

/* ── بسيط Confetti بدون library ──────────────────────────────── */
function Confetti({ active }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const particles = useRef([]);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ["#c8b97a", "#2d6a4f", "#e9c46a", "#52b788", "#fff8e1", "#f4a261"];
        particles.current = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            w: Math.random() * 12 + 6,
            h: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 4 + 2,
            angle: Math.random() * 360,
            spin: (Math.random() - 0.5) * 6,
            drift: (Math.random() - 0.5) * 1.5,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            particles.current.forEach(p => {
                p.y += p.speed;
                p.x += p.drift;
                p.angle += p.spin;
                if (p.y < canvas.height + 20) alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.angle * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            if (alive) animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [active]);

    if (!active) return null;
    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed", top: 0, left: 0,
                width: "100vw", height: "100vh",
                pointerEvents: "none", zIndex: 9999,
            }}
        />
    );
}

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
            // الفترة الفعلية بالدقائق (بدون تقريب)
            const updateIntervalMinutes = effectiveUpdateInterval;
            const updateIntervalMs = updateIntervalMinutes * 60 * 1000;
            
            const now = Date.now();
            
            // احسب الوقت المنقضي منذ آخر حفظ إعدادات بالملي ثانية
            const timeElapsedSinceUpdate = now - (lastSettingsUpdateTime || now);
            
            // احسب الوقت المتبقي بناءً على الفترة الكاملة
            // إذا انقضت الفترة كاملة، يعود الوقت لـ 0
            const remainingMs = Math.max(0, updateIntervalMs - (timeElapsedSinceUpdate % updateIntervalMs));
            const remaining = Math.ceil(remainingMs / 1000); // تحويل إلى ثواني
            
            setTimeRemaining(remaining);
        };

        updateTimer(); // تحديث فوري
        const interval = setInterval(updateTimer, 1000); // تحديث كل ثانية

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

    // إعادة تعيين flag عندما يتغير currentDayIndex (الانتقال للورد الجديد)
    useEffect(() => {
        timeExpiredRef.current = false;
    }, [currentDayIndex]);

    // تحديث الصفحات عندما ينتهي الوقت
    useEffect(() => {
        if (timeRemaining === 0 && !timeExpiredRef.current && onTimeExpired) {
            timeExpiredRef.current = true;
            onTimeExpired(); // استدعي الـ callback لتحديث الورد
            
            // أعد تعيين الـ flag بعد دقيقة واحدة لتجنب استدعاء متكرر
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
                        /* لا توجد إعدادات محفوظة — اعرض رسالة وزر الإعدادات */
                        <div style={{
                            textAlign: 'center',
                            padding: '20px 10px',
                            color: '#6b7280',
                            fontFamily: "'Noto Naskh Arabic', serif",
                        }}>
                            <div style={{ fontSize: '18px', marginBottom: '12px' }}>📖</div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
                                لم تقم بإعداد الورد اليومي بعد
                            </p>
                            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#9ca3af' }}>
                                اضغط على الترس أدناه لبدء إعدادك الورد
                            </p>
                            <WirdSettingsPopup settings={settings} onSave={onSaveSettings} />
                        </div>
                    ) : (
                        /* إعدادات موجودة — اعرض معلومات الورد */
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
                                        <span style={{ color: "#e9c46a", marginLeft: "0.5rem" }}>
                                            (+{accumulatedMissedPages} محفوظة)
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* عرض الوقت المتبقي للورد القادم */}
                            <div className="wird-next-update-timer">
                                <span className="wird-timer-label">⏱️ الورد القادم خلال:</span>
                                <span className="wird-timer-display">
                                    {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                                </span>
                                <span className="wird-timer-info">(كل {Math.max(0.5, effectiveUpdateInterval.toFixed(1))} دقائق)</span>
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
                                    /* الورد اكتمل (score=100) */
                                    isLastWird ? (
                                        /* آخر ورد في القرآن - رسالة تهنئة فقط */
                                        <div className="wird-complete-msg">
                                            🎉 ما شاء الله! أتممتَ القرآن الكريم!
                                        </div>
                                    ) : (
                                        /* ورد عادي - زرار الانتقال للتالي */
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
                                    /* لا يزال يقرأ — لا يوجد زرار */
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