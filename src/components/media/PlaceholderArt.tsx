import type { PlaceholderMotif } from "@/content/schema";

/**
 * Deterministic, engineering-themed placeholder artwork. Used for covers and
 * figures until real media is uploaded. Pure SVG: no network, no layout shift.
 */

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const W = 800;
const H = 500;

function Logic({ r }: { r: () => number }) {
  const gates = Array.from({ length: 9 }, (_, i) => ({
    x: 90 + (i % 3) * 230 + r() * 30,
    y: 90 + Math.floor(i / 3) * 140 + r() * 20,
  }));
  return (
    <g fill="none" strokeWidth={2}>
      {gates.map((g, i) => {
        const n = gates[(i + 4) % gates.length];
        return (
          <path
            key={`w${i}`}
            d={`M${g.x + 70} ${g.y + 25} H${(g.x + n.x) / 2 + 40} V${n.y + 15} H${n.x}`}
            stroke="var(--pa-b)"
            strokeOpacity={0.55}
          />
        );
      })}
      {gates.map((g, i) => (
        <path
          key={`g${i}`}
          d={`M${g.x} ${g.y} h35 a25 25 0 0 1 0 50 h-35 z`}
          stroke={i === 4 ? "var(--pa-c)" : "var(--pa-a)"}
          fill="rgb(4 8 18 / 0.6)"
        />
      ))}
    </g>
  );
}

function Waveform({ r }: { r: () => number }) {
  const rows = 5;
  return (
    <g fill="none" strokeWidth={2}>
      {Array.from({ length: rows }, (_, row) => {
        const y = 70 + row * 85;
        let d = `M40 ${y + 30}`;
        let hi = false;
        for (let x = 40; x < W - 40; ) {
          const step = row === 0 ? 40 : 40 * (1 + Math.floor(r() * 4));
          const nx = Math.min(x + step, W - 40);
          d += ` H${nx}`;
          if (nx < W - 40) {
            hi = !hi;
            d += ` V${hi ? y : y + 30}`;
          }
          x = nx;
        }
        return (
          <g key={row}>
            <line x1={40} x2={W - 40} y1={y + 45} y2={y + 45} stroke="var(--pa-b)" strokeOpacity={0.15} />
            <path d={d} stroke={row === 0 ? "var(--pa-b)" : row === 3 ? "var(--pa-c)" : "var(--pa-a)"} />
          </g>
        );
      })}
    </g>
  );
}

function Schematic({ r }: { r: () => number }) {
  const zig = (x: number, y: number) =>
    `M${x} ${y} h20 l8 -14 l16 28 l16 -28 l16 28 l16 -28 l8 14 h20`;
  return (
    <g fill="none" strokeWidth={2} stroke="var(--pa-a)">
      <path d="M80 80 H720 M80 420 H720" stroke="var(--pa-b)" strokeOpacity={0.6} />
      {[180, 400, 620].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 80 V150`} />
          <path d={zig(x - 60, 170 + r() * 10)} transform={`rotate(90 ${x} 170)`} />
          <path d={`M${x} 290 V320 M${x - 30} 320 H${x + 30} M${x - 30} 330 V370 M${x} 345 h40 M${x} 370 V420`} stroke={i === 1 ? "var(--pa-c)" : "var(--pa-a)"} />
          <circle cx={x} cy={80} r={4} fill="var(--pa-b)" stroke="none" />
          <circle cx={x} cy={420} r={4} fill="var(--pa-b)" stroke="none" />
        </g>
      ))}
    </g>
  );
}

function Die({ r }: { r: () => number }) {
  const cells = [];
  for (let y = 90; y < 410; y += 40) {
    let x = 110;
    while (x < 690) {
      const w = 30 + Math.floor(r() * 5) * 20;
      const ww = Math.min(w, 690 - x);
      cells.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={ww - 6} height={32} rx={2} fill={r() > 0.93 ? "var(--pa-c)" : "var(--pa-a)"} fillOpacity={r() * 0.25 + 0.08} stroke="var(--pa-a)" strokeOpacity={0.35} />,
      );
      x += ww;
    }
  }
  return (
    <g>
      <rect x={90} y={70} width={620} height={360} fill="none" stroke="var(--pa-b)" strokeOpacity={0.5} strokeWidth={2} />
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i} fill="var(--pa-b)" fillOpacity={0.4}>
          <rect x={110 + i * 42} y={40} width={22} height={18} />
          <rect x={110 + i * 42} y={442} width={22} height={18} />
        </g>
      ))}
      {cells}
    </g>
  );
}

function Plot({ r }: { r: () => number }) {
  const a = 0.6 + r() * 0.6;
  const curve = (k: number) =>
    Array.from({ length: 60 }, (_, i) => {
      const x = 90 + i * 10.5;
      const t = i / 59;
      const y = 400 - 300 * (1 / (1 + Math.exp(-(t - 0.45 - k * 0.08) * 12 * a)));
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
  return (
    <g fill="none" strokeWidth={2}>
      <path d="M90 60 V400 H730" stroke="var(--pa-b)" strokeOpacity={0.6} />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={90} x2={730} y1={400 - i * 60} y2={400 - i * 60} stroke="var(--pa-b)" strokeOpacity={0.1} />
      ))}
      {[0, 1, 2].map((k) => (
        <path key={k} d={curve(k)} stroke={k === 1 ? "var(--pa-c)" : "var(--pa-a)"} strokeOpacity={k === 1 ? 1 : 0.7} />
      ))}
    </g>
  );
}

function Blocks({ r }: { r: () => number }) {
  const boxes = [
    { x: 70, y: 200, w: 130, label: "IN" },
    { x: 260, y: 110, w: 150, label: "CTRL" },
    { x: 260, y: 290, w: 150, label: "DATAPATH" },
    { x: 470, y: 200, w: 130, label: "MEM" },
    { x: 650, y: 200, w: 90, label: "OUT" },
  ];
  void r;
  return (
    <g fill="none" strokeWidth={2}>
      <path d="M200 230 H230 V140 H260 M230 230 V320 H260 M410 140 H440 V230 H470 M410 320 H440 V230 M600 230 H650" stroke="var(--pa-b)" strokeOpacity={0.7} />
      {boxes.map((b, i) => (
        <g key={b.label}>
          <rect x={b.x} y={b.y} width={b.w} height={60} rx={8} fill="rgb(4 8 18 / 0.6)" stroke={i === 2 ? "var(--pa-c)" : "var(--pa-a)"} />
          <text x={b.x + b.w / 2} y={b.y + 36} textAnchor="middle" fill="var(--pa-a)" fontSize={14} fontFamily="var(--font-mono)" letterSpacing={2}>
            {b.label}
          </text>
        </g>
      ))}
    </g>
  );
}

const MOTIFS: Record<PlaceholderMotif, (p: { r: () => number }) => React.ReactElement> = {
  logic: Logic,
  waveform: Waveform,
  schematic: Schematic,
  die: Die,
  plot: Plot,
  block: Blocks,
};

export function PlaceholderArt({
  motif,
  hue = 0,
  variant = "cover",
  label = true,
  className,
}: {
  motif: PlaceholderMotif;
  hue?: number;
  variant?: "cover" | "figure";
  label?: boolean;
  className?: string;
}) {
  const Motif = MOTIFS[motif];
  const seed = motif.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 7) + hue * 13;
  const gid = `pa-${motif}-${hue}-${variant}`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={
        {
          "--pa-a": "#5ea8ff",
          "--pa-b": "#00d3fb",
          "--pa-c": "#83fd80",
          filter: hue ? `hue-rotate(${hue}deg)` : undefined,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={variant === "cover" ? "#0a2f78" : "#0b1426"} />
          <stop offset="0.55" stopColor={variant === "cover" ? "#071634" : "#080f1d"} />
          <stop offset="1" stopColor="#040812" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${gid})`} />
      <Motif r={rng(seed)} />
      {label && (
        <text x={W - 24} y={H - 22} textAnchor="end" fill="#ffd27a" fillOpacity={0.75} fontSize={13} fontFamily="var(--font-mono)" letterSpacing={3}>
          PLACEHOLDER
        </text>
      )}
    </svg>
  );
}
