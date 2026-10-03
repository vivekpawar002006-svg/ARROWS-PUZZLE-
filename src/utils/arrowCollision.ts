import { MinimalArrow, GridPoint, Direction } from '../types/minimalGame';

/**
 * Checks if a segment between p1 and p2 contains points matching a step
 */
function getSegmentPoints(p1: GridPoint, p2: GridPoint, step = 0.25): GridPoint[] {
  const points: GridPoint[] = [];
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const count = Math.max(1, Math.ceil(distance / step));

  for (let i = 0; i <= count; i++) {
    const t = i / count;
    points.push({
      x: p1.x + dx * t,
      y: p1.y + dy * t,
    });
  }
  return points;
}

/**
 * Returns a dense set of sample points along an arrow's polyline
 */
export function getArrowSamplePoints(arrow: MinimalArrow, step = 0.25): GridPoint[] {
  const allPoints: GridPoint[] = [];
  for (let i = 0; i < arrow.points.length - 1; i++) {
    const seg = getSegmentPoints(arrow.points[i], arrow.points[i + 1], step);
    allPoints.push(...seg);
  }
  return allPoints;
}

/**
 * Determines whether candidate arrow 'target' is blocked by any 'other' arrow
 * as 'target' attempts to exit in its arrowhead direction.
 *
 * In the authentic arrows puzzle, an arrow slithers forward out of its arrowhead.
 * An arrow is blocked if and only if another arrow lies in front of its arrowhead
 * along its exit ray in target.direction.
 */
export function isArrowBlocked(
  target: MinimalArrow,
  activeArrows: MinimalArrow[],
  tolerance = 0.45
): boolean {
  const otherArrows = activeArrows.filter(a => a.id !== target.id);
  if (otherArrows.length === 0) return false;

  const head = target.points[target.points.length - 1];
  const dir = target.direction;

  for (const other of otherArrows) {
    for (let i = 0; i < other.points.length - 1; i++) {
      const p1 = other.points[i];
      const p2 = other.points[i + 1];

      const minX = Math.min(p1.x, p2.x);
      const maxX = Math.max(p1.x, p2.x);
      const minY = Math.min(p1.y, p2.y);
      const maxY = Math.max(p1.y, p2.y);

      if (dir === 'UP') {
        // Exit ray goes from head.x, from head.y upwards (y < head.y)
        if (head.x >= minX - tolerance && head.x <= maxX + tolerance) {
          if (minY < head.y - 0.05) {
            return true;
          }
        }
      } else if (dir === 'DOWN') {
        // Exit ray goes from head.x, from head.y downwards (y > head.y)
        if (head.x >= minX - tolerance && head.x <= maxX + tolerance) {
          if (maxY > head.y + 0.05) {
            return true;
          }
        }
      } else if (dir === 'LEFT') {
        // Exit ray goes from head.y, from head.x leftwards (x < head.x)
        if (head.y >= minY - tolerance && head.y <= maxY + tolerance) {
          if (minX < head.x - 0.05) {
            return true;
          }
        }
      } else if (dir === 'RIGHT') {
        // Exit ray goes from head.y, from head.x rightwards (x > head.x)
        if (head.y >= minY - tolerance && head.y <= maxY + tolerance) {
          if (maxX > head.x + 0.05) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

