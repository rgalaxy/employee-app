import "./toast.css";
import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

export type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastState {
  id: number;
  message: string;
  variant: ToastVariant;
  leaving: boolean;
}

interface ToastContextValue {
  show: (message: string, variant: ToastVariant) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION_MS = 3000;
const LEAVE_MS = 220;

const ICONS: Record<ToastVariant, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "i",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };

  const dismiss = useCallback(() => {
    clearTimers();
    setToast((prev) => (prev ? { ...prev, leaving: true } : null));
    leaveTimer.current = setTimeout(() => setToast(null), LEAVE_MS);
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant) => {
      clearTimers();
      setToast({ id: Date.now(), message, variant, leaving: false });
      dismissTimer.current = setTimeout(dismiss, DURATION_MS);
    },
    [dismiss],
  );

  useEffect(() => clearTimers, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {createPortal(
        <div
          className="toast"
          role="region"
          aria-live="polite"
          aria-label="Notifications"
        >
          {toast && (
            <div
              key={toast.id}
              className={[
                "toast__item",
                `toast__item--${toast.variant}`,
                toast.leaving ? "toast__item--leaving" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="status"
            >
              <i className="toast__icon" aria-hidden="true">
                {ICONS[toast.variant]}
              </i>
              <span className="toast__message">{toast.message}</span>
              <button
                className="toast__close"
                onClick={dismiss}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          )}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
