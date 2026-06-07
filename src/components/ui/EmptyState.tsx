import type { LucideIcon } from "lucide-react";

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
};

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  className = "",
}: EmptyStateProps) => (
  <div
    className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center backdrop-blur-xl ${className}`}
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
      <Icon size={22} className="text-cyan-400" />
    </div>
    <p className="mt-3 font-medium text-slate-200">{title}</p>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>
    )}
  </div>
);

export default EmptyState;
