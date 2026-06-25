import Link from "next/link";

const systemCards = [
  {
    label: "strict floor",
    desc: "Minimum viable execution.",
  },
  {
    label: "adaptive ceiling",
    desc: "Capacity-aware expansion.",
  },
  {
    label: "weekly execution",
    desc: "Consistency over intensity.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center px-6 py-16 overflow-hidden">

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 18%, rgba(255,255,255,0.034) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-14 w-full max-w-lg">

        {/* Title */}
        <div className="flex flex-col items-center gap-4 stagger-1">
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.03em] text-white/92">
            slate.
          </h1>

          {/* Status pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] stagger-2"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="w-1 h-1 rounded-full bg-white/30 inline-block" />
            <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/25">
              system online
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/22 stagger-2">
            fatigue-aware execution engine
          </p>
          <p className="text-[11px] tracking-[0.16em] uppercase text-white/15 stagger-2">
            capacity → rules → execution
          </p>
        </div>

        {/* System cards */}
        <div
          className="noise relative w-full rounded-2xl border border-white/[0.08] overflow-hidden stagger-3"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.033) 0%, rgba(255,255,255,0.013) 100%)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.45)",
          }}
        >
          {systemCards.map((card, i) => (
            <div
              key={card.label}
              className={`px-7 py-5 flex flex-col gap-1 ${i < systemCards.length - 1 ? "border-b border-white/[0.06]" : ""}`}
            >
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">
                {card.label}
              </p>
              <p className="text-sm text-white/38 leading-snug">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-row gap-3 stagger-4">
          <Link
            href="/daily"
            className="px-6 py-2.5 bg-white text-black text-sm font-medium tracking-wide rounded-lg hover:bg-white/90 active:bg-white/80 transition-colors duration-150"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            Daily Execution
          </Link>
          <Link
            href="/architecture"
            className="px-6 py-2.5 text-white/50 text-sm font-medium tracking-wide rounded-lg border border-white/[0.09] hover:border-white/20 hover:text-white/70 transition-colors duration-150"
          >
            Architecture
          </Link>
        </div>

        {/* Footer */}
        <p className="text-[10px] tracking-[0.16em] uppercase text-white/14 stagger-4">
          reduce friction. execute consistently.
        </p>
      </div>
    </main>
  );
}
