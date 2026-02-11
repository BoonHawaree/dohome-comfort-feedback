import { StoreConfig } from '@/types';

// Zone boundaries derived from AHU y-positions in site-devices.ts
// Expanded x-range to the right: 22 → 85
const X_LEFT = 22;
const X_MID = 53.5;
const X_RIGHT = 85;

// Helper to create left/right zone pair for each AHU row
function makeZonePair(
  rowNum: number,
  ahuId: string,
  yStart: number,
  yEnd: number
): StoreConfig['zones'] {
  return [
    {
      id: `zone-${rowNum}a`,
      label: `${rowNum}A`,
      ahuId,
      polygon: [[X_LEFT, yStart], [X_MID, yStart], [X_MID, yEnd], [X_LEFT, yEnd]],
    },
    {
      id: `zone-${rowNum}b`,
      label: `${rowNum}B`,
      ahuId,
      polygon: [[X_MID, yStart], [X_RIGHT, yStart], [X_RIGHT, yEnd], [X_MID, yEnd]],
    },
  ];
}

export const stores: Record<string, StoreConfig> = {
  'dohome-phuket': {
    id: 'dohome-phuket',
    name: 'DoHome Phuket',
    floorPlan: '/assets/floor-plans/dohome-phuket/zone_main.png',
    zones: [
      ...makeZonePair(9, 'ahu_9', 9, 16.75),
      ...makeZonePair(8, 'ahu_8', 16.75, 24.25),
      ...makeZonePair(7, 'ahu_7', 24.25, 31.75),
      ...makeZonePair(6, 'ahu_6', 31.75, 39.25),
      ...makeZonePair(5, 'ahu_5', 39.25, 46.75),
      ...makeZonePair(4, 'ahu_4', 46.75, 54.25),
      ...makeZonePair(3, 'ahu_3', 54.25, 61.75),
      ...makeZonePair(2, 'ahu_2', 61.75, 69.25),
      ...makeZonePair(1, 'ahu_1', 69.25, 77),
    ],
  },
};
