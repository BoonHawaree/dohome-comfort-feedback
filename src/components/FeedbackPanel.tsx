'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ThumbsUp, Snowflake } from 'lucide-react';
import { FeedbackType } from '@/types';
import { getCompletedSlots, markSlotDone, TIME_SLOTS } from '@/lib/time-slots';

interface FeedbackPanelProps {
  selectedZoneId: string | null;
  selectedSlotId: string | null;
  onSubmit: (zoneId: string, feedback: FeedbackType) => boolean;
  onSlotComplete: () => void;
}

const options: {
  type: FeedbackType;
  label: string;
  icon: typeof Flame;
  color: string;
  bgColor: string;
}[] = [
  { type: 'too_hot', label: 'Too Hot', icon: Flame, color: '#EF4337', bgColor: '#FEE2E2' },
  { type: 'comfort', label: 'Comfort', icon: ThumbsUp, color: '#43A452', bgColor: '#DCFCE7' },
  { type: 'too_cold', label: 'Too Cold', icon: Snowflake, color: '#065BA9', bgColor: '#DBEAFE' },
];

export default function FeedbackPanel({
  selectedZoneId,
  selectedSlotId,
  onSubmit,
  onSlotComplete,
}: FeedbackPanelProps) {
  const [selected, setSelected] = useState<FeedbackType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [slotAlreadyDone, setSlotAlreadyDone] = useState(false);

  const isActive = selectedZoneId !== null;

  // Reset on zone or slot change + check if selected slot already submitted
  useEffect(() => {
    setSelected(null);
    setShowSuccess(false);
    if (selectedZoneId && selectedSlotId) {
      const done = getCompletedSlots(selectedZoneId);
      setSlotAlreadyDone(done.has(selectedSlotId));
    } else {
      setSlotAlreadyDone(false);
    }
  }, [selectedZoneId, selectedSlotId]);

  const handleTap = useCallback((type: FeedbackType) => {
    if (!isActive || slotAlreadyDone || !selectedSlotId) return;
    setSelected(type);
  }, [isActive, slotAlreadyDone, selectedSlotId]);

  const handleSubmit = useCallback(() => {
    if (!selectedZoneId || !selected || slotAlreadyDone || !selectedSlotId) return;
    const ok = onSubmit(selectedZoneId, selected);
    if (ok) {
      markSlotDone(selectedZoneId, selectedSlotId);
      setShowSuccess(true);
      setSelected(null);
      setSlotAlreadyDone(true);
      onSlotComplete();
      setTimeout(() => setShowSuccess(false), 2500);
    }
  }, [selectedZoneId, selected, slotAlreadyDone, selectedSlotId, onSubmit, onSlotComplete]);

  const disabled = !isActive || slotAlreadyDone || !selectedSlotId;
  const slotLabel = selectedSlotId
    ? TIME_SLOTS.find((s) => s.id === selectedSlotId)?.label
    : null;

  return (
    <div className="px-5 pt-3 pb-2">
      <label className="mb-2 block text-[13px] font-normal text-[#9CA3AF]">
        Your Feedback{slotLabel ? ` — ${slotLabel}` : ''}
      </label>

      {/* Feedback pills */}
      <div className="flex gap-2.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isChosen = selected === opt.type;

          return (
            <button
              key={opt.type}
              onClick={() => handleTap(opt.type)}
              disabled={disabled}
              className="flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 py-3 transition-all duration-150 active:scale-[0.97]"
              style={{
                backgroundColor: isChosen ? opt.bgColor : '#F9FAFB',
                borderColor: isChosen ? opt.color : '#E5E7EB',
                opacity: disabled ? 0.4 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <Icon size={22} color={opt.color} strokeWidth={isChosen ? 2.5 : 1.8} />
              <span className="text-[13px] font-semibold" style={{ color: opt.color }}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status messages */}
      {!selectedSlotId && isActive && (
        <p className="mt-1.5 text-center text-[11px] text-[#9CA3AF]">
          Select a time slot above
        </p>
      )}
      {slotAlreadyDone && isActive && selectedSlotId && (
        <p className="mt-1.5 text-center text-[11px] text-[#43A452]">
          {slotLabel} round already submitted
        </p>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isActive || !selected || slotAlreadyDone || !selectedSlotId}
        className="mt-3 w-full rounded-xl py-3 text-[15px] font-semibold text-white transition-all duration-150 active:scale-[0.98]"
        style={{
          background: (!isActive || !selected || slotAlreadyDone || !selectedSlotId)
            ? '#CBD5E1'
            : 'linear-gradient(77.25deg, #0E7EE4 9.22%, #14B8B4 90.78%)',
          cursor: (!isActive || !selected || slotAlreadyDone || !selectedSlotId) ? 'not-allowed' : 'pointer',
        }}
      >
        Submit
      </button>

      {/* Success */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-2 flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="#43A452" strokeWidth="1.5" />
              <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="#43A452" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[13px] font-medium text-[#43A452]">
              Thank you for your feedback!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
