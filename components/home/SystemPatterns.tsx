import type { Pattern } from "@/lib/patterns";
import { panel } from "./helpers";

export default function SystemPatterns({ patterns }: { patterns: Pattern[] }) {
  if (patterns.length === 0) return null;

  return (
    <div className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden" style={panel}>
      <div className="px-5 py-3.5 border-b border-white/[0.06]">
        <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">system patterns</p>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {patterns.map((p) => (
          <div key={p.title} className="px-5 py-3.5 flex flex-col gap-1.5">
            <p className="text-[8px] font-medium tracking-[0.14em] uppercase text-white/20">{p.title}</p>
            <p className="text-[10px] text-white/38 leading-snug">{p.explanation}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
              {p.values.map(({ label, value }) => (
                <span key={label} className="text-[9px] font-mono">
                  <span className="text-white/18">{label} </span>
                  <span className="text-white/45">{value}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
