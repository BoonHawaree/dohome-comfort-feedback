'use client';

import { ChevronDown } from 'lucide-react';
import { ZoneConfig, FeedbackType } from '@/types';

interface ZoneSelectorProps {
  zones: ZoneConfig[];
  selectedZoneId: string | null;
  zoneFeedback: Record<string, FeedbackType | null>;
  onSelect: (zoneId: string) => void;
}

export default function ZoneSelector({ zones, selectedZoneId, zoneFeedback, onSelect }: ZoneSelectorProps) {
  return (
    <div className="px-6 pt-4 pb-2">
      <label className="mb-2 block text-[14px] font-normal text-[#9CA3AF]">
        Select Zone
      </label>
      <div className="relative">
        <select
          value={selectedZoneId ?? ''}
          onChange={(e) => {
            if (e.target.value) onSelect(e.target.value);
          }}
          className="w-full appearance-none border-b border-[#E5E7EB] bg-transparent pb-3 pr-8 text-[16px] font-medium text-[#212529] outline-none focus:border-[#0E7EE4]"
        >
          <option value="">Choose a zone...</option>
          {zones.map((zone) => {
            const fb = zoneFeedback[zone.id];
            const suffix = fb === 'too_hot' ? ' - Too Hot' : fb === 'comfort' ? ' - Comfort' : fb === 'too_cold' ? ' - Too Cold' : '';
            return (
              <option key={zone.id} value={zone.id}>
                Zone {zone.label}{suffix}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={20}
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
        />
      </div>
    </div>
  );
}
