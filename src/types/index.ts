export type FeedbackType = 'too_hot' | 'comfort' | 'too_cold';

export interface FeedbackEntry {
  id: string;
  storeId: string;
  zoneId: string;
  feedback: FeedbackType;
  timestamp: string; // ISO 8601
}

export interface ZoneConfig {
  id: string;
  label: string;
  ahuId: string;
  polygon: [number, number][]; // SVG viewBox coordinates (0-100)
}

export interface StoreConfig {
  id: string;
  name: string;
  floorPlan: string;
  zones: ZoneConfig[];
}
