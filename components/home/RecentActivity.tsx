import type { SlateLog } from "@/types/logs";
import { panel } from "./helpers";

export default function RecentActivity({ recent }: { recent: SlateLog[] }) {
  return (
    <div className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden" style={panel}>
      <div className="px-5 py-3.5 border-b border-white/[0.06]">
        <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">recent activity</p>
      </div>
      {recent.length === 0 ? (
        <div className="px-5 py-5">
          <p className="text-[11px] text-white/18 italic">No recent logs.</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-white/[0.05]">
          {recent.map((log) => (
            <li key={log.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-[10px] font-medium text-white/45 truncate">{log.input.date} · {log.input.day}</p>
                <p className="text-[9px] font-mono text-white/22">{log.input.workToday === "yes" ? "Execution" : "Recovery"}</p>
              </div>
              <span className="text-xs font-mono text-white/38 shrink-0 ml-3">{log.input.energy}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
