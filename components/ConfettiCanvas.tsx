'use client';
import { useEffect, useRef } from 'react';

const COLORS = ['#009453', '#E1042D', '#F5D76E', '#C44FB5', '#42A5F5', '#FF7043', '#FFFFFF'];

export function ConfettiCanvas({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d')!;
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 100,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 3 + Math.random() * 5,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
    }));
    let frame = 0;
    let animId: number;
    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.rot += p.rotV;
      });
      frame++;
      if (frame < 90) animId = requestAnimationFrame(draw);
      else if (canvas) canvas.style.display = 'none';
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [trigger]);

  return <canvas ref={canvasRef} id="confetti-canvas" style={{ display: 'none' }} />;
}
