export type GameMode = 'classic' | 'balloons' | 'trickshot';

export type TrailStyle = 'classic' | 'fire' | 'neon' | 'rainbow';

export interface Arrow {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  length: number;
  isStuck: boolean;
  stuckTargetId?: number;
  stuckOffsetX?: number;
  stuckOffsetY?: number;
  stuckAngle?: number;
  quiverTimer: number; // For vibration animation
  quiverAmp: number;
  trail: { x: number; y: number; alpha: number }[];
  style: TrailStyle;
}

export interface Target {
  id: number;
  type: 'board' | 'apple' | 'clay';
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  vy: number;
  minY: number;
  maxY: number;
  speed: number;
  direction: number;
  isHit?: boolean;
  hitTimer?: number;
}

export interface Balloon {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  points: number;
  special?: 'extra_arrow' | 'bonus_points' | 'slow_mo';
  wobblePhase: number;
  popped: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
  shape?: 'circle' | 'spark' | 'feather' | 'wood';
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  scale: number;
  alpha: number;
  vy: number;
  badge?: string;
}

export interface GameStats {
  score: number;
  highScore: number;
  arrowsLeft: number;
  totalArrowsShot: number;
  bullseyes: number;
  hits: number;
  combo: number;
  maxCombo: number;
  timeLeft: number; // in seconds for balloon mode
}

// Arrow Puzzle Game Types
export type ArrowDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type TileType = 'arrow' | 'obstacle';

export type PuzzleTheme = 'neon' | 'cyber' | 'wooden' | 'sunset' | 'candy';
export type AppLanguage = 'en' | 'hi';

export interface PuzzleTile {
  id: string;
  row: number;
  col: number;
  direction: ArrowDirection;
  type: TileType;
  color?: string;
  // Animation state flags
  isFlying?: boolean;
  flyProgress?: number;
  isBumping?: boolean;
  bumpProgress?: number;
  bumpOffset?: { x: number; y: number };
  isHinted?: boolean;
}

export interface PuzzleLevel {
  id: number;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master' | 'Endless';
  rows: number;
  cols: number;
  tiles: PuzzleTile[];
  description?: string;
  parMoves?: number;
}

export interface MoveHistoryEntry {
  clearedTile: PuzzleTile;
  streak: number;
}
