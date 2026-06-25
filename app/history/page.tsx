import Link from "next/link";

const entries = [
  { period: "Today", energy: "7.2", mode: "Off Day" },
  { period: "Yesterday", energy: "5.7", mode: "Strict Floor" },
];

export default function History() {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white px-6 py-8 flex flex-col overflow-hidden">

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 20%, rgba(255,255,255,0.032) 0%, transparent 70%)",
        }}
      />

      <Link
        href="/"
        className="relative z-10 text-sm font-semibold tracking-tight text-white/40 hover:text-white/70 transition-colors duration-200 w-fit"
      >
        slate.
      </Link>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-14 py-12">

        <div className="flex flex-col items-center text-center gap-3 animate-slide-up">
          <h1 className="text-3xl sm:text-[2.25rem] font-semibold tracking-[-0.02em] text-white/90">
            history
          </h1>
          <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/22">
            execution memory
          </p>
        </div>

        <div
          className="noise relative w-full max-w-md rounded-2xl border border-white/[0.08] overflow-hidden animate-slide-up"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.033) 0%, rgba(255,255,255,0.013) 100%)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.4)",
            animationDelay: "0.07s",
          }}
        >
          {entries.map((entry, i) => (
            <div
              key={entry.period}
              className={`px-8 py-6 flex flex-col gap-3 ${i < entries.length - 1 ? "border-b border-white/[0.06]" : ""}`}
            >
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/28">
                {entry.period}
              </p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30 tracking-wide">energy</span>
                  <span className="text-xs font-mono text-white/55">{entry.energy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30 tracking-wide">mode</span>
                  <span className="text-xs font-mono text-white/55">{entry.mode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30 tracking-wide">status</span>
                  <span className="text-xs font-mono text-white/35">plan generated</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="text-xs text-white/22 hover:text-white/50 transition-colors duration-200 tracking-wide animate-slide-up"
          style={{ animationDelay: "0.14s" }}
        >
          ← back
        </Link>
      </div>
    </main>
  );
}
