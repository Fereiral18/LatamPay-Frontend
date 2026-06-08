import { useId } from "react";

export type SpinnerProps = {
  size?: number;
  className?: string;
  label?: string;
};

export const Spinner = ({
  size = 18,
  className = "",
  label = "Cargando",
}: SpinnerProps) => {
  // useId garantiza un id único por instancia: si hay más de un spinner
  // en la página, sus gradientes no se pisan entre sí en el DOM.
  const gradientId = `spinner-gradient-${useId()}`;

  return (
    <svg
      role="status"
      aria-label={label}
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      className={`animate-spin ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset=".55" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <path
        d="M 31.89 62.49 A 51.2 51.2 0 0 1 128.69 64.18"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M 135.37 84.72 L 142.94 53.66 L 110.99 64.04 Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M 128.11 97.51 A 51.2 51.2 0 0 1 31.31 95.82"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M 24.63 75.28 L 17.06 106.34 L 49.01 95.96 Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};

export default Spinner;
