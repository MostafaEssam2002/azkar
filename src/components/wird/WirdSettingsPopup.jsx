/**
 * WirdSettingsPopup
 * ─────────────────
 * زر ترس صغير → popup بإعدادات الورد اليومي
 */
import { useState, useRef, useEffect } from "react";

const TOTAL_PAGES = 604;

export default function WirdSettingsPopup({ settings, onSave }) {
    const [open, setOpen] = useState(!settings); // افتح تلقائي لو مفيش إعدادات
    const [pagesPerDay, setPagesPerDay] = useState(settings?.pagesPerDay ?? 20);
    const [startPage, setStartPage] = useState(settings?.startPage ?? 1);
    const [updateInterval, setUpdateInterval] = useState(settings?.updateInterval ?? 3); // بالدقائق
    const [intervalUnit, setIntervalUnit] = useState(settings?.intervalUnit ?? "minutes"); // minutes, hours, days
    const popupRef = useRef(null);

    // اغلق لو ضغط بره
    useEffect(() => {
        const handler = (e) => {
            if (open && popupRef.current && !popupRef.current.contains(e.target)) {
                if (settings) setOpen(false); // لو مفيش إعدادات متقفلش
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, settings]);

    const handleSave = () => {
        const pages = Math.min(TOTAL_PAGES, Math.max(1, Number(pagesPerDay) || 20));
        const start = Math.min(TOTAL_PAGES, Math.max(1, Number(startPage) || 1));
        
        // تحويل الفترة إلى دقائق حسب الوحدة المختارة
        let intervalInMinutes = Number(updateInterval) || 3;
        if (intervalUnit === "hours") {
            intervalInMinutes = intervalInMinutes * 60;
        } else if (intervalUnit === "days") {
            intervalInMinutes = intervalInMinutes * 24 * 60;
        }
        intervalInMinutes = Math.min(10080, Math.max(1, intervalInMinutes)); // من 1 دقيقة إلى 7 أيام
        
        onSave({ 
            pagesPerDay: pages, 
            startPage: start, 
            updateInterval: intervalInMinutes,
            intervalUnit: intervalUnit // احفظ الوحدة الأصلية للعرض
        });
        setOpen(false);
    };

    return (
        <div className="wird-settings-wrapper" ref={popupRef}>
            {/* ── زر الترس ─── */}
            <button
                className={`wird-gear-btn ${open ? "active" : ""}`}
                onClick={() => setOpen(v => !v)}
                title="إعدادات الورد اليومي"
                aria-label="إعدادات الورد"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>الورد اليومي</span>
            </button>

            {/* ── Popup ─── */}
            {open && (
                <div className="wird-popup" dir="rtl">
                    <div className="wird-popup-header">
                        <span className="wird-popup-icon">📖</span>
                        <h3>إعداد الورد اليومي</h3>
                        {settings && (
                            <button className="wird-popup-close" onClick={() => setOpen(false)}>✕</button>
                        )}
                    </div>

                    <div className="wird-popup-body">
                        {/* عدد الصفحات */}
                        <div className="wird-field">
                            <label>عدد الصفحات يومياً</label>
                            <div className="wird-stepper">
                                <button onClick={() => setPagesPerDay(v => Math.max(1, v - 1))}>−</button>
                                <span>{pagesPerDay}</span>
                                <button onClick={() => setPagesPerDay(v => Math.min(TOTAL_PAGES, v + 1))}>+</button>
                            </div>
                            <small>ختمة كل {Math.ceil(TOTAL_PAGES / pagesPerDay)} يوم</small>
                        </div>

                        {/* صفحة البداية */}
                        <div className="wird-field">
                            <label>صفحة البداية</label>
                            <input
                                type="number"
                                min={1}
                                max={TOTAL_PAGES}
                                value={startPage}
                                onChange={e => setStartPage(e.target.value)}
                                className="wird-input"
                            />
                        </div>

                        {/* فترة التحديث */}
                        <div className="wird-field">
                            <label>فترة التحديث</label>
                            <div className="wird-interval-group">
                                <div className="wird-stepper">
                                    <button onClick={() => setUpdateInterval(v => Math.max(1, v - 1))}>−</button>
                                    <span>{updateInterval}</span>
                                    <button onClick={() => setUpdateInterval(v => Math.max(1, v + 1))}>+</button>
                                </div>
                                <select 
                                    value={intervalUnit} 
                                    onChange={e => setIntervalUnit(e.target.value)}
                                    className="wird-unit-select"
                                >
                                    <option value="minutes">دقائق</option>
                                    <option value="hours">ساعات</option>
                                    <option value="days">أيام</option>
                                </select>
                            </div>
                            <small>
                                {intervalUnit === "minutes" && `الورد يتحدث كل ${updateInterval} دقيقة`}
                                {intervalUnit === "hours" && `الورد يتحدث كل ${updateInterval} ${updateInterval === 1 ? "ساعة" : "ساعات"}`}
                                {intervalUnit === "days" && `الورد يتحدث كل ${updateInterval} ${updateInterval === 1 ? "يوم" : "أيام"}`}
                            </small>
                        </div>
                    </div>

                    <button className="wird-save-btn" onClick={handleSave}>
                        حفظ الإعدادات ✓
                    </button>
                </div>
            )}
        </div>
    );
}
