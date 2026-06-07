export type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={`relative overflow-hidden rounded-md bg-white/5 ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
  </div>
);

export default Skeleton;
