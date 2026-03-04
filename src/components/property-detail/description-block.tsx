"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DescriptionBlockProps {
  description: string;
}

export function DescriptionBlock({ description }: DescriptionBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={
          expanded ? "" : "line-clamp-4"
        }
      >
        <p className="text-[15px] leading-relaxed text-stone-600">
          {description}
        </p>
      </div>
      {description.length > 200 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sand-700 hover:text-sand-800 transition-colors"
        >
          {expanded ? "Show less" : "Show more"}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
