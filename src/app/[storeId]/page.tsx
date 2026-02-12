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

  const { zoneFeedback, cooldowns, submit, loadFeedbackState } = useFeedback(storeId);

  useEffect(() => {
    if (store) {
      loadFeedbackState(store.zones.map((z) => z.id));
    }
  }, [store, loadFeedbackState]);

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
    <div className="mx-auto min-h-screen max-w-md bg-white">
      {/* Title */}
      <Header />

      {/* Store name - static field */}
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
          zoneFeedback={zoneFeedback}
          onZoneSelect={handleZoneSelect}
        />
      </div>

      {/* Zone selector dropdown */}
      <ZoneSelector
        zones={store.zones}
        selectedZoneId={selectedZoneId}
        zoneFeedback={zoneFeedback}
        onSelect={handleZoneSelect}
      />

      {/* Feedback buttons + Submit */}
      <FeedbackPanel
        selectedZoneId={selectedZoneId}
        cooldownRemaining={cooldowns[selectedZoneId ?? ''] ?? 0}
        currentFeedback={selectedZoneId ? (zoneFeedback[selectedZoneId] ?? null) : null}
        onSubmit={submit}
      />

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 pb-8 pt-6">
        {/* Alto gradient mark */}
        <div className="flex h-5 w-1.5 rounded-full bg-alto" />
        <span className="text-[13px] font-medium text-[#9CA3AF]">
          Powered by AltoTech Global
        </span>
      </div>
    </div>
  );
}
