'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ThumbsUp, Snowflake } from 'lucide-react';
import { FeedbackType } from '@/types';
import { getCurrentSlot, getCompletedSlots, markSlotDone } from '@/lib/time-slots';

interface FeedbackPanelProps {
  selectedZoneId: string | null;
  onSubmit: (zoneId: string, feedback: FeedbackType) => boolean;
  onSlotComplete: () => void; // notify parent to refresh tracker
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
  onSubmit,
  onSlotComplete,
}: FeedbackPanelProps) {
  const [selected, setSelected] = useState<FeedbackType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [slotAlreadyDone, setSlotAlreadyDone] = useState(false);

  const isActive = selectedZoneId !== null;

  // Reset on zone change + check if current slot already submitted
  useEffect(() => {
    setSelected(null);
    setShowSuccess(false);
    if (selectedZoneId) {
      const currentSlot = getCurrentSlot();
      if (currentSlot) {
        const done = getCompletedSlots(selectedZoneId);
        setSlotAlreadyDone(done.has(currentSlot.id));
      } else {
        setSlotAlreadyDone(false);
      }
    } else {
      setSlotAlreadyDone(false);
    }
  }, [selectedZoneId]);

  const handleTap = useCallback((type: FeedbackType) => {
    if (!isActive || slotAlreadyDone) return;
    setSelected(type);
  }, [isActive, slotAlreadyDone]);

  const handleSubmit = useCallback(() => {
    if (!selectedZoneId || !selected || slotAlreadyDone) return;
    const ok = onSubmit(selectedZoneId, selected);
    if (ok) {
      // Mark the current time slot as done
      const currentSlot = getCurrentSlot();
      if (currentSlot) {
        markSlotDone(selectedZoneId, currentSlot.id);
      }
      setShowSuccess(true);
      setSelected(null);
      setSlotAlreadyDone(true);
      onSlotComplete();
      setTimeout(() => setShowSuccess(false), 2500);
    }
  }, [selectedZoneId, selected, slotAlreadyDone, onSubmit, onSlotComplete]);

  const currentSlot = getCurrentSlot();
  const disabled = !isActive || slotAlreadyDone;
  const noActiveSlot = !currentSlot;

  return (
    <div className="px-6 pt-4 pb-2">
      <label className="mb-3 block text-[14px] font-normal text-[#9CA3AF]">
        Your Feedback
      </label>

      {/* Feedback pills */}
      <div className="flex gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isChosen = selected === opt.type;

          return (
            <button
              key={opt.type}
              onClick={() => handleTap(opt.type)}
              disabled={disabled || noActiveSlot}
              className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl border-2 py-4 transition-all duration-150 active:scale-[0.97]"
              style={{
                backgroundColor: isChosen ? opt.bgColor : '#F9FAFB',
                borderColor: isChosen ? opt.color : '#E5E7EB',
                opacity: disabled || noActiveSlot ? 0.4 : 1,
                cursor: disabled || noActiveSlot ? 'not-allowed' : 'pointer',
              }}
            >
              <Icon size={24} color={opt.color} strokeWidth={isChosen ? 2.5 : 1.8} />
              <span className="text-[14px] font-semibold" style={{ color: opt.color }}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status messages */}
      {noActiveSlot && isActive && (
        <p className="mt-2 text-center text-[12px] text-[#9CA3AF]">
          No active feedback round right now
        </p>
      )}
      {slotAlreadyDone && isActive && !noActiveSlot && (
        <p className="mt-2 text-center text-[12px] text-[#43A452]">
          {currentSlot.label} round already submitted
        </p>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isActive || !selected || slotAlreadyDone || noActiveSlot}
        className="mt-5 w-full rounded-xl py-3.5 text-[16px] font-semibold text-white transition-all duration-150 active:scale-[0.98]"
        style={{
          background: (!isActive || !selected || slotAlreadyDone || noActiveSlot)
            ? '#CBD5E1'
            : 'linear-gradient(77.25deg, #0E7EE4 9.22%, #14B8B4 90.78%)',
          cursor: (!isActive || !selected || slotAlreadyDone || noActiveSlot) ? 'not-allowed' : 'pointer',
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
            className="mt-3 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="#43A452" strokeWidth="1.5" />
              <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="#43A452" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[14px] font-medium text-[#43A452]">
              Thank you for your feedback!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
