import { AlertTriangle, RefreshCw } from "lucide-react";

export type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

export const ErrorState = ({
  title = "Algo salió mal",
  description = "No pudimos cargar la información. Intentalo de nuevo.",
  onRetry,
  className = "",
}: ErrorStateProps) => (
  <div
    role="alert"
    className={`flex flex-col items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-10 text-center backdrop-blur-xl ${className}`}
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15">
      <AlertTriangle size={22} className="text-red-400" />
    </div>
    <p className="mt-3 font-medium text-slate-100">{title}</p>
    <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
      >
        <RefreshCw size={16} />
        Reintentar
      </button>
    )}
  </div>
);

export default ErrorState;
