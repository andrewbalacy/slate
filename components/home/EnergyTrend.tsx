import { memo } from "react";
import type { SlateLog } from "@/types/logs";
import { panel } from "./helpers";

const MiniEnergyChart = memo(function MiniEnergyChart({ logs }: { logs: SlateLog[] }) {
  const pts = [...logs].reverse().slice(0, 7);
  if (pts.length < 2) return (
    <p className="px-5 py-4 text-[10px] text-white/18 italic">Not enough data.</p>
  );
  const W = 260; const H = 52; const PY = 4;
  const plotH = H - PY * 2;
  const points = pts.map((l, i) => ({
    x: (i / (pts.length - 1)) * W,
    y: PY + plotH - ((l.input.energy - 1) / 9) * plotH,
    label: l.input.date.slice(5),
  }));
  const poly = points.map(p => `${p.x},${p.y}`).join(" ");
  const area = [`M ${points[0].x},${H}`, ...points.map(p => `L ${p.x},${p.y}`), `L ${points[points.length - 1].x},${H}`, "Z"].join(" ");
  return (
    <div className="px-5 pb-4 pt-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 52 }} preserveAspectRatio="none">
        <path d={area} fill="rgba(255,255,255,0.025)" />
        <polyline points={poly} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2" fill="#080808" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />)}
      </svg>
      <div className="flex justify-between mt-1">
        {points.map((p, i) => <span key={i} className="text-[8px] font-mono text-white/16" style={{ width: `${100 / points.length}%`, textAlign: "center" }}>{p.label}</span>)}
      </div>
    </div>
  );
});

export default function EnergyTrend({ logs }: { logs: SlateLog[] }) {
  return (
    <div className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden" style={panel}>
      <div className="px-5 py-3.5 border-b border-white/[0.06]">
        <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">energy trend</p>
      </div>
      <MiniEnergyChart logs={logs} />
    </div>
  );
}
