"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const commands = [
  { label: "Daily Execution", desc: "Generate today's plan",           href: "/daily" },
  { label: "Logs",            desc: "Saved execution history",         href: "/logs" },
  { label: "Architecture",   desc: "Rules, constraints, system logic", href: "/architecture" },
  { label: "Home",            desc: "Return to slate OS shell",        href: "/" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.desc.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setActive(0);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
  }, [open]);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && filtered[active]) {
      navigate(filtered[active].href);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/[0.1] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(22,22,22,0.97) 0%, rgba(12,12,12,0.97) 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset, 0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07]">
          <span className="text-white/20 font-mono text-xs shrink-0">⌘K</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="search commands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/20 focus:outline-none"
          />
          <kbd
            onClick={() => setOpen(false)}
            className="text-[9px] font-mono text-white/20 border border-white/[0.08] rounded px-1.5 py-0.5 cursor-pointer hover:text-white/40 transition-colors"
          >
            esc
          </kbd>
        </div>

        {/* Results */}
        <ul className="py-2">
          {filtered.length === 0 && (
            <li className="px-5 py-4 text-sm text-white/18 italic">no results.</li>
          )}
          {filtered.map((cmd, i) => (
            <li key={cmd.href}>
              <button
                type="button"
                onClick={() => navigate(cmd.href)}
                onMouseEnter={() => setActive(i)}
                className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors duration-100"
                style={{
                  background: active === i ? "rgba(255,255,255,0.05)" : "transparent",
                  borderLeft: active === i ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
                }}
              >
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-sm font-medium text-white/75" style={{ color: active === i ? "rgba(255,255,255,0.92)" : undefined }}>
                    {cmd.label}
                  </span>
                  <span className="text-xs text-white/22 truncate">{cmd.desc}</span>
                </div>
                <span className="text-white/18 font-mono text-xs shrink-0" style={{ color: active === i ? "rgba(255,255,255,0.4)" : undefined }}>
                  →
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-4">
          <span className="text-[9px] font-mono text-white/18 tracking-wide">↑↓ navigate</span>
          <span className="text-[9px] font-mono text-white/18 tracking-wide">↵ open</span>
          <span className="text-[9px] font-mono text-white/18 tracking-wide">esc close</span>
        </div>
      </div>
    </div>
  );
}
