import { useState, useRef, useEffect } from "react";

const useDraggable = (initialPos) => {
    const dragging    = useRef(false);
    const offset      = useRef({ x: 0, y: 0 });
    const [pos,         setPos]         = useState(initialPos);
    const [isDragging,  setIsDragging]  = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!dragging.current) return;
            setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
        };
        const onMouseUp = () => {
            if (dragging.current) { dragging.current = false; setIsDragging(false); }
        };
        const onTouchMove = (e) => {
            if (!dragging.current) return;
            e.preventDefault();
            const t = e.touches[0];
            setPos({ x: t.clientX - offset.current.x, y: t.clientY - offset.current.y });
        };
        const onTouchEnd = () => {
            if (dragging.current) { dragging.current = false; setIsDragging(false); }
        };

        window.addEventListener("mousemove",  onMouseMove);
        window.addEventListener("mouseup",    onMouseUp);
        window.addEventListener("touchmove",  onTouchMove, { passive: false });
        window.addEventListener("touchend",   onTouchEnd);

        return () => {
            window.removeEventListener("mousemove",  onMouseMove);
            window.removeEventListener("mouseup",    onMouseUp);
            window.removeEventListener("touchmove",  onTouchMove);
            window.removeEventListener("touchend",   onTouchEnd);
        };
    }, []);

    const startDrag = (clientX, clientY) => {
        dragging.current = true;
        setIsDragging(true);
        offset.current = { x: clientX - pos.x, y: clientY - pos.y };
    };

    return { pos, setPos, isDragging, startDrag };
};

export default useDraggable;
