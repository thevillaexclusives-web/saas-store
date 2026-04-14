"use client";

import { useMemo } from "react";
import { circle } from "@turf/turf";
import Map, {
  Layer,
  NavigationControl,
  Source,
} from "react-map-gl/mapbox";

const DEFAULT_MAPBOX_STYLE = "mapbox://styles/mapbox/streets-v11";

interface ApproximateLocationMapProps {
  latitude: number;
  longitude: number;
}

export function ApproximateLocationMap({
  latitude,
  longitude,
}: ApproximateLocationMapProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  const mapStyle =
    process.env.NEXT_PUBLIC_MAPBOX_STYLE ?? DEFAULT_MAPBOX_STYLE;
  const area = useMemo(
    () => circle([longitude, latitude], 1, { units: "kilometers" }),
    [latitude, longitude],
  );
  const centerPoint = useMemo(
    () => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "Point" as const,
        coordinates: [longitude, latitude],
      },
    }),
    [latitude, longitude],
  );

  if (!token) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-[28px] border border-dashed border-border-subtle bg-white/70 px-6 text-center">
        <div>
          <p className="text-sm font-semibold text-stone-900">Map preview unavailable</p>
          <p className="mt-1 text-xs text-stone-500">
            Add `NEXT_PUBLIC_MAPBOX_TOKEN` to enable the approximate location map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-border-subtle">
      <Map
        reuseMaps
        mapboxAccessToken={token}
        initialViewState={{
          latitude,
          longitude,
          zoom: 13,
        }}
        mapStyle={mapStyle}
        style={{ width: "100%", height: 320 }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Source id="approximate-area" type="geojson" data={area}>
          <Layer
            id="approximate-area-fill"
            type="fill"
            paint={{
              "fill-color": "#0f172a",
              "fill-opacity": 0.12,
            }}
          />
          <Layer
            id="approximate-area-line"
            type="line"
            paint={{
              "line-color": "#0f172a",
              "line-opacity": 0.28,
              "line-width": 1.5,
            }}
          />
        </Source>
        <Source id="approximate-center" type="geojson" data={centerPoint}>
          <Layer
            id="approximate-center-dot"
            type="circle"
            paint={{
              "circle-radius": 4,
              "circle-color": "#0f172a",
              "circle-opacity": 0.45,
              "circle-stroke-color": "#ffffff",
              "circle-stroke-width": 1.5,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
