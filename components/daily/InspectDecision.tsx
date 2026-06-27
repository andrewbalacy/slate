"use client";

import { useState } from "react";
import { deriveInspectData } from "@/lib/inspectDecision";
import type { SlateInput } from "@/types/slate";

export function InspectDecision({ input }: { input: SlateInput }) {
  const [open, setOpen] = useState(false);
  const data = deriveInspectData(input);

  return (
    <div
      className="rounded-2xl border border-white/[0.07] overflow-hidden"
      style={{ background: "rgba(255,255,255,0.012)" }}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-7 py-5 flex items-center justify-between group"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm font-medium text-white/60 group-hover:text-white/85 transition-colors duration-150">
            Inspect Decision
          </span>
          <span className="text-[9px] tracking-[0.16em] uppercase text-white/20">
            View execution analysis
          </span>
        </div>
        <span
          className="text-white/20 text-[10px] font-mono transition-all duration-300 group-hover:text-white/40"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}
        >
          →
        </span>
      </button>

      {open && (
        <div className="border-t border-white/[0.06] animate-fade-in">

          {/* 1. Decision Analysis */}
          {data.limitingFactor && (
            <section className="px-7 py-5 border-b border-white/[0.04]">
              <p className="text-[8px] font-medium tracking-[0.22em] uppercase text-white/18 mb-4">Decision Analysis</p>
              <p className="text-[8px] font-medium tracking-[0.16em] uppercase text-white/25 mb-1.5">Primary Limiting Factor</p>
              <p className="text-sm font-medium text-white/72 mb-2">{data.limitingFactor.label}</p>
              <p className="text-[11px] text-white/32 leading-relaxed">{data.limitingFactor.explanation}</p>
            </section>
          )}

          {/* 2. Positive Signals */}
          {data.positiveSignals.length > 0 && (
            <section className="px-7 py-5 border-b border-white/[0.04]">
              <p className="text-[8px] font-medium tracking-[0.22em] uppercase text-white/18 mb-4">Positive Signals</p>
              <ul className="flex flex-col gap-2">
                {data.positiveSignals.map((sig, i) => (
                  <li key={i} className="text-[11px]" style={{ color: "rgba(134,239,172,0.6)" }}>
                    {sig}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 3. Constraints */}
          {data.constraints.length > 0 && (
            <section className="px-7 py-5 border-b border-white/[0.04]">
              <p className="text-[8px] font-medium tracking-[0.22em] uppercase text-white/18 mb-4">Constraints</p>
              <ul className="flex flex-col gap-2">
                {data.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-white/35">
                    <span className="text-white/18 shrink-0 mt-px">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 4. Tradeoff Analysis */}
          <section className="px-7 py-5 border-b border-white/[0.04]">
            <p className="text-[8px] font-medium tracking-[0.22em] uppercase text-white/18 mb-4">Tradeoff Analysis</p>
            <div className="grid grid-cols-2 gap-3">
              <div
                className="flex flex-col gap-3 p-4 rounded-xl border border-white/[0.09]"
                style={{ background: "rgba(255,255,255,0.022)" }}
              >
                <p className="text-[8px] font-medium tracking-[0.16em] uppercase text-white/32">Current Recommendation</p>
                <div>
                  <p className="text-[8px] tracking-[0.12em] uppercase text-white/20 mb-1">Completion Probability</p>
                  <p className="text-2xl font-semibold font-mono text-white/80">{data.tradeoff.current.probability}%</p>
                </div>
                <div>
                  <p className="text-[8px] tracking-[0.12em] uppercase text-white/20 mb-1">Recovery Risk</p>
                  <p className="text-xs font-medium text-white/55">{data.tradeoff.current.recoveryRisk}</p>
                </div>
              </div>
              <div
                className="flex flex-col gap-3 p-4 rounded-xl border border-white/[0.05]"
                style={{ background: "rgba(255,255,255,0.008)" }}
              >
                <p className="text-[8px] font-medium tracking-[0.16em] uppercase text-white/18">Everything Planned</p>
                <div>
                  <p className="text-[8px] tracking-[0.12em] uppercase text-white/14 mb-1">Completion Probability</p>
                  <p className="text-2xl font-semibold font-mono text-white/28">{data.tradeoff.everything.probability}%</p>
                </div>
                <div>
                  <p className="text-[8px] tracking-[0.12em] uppercase text-white/14 mb-1">Recovery Risk</p>
                  <p className="text-xs font-medium text-white/25">{data.tradeoff.everything.recoveryRisk}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. System Rationale */}
          <section className="px-7 py-5 border-b border-white/[0.04]">
            <p className="text-[8px] font-medium tracking-[0.22em] uppercase text-white/18 mb-4">System Rationale</p>
            <p className="text-[8px] font-medium tracking-[0.16em] uppercase text-white/22 mb-2.5">Optimization Priorities</p>
            <ul className="flex flex-col gap-1.5 mb-4">
              {data.optimizationPriorities.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-[11px] text-white/42">
                  <span className="font-mono text-white/28 text-[10px]">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-white/25 leading-relaxed">
              Slate intentionally favors consistent execution over maximum output. Sustainable throughput outperforms peak effort followed by recovery debt.
            </p>
          </section>

          {/* 6. Recommendation Confidence */}
          <section className="px-7 py-5 border-b border-white/[0.04]">
            <p className="text-[8px] font-medium tracking-[0.22em] uppercase text-white/18 mb-4">Recommendation Confidence</p>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${data.confidence}%`, background: "rgba(255,255,255,0.32)" }}
                />
              </div>
              <span className="text-sm font-semibold font-mono text-white/55 shrink-0">{data.confidence}%</span>
            </div>
            <p className="text-[10px] text-white/22 leading-relaxed">
              Confidence reflects the completeness and consistency of today's inputs.
            </p>
          </section>

          {/* 7. Adaptive Opportunity */}
          {data.adaptiveOpportunity && (
            <section className="px-7 py-5 border-b border-white/[0.04]">
              <p className="text-[8px] font-medium tracking-[0.22em] uppercase text-white/18 mb-4">Adaptive Opportunity</p>
              <p className="text-[11px] text-white/32 leading-relaxed">{data.adaptiveOpportunity}</p>
            </section>
          )}

          {/* 8. Tomorrow Projection */}
          <section className="px-7 py-5">
            <p className="text-[8px] font-medium tracking-[0.22em] uppercase text-white/18 mb-4">Tomorrow Projection</p>
            <div className="flex gap-8 mb-3">
              <div>
                <p className="text-[8px] tracking-[0.14em] uppercase text-white/20 mb-1.5">Recovery Risk</p>
                <p className="text-sm font-semibold font-mono text-white/62">{data.tomorrowProjection.recoveryRisk}</p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.14em] uppercase text-white/20 mb-1.5">Projected Capacity</p>
                <p className="text-sm font-semibold font-mono text-white/62">{data.tomorrowProjection.projectedCapacity} / 10</p>
              </div>
            </div>
            <p className="text-[10px] text-white/25 leading-relaxed">{data.tomorrowProjection.explanation}</p>
          </section>

        </div>
      )}
    </div>
  );
}
