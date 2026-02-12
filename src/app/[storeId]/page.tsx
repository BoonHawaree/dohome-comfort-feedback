'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { stores } from '@/config/zones';
import { useFeedback } from '@/hooks/useFeedback';
import { getCurrentSlot, getCompletedSlots } from '@/lib/time-slots';
import Header from '@/components/Header';
import FloorPlanViewer from '@/components/FloorPlanViewer';
import ZoneSelector from '@/components/ZoneSelector';
import TimeSlotTracker from '@/components/TimeSlotTracker';
import FeedbackPanel from '@/components/FeedbackPanel';

export default function StorePage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const store = stores[storeId];

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [slotRefreshKey, setSlotRefreshKey] = useState(0);

  const { submit } = useFeedback(storeId);

  // Register service worker + request notification permission
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  // In-app notification check: when page is visible, check if there's a pending slot
  useEffect(() => {
    function checkAndNotify() {
      if (!selectedZoneId || document.hidden) return;
      const slot = getCurrentSlot();
      if (!slot) return;
      const done = getCompletedSlots(selectedZoneId);
      if (!done.has(slot.id) && Notification.permission === 'granted') {
        navigator.serviceWorker?.ready.then((reg) => {
          reg.active?.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: 'Comfort Feedback',
            body: `Time for your ${slot.label.toLowerCase()} check!`,
          });
        });
      }
    }

    // Check when tab becomes visible
    document.addEventListener('visibilitychange', checkAndNotify);
    // Also check every 5 min while tab is open
    const interval = setInterval(checkAndNotify, 5 * 60_000);
    return () => {
      document.removeEventListener('visibilitychange', checkAndNotify);
      clearInterval(interval);
    };
  }, [selectedZoneId]);

  const handleZoneSelect = useCallback((zoneId: string) => {
    setSelectedZoneId(zoneId);
    // Request notification permission on first interaction
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSlotComplete = useCallback(() => {
    setSlotRefreshKey((k) => k + 1);
  }, []);

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="px-6 text-center">
          <p className="text-[20px] font-semibold text-[#212529]">Store not found</p>
          <p className="mt-2 text-[14px] text-[#9CA3AF]">
            The store &quot;{storeId}&quot; does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-white">
      <Header />

      {/* Store name */}
      <div className="px-6 pb-2">
        <label className="mb-2 block text-[14px] font-normal text-[#9CA3AF]">
          Store
        </label>
        <p className="border-b border-[#E5E7EB] pb-3 text-[16px] font-medium text-[#212529]">
          {store.name}
        </p>
      </div>

      {/* Floor plan */}
      <div className="px-3 pt-4">
        <FloorPlanViewer
          floorPlanSrc={store.floorPlan}
          zones={store.zones}
          selectedZoneId={selectedZoneId}
          onZoneSelect={handleZoneSelect}
        />
      </div>

      {/* Zone selector dropdown */}
      <ZoneSelector
        zones={store.zones}
        selectedZoneId={selectedZoneId}
        onSelect={handleZoneSelect}
      />

      {/* Time slot progress tracker */}
      <TimeSlotTracker zoneId={selectedZoneId} refreshKey={slotRefreshKey} />

      {/* Feedback buttons + Submit */}
      <FeedbackPanel
        selectedZoneId={selectedZoneId}
        onSubmit={submit}
        onSlotComplete={handleSlotComplete}
      />

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 pb-8 pt-6">
        <div className="flex h-5 w-1.5 rounded-full bg-alto" />
        <span className="text-[13px] font-medium text-[#9CA3AF]">
          Powered by AltoTech Global
        </span>
      </div>
    </div>
  );
}
