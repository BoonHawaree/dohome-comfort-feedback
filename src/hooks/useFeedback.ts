'use client';

import { useState, useCallback, useEffect } from 'react';
import { FeedbackType } from '@/types';
import {
  submitFeedback as storeFeedback,
  getCooldownRemaining,
  getLatestFeedbackForZone,
} from '@/lib/feedback-store';

export function useFeedback(storeId: string) {
  const [zoneFeedback, setZoneFeedback] = useState<Record<string, FeedbackType | null>>({});
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  // Load initial feedback state from localStorage
  const loadFeedbackState = useCallback(
    (zoneIds: string[]) => {
      const fb: Record<string, FeedbackType | null> = {};
      const cd: Record<string, number> = {};
      for (const zoneId of zoneIds) {
        fb[zoneId] = getLatestFeedbackForZone(storeId, zoneId);
        cd[zoneId] = getCooldownRemaining(storeId, zoneId);
      }
      setZoneFeedback(fb);
      setCooldowns(cd);
    },
    [storeId]
  );

  // Tick cooldowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const key of Object.keys(next)) {
          if (next[key] > 0) {
            next[key] = getCooldownRemaining(storeId, key);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [storeId]);

  const submit = useCallback(
    (zoneId: string, feedback: FeedbackType) => {
      const cooldown = getCooldownRemaining(storeId, zoneId);
      if (cooldown > 0) return false;

      storeFeedback(storeId, zoneId, feedback);
      setZoneFeedback((prev) => ({ ...prev, [zoneId]: feedback }));
      setCooldowns((prev) => ({ ...prev, [zoneId]: 60_000 }));
      return true;
    },
    [storeId]
  );

  return { zoneFeedback, cooldowns, submit, loadFeedbackState };
}
