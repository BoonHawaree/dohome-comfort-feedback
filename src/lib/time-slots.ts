export interface TimeSlot {
  id: 'morning' | 'afternoon' | 'evening';
  label: string;
  startHour: number; // Bangkok time (UTC+7)
  endHour: number;
}

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'morning', label: 'Morning', startHour: 9, endHour: 12 },
  { id: 'afternoon', label: 'Afternoon', startHour: 13, endHour: 16 },
  { id: 'evening', label: 'Evening', startHour: 16, endHour: 19 },
];

// Get current Bangkok hour
function getBangkokHour(): number {
  const now = new Date();
  const bangkokTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  return bangkokTime.getHours();
}

// Get today's date string in Bangkok timezone
function getBangkokDateStr(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }); // YYYY-MM-DD
}

export function getCurrentSlot(): TimeSlot | null {
  const hour = getBangkokHour();
  return TIME_SLOTS.find((s) => hour >= s.startHour && hour < s.endHour) ?? null;
}

export function getNextSlot(): TimeSlot | null {
  const hour = getBangkokHour();
  return TIME_SLOTS.find((s) => s.startHour > hour) ?? null;
}

export function getNextSlotTime(): string | null {
  const next = getNextSlot();
  if (!next) return null;
  const h = next.startHour;
  return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`;
}

// localStorage key for tracking slot submissions
const SLOT_KEY = 'dohome-comfort-slots';

interface SlotRecord {
  date: string;
  zoneId: string;
  slotId: string;
  timestamp: string;
}

function getSlotRecords(): SlotRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SLOT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSlotRecords(records: SlotRecord[]): void {
  localStorage.setItem(SLOT_KEY, JSON.stringify(records));
}

export function markSlotDone(zoneId: string, slotId: string): void {
  const records = getSlotRecords();
  records.push({
    date: getBangkokDateStr(),
    zoneId,
    slotId,
    timestamp: new Date().toISOString(),
  });
  saveSlotRecords(records);
}

export function getCompletedSlots(zoneId: string): Set<string> {
  const today = getBangkokDateStr();
  const records = getSlotRecords();
  const done = new Set<string>();
  for (const r of records) {
    if (r.zoneId === zoneId && r.date === today) {
      done.add(r.slotId);
    }
  }
  return done;
}

export function getTodayProgress(zoneId: string): { done: number; total: number } {
  const completed = getCompletedSlots(zoneId);
  return { done: completed.size, total: TIME_SLOTS.length };
}
