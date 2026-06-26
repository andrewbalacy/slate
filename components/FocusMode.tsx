"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

export type FocusData = {
  objective: string;
  recommendation: string;
  effort: string;
  shutdown: string | null;
};

// Isolated so only the clock text rerenders each second, not the whole overlay
function useElapsed() {
  const start = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - start.current), 1000);
    return () => clearInterval(id);
  }, []);

  const s = Math.floor(elapsed / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const TimerDisplay = memo(function TimerDisplay() {
  const elapsed = useElapsed();
  return (
    <p
      className="font-mono font-light text-white/28 tabular-nums"
      style={{ fontSize: "2.75rem", letterSpacing: "0.08em", lineHeight: 1 }}
    >
      {elapsed}
    </p>
  );
});

type Props = FocusData & { onExit: () => void };

const FocusMode = memo(function FocusMode({ objective, recommendation, effort, shutdown, onExit }: Props) {
  const [visible, setVisible] = useState(false);
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 16);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  function handleExit() {
    setVisible(false);
    setTimeout(() => onExitRef.current(), 380);
  }

  const meta = useMemo(() => [
    { label: "recommendation", value: recommendation },
    { label: "effort", value: effort },
    ...(shutdown ? [{ label: "shutdown", value: shutdown }] : []),
  ], [recommendation, effort, shutdown]);

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#060606]"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 55% 35% at 50% 15%, rgba(255,255,255,0.022) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center gap-14 px-6 max-w-md w-full text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s",
        }}
      >
        {/* Session timer — only this subtree rerenders each second */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[9px] font-medium tracking-[0.22em] uppercase text-white/16">focus mode</p>
          <TimerDisplay />
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/20">current objective</p>
          <p className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-white/82 leading-snug">
            {objective}
          </p>
        </div>

        <div className="flex items-center gap-0 flex-wrap justify-center divide-x divide-white/[0.07]">
          {meta.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-6">
              <p className="text-[8px] font-medium tracking-[0.16em] uppercase text-white/18">{label}</p>
              <p className="text-xs font-mono text-white/38">{value}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleExit}
          className="group flex items-center gap-2 text-xs font-medium text-white/20 hover:text-white/50 transition-colors duration-200 tracking-wide"
        >
          Exit Focus Mode
          <span className="font-mono transition-transform duration-150 group-hover:translate-x-0.5">→</span>
        </button>
      </div>
    </div>
  );
});

export default FocusMode;
