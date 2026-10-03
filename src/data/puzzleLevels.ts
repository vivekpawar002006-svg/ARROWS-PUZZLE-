import { PuzzleLevel, PuzzleTile, ArrowDirection } from '../types';

// Helper to create tile quickly
const t = (id: string, row: number, col: number, direction: ArrowDirection, color?: string): PuzzleTile => ({
  id,
  row,
  col,
  direction,
  type: 'arrow',
  color,
});

const obs = (id: string, row: number, col: number): PuzzleTile => ({
  id,
  row,
  col,
  direction: 'UP',
  type: 'obstacle',
  color: '#64748b',
});

export const PUZZLE_LEVELS: PuzzleLevel[] = [
  // LEVEL 1: Tutorial 3x3
  {
    id: 1,
    name: 'First Steps',
    difficulty: 'Beginner',
    rows: 3,
    cols: 3,
    description: 'Tap arrows with a clear path to make them fly off! Clear the outer arrows first.',
    parMoves: 4,
    tiles: [
      t('l1_1', 0, 1, 'UP', '#38bdf8'),
      t('l1_2', 1, 0, 'LEFT', '#f472b6'),
      t('l1_3', 1, 2, 'RIGHT', '#4ade80'),
      t('l1_4', 2, 1, 'DOWN', '#fbbf24'),
    ],
  },

  // LEVEL 2: Spiral 3x3
  {
    id: 2,
    name: 'Clockwise Spiral',
    difficulty: 'Beginner',
    rows: 3,
    cols: 3,
    description: 'Find which arrow has no blockers in front of it.',
    parMoves: 5,
    tiles: [
      t('l2_1', 0, 0, 'RIGHT', '#38bdf8'),
      t('l2_2', 0, 2, 'DOWN', '#f472b6'),
      t('l2_3', 2, 2, 'LEFT', '#4ade80'),
      t('l2_4', 2, 0, 'UP', '#fbbf24'),
      t('l2_5', 1, 1, 'RIGHT', '#a78bfa'),
    ],
  },

  // LEVEL 3: Crosslock 3x3
  {
    id: 3,
    name: 'Crossroads',
    difficulty: 'Beginner',
    rows: 3,
    cols: 3,
    description: 'Two arrows are aiming inward. Clear the outer gatekeepers first.',
    parMoves: 6,
    tiles: [
      t('l3_1', 0, 1, 'UP', '#38bdf8'),
      t('l3_2', 1, 0, 'LEFT', '#f472b6'),
      t('l3_3', 1, 1, 'UP', '#fbbf24'),
      t('l3_4', 1, 2, 'DOWN', '#4ade80'),
      t('l3_5', 2, 1, 'DOWN', '#a78bfa'),
      t('l3_6', 2, 2, 'RIGHT', '#fb7185'),
    ],
  },

  // LEVEL 4: Pinwheel 4x4
  {
    id: 4,
    name: 'Pinwheel',
    difficulty: 'Intermediate',
    rows: 4,
    cols: 4,
    description: 'An interlocking ring of arrows. Look closely at the corners.',
    parMoves: 8,
    tiles: [
      t('l4_1', 0, 1, 'RIGHT', '#38bdf8'),
      t('l4_2', 0, 2, 'RIGHT', '#38bdf8'),
      t('l4_3', 1, 3, 'DOWN', '#4ade80'),
      t('l4_4', 2, 3, 'DOWN', '#4ade80'),
      t('l4_5', 3, 2, 'LEFT', '#fbbf24'),
      t('l4_6', 3, 1, 'LEFT', '#fbbf24'),
      t('l4_7', 2, 0, 'UP', '#f472b6'),
      t('l4_8', 1, 0, 'UP', '#f472b6'),
    ],
  },

  // LEVEL 5: Introducing Obstacles!
  {
    id: 5,
    name: 'Stone Barrier',
    difficulty: 'Intermediate',
    rows: 4,
    cols: 4,
    description: 'Obstacle rocks cannot move and permanently block arrows in their line of sight!',
    parMoves: 7,
    tiles: [
      obs('l5_obs1', 1, 1),
      t('l5_1', 0, 0, 'RIGHT', '#38bdf8'),
      t('l5_2', 0, 2, 'UP', '#4ade80'),
      t('l5_3', 1, 3, 'RIGHT', '#fbbf24'),
      t('l5_4', 2, 0, 'LEFT', '#f472b6'),
      t('l5_5', 2, 2, 'DOWN', '#a78bfa'),
      t('l5_6', 3, 1, 'DOWN', '#38bdf8'),
      t('l5_7', 3, 3, 'UP', '#fb7185'),
    ],
  },

  // LEVEL 6: The Interlock 4x4
  {
    id: 6,
    name: 'Tangled Paths',
    difficulty: 'Intermediate',
    rows: 4,
    cols: 4,
    description: 'Deduce the sequential domino effect.',
    parMoves: 10,
    tiles: [
      t('l6_1', 0, 0, 'DOWN', '#38bdf8'),
      t('l6_2', 0, 3, 'LEFT', '#f472b6'),
      t('l6_3', 1, 1, 'UP', '#4ade80'),
      t('l6_4', 1, 2, 'RIGHT', '#fbbf24'),
      t('l6_5', 2, 1, 'LEFT', '#a78bfa'),
      t('l6_6', 2, 2, 'DOWN', '#fb7185'),
      t('l6_7', 3, 0, 'RIGHT', '#2dd4bf'),
      t('l6_8', 3, 3, 'UP', '#f59e0b'),
      t('l6_9', 0, 1, 'UP', '#38bdf8'),
      t('l6_10', 3, 2, 'DOWN', '#4ade80'),
    ],
  },

  // LEVEL 7: Double Ring 4x4
  {
    id: 7,
    name: 'Double Ring',
    difficulty: 'Intermediate',
    rows: 4,
    cols: 4,
    description: 'Outer ring protects the inner core.',
    parMoves: 12,
    tiles: [
      t('l7_1', 0, 0, 'UP', '#38bdf8'),
      t('l7_2', 0, 1, 'RIGHT', '#38bdf8'),
      t('l7_3', 0, 2, 'RIGHT', '#38bdf8'),
      t('l7_4', 0, 3, 'RIGHT', '#38bdf8'),
      t('l7_5', 1, 3, 'DOWN', '#4ade80'),
      t('l7_6', 2, 3, 'DOWN', '#4ade80'),
      t('l7_7', 3, 3, 'DOWN', '#4ade80'),
      t('l7_8', 3, 2, 'LEFT', '#fbbf24'),
      t('l7_9', 3, 1, 'LEFT', '#fbbf24'),
      t('l7_10', 3, 0, 'LEFT', '#fbbf24'),
      t('l7_11', 1, 1, 'RIGHT', '#f472b6'),
      t('l7_12', 2, 2, 'LEFT', '#a78bfa'),
    ],
  },

  // LEVEL 8: Diamond 5x5
  {
    id: 8,
    name: 'Diamond Crest',
    difficulty: 'Advanced',
    rows: 5,
    cols: 5,
    description: 'A diamond formation with central tension.',
    parMoves: 12,
    tiles: [
      t('l8_1', 0, 2, 'UP', '#38bdf8'),
      t('l8_2', 1, 1, 'LEFT', '#f472b6'),
      t('l8_3', 1, 3, 'RIGHT', '#4ade80'),
      t('l8_4', 2, 0, 'LEFT', '#f472b6'),
      t('l8_5', 2, 2, 'UP', '#fbbf24'),
      t('l8_6', 2, 4, 'RIGHT', '#4ade80'),
      t('l8_7', 3, 1, 'DOWN', '#fb7185'),
      t('l8_8', 3, 3, 'DOWN', '#fb7185'),
      t('l8_9', 4, 2, 'DOWN', '#a78bfa'),
      t('l8_10', 1, 2, 'RIGHT', '#38bdf8'),
      t('l8_11', 3, 2, 'LEFT', '#4ade80'),
      t('l8_12', 2, 1, 'DOWN', '#fbbf24'),
    ],
  },

  // LEVEL 9: Stone Fortress 5x5
  {
    id: 9,
    name: 'Stone Fortress',
    difficulty: 'Advanced',
    rows: 5,
    cols: 5,
    description: 'Obstacles split the grid into distinct escape corridors.',
    parMoves: 13,
    tiles: [
      obs('l9_o1', 2, 1),
      obs('l9_o2', 2, 3),
      t('l9_1', 0, 0, 'RIGHT', '#38bdf8'),
      t('l9_2', 0, 2, 'UP', '#4ade80'),
      t('l9_3', 0, 4, 'LEFT', '#f472b6'),
      t('l9_4', 1, 1, 'UP', '#fbbf24'),
      t('l9_5', 1, 3, 'UP', '#fbbf24'),
      t('l9_6', 2, 0, 'LEFT', '#38bdf8'),
      t('l9_7', 2, 2, 'DOWN', '#a78bfa'),
      t('l9_8', 2, 4, 'RIGHT', '#4ade80'),
      t('l9_9', 3, 1, 'DOWN', '#fb7185'),
      t('l9_10', 3, 3, 'DOWN', '#fb7185'),
      t('l9_11', 4, 0, 'LEFT', '#f472b6'),
      t('l9_12', 4, 2, 'DOWN', '#38bdf8'),
      t('l9_13', 4, 4, 'RIGHT', '#4ade80'),
    ],
  },

  // LEVEL 10: Spiral Maze 5x5
  {
    id: 10,
    name: 'Spiral Vortex',
    difficulty: 'Advanced',
    rows: 5,
    cols: 5,
    description: 'Unwind the spiral from the outside inward without getting stuck.',
    parMoves: 16,
    tiles: [
      t('l10_1', 0, 0, 'RIGHT', '#38bdf8'),
      t('l10_2', 0, 1, 'RIGHT', '#38bdf8'),
      t('l10_3', 0, 2, 'RIGHT', '#38bdf8'),
      t('l10_4', 0, 3, 'RIGHT', '#38bdf8'),
      t('l10_5', 0, 4, 'DOWN', '#4ade80'),
      t('l10_6', 1, 4, 'DOWN', '#4ade80'),
      t('l10_7', 2, 4, 'DOWN', '#4ade80'),
      t('l10_8', 3, 4, 'DOWN', '#4ade80'),
      t('l10_9', 4, 4, 'LEFT', '#fbbf24'),
      t('l10_10', 4, 3, 'LEFT', '#fbbf24'),
      t('l10_11', 4, 2, 'LEFT', '#fbbf24'),
      t('l10_12', 4, 1, 'LEFT', '#fbbf24'),
      t('l10_13', 4, 0, 'UP', '#f472b6'),
      t('l10_14', 3, 0, 'UP', '#f472b6'),
      t('l10_15', 2, 0, 'UP', '#f472b6'),
      t('l10_16', 2, 2, 'RIGHT', '#a78bfa'),
    ],
  },

  // LEVEL 11: Arrow Knot 5x5
  {
    id: 11,
    name: 'Gordian Knot',
    difficulty: 'Advanced',
    rows: 5,
    cols: 5,
    description: 'A tight web of arrows pointing across each other.',
    parMoves: 16,
    tiles: [
      t('l11_1', 1, 1, 'RIGHT', '#38bdf8'),
      t('l11_2', 1, 2, 'DOWN', '#4ade80'),
      t('l11_3', 1, 3, 'LEFT', '#fbbf24'),
      t('l11_4', 2, 1, 'UP', '#f472b6'),
      t('l11_5', 2, 2, 'RIGHT', '#a78bfa'),
      t('l11_6', 2, 3, 'DOWN', '#fb7185'),
      t('l11_7', 3, 1, 'LEFT', '#38bdf8'),
      t('l11_8', 3, 2, 'UP', '#4ade80'),
      t('l11_9', 3, 3, 'RIGHT', '#fbbf24'),
      t('l11_10', 0, 2, 'UP', '#2dd4bf'),
      t('l11_11', 4, 2, 'DOWN', '#2dd4bf'),
      t('l11_12', 2, 0, 'LEFT', '#f472b6'),
      t('l11_13', 2, 4, 'RIGHT', '#f472b6'),
      t('l11_14', 0, 0, 'RIGHT', '#38bdf8'),
      t('l11_15', 4, 4, 'LEFT', '#fbbf24'),
      t('l11_16', 0, 4, 'DOWN', '#4ade80'),
    ],
  },

  // LEVEL 12: Gridlock 6x6
  {
    id: 12,
    name: 'Rush Hour Gridlock',
    difficulty: 'Master',
    rows: 6,
    cols: 6,
    description: 'High density traffic. One single breakthrough opens the entire map!',
    parMoves: 18,
    tiles: [
      obs('l12_o1', 1, 1),
      obs('l12_o2', 4, 4),
      t('l12_1', 0, 0, 'RIGHT', '#38bdf8'),
      t('l12_2', 0, 2, 'DOWN', '#4ade80'),
      t('l12_3', 0, 4, 'RIGHT', '#38bdf8'),
      t('l12_4', 1, 3, 'UP', '#fbbf24'),
      t('l12_5', 1, 5, 'DOWN', '#4ade80'),
      t('l12_6', 2, 0, 'UP', '#f472b6'),
      t('l12_7', 2, 2, 'RIGHT', '#38bdf8'),
      t('l12_8', 2, 4, 'UP', '#fbbf24'),
      t('l12_9', 3, 1, 'DOWN', '#4ade80'),
      t('l12_10', 3, 3, 'LEFT', '#f472b6'),
      t('l12_11', 3, 5, 'RIGHT', '#38bdf8'),
      t('l12_12', 4, 0, 'LEFT', '#f472b6'),
      t('l12_13', 4, 2, 'DOWN', '#4ade80'),
      t('l12_14', 5, 1, 'LEFT', '#f472b6'),
      t('l12_15', 5, 3, 'UP', '#fbbf24'),
      t('l12_16', 5, 5, 'DOWN', '#4ade80'),
      t('l12_17', 1, 2, 'RIGHT', '#a78bfa'),
      t('l12_18', 4, 3, 'LEFT', '#fb7185'),
    ],
  },

  // LEVEL 13: The Quad Chamber 6x6
  {
    id: 13,
    name: 'Quad Chambers',
    difficulty: 'Master',
    rows: 6,
    cols: 6,
    description: 'Four chambers divided by stone columns. Precision navigation required.',
    parMoves: 20,
    tiles: [
      obs('l13_o1', 2, 2),
      obs('l13_o2', 2, 3),
      obs('l13_o3', 3, 2),
      obs('l13_o4', 3, 3),
      t('l13_1', 0, 1, 'UP', '#38bdf8'),
      t('l13_2', 0, 4, 'UP', '#38bdf8'),
      t('l13_3', 1, 0, 'LEFT', '#f472b6'),
      t('l13_4', 1, 2, 'UP', '#fbbf24'),
      t('l13_5', 1, 3, 'RIGHT', '#4ade80'),
      t('l13_6', 1, 5, 'RIGHT', '#4ade80'),
      t('l13_7', 2, 1, 'LEFT', '#f472b6'),
      t('l13_8', 2, 4, 'RIGHT', '#4ade80'),
      t('l13_9', 3, 1, 'LEFT', '#f472b6'),
      t('l13_10', 3, 4, 'DOWN', '#fb7185'),
      t('l13_11', 4, 0, 'LEFT', '#f472b6'),
      t('l13_12', 4, 2, 'DOWN', '#fbbf24'),
      t('l13_13', 4, 3, 'RIGHT', '#4ade80'),
      t('l13_14', 4, 5, 'RIGHT', '#4ade80'),
      t('l13_15', 5, 1, 'DOWN', '#fb7185'),
      t('l13_16', 5, 4, 'DOWN', '#fb7185'),
      t('l13_17', 0, 0, 'LEFT', '#38bdf8'),
      t('l13_18', 0, 5, 'RIGHT', '#4ade80'),
      t('l13_19', 5, 0, 'LEFT', '#f472b6'),
      t('l13_20', 5, 5, 'DOWN', '#fb7185'),
    ],
  },

  // LEVEL 14: Grand Master Labyrinth 7x7
  {
    id: 14,
    name: 'The Grand Escape',
    difficulty: 'Master',
    rows: 7,
    cols: 7,
    description: 'The ultimate arrow puzzle test. Untangle 28 arrows from the master web!',
    parMoves: 26,
    tiles: [
      obs('l14_o1', 3, 3),
      t('l14_1', 0, 0, 'RIGHT', '#38bdf8'),
      t('l14_2', 0, 2, 'UP', '#38bdf8'),
      t('l14_3', 0, 4, 'UP', '#38bdf8'),
      t('l14_4', 0, 6, 'DOWN', '#4ade80'),
      t('l14_5', 1, 1, 'RIGHT', '#fbbf24'),
      t('l14_6', 1, 3, 'DOWN', '#4ade80'),
      t('l14_7', 1, 5, 'LEFT', '#f472b6'),
      t('l14_8', 2, 0, 'LEFT', '#f472b6'),
      t('l14_9', 2, 2, 'UP', '#38bdf8'),
      t('l14_10', 2, 4, 'RIGHT', '#4ade80'),
      t('l14_11', 2, 6, 'RIGHT', '#4ade80'),
      t('l14_12', 3, 1, 'DOWN', '#fb7185'),
      t('l14_13', 3, 2, 'LEFT', '#f472b6'),
      t('l14_14', 3, 4, 'RIGHT', '#4ade80'),
      t('l14_15', 3, 5, 'UP', '#38bdf8'),
      t('l14_16', 4, 0, 'LEFT', '#f472b6'),
      t('l14_17', 4, 2, 'LEFT', '#f472b6'),
      t('l14_18', 4, 4, 'DOWN', '#fb7185'),
      t('l14_19', 4, 6, 'RIGHT', '#4ade80'),
      t('l14_20', 5, 1, 'RIGHT', '#fbbf24'),
      t('l14_21', 5, 3, 'UP', '#38bdf8'),
      t('l14_22', 5, 5, 'LEFT', '#f472b6'),
      t('l14_23', 6, 0, 'UP', '#38bdf8'),
      t('l14_24', 6, 2, 'DOWN', '#fb7185'),
      t('l14_25', 6, 4, 'DOWN', '#fb7185'),
      t('l14_26', 6, 6, 'LEFT', '#f472b6'),
    ],
  },

  // LEVEL 15: Zen Garden 5x5
  {
    id: 15,
    name: 'Zen Garden',
    difficulty: 'Advanced',
    rows: 5,
    cols: 5,
    description: 'A harmonious balanced arrangement. Clear the outer petals first.',
    parMoves: 14,
    tiles: [
      t('l15_1', 0, 1, 'UP', '#38bdf8'),
      t('l15_2', 0, 3, 'UP', '#38bdf8'),
      t('l15_3', 1, 0, 'LEFT', '#4ade80'),
      t('l15_4', 1, 2, 'RIGHT', '#fbbf24'),
      t('l15_5', 1, 4, 'RIGHT', '#4ade80'),
      t('l15_6', 2, 1, 'DOWN', '#f472b6'),
      t('l15_7', 2, 2, 'UP', '#a78bfa'),
      t('l15_8', 2, 3, 'LEFT', '#fb7185'),
      t('l15_9', 3, 0, 'LEFT', '#4ade80'),
      t('l15_10', 3, 2, 'DOWN', '#fbbf24'),
      t('l15_11', 3, 4, 'RIGHT', '#4ade80'),
      t('l15_12', 4, 1, 'DOWN', '#38bdf8'),
      t('l15_13', 4, 3, 'DOWN', '#38bdf8'),
      t('l15_14', 2, 0, 'UP', '#2dd4bf'),
    ],
  },

  // LEVEL 16: Crossed Swords 6x6
  {
    id: 16,
    name: 'Crossed Swords',
    difficulty: 'Advanced',
    rows: 6,
    cols: 6,
    description: 'Diagonal escape paths. Coordinate each quadrant carefully.',
    parMoves: 18,
    tiles: [
      obs('l16_o1', 1, 1),
      obs('l16_o2', 4, 4),
      t('l16_1', 0, 1, 'UP', '#38bdf8'),
      t('l16_2', 0, 4, 'RIGHT', '#38bdf8'),
      t('l16_3', 1, 2, 'DOWN', '#4ade80'),
      t('l16_4', 1, 5, 'DOWN', '#4ade80'),
      t('l16_5', 2, 0, 'LEFT', '#fbbf24'),
      t('l16_6', 2, 3, 'UP', '#a78bfa'),
      t('l16_7', 3, 2, 'RIGHT', '#f472b6'),
      t('l16_8', 3, 5, 'RIGHT', '#f472b6'),
      t('l16_9', 4, 0, 'UP', '#fbbf24'),
      t('l16_10', 4, 3, 'DOWN', '#fb7185'),
      t('l16_11', 5, 1, 'LEFT', '#2dd4bf'),
      t('l16_12', 5, 4, 'DOWN', '#2dd4bf'),
      t('l16_13', 0, 0, 'LEFT', '#38bdf8'),
      t('l16_14', 5, 5, 'RIGHT', '#4ade80'),
      t('l16_15', 2, 5, 'UP', '#fbbf24'),
      t('l16_16', 3, 0, 'DOWN', '#a78bfa'),
    ],
  },

  // LEVEL 17: The Iron Vault 6x6
  {
    id: 17,
    name: 'The Iron Vault',
    difficulty: 'Master',
    rows: 6,
    cols: 6,
    description: 'Four stone pillars block the corners. Release the trapped core!',
    parMoves: 20,
    tiles: [
      obs('l17_o1', 1, 1),
      obs('l17_o2', 1, 4),
      obs('l17_o3', 4, 1),
      obs('l17_o4', 4, 4),
      t('l17_1', 0, 2, 'UP', '#38bdf8'),
      t('l17_2', 0, 3, 'UP', '#38bdf8'),
      t('l17_3', 2, 0, 'LEFT', '#f472b6'),
      t('l17_4', 3, 0, 'LEFT', '#f472b6'),
      t('l17_5', 2, 5, 'RIGHT', '#4ade80'),
      t('l17_6', 3, 5, 'RIGHT', '#4ade80'),
      t('l17_7', 5, 2, 'DOWN', '#fbbf24'),
      t('l17_8', 5, 3, 'DOWN', '#fbbf24'),
      t('l17_9', 2, 2, 'LEFT', '#a78bfa'),
      t('l17_10', 2, 3, 'UP', '#fb7185'),
      t('l17_11', 3, 2, 'DOWN', '#2dd4bf'),
      t('l17_12', 3, 3, 'RIGHT', '#38bdf8'),
      t('l17_13', 1, 2, 'UP', '#fbbf24'),
      t('l17_14', 1, 3, 'RIGHT', '#f472b6'),
      t('l17_15', 4, 2, 'LEFT', '#4ade80'),
      t('l17_16', 4, 3, 'DOWN', '#a78bfa'),
      t('l17_17', 0, 0, 'RIGHT', '#38bdf8'),
      t('l17_18', 0, 5, 'LEFT', '#f472b6'),
      t('l17_19', 5, 0, 'RIGHT', '#fbbf24'),
      t('l17_20', 5, 5, 'LEFT', '#4ade80'),
    ],
  },

  // LEVEL 18: Orbit Rings 6x6
  {
    id: 18,
    name: 'Orbit Rings',
    difficulty: 'Master',
    rows: 6,
    cols: 6,
    description: 'Concentric planetary rings. Untie the outer ring before unlocking the core.',
    parMoves: 22,
    tiles: [
      t('l18_1', 0, 0, 'RIGHT', '#38bdf8'),
      t('l18_2', 0, 1, 'RIGHT', '#38bdf8'),
      t('l18_3', 0, 2, 'RIGHT', '#38bdf8'),
      t('l18_4', 0, 3, 'RIGHT', '#38bdf8'),
      t('l18_5', 0, 4, 'RIGHT', '#38bdf8'),
      t('l18_6', 0, 5, 'DOWN', '#4ade80'),
      t('l18_7', 1, 5, 'DOWN', '#4ade80'),
      t('l18_8', 2, 5, 'DOWN', '#4ade80'),
      t('l18_9', 3, 5, 'DOWN', '#4ade80'),
      t('l18_10', 4, 5, 'DOWN', '#4ade80'),
      t('l18_11', 5, 5, 'LEFT', '#fbbf24'),
      t('l18_12', 5, 4, 'LEFT', '#fbbf24'),
      t('l18_13', 5, 3, 'LEFT', '#fbbf24'),
      t('l18_14', 5, 2, 'LEFT', '#fbbf24'),
      t('l18_15', 5, 1, 'LEFT', '#fbbf24'),
      t('l18_16', 5, 0, 'UP', '#f472b6'),
      t('l18_17', 4, 0, 'UP', '#f472b6'),
      t('l18_18', 3, 0, 'UP', '#f472b6'),
      t('l18_19', 2, 0, 'UP', '#f472b6'),
      t('l18_20', 2, 2, 'RIGHT', '#a78bfa'),
      t('l18_21', 2, 3, 'DOWN', '#fb7185'),
      t('l18_22', 3, 3, 'LEFT', '#2dd4bf'),
      t('l18_23', 3, 2, 'UP', '#fbbf24'),
    ],
  },

  // LEVEL 19: Citadel Labyrinth 7x7
  {
    id: 19,
    name: 'Citadel Labyrinth',
    difficulty: 'Master',
    rows: 7,
    cols: 7,
    description: 'An ancient fortress maze with fortified stone corners.',
    parMoves: 24,
    tiles: [
      obs('l19_o1', 1, 1),
      obs('l19_o2', 1, 5),
      obs('l19_o3', 5, 1),
      obs('l19_o4', 5, 5),
      obs('l19_o5', 3, 3),
      t('l19_1', 0, 2, 'UP', '#38bdf8'),
      t('l19_2', 0, 4, 'UP', '#38bdf8'),
      t('l19_3', 2, 0, 'LEFT', '#f472b6'),
      t('l19_4', 4, 0, 'LEFT', '#f472b6'),
      t('l19_5', 2, 6, 'RIGHT', '#4ade80'),
      t('l19_6', 4, 6, 'RIGHT', '#4ade80'),
      t('l19_7', 6, 2, 'DOWN', '#fbbf24'),
      t('l19_8', 6, 4, 'DOWN', '#fbbf24'),
      t('l19_9', 2, 2, 'RIGHT', '#a78bfa'),
      t('l19_10', 2, 4, 'DOWN', '#fb7185'),
      t('l19_11', 4, 2, 'UP', '#2dd4bf'),
      t('l19_12', 4, 4, 'LEFT', '#38bdf8'),
      t('l19_13', 1, 3, 'UP', '#fbbf24'),
      t('l19_14', 3, 1, 'LEFT', '#f472b6'),
      t('l19_15', 3, 5, 'RIGHT', '#4ade80'),
      t('l19_16', 5, 3, 'DOWN', '#a78bfa'),
      t('l19_17', 2, 3, 'LEFT', '#38bdf8'),
      t('l19_18', 3, 2, 'UP', '#4ade80'),
      t('l19_19', 3, 4, 'DOWN', '#f472b6'),
      t('l19_20', 4, 3, 'RIGHT', '#fbbf24'),
    ],
  },

  // LEVEL 20: Infinity Nexus 7x7
  {
    id: 20,
    name: 'Infinity Nexus',
    difficulty: 'Master',
    rows: 7,
    cols: 7,
    description: 'The crowning challenge! Untie the intricate web of 30 arrows.',
    parMoves: 30,
    tiles: [
      t('l20_1', 0, 0, 'UP', '#38bdf8'),
      t('l20_2', 0, 1, 'RIGHT', '#38bdf8'),
      t('l20_3', 0, 3, 'UP', '#38bdf8'),
      t('l20_4', 0, 5, 'RIGHT', '#38bdf8'),
      t('l20_5', 0, 6, 'DOWN', '#4ade80'),
      t('l20_6', 1, 0, 'LEFT', '#f472b6'),
      t('l20_7', 1, 2, 'RIGHT', '#fbbf24'),
      t('l20_8', 1, 4, 'DOWN', '#4ade80'),
      t('l20_9', 1, 6, 'RIGHT', '#4ade80'),
      t('l20_10', 2, 1, 'UP', '#38bdf8'),
      t('l20_11', 2, 3, 'LEFT', '#f472b6'),
      t('l20_12', 2, 5, 'DOWN', '#fb7185'),
      t('l20_13', 3, 0, 'LEFT', '#f472b6'),
      t('l20_14', 3, 2, 'UP', '#38bdf8'),
      t('l20_15', 3, 4, 'DOWN', '#fbbf24'),
      t('l20_16', 3, 6, 'RIGHT', '#4ade80'),
      t('l20_17', 4, 1, 'DOWN', '#fb7185'),
      t('l20_18', 4, 3, 'RIGHT', '#4ade80'),
      t('l20_19', 4, 5, 'UP', '#38bdf8'),
      t('l20_20', 5, 0, 'LEFT', '#f472b6'),
      t('l20_21', 5, 2, 'UP', '#38bdf8'),
      t('l20_22', 5, 4, 'LEFT', '#f472b6'),
      t('l20_23', 5, 6, 'RIGHT', '#4ade80'),
      t('l20_24', 6, 0, 'DOWN', '#fbbf24'),
      t('l20_25', 6, 1, 'LEFT', '#fbbf24'),
      t('l20_26', 6, 3, 'DOWN', '#fbbf24'),
      t('l20_27', 6, 5, 'LEFT', '#fbbf24'),
      t('l20_28', 6, 6, 'DOWN', '#fbbf24'),
      t('l20_29', 2, 2, 'LEFT', '#a78bfa'),
      t('l20_30', 4, 4, 'RIGHT', '#2dd4bf'),
    ],
  },
];

// Procedural Level Generator with Guaranteed Solvability (reverse build technique)
export function generateProceduralLevel(
  levelSeed: number,
  rows = 5,
  cols = 5,
  targetArrows = 16,
  obstacles = 2
): PuzzleLevel {
  const directions: ArrowDirection[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const colors = ['#38bdf8', '#4ade80', '#fbbf24', '#f472b6', '#a78bfa', '#fb7185', '#2dd4bf'];

  // Seeded PRNG for reproducibility
  let seed = levelSeed * 9301 + 49297;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Occupancy map
  const grid: (PuzzleTile | null)[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
  );

  // Place obstacles first (in central regions)
  const tiles: PuzzleTile[] = [];
  let obsPlaced = 0;
  let attempts = 0;
  while (obsPlaced < obstacles && attempts < 50) {
    attempts++;
    const r = 1 + Math.floor(rnd() * (rows - 2));
    const c = 1 + Math.floor(rnd() * (cols - 2));
    if (!grid[r][c]) {
      const stone: PuzzleTile = {
        id: `gen_obs_${obsPlaced}`,
        row: r,
        col: c,
        direction: 'UP',
        type: 'obstacle',
        color: '#64748b',
      };
      grid[r][c] = stone;
      tiles.push(stone);
      obsPlaced++;
    }
  }

  // Reverse Construction: We start from solved board and place arrows that could fly out
  // This guarantees 100% solvability without deadlocks!
  let arrowsPlaced = 0;
  let genAttempts = 0;

  while (arrowsPlaced < targetArrows && genAttempts < 200) {
    genAttempts++;
    const r = Math.floor(rnd() * rows);
    const c = Math.floor(rnd() * cols);

    if (grid[r][c]) continue; // occupied

    // Pick a direction where the ray towards edge is currently CLEAR in the existing grid
    const validDirs: ArrowDirection[] = [];

    // Check UP
    let clearUp = true;
    for (let checkR = r - 1; checkR >= 0; checkR--) {
      if (grid[checkR][c]) {
        clearUp = false;
        break;
      }
    }
    if (clearUp) validDirs.push('UP');

    // Check DOWN
    let clearDown = true;
    for (let checkR = r + 1; checkR < rows; checkR++) {
      if (grid[checkR][c]) {
        clearDown = false;
        break;
      }
    }
    if (clearDown) validDirs.push('DOWN');

    // Check LEFT
    let clearLeft = true;
    for (let checkC = c - 1; checkC >= 0; checkC--) {
      if (grid[r][checkC]) {
        clearLeft = false;
        break;
      }
    }
    if (clearLeft) validDirs.push('LEFT');

    // Check RIGHT
    let clearRight = true;
    for (let checkC = c + 1; checkC < cols; checkC++) {
      if (grid[r][checkC]) {
        clearRight = false;
        break;
      }
    }
    if (clearRight) validDirs.push('RIGHT');

    if (validDirs.length > 0) {
      const chosenDir = validDirs[Math.floor(rnd() * validDirs.length)];
      const color = colors[arrowsPlaced % colors.length];

      const newArrow: PuzzleTile = {
        id: `gen_arrow_${arrowsPlaced}`,
        row: r,
        col: c,
        direction: chosenDir,
        type: 'arrow',
        color,
      };

      grid[r][c] = newArrow;
      tiles.push(newArrow);
      arrowsPlaced++;
    }
  }

  return {
    id: levelSeed,
    name: `Endless Quest #${levelSeed}`,
    difficulty: levelSeed > 20 ? 'Master' : levelSeed > 10 ? 'Advanced' : 'Intermediate',
    rows,
    cols,
    tiles,
    description: `Procedurally generated solvable puzzle with ${arrowsPlaced} arrows and ${obstacles} barriers.`,
    parMoves: arrowsPlaced,
  };
}
