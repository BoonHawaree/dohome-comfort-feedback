'use client';

import { ZoneConfig, FeedbackType } from '@/types';

interface FloorPlanViewerProps {
  floorPlanSrc: string;
  zones: ZoneConfig[];
  selectedZoneId: string | null;
  zoneFeedback: Record<string, FeedbackType | null>;
  onZoneSelect: (zoneId: string) => void;
}

// When nothing is selected: all zones show their normal color
// When one zone IS selected: selected = strong teal fill, others = muted grey
function getZoneFill(
  feedback: FeedbackType | null,
  isSelected: boolean,
  hasAnySelection: boolean
): string {
  // This zone is the selected one → strong teal
  if (isSelected) return 'rgba(14, 184, 180, 0.35)';

  // Another zone is selected → mute this one to grey
  if (hasAnySelection) return 'rgba(200, 200, 210, 0.12)';

  // No selection at all → show normal tinted fills
  switch (feedback) {
    case 'too_hot': return 'rgba(239, 67, 55, 0.15)';
    case 'comfort': return 'rgba(67, 164, 82, 0.15)';
    case 'too_cold': return 'rgba(6, 91, 169, 0.15)';
    default: return 'rgba(14, 126, 228, 0.06)';
  }
}

function getZoneStroke(isSelected: boolean, hasAnySelection: boolean): string {
  if (isSelected) return 'rgba(14, 184, 180, 0.7)';
  if (hasAnySelection) return 'rgba(200, 200, 210, 0.3)';
  return 'rgba(14, 126, 228, 0.2)';
}

function getBadgeColor(
  feedback: FeedbackType | null,
  isSelected: boolean,
  hasAnySelection: boolean
): string {
  if (isSelected) return '#0E7EE4';
  if (hasAnySelection) return '#B0B8C4';
  switch (feedback) {
    case 'too_hot': return '#EF4337';
    case 'comfort': return '#43A452';
    case 'too_cold': return '#065BA9';
    default: return '#0E7EE4';
  }
}

function getBadgeTextColor(isSelected: boolean, hasAnySelection: boolean): string {
  if (isSelected) return '#212529';
  if (hasAnySelection) return '#9CA3AF';
  return '#212529';
}

export default function FloorPlanViewer({
  floorPlanSrc,
  zones,
  selectedZoneId,
  zoneFeedback,
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
          const feedback = zoneFeedback[zone.id] ?? null;
          const isSelected = zone.id === selectedZoneId;
          const points = zone.polygon.map(([x, y]) => `${x},${y}`).join(' ');

          const centerX = zone.polygon.reduce((s, [x]) => s + x, 0) / zone.polygon.length;
          const centerY = zone.polygon.reduce((s, [, y]) => s + y, 0) / zone.polygon.length;

          const badgeColor = getBadgeColor(feedback, isSelected, hasAnySelection);
          const badgeRadius = isSelected ? 3.2 : 2.8;

          return (
            <g key={zone.id} onClick={() => onZoneSelect(zone.id)} className="cursor-pointer">
              {/* Zone fill area - always visible with border */}
              <polygon
                points={points}
                fill={getZoneFill(feedback, isSelected, hasAnySelection)}
                stroke={getZoneStroke(isSelected, hasAnySelection)}
                strokeWidth="0.3"
              />

              {/* Numbered circle badge */}
              <circle
                cx={centerX}
                cy={centerY}
                r={badgeRadius}
                fill="white"
                stroke={badgeColor}
                strokeWidth={isSelected ? '0.5' : '0.3'}
              />
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="central"
                fill={getBadgeTextColor(isSelected, hasAnySelection)}
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
