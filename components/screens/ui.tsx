import type { ReactNode } from 'react';

/** Small presentational helpers shared by every mock screen. Visual only. */

export function PageHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="atlas-pagehead">
      <h1 className="atlas-h1">{title}</h1>
      {sub && <p className="atlas-sub">{sub}</p>}
    </div>
  );
}

export function Tile({ children, spot, className, accent }: { children: ReactNode; spot?: string; className?: string; accent?: boolean }) {
  return (
    <div className={`sbx-tile${accent ? ' sbx-tile--accent' : ''}${className ? ` ${className}` : ''}`} data-spot={spot}>
      {children}
    </div>
  );
}

const SWATCHES = ['#1C4C78', '#4C1D95', '#348DDE', '#1F7A4D', '#8A5A12', '#BE1A4E'];
export function Logo({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const color = SWATCHES[name.length % SWATCHES.length];
  return (
    <span className="sbx-logo" style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}>
      {initials}
    </span>
  );
}

export function Chip({ children, tone }: { children: ReactNode; tone?: 'ok' | 'accent' | 'muted' }) {
  return <span className={`sbx-chip${tone ? ` sbx-chip--${tone}` : ''}`}>{children}</span>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="atlas-eyebrow sbx-eyebrow">{children}</div>;
}

export function Meter({ value, label }: { value: number; label?: string }) {
  return (
    <div className="sbx-meter">
      <div className="sbx-meter__bar"><span style={{ width: `${value}%` }} /></div>
      {label && <span className="sbx-meter__label">{label}</span>}
    </div>
  );
}
