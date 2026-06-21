/**
 * WirdSettingsPopup
 * ─────────────────
 * زر ترس صغير → popup بإعدادات الورد اليومي
 */
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const TOTAL_PAGES = 604;

export default function WirdSettingsPopup({ settings, onSave }) {
    const [open, setOpen] = useState(!settings);
    const [pagesPerDay, setPagesPerDay] = useState(settings?.pagesPerDay ?? 20);
    const [startPage, setStartPage] = useState(settings?.startPage ?? 1);
    const [updateInterval, setUpdateInterval] = useState(settings?.updateInterval ?? 3);
    const [intervalUnit, setIntervalUnit] = useState(settings?.intervalUnit ?? "minutes");
    const popupRef = useRef(null);

    useEffect(() => {
        const handler = (event) => {
            if (open && popupRef.current && !popupRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const handleSave = () => {
        const pages = Math.min(TOTAL_PAGES, Math.max(1, Number(pagesPerDay) || 20));
        const start = Math.min(TOTAL_PAGES, Math.max(1, Number(startPage) || 1));

        let intervalInMinutes = Number(updateInterval) || 3;
        if (intervalUnit === "hours") {
            intervalInMinutes = intervalInMinutes * 60;
        } else if (intervalUnit === "days") {
            intervalInMinutes = intervalInMinutes * 24 * 60;
        }
        intervalInMinutes = Math.min(10080, Math.max(1, intervalInMinutes));

        onSave({
            pagesPerDay: pages,
            startPage: start,
            updateInterval: intervalInMinutes,
            intervalUnit,
        });
        setOpen(false);
    };

    const updateInput = (setter, value, min, max) => {
        const parsed = Number(value);
        if (Number.isNaN(parsed)) return;
        setter(Math.min(max, Math.max(min, parsed)));
    };

    const popupContent = open && (
        <div className="wird-popup-overlay" dir="rtl">
            <div className="wird-popup" ref={popupRef} onClick={(e) => e.stopPropagation()}>
                <div className="wird-popup-header">
                    <span className="wird-popup-icon">📖</span>
                    <h3>إعداد الورد اليومي</h3>
                    <button className="wird-popup-close" onClick={() => setOpen(false)} aria-label="إغلاق الإعدادات">✕</button>
                </div>

                <div className="wird-popup-body">
                    <div className="wird-field">
                        <label>عدد الصفحات يومياً</label>
                        <div className="wird-input-row">
                            <button
                                type="button"
                                className="wird-step-btn"
                                onClick={() => setPagesPerDay((v) => Math.max(1, v - 1))}
                            >−</button>
                            <input
                                type="number"
                                min={1}
                                max={TOTAL_PAGES}
                                value={pagesPerDay}
                                onChange={(e) => updateInput(setPagesPerDay, e.target.value, 1, TOTAL_PAGES)}
                                className="wird-number-input"
                            />
                            <button
                                type="button"
                                className="wird-step-btn"
                                onClick={() => setPagesPerDay((v) => Math.min(TOTAL_PAGES, v + 1))}
                            >+</button>
                        </div>
                        <small>ختمة كل {Math.max(1, Math.ceil(TOTAL_PAGES / Math.max(1, pagesPerDay)))} يوم</small>
                    </div>

                    <div className="wird-field">
                        <label>صفحة البداية</label>
                        <input
                            type="number"
                            min={1}
                            max={TOTAL_PAGES}
                            value={startPage}
                            onChange={(e) => updateInput(setStartPage, e.target.value, 1, TOTAL_PAGES)}
                            className="wird-input"
                        />
                    </div>

                    <div className="wird-field">
                        <label>فترة التحديث</label>
                        <div className="wird-interval-group">
                            <div className="wird-input-row">
                                <button
                                    type="button"
                                    className="wird-step-btn"
                                    onClick={() => setUpdateInterval((v) => Math.max(1, v - 1))}
                                >−</button>
                                <input
                                    type="number"
                                    min={1}
                                    max={10080}
                                    value={updateInterval}
                                    onChange={(e) => updateInput(setUpdateInterval, e.target.value, 1, 10080)}
                                    className="wird-number-input"
                                />
                                <button
                                    type="button"
                                    className="wird-step-btn"
                                    onClick={() => setUpdateInterval((v) => Math.min(10080, v + 1))}
                                >+</button>
                            </div>
                            <select
                                value={intervalUnit}
                                onChange={(e) => setIntervalUnit(e.target.value)}
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
        </div>
    );

    return (
        <div className="wird-settings-wrapper">
            <button
                className={`wird-gear-btn ${open ? "active" : ""}`}
                onClick={() => setOpen((v) => !v)}
                title="إعدادات الورد اليومي"
                aria-label="إعدادات الورد"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>الورد اليومي</span>
            </button>

            {createPortal(popupContent, document.body)}
        </div>
    );
}
