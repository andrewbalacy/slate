import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center gap-20">
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-white">
            slate.
          </h1>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30">
            fatigue-aware execution engine
          </p>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-white/40">reduce friction.</p>
            <p className="text-sm text-white/40">execute consistently.</p>
          </div>
        </div>

        <div className="flex flex-row gap-3">
          <Link
            href="/daily"
            className="px-6 py-2.5 bg-white text-black text-sm font-medium tracking-wide hover:bg-white/90 transition-colors duration-150"
          >
            Daily Execution
          </Link>
          <Link
            href="/architecture"
            className="px-6 py-2.5 text-white/60 text-sm font-medium tracking-wide border border-white/10 hover:border-white/30 hover:text-white/80 transition-colors duration-150"
          >
            Architecture
          </Link>
        </div>
      </div>
    </main>
  );
}
