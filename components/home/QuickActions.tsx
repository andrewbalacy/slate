import Link from "next/link";
import { panel } from "./helpers";

const quickActions = [
  { href: "/daily",        label: "Daily Execution" },
  { href: "/logs",         label: "Logs" },
  { href: "/architecture", label: "Architecture" },
];

export default function QuickActions() {
  return (
    <div
      className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden"
      style={panel}
    >
      <div className="px-6 py-3 border-b border-white/[0.06]">
        <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/22">quick actions</p>
      </div>
      {quickActions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="cmd-module group relative flex items-center justify-between px-6 py-3.5 border-b border-white/[0.05] last:border-b-0"
        >
          <span className="cmd-edge absolute left-0 top-1/2 -translate-y-1/2 w-px h-0 bg-white/35 transition-all duration-150 group-hover:h-6" />
          <span className="text-sm font-medium text-white/52 group-hover:text-white/85 transition-colors duration-150 pl-1">
            {action.label}
          </span>
          <span className="text-white/18 group-hover:text-white/42 text-xs font-mono transition-all duration-150 group-hover:translate-x-0.5">→</span>
        </Link>
      ))}
    </div>
  );
}
