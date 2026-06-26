"use client";

import { useEffect, useState } from "react";

export default function SystemClock() {
  const [clock, setClock] = useState({ time: "", date: "" });

  useEffect(() => {
    function tick() {
      const now = new Date();
      setClock({
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        date: now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!clock.time) return null;

  return (
    <div className="fixed top-7 right-6 z-50 flex flex-col items-end gap-0.5 pointer-events-none">
      <span className="text-[11px] font-mono text-white/30 tabular-nums">{clock.time}</span>
      <span className="text-[9px] font-mono text-white/18 tracking-wide">{clock.date}</span>
    </div>
  );
}
