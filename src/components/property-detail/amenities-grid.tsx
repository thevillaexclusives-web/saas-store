"use client";

import { useState } from "react";
import {
  Waves,
  Sparkles,
  Umbrella,
  Thermometer,
  Wifi,
  CookingPot,
  Tv,
  Flame,
  Shield,
  Car,
  Dumbbell,
  Bell,
  Trees,
  Sun,
  Wine,
} from "lucide-react";
import type { Amenity } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  waves: Waves,
  sparkles: Sparkles,
  umbrella: Umbrella,
  thermometer: Thermometer,
  wifi: Wifi,
  "cooking-pot": CookingPot,
  tv: Tv,
  flame: Flame,
  shield: Shield,
  car: Car,
  dumbbell: Dumbbell,
  bell: Bell,
  trees: Trees,
  sun: Sun,
  wine: Wine,
};

interface AmenitiesGridProps {
  amenities: Amenity[];
}

export function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? amenities : amenities.slice(0, 8);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {visible.map((amenity) => {
          const Icon = iconMap[amenity.icon] || Sparkles;
          return (
            <div
              key={amenity.name}
              className="flex items-center gap-3 py-1"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sand-50 shrink-0">
                <Icon className="w-[18px] h-[18px] text-sand-600" />
              </div>
              <span className="text-sm text-stone-700 font-medium">
                {amenity.name}
              </span>
            </div>
          );
        })}
      </div>
      {amenities.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-5 px-5 py-2.5 border border-stone-800 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-800 hover:text-white transition-all"
        >
          {showAll
            ? "Show less"
            : `Show all ${amenities.length} amenities`}
        </button>
      )}
    </div>
  );
}
