import React, { useEffect, useRef, useCallback } from 'react';
import { Arrow, Target, Balloon, Particle, FloatingText, GameMode, TrailStyle } from '../types';
import { soundFx } from '../utils/audio';

interface ArcheryCanvasProps {
  gameMode: GameMode;
  trailStyle: TrailStyle;
  isGameActive: boolean;
  wind: number; // -5 to +5
  onScoreUpdate: (points: number, isBullseye: boolean, isHit: boolean) => void;
  onArrowShot: () => void;
  onExtraArrow: () => void;
  onGameOver: () => void;
  arrowsLeft: number;
}

export const ArcheryCanvas: React.FC<ArcheryCanvasProps> = ({
  gameMode,
  trailStyle,
  isGameActive,
  wind,
  onScoreUpdate,
  onArrowShot,
  onExtraArrow,
  onGameOver,
  arrowsLeft,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game state refs for 60fps animation loop
  const stateRef = useRef<{
    width: number;
    height: number;
    // Bow position & aiming
    bowX: number;
    bowY: number;
    isAiming: boolean;
    aimStartX: number;
    aimStartY: number;
    currentPointerX: number;
    currentPointerY: number;
    pullDistance: number;
    aimAngle: number;
    stringVibrateTimer: number;
    // Entities
    arrows: Arrow[];
    targets: Target[];
    balloons: Balloon[];
    particles: Particle[];
    floatingTexts: FloatingText[];
    // Animation flags
    timeDilation: number; // for slow-mo hit effect
    timeDilationTimer: number;
    lastFrameTime: number;
    clouds: { x: number; y: number; speed: number; scale: number }[];
    balloonSpawnTimer: number;
  }>({
    width: 1000,
    height: 600,
    bowX: 120,
    bowY: 340,
    isAiming: false,
    aimStartX: 0,
    aimStartY: 0,
    currentPointerX: 0,
    currentPointerY: 0,
    pullDistance: 0,
    aimAngle: 0,
    stringVibrateTimer: 0,
    arrows: [],
    targets: [],
    balloons: [],
    particles: [],
    floatingTexts: [],
    timeDilation: 1,
    timeDilationTimer: 0,
    lastFrameTime: performance.now(),
    clouds: [
      { x: 50, y: 70, speed: 0.15, scale: 0.9 },
      { x: 380, y: 110, speed: 0.22, scale: 1.2 },
      { x: 720, y: 50, speed: 0.18, scale: 0.8 },
      { x: 950, y: 95, speed: 0.12, scale: 1.1 },
    ],
    balloonSpawnTimer: 0,
  });

  const nextArrowId = useRef<number>(1);
  const nextTargetId = useRef<number>(1);
  const nextBalloonId = useRef<number>(1);
  const nextTextId = useRef<number>(1);

  // Initialize targets based on mode
  const initTargets = useCallback(() => {
    const s = stateRef.current;
    s.targets = [];
    s.balloons = [];
    s.arrows = [];
    s.particles = [];
    s.floatingTexts = [];

    const targetX = Math.max(s.width * 0.82, 650);
    const centerY = s.height * 0.52;

    if (gameMode === 'classic') {
      s.targets.push({
        id: nextTargetId.current++,
        type: 'board',
        x: targetX,
        y: centerY,
        width: 32,
        height: 180,
        radius: 80,
        vy: 1.2,
        minY: centerY - 110,
        maxY: centerY + 110,
        speed: 1.3,
        direction: 1,
      });
    } else if (gameMode === 'trickshot') {
      // Main target + apple on top or swinging clay pot
      s.targets.push({
        id: nextTargetId.current++,
        type: 'board',
        x: targetX,
        y: centerY,
        width: 30,
        height: 160,
        radius: 70,
        vy: 1.8,
        minY: centerY - 130,
        maxY: centerY + 130,
        speed: 1.8,
        direction: 1,
      });
      s.targets.push({
        id: nextTargetId.current++,
        type: 'apple',
        x: targetX - 5,
        y: centerY - 95,
        width: 24,
        height: 24,
        radius: 14,
        vy: 1.8,
        minY: centerY - 130 - 95,
        maxY: centerY + 130 - 95,
        speed: 1.8,
        direction: 1,
      });
    } else if (gameMode === 'balloons') {
      // Faster moving small target board + floating balloons
      s.targets.push({
        id: nextTargetId.current++,
        type: 'board',
        x: targetX,
        y: centerY,
        width: 26,
        height: 130,
        radius: 60,
        vy: 2.2,
        minY: centerY - 140,
        maxY: centerY + 140,
        speed: 2.2,
        direction: 1,
      });
    }
  }, [gameMode]);

  // Handle Canvas Resizing
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width;
      const height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      stateRef.current.width = width;
      stateRef.current.height = height;
      stateRef.current.bowX = Math.max(width * 0.12, 70);
      stateRef.current.bowY = height * 0.58;

      initTargets();
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    resize();

    return () => ro.disconnect();
  }, [initTargets]);

  // Re-initialize targets when gameMode changes
  useEffect(() => {
    initTargets();
  }, [gameMode, initTargets]);

  // Spawn Balloons in Balloon Mode
  const spawnBalloon = useCallback(() => {
    const s = stateRef.current;
    if (s.balloons.length >= 7) return;

    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const isSpecial = Math.random() < 0.25;
    const specialType = isSpecial ? (Math.random() < 0.5 ? 'extra_arrow' : 'bonus_points') : undefined;

    const startX = s.width * 0.38 + Math.random() * (s.width * 0.38);
    const radius = 16 + Math.random() * 10;

    s.balloons.push({
      id: nextBalloonId.current++,
      x: startX,
      y: s.height + 40,
      radius,
      color: specialType === 'extra_arrow' ? '#10b981' : specialType === 'bonus_points' ? '#fbbf24' : colors[Math.floor(Math.random() * colors.length)],
      speed: 1.2 + Math.random() * 1.5,
      points: specialType === 'bonus_points' ? 250 : 100,
      special: specialType,
      wobblePhase: Math.random() * Math.PI * 2,
      popped: false,
    });
  }, []);

  // Spawn particles utility
  const createExplosion = (x: number, y: number, color: string, count = 18, shape: Particle['shape'] = 'circle') => {
    const s = stateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5.5;
      s.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color,
        size: 3 + Math.random() * 4,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02,
        gravity: 0.12,
        shape,
      });
    }
  };

  const addFloatingText = (text: string, x: number, y: number, color: string, scale = 1.2, badge?: string) => {
    stateRef.current.floatingTexts.push({
      id: nextTextId.current++,
      text,
      x,
      y,
      color,
      scale,
      alpha: 1,
      vy: -1.8,
      badge,
    });
  };

  // Pointer Handlers for Aim & Shoot
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isGameActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check arrows
    if (gameMode !== 'balloons' && arrowsLeft <= 0) return;

    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const s = stateRef.current;
    s.isAiming = true;
    s.aimStartX = px;
    s.aimStartY = py;
    s.currentPointerX = px;
    s.currentPointerY = py;
    s.pullDistance = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = stateRef.current;
    if (!s.isAiming) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    s.currentPointerX = px;
    s.currentPointerY = py;

    // Calculate pull relative to start or relative to bow
    const dx = s.aimStartX - px;
    const dy = s.aimStartY - py;
    const rawPull = Math.sqrt(dx * dx + dy * dy);
    s.pullDistance = Math.min(rawPull, 110);

    // Aim angle: pulling backward shoots forward!
    s.aimAngle = Math.atan2(s.aimStartY - py, s.aimStartX - px);

    // Audio click for tension buildup
    if (Math.random() < 0.08) {
      soundFx.playDraw(s.pullDistance / 110);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = stateRef.current;
    if (!s.isAiming) return;
    s.isAiming = false;

    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }

    // Minimum pull threshold to release arrow
    if (s.pullDistance > 18) {
      const powerNorm = s.pullDistance / 110;
      const speed = 14 + powerNorm * 22; // flight speed

      const arrowVx = Math.cos(s.aimAngle) * speed;
      const arrowVy = Math.sin(s.aimAngle) * speed;

      // Nock position starts at bow center
      const startX = s.bowX + Math.cos(s.aimAngle) * 20;
      const startY = s.bowY + Math.sin(s.aimAngle) * 20;

      s.arrows.push({
        id: nextArrowId.current++,
        x: startX,
        y: startY,
        vx: arrowVx,
        vy: arrowVy,
        angle: s.aimAngle,
        length: 54,
        isStuck: false,
        quiverTimer: 0,
        quiverAmp: 0,
        trail: [],
        style: trailStyle,
      });

      // String snaps back & vibrates
      s.stringVibrateTimer = 1.0;

      // Sound effect
      soundFx.playShoot(powerNorm);

      // Trigger callback
      onArrowShot();
    }

    s.pullDistance = 0;
  };

  // Main 60fps Game Loop
  useEffect(() => {
    let animationFrameId: number;

    const loop = (timestamp: number) => {
      const canvas = canvasRef.current;
      const s = stateRef.current;
      if (!canvas) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      // Delta time calculation with slow-mo support
      const rawDt = Math.min((timestamp - s.lastFrameTime) / 1000, 0.1);
      s.lastFrameTime = timestamp;

      if (s.timeDilationTimer > 0) {
        s.timeDilationTimer -= rawDt;
        s.timeDilation = 0.35; // Slow motion
      } else {
        s.timeDilation = 1.0;
      }

      const dt = rawDt * s.timeDilation;

      // 1. UPDATE GAME OBJECTS
      // Cloud movement
      s.clouds.forEach(c => {
        c.x += c.speed;
        if (c.x > s.width + 120) c.x = -120;
      });

      // String vibration decay
      if (s.stringVibrateTimer > 0) {
        s.stringVibrateTimer -= rawDt * 7;
        if (s.stringVibrateTimer < 0) s.stringVibrateTimer = 0;
      }

      // Targets movement
      s.targets.forEach(t => {
        if (t.type === 'board' || t.type === 'apple') {
          t.y += t.vy * t.speed * t.direction * (dt * 60);
          if (t.y > t.maxY) {
            t.y = t.maxY;
            t.direction = -1;
          } else if (t.y < t.minY) {
            t.y = t.minY;
            t.direction = 1;
          }
        }
      });

      // Synchronize apple with board if in trickshot mode
      if (gameMode === 'trickshot' && s.targets.length >= 2) {
        const board = s.targets.find(tg => tg.type === 'board');
        const apple = s.targets.find(tg => tg.type === 'apple');
        if (board && apple && !apple.isHit) {
          apple.y = board.y - 95;
          apple.x = board.x - 6;
        }
      }

      // Balloon Spawning & Movement
      if (gameMode === 'balloons' && isGameActive) {
        s.balloonSpawnTimer += rawDt;
        if (s.balloonSpawnTimer > 1.2) {
          s.balloonSpawnTimer = 0;
          spawnBalloon();
        }

        s.balloons.forEach(b => {
          b.y -= b.speed * (dt * 60);
          b.wobblePhase += 0.05;
          b.x += Math.sin(b.wobblePhase) * 0.6;
        });

        // Remove off-screen balloons
        s.balloons = s.balloons.filter(b => b.y > -50 && !b.popped);
      }

      // Update Arrows
      const gravity = 0.32;
      const windForce = wind * 0.015;

      for (let i = 0; i < s.arrows.length; i++) {
        const a = s.arrows[i];

        if (a.isStuck) {
          // If stuck to a moving target, follow its movement!
          if (a.stuckTargetId !== undefined) {
            const tgt = s.targets.find(t => t.id === a.stuckTargetId);
            if (tgt) {
              a.x = tgt.x + (a.stuckOffsetX || 0);
              a.y = tgt.y + (a.stuckOffsetY || 0);
            }
          }

          // Quiver vibration
          if (a.quiverTimer > 0) {
            a.quiverTimer -= dt * 4;
            if (a.quiverTimer < 0) a.quiverTimer = 0;
          }
          continue;
        }

        // Apply physics
        a.vy += gravity * (dt * 60);
        a.vx += windForce * (dt * 60);
        a.x += a.vx * (dt * 60);
        a.y += a.vy * (dt * 60);
        a.angle = Math.atan2(a.vy, a.vx);

        // Add trail coordinate
        a.trail.push({ x: a.x, y: a.y, alpha: 1.0 });
        if (a.trail.length > 14) {
          a.trail.shift();
        }

        // Particle sparks for special trails
        if (a.style === 'fire' && Math.random() < 0.6) {
          s.particles.push({
            x: a.x - Math.cos(a.angle) * 20,
            y: a.y - Math.sin(a.angle) * 20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.5,
            color: Math.random() < 0.5 ? '#f97316' : '#eab308',
            size: 2.5 + Math.random() * 3,
            alpha: 0.9,
            decay: 0.05,
            gravity: -0.05,
            shape: 'spark',
          });
        } else if (a.style === 'neon' && Math.random() < 0.5) {
          s.particles.push({
            x: a.x - Math.cos(a.angle) * 20,
            y: a.y - Math.sin(a.angle) * 20,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            color: '#06b6d4',
            size: 2 + Math.random() * 2,
            alpha: 0.8,
            decay: 0.06,
            gravity: 0,
            shape: 'circle',
          });
        }

        // COLLISION DETECTION
        const tipX = a.x + Math.cos(a.angle) * (a.length * 0.5);
        const tipY = a.y + Math.sin(a.angle) * (a.length * 0.5);

        // 1. Check Balloon Collision
        if (gameMode === 'balloons') {
          for (let j = 0; j < s.balloons.length; j++) {
            const b = s.balloons[j];
            if (b.popped) continue;
            const dist = Math.hypot(tipX - b.x, tipY - b.y);
            if (dist < b.radius + 6) {
              b.popped = true;
              soundFx.playPop();
              createExplosion(b.x, b.y, b.color, 24, 'circle');

              let pts = b.points;
              let badgeText = '+PTS';
              if (b.special === 'extra_arrow') {
                onExtraArrow();
                badgeText = '+1 ARROW!';
                addFloatingText('+1 ARROW! 🎯', b.x, b.y - 15, '#10b981', 1.4, 'BONUS');
              } else if (b.special === 'bonus_points') {
                pts = 300;
                badgeText = '+300 BONUS!';
                addFloatingText('+300 BONUS! ⭐', b.x, b.y - 15, '#fbbf24', 1.4, 'GOLD');
              } else {
                addFloatingText(`+${pts}`, b.x, b.y - 15, b.color, 1.2, badgeText);
              }

              onScoreUpdate(pts, false, true);
              break;
            }
          }
        }

        // 2. Check Apple Collision (Trickshot)
        if (gameMode === 'trickshot') {
          const apple = s.targets.find(t => t.type === 'apple' && !t.isHit);
          if (apple) {
            const dist = Math.hypot(tipX - apple.x, tipY - apple.y);
            if (dist < apple.radius + 8) {
              apple.isHit = true;
              soundFx.playHit(true);
              soundFx.playBullseye();
              createExplosion(apple.x, apple.y, '#ef4444', 30, 'wood');
              createExplosion(apple.x, apple.y, '#84cc16', 15, 'feather');
              addFloatingText('PERFECT APPLE SHOT! 🍎 +500', apple.x - 40, apple.y - 30, '#ef4444', 1.5, 'EPIC');

              s.timeDilationTimer = 0.35; // slow mo impact
              onScoreUpdate(500, true, true);

              // Stick arrow
              a.isStuck = true;
              a.stuckTargetId = apple.id;
              a.stuckOffsetX = tipX - apple.x;
              a.stuckOffsetY = tipY - apple.y;
              a.quiverTimer = 1.0;
              a.quiverAmp = 18;
              continue;
            }
          }
        }

        // 3. Check Target Board Collision
        const board = s.targets.find(t => t.type === 'board');
        if (board) {
          // Check if tip is within board horizontal slice and vertical bounds
          const boardLeft = board.x - 12;
          const boardRight = board.x + board.width + 10;
          const boardTop = board.y - board.height / 2;
          const boardBottom = board.y + board.height / 2;

          if (tipX >= boardLeft && tipX <= boardRight && tipY >= boardTop && tipY <= boardBottom) {
            // Impact! Calculate hit distance from center
            const distFromCenter = Math.abs(tipY - board.y);
            const halfHeight = board.height / 2;

            let points = 10;
            let isBullseye = false;
            let label = '+10';
            let hitColor = '#64748b';

            if (distFromCenter <= 12) {
              points = 100;
              isBullseye = true;
              label = 'BULLSEYE! 🎯 +100';
              hitColor = '#f59e0b';
              s.timeDilationTimer = 0.3; // Dramatic slow-mo!
            } else if (distFromCenter <= 28) {
              points = 75;
              label = 'INNER RED! +75';
              hitColor = '#ef4444';
            } else if (distFromCenter <= 48) {
              points = 50;
              label = 'BLUE RING +50';
              hitColor = '#3b82f6';
            } else if (distFromCenter <= 68) {
              points = 25;
              label = 'BLACK RING +25';
              hitColor = '#1e293b';
            } else {
              points = 10;
              label = 'WHITE RING +10';
              hitColor = '#94a3b8';
            }

            soundFx.playHit(isBullseye);
            createExplosion(tipX, tipY, isBullseye ? '#fbbf24' : '#d97706', isBullseye ? 28 : 14, 'wood');
            addFloatingText(label, tipX - 30, tipY - 20, hitColor, isBullseye ? 1.5 : 1.2, isBullseye ? 'MAX' : undefined);

            onScoreUpdate(points, isBullseye, true);

            // Stick arrow into board
            a.isStuck = true;
            a.stuckTargetId = board.id;
            a.stuckOffsetX = tipX - board.x;
            a.stuckOffsetY = tipY - board.y;
            a.quiverTimer = 1.0;
            a.quiverAmp = isBullseye ? 22 : 14;
            continue;
          }
        }

        // 4. Ground Collision
        const groundLevel = s.height - 35;
        if (tipY >= groundLevel) {
          a.isStuck = true;
          a.y = groundLevel - 4;
          a.quiverTimer = 0.5;
          a.quiverAmp = 8;
          createExplosion(tipX, groundLevel, '#4ade80', 10, 'feather');
          soundFx.playHit(false);
          addFloatingText('MISS', tipX, groundLevel - 15, '#94a3b8', 1.0);
          onScoreUpdate(0, false, false);
          continue;
        }

        // 5. Out of right / top bounds
        if (a.x > s.width + 120 || a.y < -300) {
          s.arrows.splice(i, 1);
          i--;
          onScoreUpdate(0, false, false);
        }
      }

      // Keep only recent 15 stuck arrows to optimize canvas draw
      const stuckArrows = s.arrows.filter(a => a.isStuck);
      if (stuckArrows.length > 18) {
        const oldest = stuckArrows[0];
        s.arrows = s.arrows.filter(a => a !== oldest);
      }

      // Check if all arrows used up in classic mode
      if (gameMode !== 'balloons' && arrowsLeft <= 0) {
        const activeArrows = s.arrows.filter(a => !a.isStuck);
        if (activeArrows.length === 0 && s.arrows.length > 0) {
          // Delay brief moment then trigger game over
          if (!s.isAiming) {
            setTimeout(() => {
              if (arrowsLeft <= 0) onGameOver();
            }, 800);
          }
        }
      }

      // Update Particles
      for (let i = 0; i < s.particles.length; i++) {
        const p = s.particles[i];
        p.x += p.vx * (dt * 60);
        p.y += p.vy * (dt * 60);
        p.vy += p.gravity * (dt * 60);
        p.alpha -= p.decay * (dt * 60);
        if (p.alpha <= 0) {
          s.particles.splice(i, 1);
          i--;
        }
      }

      // Update Floating Texts
      for (let i = 0; i < s.floatingTexts.length; i++) {
        const ft = s.floatingTexts[i];
        ft.y += ft.vy * (dt * 60);
        ft.alpha -= 0.018 * (dt * 60);
        if (ft.alpha <= 0) {
          s.floatingTexts.splice(i, 1);
          i--;
        }
      }

      // 2. RENDER STAGE
      ctx.clearRect(0, 0, s.width, s.height);

      // A. Sky Background Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, s.height);
      skyGrad.addColorStop(0, '#bae6fd'); // soft azure
      skyGrad.addColorStop(0.55, '#e0f2fe');
      skyGrad.addColorStop(0.85, '#fef9c3'); // warm sun horizon
      skyGrad.addColorStop(1, '#86efac');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, s.width, s.height);

      // B. Distant Mountain Silhouettes
      ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
      ctx.beginPath();
      ctx.moveTo(0, s.height * 0.75);
      ctx.lineTo(s.width * 0.2, s.height * 0.52);
      ctx.lineTo(s.width * 0.45, s.height * 0.68);
      ctx.lineTo(s.width * 0.7, s.height * 0.48);
      ctx.lineTo(s.width * 0.9, s.height * 0.65);
      ctx.lineTo(s.width, s.height * 0.58);
      ctx.lineTo(s.width, s.height);
      ctx.lineTo(0, s.height);
      ctx.fill();

      // C. Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      s.clouds.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 22 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 20 * c.scale, c.y - 8 * c.scale, 28 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 48 * c.scale, c.y, 24 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 24 * c.scale, c.y + 10 * c.scale, 20 * c.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // D. Lush Archery Field / Grass Ground
      const groundY = s.height - 35;
      const grassGrad = ctx.createLinearGradient(0, groundY - 20, 0, s.height);
      grassGrad.addColorStop(0, '#22c55e');
      grassGrad.addColorStop(0.4, '#16a34a');
      grassGrad.addColorStop(1, '#15803d');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, groundY, s.width, 35);

      // Grass fringe details
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.5;
      for (let gx = 10; gx < s.width; gx += 16) {
        ctx.beginPath();
        ctx.moveTo(gx, groundY);
        ctx.lineTo(gx + (Math.sin(gx + timestamp * 0.002) * 4), groundY - 8);
        ctx.stroke();
      }

      // E. Distance markers (20m, 40m, 60m)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      const markers = [0.35, 0.55, 0.75];
      markers.forEach((mRatio, idx) => {
        const mx = s.width * mRatio;
        ctx.fillRect(mx - 2, groundY - 14, 4, 14);
        ctx.fillText(`${(idx + 1) * 20}m`, mx, groundY + 16);
      });

      // F. Render Wind Vane / Ribbon
      const vaneX = s.width * 0.5;
      const vaneY = 40;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(vaneX - 2, vaneY, 4, 25);
      ctx.beginPath();
      ctx.arc(vaneX, vaneY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();

      // Ribbon waving with wind
      const ribbonLength = 28 + Math.abs(wind) * 6;
      const waveOffset = Math.sin(timestamp * 0.008) * 6;
      const ribbonDir = wind >= 0 ? 1 : -1;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(vaneX, vaneY + 2);
      ctx.quadraticCurveTo(
        vaneX + (ribbonLength * 0.5 * ribbonDir),
        vaneY + waveOffset,
        vaneX + (ribbonLength * ribbonDir),
        vaneY + waveOffset * 1.4
      );
      ctx.stroke();

      // G. Render Balloons
      s.balloons.forEach(b => {
        if (b.popped) return;
        // String
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radius);
        ctx.quadraticCurveTo(b.x + Math.sin(b.wobblePhase) * 6, b.y + b.radius + 15, b.x, b.y + b.radius + 30);
        ctx.stroke();

        // Balloon Body
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.radius * 0.85, b.radius, 0, 0, Math.PI * 2);
        ctx.fill();

        // Balloon highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(b.x - b.radius * 0.3, b.y - b.radius * 0.35, b.radius * 0.25, b.radius * 0.4, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Icon badge for special
        if (b.special === 'extra_arrow') {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🏹+1', b.x, b.y + 4);
        } else if (b.special === 'bonus_points') {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⭐', b.x, b.y + 4);
        }
      });

      // H. Render Targets
      s.targets.forEach(tgt => {
        if (tgt.type === 'board') {
          // Wooden Stand Legs
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(tgt.x, tgt.y);
          ctx.lineTo(tgt.x - 25, groundY);
          ctx.moveTo(tgt.x + tgt.width, tgt.y);
          ctx.lineTo(tgt.x + tgt.width + 15, groundY);
          ctx.stroke();

          // Target Board (Concentric rings drawn in 3D perspective ellipse)
          const cx = tgt.x + tgt.width / 2;
          const cy = tgt.y;
          const rx = tgt.radius * 0.32; // perspective squish
          const ry = tgt.radius;

          // Rings from outside to inside:
          // White, Black, Blue, Red, Gold
          const rings = [
            { scale: 1.0, color: '#f8fafc', stroke: '#cbd5e1' },
            { scale: 0.8, color: '#1e293b', stroke: '#0f172a' },
            { scale: 0.6, color: '#3b82f6', stroke: '#2563eb' },
            { scale: 0.4, color: '#ef4444', stroke: '#dc2626' },
            { scale: 0.2, color: '#fbbf24', stroke: '#d97706' },
            { scale: 0.08, color: '#f59e0b', stroke: '#b45309' }, // Inner center dot
          ];

          rings.forEach(ring => {
            ctx.fillStyle = ring.color;
            ctx.strokeStyle = ring.stroke;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx * ring.scale, ry * ring.scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          });
        } else if (tgt.type === 'apple' && !tgt.isHit) {
          // Apple on top of board
          const ax = tgt.x;
          const ay = tgt.y;
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(ax, ay, tgt.radius, 0, Math.PI * 2);
          ctx.fill();

          // Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(ax - 3, ay - 3, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Stem and Leaf
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ax, ay - tgt.radius);
          ctx.quadraticCurveTo(ax + 2, ay - tgt.radius - 6, ax + 5, ay - tgt.radius - 8);
          ctx.stroke();

          ctx.fillStyle = '#84cc16';
          ctx.beginPath();
          ctx.ellipse(ax + 6, ay - tgt.radius - 6, 4, 2, 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // I. Render Arrows (Flying & Stuck)
      s.arrows.forEach(a => {
        // Render Trail
        if (a.trail.length > 1) {
          for (let ti = 0; ti < a.trail.length - 1; ti++) {
            const p1 = a.trail[ti];
            const p2 = a.trail[ti + 1];
            const progress = ti / a.trail.length;
            ctx.strokeStyle =
              a.style === 'fire'
                ? `rgba(249, 115, 22, ${progress * 0.7})`
                : a.style === 'neon'
                ? `rgba(6, 182, 212, ${progress * 0.8})`
                : a.style === 'rainbow'
                ? `hsla(${(timestamp * 0.2 + ti * 25) % 360}, 90%, 60%, ${progress * 0.8})`
                : `rgba(203, 213, 225, ${progress * 0.5})`;
            ctx.lineWidth = a.style === 'classic' ? 1.5 : 3.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        ctx.save();
        ctx.translate(a.x, a.y);

        // Add quiver vibration if stuck
        let displayAngle = a.angle;
        if (a.isStuck && a.quiverTimer > 0) {
          const quiverOffset = Math.sin(a.quiverTimer * 38) * (a.quiverAmp * a.quiverTimer * 0.05);
          displayAngle += quiverOffset;
        }

        ctx.rotate(displayAngle);

        const halfLen = a.length / 2;

        // Wooden / Carbon Shaft
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-halfLen, 0);
        ctx.lineTo(halfLen, 0);
        ctx.stroke();

        // Steel Arrowhead
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(halfLen + 7, 0);
        ctx.lineTo(halfLen - 2, -4);
        ctx.lineTo(halfLen, 0);
        ctx.lineTo(halfLen - 2, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Fletching (Feathers) at back
        const fletchColor = a.style === 'fire' ? '#ea580c' : a.style === 'neon' ? '#0891b2' : '#dc2626';
        ctx.fillStyle = fletchColor;
        // Top feather
        ctx.beginPath();
        ctx.moveTo(-halfLen + 2, -1);
        ctx.lineTo(-halfLen + 10, -5);
        ctx.lineTo(-halfLen + 14, -1);
        ctx.closePath();
        ctx.fill();
        // Bottom feather
        ctx.beginPath();
        ctx.moveTo(-halfLen + 2, 1);
        ctx.lineTo(-halfLen + 10, 5);
        ctx.lineTo(-halfLen + 14, 1);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      // J. Render Trajectory Guide Dots (When Aiming)
      if (s.isAiming && s.pullDistance > 15) {
        const powerNorm = s.pullDistance / 110;
        const speed = 14 + powerNorm * 22;
        let simX = s.bowX + Math.cos(s.aimAngle) * 20;
        let simY = s.bowY + Math.sin(s.aimAngle) * 20;
        let simVx = Math.cos(s.aimAngle) * speed;
        let simVy = Math.sin(s.aimAngle) * speed;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let step = 0; step < 26; step++) {
          simVy += gravity;
          simVx += windForce;
          simX += simVx;
          simY += simVy;

          if (simY > groundY || simX > s.width) break;

          if (step % 2 === 0) {
            const alpha = 1.0 - step / 28;
            ctx.fillStyle =
              trailStyle === 'fire'
                ? `rgba(249, 115, 22, ${alpha})`
                : trailStyle === 'neon'
                ? `rgba(6, 182, 212, ${alpha})`
                : `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(simX, simY, 2.5 - (step / 26) * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // K. Render Bow & Archer's Hand/String
      ctx.save();
      ctx.translate(s.bowX, s.bowY);

      // Rotate bow according to aimAngle or default facing right
      const bowAngle = s.isAiming ? s.aimAngle : -0.15;
      ctx.rotate(bowAngle);

      const bowHeight = 84;
      const bowHalfH = bowHeight / 2;
      const flexPull = (s.pullDistance / 110) * 14;

      // Bowstring vibration displacement
      let stringOsc = 0;
      if (s.stringVibrateTimer > 0) {
        stringOsc = Math.sin(s.stringVibrateTimer * 45) * (s.stringVibrateTimer * 12);
      }

      // Pull string nock point
      const nockX = -flexPull - (s.isAiming ? (s.pullDistance / 110) * 32 : 0) + stringOsc;
      const nockY = 0;

      // Draw Flexible Wooden Limbs
      ctx.strokeStyle = '#92400e'; // Rich wood
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      // Upper Limb
      ctx.moveTo(-flexPull * 0.4, -bowHalfH);
      ctx.quadraticCurveTo(18 - flexPull, -bowHalfH * 0.45, 12 - flexPull * 0.8, 0);
      // Lower Limb
      ctx.quadraticCurveTo(18 - flexPull, bowHalfH * 0.45, -flexPull * 0.4, bowHalfH);
      ctx.stroke();

      // Bow Grip (Leather Wrap)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(12 - flexPull * 0.8, -12);
      ctx.lineTo(12 - flexPull * 0.8, 12);
      ctx.stroke();

      // Bowstring (from tips to nock)
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-flexPull * 0.4, -bowHalfH);
      ctx.lineTo(nockX, nockY);
      ctx.lineTo(-flexPull * 0.4, bowHalfH);
      ctx.stroke();

      // If aiming, draw nocked arrow sitting on the rest
      if (s.isAiming && s.pullDistance > 5) {
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(nockX, 0);
        ctx.lineTo(nockX + 54, 0);
        ctx.stroke();

        // Arrow tip on bow
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(nockX + 54 + 6, 0);
        ctx.lineTo(nockX + 54 - 1, -3.5);
        ctx.lineTo(nockX + 54 + 1, 0);
        ctx.lineTo(nockX + 54 - 1, 3.5);
        ctx.closePath();
        ctx.fill();

        // Fletching near nock
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(nockX + 4, -3, 8, 2);
        ctx.fillRect(nockX + 4, 1, 8, 2);
      }

      ctx.restore();

      // L. Render Particles
      s.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;

        if (p.shape === 'spark') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'wood') {
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size * 1.5);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // M. Render Floating Animated Texts
      s.floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = Math.max(ft.alpha, 0);
        ctx.font = `bold ${Math.round(18 * ft.scale)}px sans-serif`;
        ctx.fillStyle = ft.color;
        ctx.textAlign = 'center';

        // Text shadow for crisp visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 6;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isGameActive,
    arrowsLeft,
    gameMode,
    trailStyle,
    wind,
    onScoreUpdate,
    onArrowShot,
    onExtraArrow,
    onGameOver,
    spawnBalloon,
  ]);

  return (
    <div
      ref={containerRef}
      id="archery-canvas-container"
      className="relative w-full h-full min-h-[460px] md:min-h-[580px] overflow-hidden select-none cursor-crosshair rounded-2xl shadow-inner border border-slate-700/40 bg-slate-900"
    >
      <canvas
        ref={canvasRef}
        id="archery-game-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full block touch-none"
      />

      {/* Interactive Aim Helper Prompt when starting */}
      {isGameActive && (
        <div
          id="aim-instruction-tip"
          className="absolute bottom-4 left-6 pointer-events-none text-xs md:text-sm font-medium text-slate-800 bg-white/75 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 border border-slate-300"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Click / Touch & Drag backward to draw bow &bull; Release to Shoot</span>
        </div>
      )}
    </div>
  );
};
