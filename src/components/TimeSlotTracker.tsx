'use client';

import { useEffect, useState } from 'react';
import { Sun, CloudSun, Sunset, Check, Clock } from 'lucide-react';
import {
  TIME_SLOTS,
  getCurrentSlot,
  getNextSlotTime,
  getCompletedSlots,
} from '@/lib/time-slots';

interface TimeSlotTrackerProps {
  zoneId: string | null;
  refreshKey: number; // increment to force re-read from localStorage
}

const slotIcons = {
  morning: Sun,
  afternoon: CloudSun,
  evening: Sunset,
};

export default function TimeSlotTracker({ zoneId, refreshKey }: TimeSlotTrackerProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [currentSlotId, setCurrentSlotId] = useState<string | null>(null);
  const [nextTime, setNextTime] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      if (zoneId) {
        setCompleted(getCompletedSlots(zoneId));
      } else {
        setCompleted(new Set());
      }
      setCurrentSlotId(getCurrentSlot()?.id ?? null);
      setNextTime(getNextSlotTime());
    }
    update();
    const interval = setInterval(update, 30_000); // check every 30s
    return () => clearInterval(interval);
  }, [zoneId, refreshKey]);

  const doneCount = completed.size;
  const allDone = doneCount === TIME_SLOTS.length;

  return (
    <div className="px-6 pt-4 pb-2">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[14px] font-normal text-[#9CA3AF]">
          Today&apos;s Progress
        </label>
        <span className="text-[13px] font-semibold" style={{ color: allDone ? '#43A452' : '#0E7EE4' }}>
          {doneCount}/{TIME_SLOTS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 w-full rounded-full bg-[#F1F5F9]">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{
            width: `${(doneCount / TIME_SLOTS.length) * 100}%`,
            background: allDone
              ? '#43A452'
              : 'linear-gradient(77.25deg, #0E7EE4 9.22%, #14B8B4 90.78%)',
          }}
        />
      </div>

      {/* Time slot cards */}
      <div className="flex gap-2">
        {TIME_SLOTS.map((slot) => {
          const Icon = slotIcons[slot.id];
          const isDone = completed.has(slot.id);
          const isCurrent = slot.id === currentSlotId;
          const isPast = !isCurrent && !isDone && TIME_SLOTS.indexOf(slot) < TIME_SLOTS.findIndex(s => s.id === currentSlotId);
          const isFuture = !isCurrent && !isDone && !isPast;

          return (
            <div
              key={slot.id}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl border px-2 py-2.5"
              style={{
                borderColor: isDone ? '#43A452' : isCurrent ? '#0E7EE4' : '#E5E7EB',
                backgroundColor: isDone ? '#F0FDF4' : isCurrent ? '#EFF6FF' : '#FAFAFA',
              }}
            >
              {isDone ? (
                <Check size={16} color="#43A452" strokeWidth={2.5} />
              ) : isCurrent ? (
                <Icon size={16} color="#0E7EE4" strokeWidth={2} />
              ) : (
                <Icon size={16} color="#CBD5E1" strokeWidth={1.5} />
              )}
              <span
                className="text-[11px] font-semibold"
                style={{
                  color: isDone ? '#43A452' : isCurrent ? '#0E7EE4' : '#CBD5E1',
                }}
              >
                {slot.label}
              </span>
              <span
                className="text-[9px] font-normal"
                style={{ color: isDone || isCurrent ? '#9CA3AF' : '#D1D5DB' }}
              >
                {slot.startHour > 12 ? slot.startHour - 12 : slot.startHour}
                {slot.startHour >= 12 ? 'PM' : 'AM'}
                {' - '}
                {slot.endHour > 12 ? slot.endHour - 12 : slot.endHour}
                {slot.endHour >= 12 ? 'PM' : 'AM'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status message */}
      {allDone ? (
        <p className="mt-3 text-center text-[12px] font-medium text-[#43A452]">
          All done for today! See you tomorrow.
        </p>
      ) : currentSlotId && !completed.has(currentSlotId) ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <Clock size={12} color="#0E7EE4" />
          <p className="text-[12px] font-medium text-[#0E7EE4]">
            Time to submit your {currentSlotId} feedback
          </p>
        </div>
      ) : nextTime ? (
        <p className="mt-3 text-center text-[12px] font-normal text-[#9CA3AF]">
          Next feedback round at {nextTime}
        </p>
      ) : null}
    </div>
  );
}
