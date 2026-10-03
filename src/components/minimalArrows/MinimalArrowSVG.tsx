import React from 'react';
import { MinimalArrow, Direction, ArrowHeadStyle } from '../../types/minimalGame';
import { motion } from 'motion/react';

interface MinimalArrowSVGProps {
  arrow: MinimalArrow;
  spacing: number;
  offsetX: number;
  offsetY: number;
  color?: string;
  isHinted?: boolean;
  headStyle?: ArrowHeadStyle;
  onClick: () => void;
}

/**
 * Generates an SVG path with smooth rounded corner fillets on right-angle bends,
 * exactly matching the rounded corners in reference image IMG_3160.jpeg.
 */
function createRoundedPath(points: { x: number; y: number }[], radius: number): string {
  if (points.length < 2) return '';
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const dx1 = prev.x - curr.x;
    const dy1 = prev.y - curr.y;
    const len1 = Math.hypot(dx1, dy1);

    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;
    const len2 = Math.hypot(dx2, dy2);

    if (len1 === 0 || len2 === 0) {
      d += ` L ${curr.x} ${curr.y}`;
      continue;
    }

    const r = Math.min(radius, len1 * 0.45, len2 * 0.45);

    const p1x = curr.x + (dx1 / len1) * r;
    const p1y = curr.y + (dy1 / len1) * r;

    const p2x = curr.x + (dx2 / len2) * r;
    const p2y = curr.y + (dy2 / len2) * r;

    d += ` L ${p1x} ${p1y} Q ${curr.x} ${curr.y} ${p2x} ${p2y}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

export const MinimalArrowSVG: React.FC<MinimalArrowSVGProps> = ({
  arrow,
  spacing,
  offsetX,
  offsetY,
  color = '#0c1427',
  isHinted = false,
  headStyle = 'solid',
  onClick,
}) => {
  const pixelPoints = arrow.points.map(p => ({
    x: offsetX + p.x * spacing,
    y: offsetY + p.y * spacing,
  }));

  if (pixelPoints.length < 2) return null;

  // Endpoint where the arrowhead is placed
  const head = pixelPoints[pixelPoints.length - 1];
  const dir = arrow.direction;

  // Proportional line width and corner radius: clean, modern 2D line
  const lineWidth = arrow.isBumping
    ? Math.max(3.2, Math.min(4.5, spacing * 0.12))
    : Math.max(2.6, Math.min(3.8, spacing * 0.095));

  const cornerRadius = Math.max(6, Math.min(12, spacing * 0.28));

  // Prominent, crisp arrowhead face ("arrows ke face ache se show hoo"):
  // Distinct solid triangular face with crisp apex and sharp silhouette,
  // perfectly sized so arrows never touch adjacent tracks or each other!
  const headLen = Math.max(9, Math.min(14, spacing * 0.32));
  const headWidth = Math.max(5, Math.min(8.5, spacing * 0.20));

  // Build the main shaft path.
  // The shaft line stops cleanly at the arrowhead's base so they meet seamlessly.
  let shaftEnd = { ...head };
  if (dir === 'UP') shaftEnd.y += headLen * 0.9;
  else if (dir === 'DOWN') shaftEnd.y -= headLen * 0.9;
  else if (dir === 'LEFT') shaftEnd.x += headLen * 0.9;
  else if (dir === 'RIGHT') shaftEnd.x -= headLen * 0.9;

  const pathPoints = [...pixelPoints.slice(0, -1), shaftEnd];
  const pathD = createRoundedPath(pathPoints, cornerRadius);
  const fullPathD = createRoundedPath(pixelPoints, cornerRadius);

  /**
   * Classic Solid Triangle Arrowhead from IMG_3160.jpeg:
   * Flat base perpendicular to line, sharp apex pointing in direction of travel.
   */
  const getBasicArrowHeadPolygon = (): string => {
    const { x, y } = head;
    switch (dir) {
      case 'UP':
        return `${x},${y} ${x - headWidth},${y + headLen} ${x + headWidth},${y + headLen}`;
      case 'DOWN':
        return `${x},${y} ${x - headWidth},${y - headLen} ${x + headWidth},${y - headLen}`;
      case 'LEFT':
        return `${x},${y} ${x + headLen},${y - headWidth} ${x + headLen},${y + headWidth}`;
      case 'RIGHT':
        return `${x},${y} ${x - headLen},${y - headWidth} ${x - headLen},${y + headWidth}`;
    }
  };

  /**
   * Classic Open Chevron Arrowhead (>)
   */
  const getBasicChevronPath = (): string => {
    const { x, y } = head;
    switch (dir) {
      case 'UP':
        return `M ${x - headWidth} ${y + headLen} L ${x} ${y} L ${x + headWidth} ${y + headLen}`;
      case 'DOWN':
        return `M ${x - headWidth} ${y - headLen} L ${x} ${y} L ${x + headWidth} ${y - headLen}`;
      case 'LEFT':
        return `M ${x + headLen} ${y - headWidth} L ${x} ${y} L ${x + headLen} ${y + headWidth}`;
      case 'RIGHT':
        return `M ${x - headLen} ${y - headWidth} L ${x} ${y} L ${x - headLen} ${y + headWidth}`;
    }
  };

  const arrowHeadPoints = getBasicArrowHeadPolygon();
  const chevronPath = getBasicChevronPath();

  // Exit trajectory distance: moves cleanly off-screen along the line where its face points!
  // Moderate distance so the visual speed remains calm and relaxing
  const exitDistance = Math.max(520, spacing * 18);
  const flyX = dir === 'RIGHT' ? exitDistance : dir === 'LEFT' ? -exitDistance : 0;
  const flyY = dir === 'DOWN' ? exitDistance : dir === 'UP' ? -exitDistance : 0;

  // Bump animation when arrow hits a block
  const getBumpTranslation = (d: Direction) => {
    switch (d) {
      case 'UP':
        return { y: [0, -8, 2, -1, 0] };
      case 'DOWN':
        return { y: [0, 8, -2, 1, 0] };
      case 'LEFT':
        return { x: [0, -8, 2, -1, 0] };
      case 'RIGHT':
        return { x: [0, 8, -2, 1, 0] };
    }
  };

  let groupAnimateProps: any = { x: 0, y: 0, opacity: 1 };
  let groupTransitionProps: any = { duration: 0.2 };

  if (arrow.isBumping) {
    const bump = getBumpTranslation(arrow.direction);
    groupAnimateProps = {
      ...bump,
      opacity: 1,
    };
    groupTransitionProps = {
      duration: 0.25,
      ease: 'easeInOut',
    };
  } else if (arrow.isFlying) {
    // Slower, calm, slow-motion release flight ("jbb arrows ko chodhe speed slow ho", "speed km rkho")
    // The FULL arrow (shaft + prominent head) glides along its facing line out of the maze
    groupAnimateProps = {
      x: flyX,
      y: flyY,
      opacity: [1, 1, 0.85, 0],
    };
    groupTransitionProps = {
      duration: 1.65, // Relaxing, calm, slow glide
      times: [0, 0.72, 0.9, 1],
      ease: [0.22, 0.5, 0.36, 1],
    };
  }

  const strokeColor = arrow.isBumping
    ? '#ef4444'
    : isHinted
    ? '#0284c7'
    : arrow.color || color;

  return (
    <motion.g
      id={`arrow-item-${arrow.id}`}
      animate={groupAnimateProps}
      transition={groupTransitionProps}
      whileHover={!arrow.isFlying && !arrow.isBumping ? { opacity: 0.85 } : undefined}
      whileTap={!arrow.isFlying && !arrow.isBumping ? { scale: 0.98 } : undefined}
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      className="cursor-pointer select-none group"
    >
      {/* Glowing Sky Blue Ribbon Halo behind hinted arrow */}
      {isHinted && (
        <motion.path
          d={fullPathD}
          fill="none"
          stroke="#bae6fd"
          strokeWidth={Math.max(11, spacing * 0.72)}
          strokeOpacity={0.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Invisible wider path for effortless touch/click selection */}
      <path
        d={fullPathD}
        fill="none"
        stroke="transparent"
        strokeWidth={Math.min(24, Math.max(16, spacing * 0.75))}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main Arrow Line Body:
          Full arrow moves together with its arrowhead along its facing line! */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={lineWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arrowhead: Sits perfectly attached to tip, moving unified with the entire arrow */}
      <g>
        {headStyle === 'chevron' ? (
          <path
            d={chevronPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={lineWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <polygon
            points={arrowHeadPoints}
            fill={strokeColor}
            stroke={strokeColor}
            strokeWidth={0.5}
            strokeLinejoin="round"
          />
        )}
      </g>
    </motion.g>
  );
};
