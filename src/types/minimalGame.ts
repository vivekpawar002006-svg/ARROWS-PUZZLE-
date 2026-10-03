export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GridPoint {
  x: number; // 0-indexed column coordinate on dot grid
  y: number; // 0-indexed row coordinate on dot grid
}

export interface MinimalArrow {
  id: string;
  points: GridPoint[]; // Path of the arrow through dots / coordinates
  direction: Direction; // Pointing direction of the arrowhead at the final point
  isFlying?: boolean;
  isBumping?: boolean;
  color?: string; // Optional custom stroke color, defaults to deep navy #12192d
}

export type LevelDifficulty = 'Beginner' | 'Skilled' | 'Expert' | 'Grandmaster' | 'Hard';

export interface MinimalLevel {
  id: number;
  gridCols: number;
  gridRows: number;
  arrows: MinimalArrow[];
  compliment?: string; // e.g. "Brilliant!", "Splendid!", "Mastermind!"
  difficulty?: LevelDifficulty;
  title?: string;
}

export type NavTab = 'challenge' | 'home' | 'settings';

export type AppTheme = 'classic' | 'dark' | 'lavender';

export type ArrowHeadStyle = 'solid' | 'chevron';
