"use client";

import { useToastStore } from "@/store/useToastStore";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl border p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in min-w-[300px]
            ${toast.type === "success" ? "bg-emerald-50/90 border-emerald-200/50 dark:bg-emerald-950/80 dark:border-emerald-800/50" : ""}
            ${toast.type === "error" ? "bg-red-50/90 border-red-200/50 dark:bg-red-950/80 dark:border-red-800/50" : ""}
            ${!toast.type || toast.type === "info" ? "bg-white/90 border-gray-200/50 dark:bg-gray-900/90 dark:border-gray-800/50" : ""}
          `}
        >
          {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />}
          {toast.type === "error" && <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />}
          {(!toast.type || toast.type === "info") && <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
          
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex-1">{toast.message}</p>
          
          <button 
            onClick={() => removeToast(toast.id)} 
            className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
