import { useRef, useState, useEffect } from "react";

const FloatingPin = ({ onDropped, pinning, setPinning }) => {
    const ref       = useRef(null);
    const dragging  = useRef(false);
    const startPos  = useRef({ ox: 0, oy: 0 });
    const [pos,    setPos]    = useState({ x: window.innerWidth - 62, y: window.innerHeight / 2 - 20 });
    const [lifted, setLifted] = useState(false);

    const walkToAya = (el) => {
        while (el) {
            if (el.dataset && "aya" in el.dataset) return el;
            el = el.parentElement;
        }
        return null;
    };

    const clearHL = () =>
        document.querySelectorAll("[data-aya][data-hl]").forEach(el => el.removeAttribute("data-hl"));

    const applyHL = (cx, cy) => {
        clearHL();
        const els = document.elementsFromPoint(cx, cy);
        for (const el of els) {
            const aya = walkToAya(el);
            if (aya) { aya.setAttribute("data-hl", "true"); break; }
        }
    };

    const findAya = (cx, cy) => {
        const els = document.elementsFromPoint(cx, cy);
        for (const el of els) {
            const aya = walkToAya(el);
            if (aya) return aya;
        }
        return null;
    };

    useEffect(() => {
        const onMove = (cx, cy) => {
            if (!dragging.current) return;
            setPos({ x: cx - startPos.current.ox, y: cy - startPos.current.oy });
            applyHL(cx, cy);
        };
        const onUp = (cx, cy) => {
            if (!dragging.current) return;
            dragging.current = false;
            setLifted(false);
            setPinning(false);
            clearHL();
            const ayaEl = findAya(cx, cy);
            if (ayaEl) {
                onDropped({
                    ayaNumber: Number(ayaEl.dataset.ayaNum),
                    suraId:    Number(ayaEl.dataset.suraId),
                    suraName:  ayaEl.dataset.suraName,
                    ayaText:   ayaEl.dataset.ayaText,
                });
            }
            // Keep the pin where the user dropped it instead of resetting it.
        };

        const mm = (e) => onMove(e.clientX, e.clientY);
        const mu = (e) => onUp(e.clientX, e.clientY);
        const tm = (e) => { if (!dragging.current) return; e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); };
        const tu = (e) => onUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

        window.addEventListener("mousemove",  mm);
        window.addEventListener("mouseup",    mu);
        window.addEventListener("touchmove",  tm, { passive: false });
        window.addEventListener("touchend",   tu);

        return () => {
            window.removeEventListener("mousemove",  mm);
            window.removeEventListener("mouseup",    mu);
            window.removeEventListener("touchmove",  tm);
            window.removeEventListener("touchend",   tu);
        };
    }, [onDropped, setPinning]);

    const startDrag = (cx, cy) => {
        const rect = ref.current.getBoundingClientRect();
        startPos.current = { ox: cx - rect.left, oy: cy - rect.top };
        dragging.current = true;
        setLifted(true);
        setPinning(true);
    };

    const safeX = Math.max(0, Math.min(window.innerWidth  - 50, pos.x));
    const safeY = Math.max(0, Math.min(window.innerHeight - 50, pos.y));

    return (
        <>
            <div
                ref={ref}
                title="اسحب على أي آية لحفظ موقفك"
                className={`floating-pin ${lifted ? "floating-pin--lifted" : "floating-pin--resting"}`}
                style={{ left: safeX, top: safeY }}
                onMouseDown={(e) => { startDrag(e.clientX, e.clientY); e.preventDefault(); }}
                onTouchStart={(e) => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); }}
            >
                📌
            </div>

            {pinning && (
                <div className="floating-pin__hint">
                    أفلت الـ Pin على أي آية لحفظ موقفك
                </div>
            )}
        </>
    );
};

export default FloatingPin;
