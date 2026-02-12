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
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [slotRefreshKey, setSlotRefreshKey] = useState(0);

  const { submit } = useFeedback(storeId);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  // Auto-select the current slot on mount and when zone changes
  useEffect(() => {
    const current = getCurrentSlot();
    if (current && selectedZoneId) {
      const done = getCompletedSlots(selectedZoneId);
      // Auto-select current slot if not already done
      if (!done.has(current.id)) {
        setSelectedSlotId(current.id);
      } else {
        setSelectedSlotId(null);
      }
    } else if (current) {
      setSelectedSlotId(current.id);
    }
  }, [selectedZoneId, slotRefreshKey]);

  // In-app notification check
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

    document.addEventListener('visibilitychange', checkAndNotify);
    const interval = setInterval(checkAndNotify, 5 * 60_000);
    return () => {
      document.removeEventListener('visibilitychange', checkAndNotify);
      clearInterval(interval);
    };
  }, [selectedZoneId]);

  const handleZoneSelect = useCallback((zoneId: string) => {
    setSelectedZoneId(zoneId);
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSlotSelect = useCallback((slotId: string) => {
    setSelectedSlotId(slotId);
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
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-white">
      {/* Compact header row: title + store name */}
      <Header storeName={store.name} />

      {/* Small time-slot pills above the map */}
      <TimeSlotTracker
        zoneId={selectedZoneId}
        refreshKey={slotRefreshKey}
        selectedSlotId={selectedSlotId}
        onSlotSelect={handleSlotSelect}
      />

      {/* Floor plan - takes most space */}
      <div className="flex-1 px-3 pt-1">
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

      {/* Feedback buttons + Submit - always visible */}
      <FeedbackPanel
        selectedZoneId={selectedZoneId}
        selectedSlotId={selectedSlotId}
        onSubmit={submit}
        onSlotComplete={handleSlotComplete}
      />

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 pb-4 pt-2">
        <div className="flex h-4 w-1 rounded-full bg-alto" />
        <span className="text-[11px] font-medium text-[#9CA3AF]">
          Powered by AltoTech Global
        </span>
      </div>
    </div>
  );
}
