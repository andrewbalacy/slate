import { panel } from "./helpers";

type SystemStateData = {
  energy: number;
  capacity: string;
  mode: string;
  recoveryRisk: string;
  recommendation: string;
} | null;

export default function SystemState({ systemState }: { systemState: SystemStateData }) {
  return (
    <div className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden" style={panel}>
      <div className="px-5 py-3.5 border-b border-white/[0.06]">
        <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">system state</p>
      </div>
      {!systemState ? (
        <div className="px-5 py-5">
          <p className="text-[11px] text-white/18 leading-relaxed">No system state yet. Generate and save a daily log.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-white/[0.05]">
          {[
            { label: "energy",         value: String(systemState.energy) },
            { label: "capacity",       value: systemState.capacity },
            { label: "mode",           value: systemState.mode },
            { label: "risk",           value: systemState.recoveryRisk },
            { label: "recommendation", value: systemState.recommendation },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3">
              <span className="text-[9px] font-medium tracking-[0.14em] uppercase text-white/22">{label}</span>
              <span className="text-xs font-mono text-white/55">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
