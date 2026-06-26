"use client";

import type { SlatePlan } from "@/types/slate";

export function GeneratedPlan({ plan, saved, onSave }: {
  plan: SlatePlan;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="w-full max-w-md flex flex-col gap-3 animate-fade-in">
      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/22 px-1">
        generated plan
      </p>
      <div
        className="noise relative rounded-2xl border border-white/[0.08] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.012) 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="px-8 py-7 border-b border-white/[0.07]"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)" }}
        >
          <p className="text-2xl font-semibold tracking-tight text-white/90">{plan.title}</p>
        </div>
        <ul className="flex flex-col divide-y divide-white/[0.05]">
          {plan.blocks.map((block, i) => (
            <li
              key={i}
              className="px-8 py-4 text-sm text-white/55 font-mono tracking-wide animate-fade-in"
              style={{ animationDelay: `${i * 0.06 + 0.1}s` }}
            >
              {block}
            </li>
          ))}
        </ul>
        <div className="px-8 py-5 border-t border-white/[0.07]">
          <p className="text-xs text-white/22 tracking-[0.06em]">{plan.closingLine}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saved}
        className="w-full py-3 border border-white/[0.09] rounded-xl text-sm font-medium tracking-wide transition-all duration-150 disabled:cursor-default"
        style={{
          color: saved ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.5)",
          background: saved ? "rgba(255,255,255,0.02)" : "transparent",
        }}
      >
        {saved ? "log saved" : "save today's log"}
      </button>
    </div>
  );
}
