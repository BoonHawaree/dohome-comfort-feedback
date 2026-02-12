'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { stores } from '@/config/zones';
import { useFeedback } from '@/hooks/useFeedback';
import Header from '@/components/Header';
import FloorPlanViewer from '@/components/FloorPlanViewer';
import ZoneSelector from '@/components/ZoneSelector';
import FeedbackPanel from '@/components/FeedbackPanel';

export default function StorePage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const store = stores[storeId];

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const { submit } = useFeedback(storeId);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  const handleZoneSelect = useCallback((zoneId: string) => {
    setSelectedZoneId(zoneId);
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
      <Header storeName={store.name} />

      {/* Floor plan */}
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

      {/* Feedback buttons + Submit */}
      <FeedbackPanel
        selectedZoneId={selectedZoneId}
        onSubmit={submit}
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
