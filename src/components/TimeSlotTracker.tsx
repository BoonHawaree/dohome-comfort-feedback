'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import {
  TIME_SLOTS,
  getCurrentSlot,
  getCompletedSlots,
  isSlotSelectable,
} from '@/lib/time-slots';

interface TimeSlotTrackerProps {
  zoneId: string | null;
  refreshKey: number;
  selectedSlotId: string | null;
  onSlotSelect: (slotId: string) => void;
}

export default function TimeSlotTracker({
  zoneId,
  refreshKey,
  selectedSlotId,
  onSlotSelect,
}: TimeSlotTrackerProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [currentSlotId, setCurrentSlotId] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      if (zoneId) {
        setCompleted(getCompletedSlots(zoneId));
      } else {
        setCompleted(new Set());
      }
      setCurrentSlotId(getCurrentSlot()?.id ?? null);
    }
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [zoneId, refreshKey]);

  const allDone = completed.size === TIME_SLOTS.length;

  return (
    <div className="px-5 pb-1 pt-1">
      <div className="flex items-center gap-1.5">
        {TIME_SLOTS.map((slot) => {
          const isDone = completed.has(slot.id);
          const isCurrent = slot.id === currentSlotId;
          const selectable = isSlotSelectable(slot.id) && !isDone;
          const isSelected = slot.id === selectedSlotId;

          return (
            <button
              key={slot.id}
              onClick={() => selectable && onSlotSelect(slot.id)}
              disabled={!selectable}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-150"
              style={{
                backgroundColor: isDone
                  ? '#F0FDF4'
                  : isSelected
                    ? '#EFF6FF'
                    : '#F5F5F5',
                border: isDone
                  ? '1.5px solid #43A452'
                  : isSelected
                    ? '1.5px solid #0E7EE4'
                    : isCurrent
                      ? '1.5px solid #93C5FD'
                      : '1.5px solid #E5E7EB',
                color: isDone
                  ? '#43A452'
                  : isSelected
                    ? '#0E7EE4'
                    : selectable
                      ? '#6B7280'
                      : '#CBD5E1',
                cursor: selectable ? 'pointer' : 'default',
                opacity: !selectable && !isDone ? 0.5 : 1,
              }}
            >
              {isDone && <Check size={11} strokeWidth={3} />}
              {slot.label}
            </button>
          );
        })}

        {allDone && (
          <span className="ml-auto text-[11px] font-medium text-[#43A452]">
            All done!
          </span>
        )}
      </div>
    </div>
  );
}
