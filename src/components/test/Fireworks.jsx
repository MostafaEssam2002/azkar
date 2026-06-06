import React, { useEffect, useRef } from "react";
import "./fireworks.scss";

const Fireworks = ({ active }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const rocketsRef = useRef([]);
    const animationIdRef = useRef(null);

    useEffect(() => {
        if (!active || !containerRef.current) return;

        // Create canvas
        const canvas = document.createElement("canvas");
        canvasRef.current = canvas;
        canvas.className = "fireworks-canvas";
        const ctx = canvas.getContext("2d");
        
        // Set canvas size
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateCanvasSize();
        
        containerRef.current.appendChild(canvas);

        // Color palette
        const colors = [
            "#FFD700", // Gold
            "#FF6B6B", // Red
            "#4ECDC4", // Teal
            "#45B7D1", // Blue
            "#FFA07A", // Light Salmon
            "#98D8C8", // Mint
            "#F7DC6F", // Yellow
            "#BB8FCE", // Purple
            "#85C1E2", // Sky Blue
            "#F8B195", // Orange
        ];

        // Particle class
        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.vx = (Math.random() - 0.5) * 12;
                this.vy = (Math.random() - 0.5) * 12;
                this.ax = 0;
                this.ay = 0.3; // gravity
                this.life = 1;
                this.decay = Math.random() * 0.015 + 0.015;
                this.size = Math.random() * 5 + 3;
                this.trail = [];
                this.maxTrailLength = 8;
            }

            update() {
                this.vx += this.ax;
                this.vy += this.ay;
                this.x += this.vx;
                this.y += this.vy;
                
                // Store trail
                this.trail.push({ x: this.x, y: this.y, life: this.life });
                if (this.trail.length > this.maxTrailLength) {
                    this.trail.shift();
                }
                
                this.life -= this.decay;
                return this.life > 0;
            }

            draw(ctx) {
                // Draw trail
                if (this.trail.length > 1) {
                    ctx.strokeStyle = this.color;
                    ctx.globalAlpha = this.life * 0.3;
                    ctx.lineWidth = this.size * 0.4;
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";
                    
                    ctx.beginPath();
                    ctx.moveTo(this.trail[0].x, this.trail[0].y);
                    for (let i = 1; i < this.trail.length; i++) {
                        ctx.lineTo(this.trail[i].x, this.trail[i].y);
                    }
                    ctx.stroke();
                }

                // Draw particle with glow
                ctx.globalAlpha = this.life;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 15;
                ctx.fillStyle = this.color;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Outer glow
                ctx.globalAlpha = this.life * 0.5;
                ctx.shadowBlur = 25;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Rocket class
        class Rocket {
            constructor(x, y, targetX, targetY) {
                this.x = x;
                this.y = y;
                this.targetX = targetX;
                this.targetY = targetY;
                this.vx = 0;
                this.vy = 0;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.life = 1;
                
                // Calculate duration based on distance
                const distance = Math.sqrt(
                    Math.pow(targetX - x, 2) + Math.pow(targetY - y, 2)
                );
                this.duration = Math.max(40, Math.min(80, distance / 10)); // 40-80 frames
                
                this.frame = 0;
                this.trail = [];
            }

            update() {
                this.frame++;
                const progress = this.frame / this.duration;

                // Smooth easing (ease-out)
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                this.x = this.x + (this.targetX - this.x) * easeProgress;
                this.y = this.y + (this.targetY - this.y) * easeProgress;

                // Store trail
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 12) {
                    this.trail.shift();
                }

                this.life = 1 - easeProgress;

                return this.frame < this.duration;
            }

            draw(ctx) {
                // Draw rocket trail
                if (this.trail.length > 1) {
                    ctx.strokeStyle = this.color;
                    ctx.globalAlpha = 0.6;
                    ctx.lineWidth = 2;
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";

                    ctx.beginPath();
                    ctx.moveTo(this.trail[0].x, this.trail[0].y);
                    for (let i = 1; i < this.trail.length; i++) {
                        ctx.lineTo(this.trail[i].x, this.trail[i].y);
                    }
                    ctx.stroke();
                }

                // Draw rocket with glow
                ctx.globalAlpha = 1;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 20;
                ctx.fillStyle = this.color;

                ctx.beginPath();
                ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
                ctx.fill();

                // Rocket head
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(this.x, this.y - 3, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            explode() {
                const particleCount = 80;
                for (let i = 0; i < particleCount; i++) {
                    particlesRef.current.push(
                        new Particle(this.x, this.y, colors[Math.floor(Math.random() * colors.length)])
                    );
                }

                // Secondary explosions
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const angleRange = Math.random() * Math.PI * 0.5;
                        const angle = Math.random() * angleRange + Math.PI * 0.25;
                        const distance = 40 + Math.random() * 60;
                        
                        for (let j = 0; j < 20; j++) {
                            const p = new Particle(
                                this.x + Math.cos(angle) * distance,
                                this.y + Math.sin(angle) * distance,
                                colors[Math.floor(Math.random() * colors.length)]
                            );
                            particlesRef.current.push(p);
                        }
                    }, i * 100);
                }
            }
        }

        // Launch rockets
        const launchRocket = () => {
            // Start position - random along the bottom
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight;
            
            // Target position - scattered across the upper/middle area
            const targetX = Math.random() * window.innerWidth;
            const targetY = window.innerHeight * (0.2 + Math.random() * 0.4); // 20-60% from top
            
            rocketsRef.current.push(new Rocket(startX, startY, targetX, targetY));
        };

        // Launch sequence - 7 rockets with varied timing
        launchRocket();
        setTimeout(() => launchRocket(), 120);
        setTimeout(() => launchRocket(), 240);
        setTimeout(() => launchRocket(), 360);
        setTimeout(() => launchRocket(), 480);
        setTimeout(() => launchRocket(), 600);
        setTimeout(() => launchRocket(), 720);

        // Animation loop
        const animate = () => {
            // Clear canvas
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalShadow = "transparent";
            ctx.globalAlpha = 1;

            // Update and draw rockets
            for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
                const rocket = rocketsRef.current[i];
                if (!rocket.update()) {
                    rocket.explode();
                    rocketsRef.current.splice(i, 1);
                } else {
                    rocket.draw(ctx);
                }
            }

            // Update and draw particles
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const particle = particlesRef.current[i];
                if (!particle.update()) {
                    particlesRef.current.splice(i, 1);
                } else {
                    particle.draw(ctx);
                }
            }

            // Continue animation if there are still elements
            if (rocketsRef.current.length > 0 || particlesRef.current.length > 0) {
                animationIdRef.current = requestAnimationFrame(animate);
            } else {
                // Clean up
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                canvas.remove();
            }
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            updateCanvasSize();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (canvasRef.current && containerRef.current) {
                try {
                    containerRef.current.removeChild(canvasRef.current);
                } catch (e) {
                    // Element already removed
                }
            }
        };
    }, [active]);

    if (!active) return null;

    return <div ref={containerRef} className="fireworks-container" />;
};

export default Fireworks;

