import { useEffect, useRef } from "react";

// One animated backdrop for the whole app (mounted once in App.jsx).
// Pages that want it to show through just need a transparent background.
export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animId;
    let t = 0;

    const blobs = [
      { x: 0.15, y: 0.3, r: 320, color: "#4c1d95", speed: 0.0008 }, // deep purple
      { x: 0.85, y: 0.7, r: 280, color: "#0f766e", speed: 0.001 },  // teal
      { x: 0.5, y: 0.85, r: 250, color: "#1e1b4b", speed: 0.0012 }, // indigo
      { x: 0.7, y: 0.2, r: 200, color: "#312e81", speed: 0.0009 },  // violet
    ];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (reduceMotion) draw();
    }

    function draw() {
      t += 1;
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((b, i) => {
        const ox = Math.sin(t * b.speed + i * 1.2) * 80;
        const oy = Math.cos(t * b.speed * 0.8 + i * 0.9) * 60;
        const cx = b.x * canvas.width + ox;
        const cy = b.y * canvas.height + oy;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
        grad.addColorStop(0, b.color + "cc");
        grad.addColorStop(1, b.color + "00");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!reduceMotion) animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    if (!reduceMotion) draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ss-bg-canvas" aria-hidden="true" />;
}
