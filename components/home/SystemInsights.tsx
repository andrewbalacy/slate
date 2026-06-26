import { panel } from "./helpers";
import type { HealthScore } from "@/lib/insights";

type InsightsData = {
  total: number;
  avgEnergy: number;
  workDays: number;
  trainingDays: number;
  topConstraint: string | null;
} | null;

export default function SystemInsights({
  insights,
  healthScore,
}: {
  insights: InsightsData;
  healthScore: HealthScore | null;
}) {
  return (
    <div className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden" style={panel}>
      <div className="px-5 py-3.5 border-b border-white/[0.06]">
        <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">system insights</p>
      </div>
      {!insights ? (
        <div className="px-5 py-5">
          <p className="text-[11px] text-white/18 italic">No execution memory yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.05]">
            {[
              { label: "logged",     value: String(insights.total) },
              { label: "avg energy", value: insights.avgEnergy.toFixed(1) },
              { label: "work days",  value: String(insights.workDays) },
              { label: "training",   value: String(insights.trainingDays) },
            ].map(({ label, value }) => (
              <div key={label} className="px-5 py-3.5 flex flex-col gap-0.5">
                <p className="text-[8px] font-medium tracking-[0.14em] uppercase text-white/20">{label}</p>
                <p className="text-lg font-semibold tracking-tight text-white/65 font-mono">{value}</p>
              </div>
            ))}
          </div>
          {insights.topConstraint && (
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
              <p className="text-[8px] font-medium tracking-[0.14em] uppercase text-white/20">top constraint</p>
              <p className="text-xs font-mono text-white/38">{insights.topConstraint}</p>
            </div>
          )}

          <div className="border-t border-white/[0.08]">
            <div className="px-5 py-3 border-b border-white/[0.05]">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">execution health</p>
            </div>

            {healthScore ? (
              <div className="px-5 pt-5 pb-5 flex flex-col gap-4">
                <div className="flex items-end justify-between">
                  <span className="text-5xl font-semibold tracking-tight text-white/80 font-mono leading-none">
                    {healthScore.score}
                  </span>
                  <div className="flex flex-col items-end gap-1 pb-0.5">
                    <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/40">
                      {healthScore.label}
                    </span>
                    <span className="text-[9px] text-white/22 text-right leading-snug max-w-[130px]">
                      {healthScore.explanation}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-1 border-t border-white/[0.05]">
                  {healthScore.factors.map((f) => (
                    <p key={f} className="text-[9px] font-mono text-white/22 leading-relaxed">· {f}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-5 py-5">
                <p className="text-[10px] font-mono text-white/18">3+ sessions required</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
