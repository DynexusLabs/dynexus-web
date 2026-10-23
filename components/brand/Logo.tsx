import { useId } from "react";
import { HEX, HUB, NODES } from "./logo-geometry";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  const id = useId();
  const g = `url(#${id})`;
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7f5af0" />
          <stop offset="1" stopColor="#00d9ff" />
        </linearGradient>
      </defs>
      <polygon points={HEX} fill="none" stroke={g} strokeWidth="2" strokeLinejoin="round" />
      {NODES.map((n) => (
        <line
          key={`l${n.x}`}
          x1={HUB.x}
          y1={HUB.y}
          x2={n.x}
          y2={n.y}
          stroke={g}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ))}
      {NODES.map((n) => (
        <circle key={`c${n.x}`} cx={n.x} cy={n.y} r="2.3" fill={g} />
      ))}
      <circle cx={HUB.x} cy={HUB.y} r="2.8" fill="#fff" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="text-lg font-semibold tracking-[0.18em] text-fg">DYNEXUS</span>
    </span>
  );
}
