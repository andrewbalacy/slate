"use client";

import { useState } from "react";

export function EnergySelector({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const indicator = hovered ?? value;

  return (
    <div className="flex flex-col gap-2">
      <div
        role="group"
        aria-label="Energy level 1 to 10"
        className="flex items-center gap-1.5"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const n = i + 1;
          const filled = indicator !== null && n <= indicator;
          const selected = value !== null && n <= value;
          return (
            <button
              key={n}
              type="button"
              aria-label={`Energy ${n}`}
              onClick={() => onChange(n)}
              onMouseEnter={() => setHovered(n)}
              className="relative flex-1 h-2 rounded-full transition-all duration-100"
              style={{
                background: filled
                  ? "rgba(255,255,255,0.7)"
                  : selected
                  ? "rgba(255,255,255,0.45)"
                  : "rgba(255,255,255,0.1)",
                transform: hovered === n ? "scaleY(1.5)" : "scaleY(1)",
                transformOrigin: "center",
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between px-0.5">
        <span className="text-[8px] font-mono text-white/18">1</span>
        {value !== null && (
          <span className="text-[9px] font-mono text-white/40">{value} / 10</span>
        )}
        <span className="text-[8px] font-mono text-white/18">10</span>
      </div>
    </div>
  );
}
