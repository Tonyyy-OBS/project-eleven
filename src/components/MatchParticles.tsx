import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; color: string;
  life: number; maxLife: number;
  rotation: number; vr: number;
}

interface MatchParticlesProps {
  trigger: { x: number; y: number; color: string } | null;
}

export default function MatchParticles({ trigger }: MatchParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;
    const colors = [trigger.color, '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'];
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 5;
      particlesRef.current.push({
        x: trigger.x, y: trigger.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1, maxLife: 40 + Math.random() * 30,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
      });
    }
    // Sparkles
    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({
        x: trigger.x + (Math.random() - 0.5) * 40,
        y: trigger.y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3,
        size: 2 + Math.random() * 3,
        color: '#ffffff',
        life: 1, maxLife: 20 + Math.random() * 15,
        rotation: 0, vr: 0,
      });
    }
  }, [trigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity
        p.vx *= 0.98;
        p.life++;
        p.rotation += p.vr;
        
        const progress = p.life / p.maxLife;
        const alpha = 1 - progress;
        const scale = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = p.color;
        
        // Draw varied shapes
        const s = p.size * scale;
        if (p.vr === 0) {
          // Sparkle (star)
          ctx.beginPath();
          for (let j = 0; j < 4; j++) {
            const a = (j * Math.PI) / 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * s * 1.5, Math.sin(a) * s * 1.5);
          }
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Confetti rectangle
          ctx.fillRect(-s / 2, -s / 4, s, s / 2);
        }
        
        ctx.restore();
      }
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[200]"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
