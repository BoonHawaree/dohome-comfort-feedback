'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ThumbsUp, Snowflake } from 'lucide-react';
import { FeedbackType } from '@/types';

interface FeedbackPanelProps {
  selectedZoneId: string | null;
  onSubmit: (zoneId: string, feedback: FeedbackType) => boolean;
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
}: FeedbackPanelProps) {
  const [selected, setSelected] = useState<FeedbackType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const isActive = selectedZoneId !== null;

  // Reset on zone change
  useEffect(() => {
    setSelected(null);
    setShowSuccess(false);
  }, [selectedZoneId]);

  const handleTap = useCallback((type: FeedbackType) => {
    if (!isActive) return;
    setSelected(type);
  }, [isActive]);

  const handleSubmit = useCallback(() => {
    if (!selectedZoneId || !selected) return;
    const ok = onSubmit(selectedZoneId, selected);
    if (ok) {
      setShowSuccess(true);
      setSelected(null);
      setTimeout(() => setShowSuccess(false), 2500);
    }
  }, [selectedZoneId, selected, onSubmit]);

  return (
    <div className="px-5 pt-3 pb-2">
      <label className="mb-2 block text-[13px] font-normal text-[#9CA3AF]">
        Your Feedback
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
              disabled={!isActive}
              className="flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 py-3 transition-all duration-150 active:scale-[0.97]"
              style={{
                backgroundColor: isChosen ? opt.bgColor : '#F9FAFB',
                borderColor: isChosen ? opt.color : '#E5E7EB',
                opacity: !isActive ? 0.4 : 1,
                cursor: !isActive ? 'not-allowed' : 'pointer',
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

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isActive || !selected}
        className="mt-3 w-full rounded-xl py-3 text-[15px] font-semibold text-white transition-all duration-150 active:scale-[0.98]"
        style={{
          background: (!isActive || !selected)
            ? '#CBD5E1'
            : 'linear-gradient(77.25deg, #0E7EE4 9.22%, #14B8B4 90.78%)',
          cursor: (!isActive || !selected) ? 'not-allowed' : 'pointer',
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
