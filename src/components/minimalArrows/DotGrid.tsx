import React from 'react';

interface DotGridProps {
  cols: number;
  rows: number;
  spacing: number;
  offsetX: number;
  offsetY: number;
  dotColor?: string;
}

export const DotGrid: React.FC<DotGridProps> = ({
  cols,
  rows,
  spacing,
  offsetX,
  offsetY,
  dotColor = '#cbd5e1',
}) => {
  const dots = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({
        x: offsetX + c * spacing,
        y: offsetY + r * spacing,
        key: `dot-${c}-${r}`,
      });
    }
  }

  const dotRadius = Math.max(1.4, Math.min(2.2, spacing * 0.08));

  return (
    <g id="minimal-dot-grid" className="pointer-events-none">
      {dots.map(dot => (
        <circle
          key={dot.key}
          cx={dot.x}
          cy={dot.y}
          r={dotRadius}
          fill={dotColor}
          opacity={0.5}
        />
      ))}
    </g>
  );
};
