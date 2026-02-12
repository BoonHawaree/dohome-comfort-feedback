'use client';

import { ZoneConfig } from '@/types';

interface FloorPlanViewerProps {
  floorPlanSrc: string;
  zones: ZoneConfig[];
  selectedZoneId: string | null;
  onZoneSelect: (zoneId: string) => void;
}

export default function FloorPlanViewer({
  floorPlanSrc,
  zones,
  selectedZoneId,
  onZoneSelect,
}: FloorPlanViewerProps) {
  const hasAnySelection = selectedZoneId !== null;

  return (
    <div className="relative w-full">
      <img
        src={floorPlanSrc}
        alt="Store floor plan"
        className="block w-full"
        draggable={false}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {zones.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          const points = zone.polygon.map(([x, y]) => `${x},${y}`).join(' ');
          const centerX = zone.polygon.reduce((s, [x]) => s + x, 0) / zone.polygon.length;
          const centerY = zone.polygon.reduce((s, [, y]) => s + y, 0) / zone.polygon.length;

          // Colors: selected = teal, others muted when something is selected, default blue tint
          const fill = isSelected
            ? 'rgba(14, 184, 180, 0.35)'
            : hasAnySelection
              ? 'rgba(200, 200, 210, 0.1)'
              : 'rgba(14, 126, 228, 0.06)';
          const stroke = isSelected
            ? 'rgba(14, 184, 180, 0.7)'
            : hasAnySelection
              ? 'rgba(200, 200, 210, 0.25)'
              : 'rgba(14, 126, 228, 0.2)';
          const badgeBorder = isSelected ? '#0E7EE4' : hasAnySelection ? '#B0B8C4' : '#0E7EE4';
          const textColor = isSelected ? '#212529' : hasAnySelection ? '#9CA3AF' : '#212529';

          return (
            <g key={zone.id} onClick={() => onZoneSelect(zone.id)} className="cursor-pointer">
              <polygon
                points={points}
                fill={fill}
                stroke={stroke}
                strokeWidth="0.3"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={isSelected ? 3.2 : 2.8}
                fill="white"
                stroke={badgeBorder}
                strokeWidth={isSelected ? '0.5' : '0.3'}
              />
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textColor}
                fontSize={isSelected ? '3' : '2.6'}
                fontWeight="700"
                fontFamily="Inter, sans-serif"
                style={{ pointerEvents: 'none' }}
              >
                {zone.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
