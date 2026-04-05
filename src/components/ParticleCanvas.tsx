import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const mk = () => ({
      x: Math.random() * cv.width,
      y: cv.height + 5,
      r: Math.random() * 1.7 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(Math.random() * 0.52 + 0.14),
      life: Math.random() * 0.7 + 0.3,
      col: Math.random() > 0.5 ? '0,229,255' : '124,58,237',
    });

    const pts = Array.from({ length: 52 }, () => {
      const p = mk();
      p.y = Math.random() * cv.height;
      return p;
    });

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.003;
        if (p.life <= 0 || p.y < -10) pts[i] = mk();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${Math.min(1, p.life * 2) * 0.42})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none" />;
}
