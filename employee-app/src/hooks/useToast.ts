import { useContext } from "react";
import { ToastContext } from "../components/Toast/toast";

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>");

  const { show } = ctx;
  return {
    toast: {
      success: (message: string) => show(message, "success"),
      error: (message: string) => show(message, "error"),
      info: (message: string) => show(message, "info"),
      warning: (message: string) => show(message, "warning"),
    },
  };
}
