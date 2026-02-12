import { StoreConfig } from '@/types';

// Zone boundaries derived from AHU y-positions in site-devices.ts
const X_LEFT = 22;
const X_RIGHT = 85;

export const stores: Record<string, StoreConfig> = {
  'dohome-phuket': {
    id: 'dohome-phuket',
    name: 'DoHome Phuket',
    floorPlan: '/assets/floor-plans/dohome-phuket/zone_main.png',
    zones: [
      { id: 'zone-9', label: '9', ahuId: 'ahu_9', polygon: [[X_LEFT, 9], [X_RIGHT, 9], [X_RIGHT, 16.75], [X_LEFT, 16.75]] },
      { id: 'zone-8', label: '8', ahuId: 'ahu_8', polygon: [[X_LEFT, 16.75], [X_RIGHT, 16.75], [X_RIGHT, 24.25], [X_LEFT, 24.25]] },
      { id: 'zone-7', label: '7', ahuId: 'ahu_7', polygon: [[X_LEFT, 24.25], [X_RIGHT, 24.25], [X_RIGHT, 31.75], [X_LEFT, 31.75]] },
      { id: 'zone-6', label: '6', ahuId: 'ahu_6', polygon: [[X_LEFT, 31.75], [X_RIGHT, 31.75], [X_RIGHT, 39.25], [X_LEFT, 39.25]] },
      { id: 'zone-5', label: '5', ahuId: 'ahu_5', polygon: [[X_LEFT, 39.25], [X_RIGHT, 39.25], [X_RIGHT, 46.75], [X_LEFT, 46.75]] },
      { id: 'zone-4', label: '4', ahuId: 'ahu_4', polygon: [[X_LEFT, 46.75], [X_RIGHT, 46.75], [X_RIGHT, 54.25], [X_LEFT, 54.25]] },
      { id: 'zone-3', label: '3', ahuId: 'ahu_3', polygon: [[X_LEFT, 54.25], [X_RIGHT, 54.25], [X_RIGHT, 61.75], [X_LEFT, 61.75]] },
      { id: 'zone-2', label: '2', ahuId: 'ahu_2', polygon: [[X_LEFT, 61.75], [X_RIGHT, 61.75], [X_RIGHT, 69.25], [X_LEFT, 69.25]] },
      { id: 'zone-1', label: '1', ahuId: 'ahu_1', polygon: [[X_LEFT, 69.25], [X_RIGHT, 69.25], [X_RIGHT, 77], [X_LEFT, 77]] },
    ],
  },
};
