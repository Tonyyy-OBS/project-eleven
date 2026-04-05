import { COLORS } from '@/lib/gameData';

interface AvatarProps {
  c?: number; h?: number; o?: number; e?: number;
  size?: number;
  className?: string;
}

function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (n >> 16) + amount);
  const g = Math.min(255, ((n >> 8) & 255) + amount);
  const b = Math.min(255, (n & 255) + amount);
  return `rgb(${r},${g},${b})`;
}

export default function Avatar({ c = 0, h = 0, o = 0, e = 0, size = 80, className = '' }: AvatarProps) {
  const col = COLORS[c] || COLORS[0];
  const light = lighten(col, 55);

  const HAIR_PATHS = [
    <path key="h0" d="M28 52 Q28 22 50 20 Q72 22 72 52 Q65 38 50 36 Q35 38 28 52Z" fill="#2d1b0e" />,
    <><path d="M26 54 Q26 20 50 18 Q74 20 74 52 Q66 38 50 36 Q34 38 26 54Z" fill="#111" /><path d="M26 54 Q28 40 42 34 Q28 28 30 18 Q42 12 56 16 Q72 20 74 52 Q66 38 50 36 Q40 38 26 54Z" fill="#1c1c1c" /></>,
    <polygon points="36,50 40,27 44,18 47,31 50,11 53,31 56,18 60,27 64,50" fill="#cc2200" stroke="#aa1100" strokeWidth="1" />,
    <><ellipse cx="50" cy="30" rx="30" ry="24" fill="#3d2211" /><ellipse cx="50" cy="32" rx="26" ry="20" fill="#4a2c18" /></>,
    <><rect x="26" y="22" width="48" height="20" rx="10" fill="#37474f" /><rect x="13" y="28" width="14" height="16" rx="7" fill="#37474f" /><rect x="73" y="28" width="14" height="16" rx="7" fill="#37474f" /><ellipse cx="50" cy="19" rx="9" ry="5" fill="#00e5ff" opacity="0.88" /></>,
  ];

  const OUTFIT_PATHS = [
    <><path d="M24 82 C24 74 32 70 40 70 L60 70 C68 70 76 74 76 82 L80 116 L20 116Z" fill={col} /><path d="M36 70 L50 76 L64 70 L63 82 L50 78 L37 82Z" fill="rgba(0,0,0,.13)" /></>,
    <><path d="M24 82 C24 74 32 70 40 70 L60 70 C68 70 76 74 76 82 L80 116 L20 116Z" fill="#e53935" /><path d="M20 88 L80 88 L80 95 L20 95Z" fill="#b71c1c" /><path d="M36 70 L50 76 L64 70 L63 80 L50 77 L37 80Z" fill="rgba(255,255,255,.18)" /></>,
    <><path d="M24 82 C24 74 32 70 40 70 L60 70 C68 70 76 74 76 82 L80 116 L20 116Z" fill="#eceff1" /><path d="M32 70 L36 70 L36 116 L20 116 L24 82 C24 74 28 70 32 70Z" fill="white" /><path d="M68 70 L64 70 L64 116 L80 116 L76 82 C76 74 72 70 68 70Z" fill="white" /><rect x="45" y="76" width="10" height="16" rx="2" fill="#1565c0" opacity="0.55" /><circle cx="37" cy="78" r="3" fill="#1565c0" /></>,
    <><path d="M24 82 C24 74 32 70 40 70 L60 70 C68 70 76 74 76 82 L80 116 L20 116Z" fill="#1a1a2e" /><path d="M20 86 L80 86 L80 92 L20 92Z" fill="#e53935" /><path d="M49 70 L49 116 L51 116 L51 70Z" fill="rgba(255,255,255,.07)" /></>,
    <><path d="M24 82 C24 74 32 70 40 70 L60 70 C68 70 76 74 76 82 L80 116 L20 116Z" fill="#455a64" /><path d="M36 70 L50 76 L64 70 L63 82 L50 78 L37 82Z" fill="#90a4ae" /><circle cx="50" cy="93" r="10" fill="none" stroke="#00e5ff" strokeWidth="1.5" /><rect x="28" y="87" width="8" height="8" rx="2" fill="#00e5ff" opacity="0.75" /><rect x="64" y="87" width="8" height="8" rx="2" fill="#00e5ff" opacity="0.75" /></>,
  ];

  const EYES_PATHS = [
    <><circle cx="42" cy="50" r="5" fill="white" /><circle cx="58" cy="50" r="5" fill="white" /><circle cx="42" cy="51" r="3" fill="#0d1117" /><circle cx="58" cy="51" r="3" fill="#0d1117" /><circle cx="43" cy="49" r="1.1" fill="white" /><circle cx="59" cy="49" r="1.1" fill="white" /></>,
    <><circle cx="42" cy="50" r="6.5" fill="white" /><circle cx="58" cy="50" r="6.5" fill="white" /><circle cx="42" cy="51" r="4.5" fill="#1976d2" /><circle cx="58" cy="51" r="4.5" fill="#1976d2" /><circle cx="42" cy="51" r="2.2" fill="#0d1117" /><circle cx="58" cy="51" r="2.2" fill="#0d1117" /><circle cx="43" cy="49" r="1.3" fill="white" /><circle cx="59" cy="49" r="1.3" fill="white" /></>,
    <><circle cx="42" cy="52" r="5" fill="white" /><circle cx="58" cy="52" r="5" fill="white" /><ellipse cx="42" cy="53" rx="4" ry="2.2" fill="#0d1117" /><ellipse cx="58" cy="53" rx="4" ry="2.2" fill="#0d1117" /><rect x="37" y="47" width="10" height="5" rx="1" fill={col} opacity="0.7" /><rect x="53" y="47" width="10" height="5" rx="1" fill={col} opacity="0.7" /></>,
    <><text x="32" y="59" fontSize="15" fill="#f59e0b" fontFamily="serif">★</text><text x="50" y="59" fontSize="15" fill="#f59e0b" fontFamily="serif">★</text></>,
  ];

  const hi = Math.min(h, HAIR_PATHS.length - 1);
  const oi = Math.min(o, OUTFIT_PATHS.length - 1);
  const ei = Math.min(e, EYES_PATHS.length - 1);
  const asp = 116;

  return (
    <svg
      className={className}
      viewBox={`0 0 100 ${asp}`}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={Math.round(size * asp / 100)}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <ellipse cx="50" cy="113" rx="27" ry="4" fill="rgba(0,0,0,.2)" />
      {OUTFIT_PATHS[oi]}
      <rect x="44" y="68" width="12" height="10" rx="5" fill={col} />
      <circle cx="50" cy="48" r="26" fill={col} />
      <ellipse cx="50" cy="53" rx="19" ry="17" fill={light} opacity="0.2" />
      {EYES_PATHS[ei]}
      <path d="M43 63 Q50 69 57 63" stroke="rgba(0,0,0,.26)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="33" cy="57" rx="5.5" ry="3" fill="rgba(255,100,100,.2)" />
      <ellipse cx="67" cy="57" rx="5.5" ry="3" fill="rgba(255,100,100,.2)" />
      {HAIR_PATHS[hi]}
    </svg>
  );
}
