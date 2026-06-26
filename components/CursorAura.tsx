"use client";

import { useEffect, useRef } from "react";

export default function CursorAura() {
  const elRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -999, y: -999 });
  const current = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const running = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const el = elRef.current;
    if (!el) return;

    el.style.opacity = "1";

    function tick() {
      const dx = pos.current.x - current.current.x;
      const dy = pos.current.y - current.current.y;
      current.current.x += dx * 0.08;
      current.current.y += dy * 0.08;
      if (el) el.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;

      // Stop the loop once settled to sub-pixel — restart on next mousemove
      if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        running.current = false;
      }
    }

    function onMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!running.current) {
        running.current = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[1] top-0 left-0"
      style={{ opacity: 0 }}
      ref={elRef}
    >
      <div
        style={{
          width: 480,
          height: 480,
          marginLeft: -240,
          marginTop: -240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.028) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
