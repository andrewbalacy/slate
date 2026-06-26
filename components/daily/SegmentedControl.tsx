"use client";

export function SegmentedControl<T extends string>({
  id, options, value, onChange,
}: {
  id: string;
  options: { label: string; value: T }[];
  value: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-labelledby={id} className="flex rounded-lg border border-white/[0.09] overflow-hidden">
      {options.map((opt, i) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className="flex-1 py-2.5 text-sm font-medium tracking-wide transition-all duration-150"
            style={{
              background: active
                ? "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)"
                : "transparent",
              color: active ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.28)",
              borderRight: i < options.length - 1 ? "1px solid rgba(255,255,255,0.09)" : "none",
              boxShadow: active ? "0 1px 0 rgba(255,255,255,0.06) inset" : "none",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
