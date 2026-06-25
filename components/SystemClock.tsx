"use client";

import { useState, useEffect } from "react";

export default function SystemClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="fixed top-7 right-6 z-50 flex flex-col items-end gap-0.5 pointer-events-none">
      <span className="text-[11px] font-mono text-white/30 tabular-nums">{timeStr}</span>
      <span className="text-[9px] font-mono text-white/18 tracking-wide">{dateStr}</span>
    </div>
  );
}
