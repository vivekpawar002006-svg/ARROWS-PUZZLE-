import { MinimalArrow, GridPoint, Direction } from '../types/minimalGame';
import { isArrowBlocked } from './arrowCollision';

/**
 * Checks if two axis-aligned segments overlap, cross, or touch endpoints.
 */
export function doSegmentsCrossOrTouch(
  p1: GridPoint,
  p2: GridPoint,
  p3: GridPoint,
  p4: GridPoint
): boolean {
  const isS1Horiz = p1.y === p2.y;
  const isS2Horiz = p3.y === p4.y;

  const minX1 = Math.min(p1.x, p2.x);
  const maxX1 = Math.max(p1.x, p2.x);
  const minY1 = Math.min(p1.y, p2.y);
  const maxY1 = Math.max(p1.y, p2.y);

  const minX2 = Math.min(p3.x, p4.x);
  const maxX2 = Math.max(p3.x, p4.x);
  const minY2 = Math.min(p3.y, p4.y);
  const maxY2 = Math.max(p3.y, p4.y);

  if (isS1Horiz && isS2Horiz) {
    if (p1.y === p3.y) {
      return Math.max(minX1, minX2) <= Math.min(maxX1, maxX2);
    }
    return false;
  }

  if (!isS1Horiz && !isS2Horiz) {
    if (p1.x === p3.x) {
      return Math.max(minY1, minY2) <= Math.min(maxY1, maxY2);
    }
    return false;
  }

  if (isS1Horiz && !isS2Horiz) {
    return minX1 <= p3.x && p3.x <= maxX1 && minY2 <= p1.y && p1.y <= maxY2;
  }

  if (!isS1Horiz && isS2Horiz) {
    return minX2 <= p1.x && p1.x <= maxX2 && minY1 <= p3.y && p3.y <= maxY1;
  }

  return false;
}

/**
 * Checks if candidate arrow self-intersects, or overlaps/crosses any existing arrow.
 */
export function doesArrowOverlapExisting(
  candidate: MinimalArrow,
  existingArrows: MinimalArrow[]
): boolean {
  // 1. Self-intersection check (non-adjacent segments of candidate cannot cross or touch)
  for (let i = 0; i < candidate.points.length - 1; i++) {
    for (let j = i + 1; j < candidate.points.length - 1; j++) {
      if (j === i + 1) continue; // Adjacent segments naturally share a corner vertex
      if (
        doSegmentsCrossOrTouch(
          candidate.points[i],
          candidate.points[i + 1],
          candidate.points[j],
          candidate.points[j + 1]
        )
      ) {
        return true;
      }
    }
  }

  // 2. Check against all existing arrows
  for (const other of existingArrows) {
    for (let i = 0; i < candidate.points.length - 1; i++) {
      for (let j = 0; j < other.points.length - 1; j++) {
        if (
          doSegmentsCrossOrTouch(
            candidate.points[i],
            candidate.points[i + 1],
            other.points[j],
            other.points[j + 1]
          )
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Solvability Simulator:
 * Confirms that a puzzle can be 100% solved with sequential valid unblocking moves.
 */
export function isPuzzleSolvable(initialArrows: MinimalArrow[]): boolean {
  let remaining = [...initialArrows];
  let movesMade = 0;

  while (remaining.length > 0) {
    // Find any unblocked arrow
    const unblockedIndex = remaining.findIndex(arrow => !isArrowBlocked(arrow, remaining));

    if (unblockedIndex === -1) {
      // Deadlock! No arrow can move
      return false;
    }

    // Remove the unblocked arrow (it flew away)
    remaining.splice(unblockedIndex, 1);
    movesMade++;
  }

  return movesMade === initialArrows.length;
}

