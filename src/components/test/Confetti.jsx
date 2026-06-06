/**
 * Confetti
 * ────────
 * احتفال كونفتي بسيط بدون library خارجية
 * يُستخدم عند إتمام الورد اليومي
 */
import { useEffect, useRef } from "react";

export default function Confetti({ active }) {
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
