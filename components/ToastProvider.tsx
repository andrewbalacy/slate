"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// ── types ─────────────────────────────────────────────────────────────────────

type ToastEntry = { id: string; message: string };

type ToastContextValue = { toast: (message: string) => void };

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

// ── single toast ──────────────────────────────────────────────────────────────

function ToastItem({ message, onDone }: { message: string; onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), 2600);
    const t2 = setTimeout(() => onDoneRef.current(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        background: "linear-gradient(160deg, rgba(22,22,22,0.96) 0%, rgba(12,12,12,0.96) 100%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        padding: "10px 16px",
        minWidth: "200px",
        maxWidth: "320px",
        pointerEvents: "none" as const,
      }}
    >
      <p className="text-xs font-medium text-white/60 tracking-wide">{message}</p>
    </div>
  );
}

// ── provider ──────────────────────────────────────────────────────────────────

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const toast = useCallback((message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message }]);
  }, []);

  function remove(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div
        className="fixed bottom-6 right-6 z-[200] flex flex-col-reverse gap-2 items-end pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map(t => (
          <ToastItem key={t.id} message={t.message} onDone={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
