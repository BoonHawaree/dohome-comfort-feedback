import { FeedbackEntry, FeedbackType } from '@/types';

const STORAGE_KEY = 'dohome-comfort-feedback';
const MAX_ENTRIES = 1000;
const COOLDOWN_MS = 60_000; // 60 seconds

export function getEntries(): FeedbackEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: FeedbackEntry[]): void {
  // Prune oldest if over cap
  const pruned = entries.length > MAX_ENTRIES
    ? entries.slice(entries.length - MAX_ENTRIES)
    : entries;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
}

export function submitFeedback(
  storeId: string,
  zoneId: string,
  feedback: FeedbackType
): FeedbackEntry {
  const entry: FeedbackEntry = {
    id: crypto.randomUUID(),
    storeId,
    zoneId,
    feedback,
    timestamp: new Date().toISOString(),
  };
  const entries = getEntries();
  entries.push(entry);
  saveEntries(entries);
  return entry;
}

export function getCooldownRemaining(storeId: string, zoneId: string): number {
  const entries = getEntries();
  const latest = entries
    .filter((e) => e.storeId === storeId && e.zoneId === zoneId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];

  if (!latest) return 0;
  const elapsed = Date.now() - new Date(latest.timestamp).getTime();
  return Math.max(0, COOLDOWN_MS - elapsed);
}

export function getLatestFeedbackForZone(
  storeId: string,
  zoneId: string
): FeedbackType | null {
  const entries = getEntries();
  const latest = entries
    .filter((e) => e.storeId === storeId && e.zoneId === zoneId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
  return latest?.feedback ?? null;
}
