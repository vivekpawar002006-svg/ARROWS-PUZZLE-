import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
  color: string;
  rotation: number;
  vx: number;
  vy: number;
  vRot: number;
  shape: 'rect' | 'circle';
}

const CONFETTI_COLORS = [
  '#6366f1', // indigo
  '#4f46e5', // royal blue
  '#1e293b', // dark navy
  '#a5b4fc', // soft periwinkle
  '#818cf8', // lavender
  '#ffffff', // white
];

export const ConfettiEffect: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate two fountain bursts from bottom left and bottom right as seen in the video at 00:04
    const newParticles: Particle[] = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      // Half from left, half from right
      const fromLeft = i % 2 === 0;
      const startX = fromLeft ? 10 + Math.random() * 15 : 75 + Math.random() * 15;
      const startY = 85 + Math.random() * 10;

      // Velocity angled towards center-top
      const angle = fromLeft
        ? -Math.PI * (0.35 + Math.random() * 0.25) // pointing up-right
        : -Math.PI * (0.65 + Math.random() * 0.25); // pointing up-left

      const speed = 12 + Math.random() * 16;

      newParticles.push({
        id: i,
        x: startX,
        y: startY,
        size: 5 + Math.random() * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        vx: Math.cos(angle) * speed * 0.12,
        vy: Math.sin(angle) * speed * 0.15,
        vRot: (Math.random() - 0.5) * 15,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      });
    }

    setParticles(newParticles);

    let animationFrame: number;
    let lastTime = performance.now();

    const update = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.35 * dt * 25, // gravity
          rotation: p.rotation + p.vRot,
        }))
      );

      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: p.shape === 'rect' ? `${p.size * 1.6}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            opacity: Math.max(0, 1 - (p.y - 40) / 70),
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          }}
        />
      ))}
    </div>
  );
};
