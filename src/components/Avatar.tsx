import { HAIR_COLORS, SKIN_TONES } from '@/lib/gameData';
import { AvatarConfig } from '@/lib/gameStore';

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

const SHIRT_COLORS = ['#2D3748', '#3B82F6', '#F1F5F9', '#F59E0B', '#06B6D4', '#E879F9', '#22C55E', '#111827'];
const PANTS_COLORS = ['#374151', '#1E3A8A', '#111827', '#C4A97D', '#2563EB', '#0F172A', '#E5E7EB', '#4B5563'];
const SHOE_COLORS = ['#F8FAFC', '#111827', '#7C4A23', '#06B6D4', '#1E293B', '#DC2626', '#0F172A'];

export default function Avatar({ config, size = 84, className = '' }: AvatarProps) {
  const skin = SKIN_TONES[config.skinTone] || SKIN_TONES[0];
  const hair = HAIR_COLORS[config.hairColor] || HAIR_COLORS[0];
  const gender = config.gender ?? (config.bodyType >= 3 ? 'female' : 'male');
  const shirt = SHIRT_COLORS[config.shirt] || SHIRT_COLORS[0];
  const pants = PANTS_COLORS[config.pants] || PANTS_COLORS[0];
  const shoes = SHOE_COLORS[config.shoes] || SHOE_COLORS[0];
  const skinDark = shade(skin, -20);
  const skinBlush = shade(skin, -10);
  const hairDark = shade(hair, -25);
  const isFemale = gender === 'female';

  // Body proportions
  const shoulderW = isFemale ? 36 : 42;
  const hipW = isFemale ? 34 : 30;
  const waistW = isFemale ? 28 : 34;
  const cx = 70;

  return (
    <svg
      className={className}
      viewBox="0 0 140 260"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * (260 / 140)}
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`skin-${config.skinTone}`} cx="50%" cy="30%">
          <stop offset="0%" stopColor={shade(skin, 8)} />
          <stop offset="100%" stopColor={skin} />
        </radialGradient>
        <linearGradient id="shadow-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="70" cy="248" rx="26" ry="6" fill="rgba(0,0,0,0.18)" />

      {/* LEGS - behind torso */}
      <rect x="56" y="160" width="13" height="58" rx="6.5" fill={skin} />
      <rect x="71" y="160" width="13" height="58" rx="6.5" fill={skin} />
      <rect x="56" y="160" width="5" height="58" rx="2.5" fill={skinDark} opacity="0.12" />
      <rect x="71" y="160" width="5" height="58" rx="2.5" fill={skinDark} opacity="0.08" />

      {/* PANTS */}
      {renderPants(config.pants, pants)}

      {/* SHOES */}
      {renderShoes(config.shoes, shoes)}

      {/* TORSO - skin base */}
      <path d={buildTorso(cx, shoulderW, waistW, hipW, isFemale)} fill={skin} />
      <path d={buildTorso(cx, shoulderW, waistW, hipW, isFemale)} fill={skinDark} opacity="0.06" />

      {/* SHIRT */}
      {renderShirt(config.shirt, shirt, cx, shoulderW, waistW, hipW, isFemale)}

      {/* ARMS */}
      <rect x="35" y="100" width="13" height="52" rx="6.5" fill={skin} transform="rotate(6 41 126)" />
      <rect x="92" y="100" width="13" height="52" rx="6.5" fill={skin} transform="rotate(-6 98 126)" />
      {/* Hands */}
      <ellipse cx="39" cy="154" rx="7" ry="6.5" fill={skinBlush} />
      <ellipse cx="101" cy="154" rx="7" ry="6.5" fill={skinBlush} />

      {/* NECK */}
      <rect x="63" y="78" width="14" height="16" rx="7" fill={skin} />

      {/* HEAD */}
      <ellipse cx="70" cy="52" rx="27" ry="29" fill={`url(#skin-${config.skinTone})`} />
      {/* Ears */}
      <ellipse cx="44" cy="55" rx="5" ry="6.5" fill={skin} />
      <ellipse cx="44" cy="55" rx="3" ry="4" fill={skinDark} opacity="0.12" />
      <ellipse cx="96" cy="55" rx="5" ry="6.5" fill={skin} />
      <ellipse cx="96" cy="55" rx="3" ry="4" fill={skinDark} opacity="0.12" />

      {/* Eyebrows */}
      <path d="M 53 44 Q 58 40 64 43" fill="none" stroke={hairDark} strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
      <path d="M 76 43 Q 82 40 87 44" fill="none" stroke={hairDark} strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />

      {/* EYES */}
      {renderEyes(config.eyes)}

      {/* NOSE */}
      {renderNose(config.nose, skinDark)}

      {/* MOUTH */}
      {renderMouth(config.mouth)}

      {/* Blush */}
      <ellipse cx="52" cy="68" rx="5.5" ry="2.8" fill="hsl(0 60% 75% / 0.15)" />
      <ellipse cx="88" cy="68" rx="5.5" ry="2.8" fill="hsl(0 60% 75% / 0.15)" />

      {/* HAIR */}
      {renderHair(config.hair, hair, hairDark)}

      {/* ACCESSORY */}
      {renderAccessory(config.accessory)}
    </svg>
  );
}

function buildTorso(cx: number, sw: number, ww: number, hw: number, fem: boolean) {
  const top = 90;
  const mid = fem ? 125 : 128;
  const bot = 162;
  return `M ${cx - sw / 2} ${top} 
    Q ${cx} ${top - 4} ${cx + sw / 2} ${top} 
    L ${cx + ww / 2} ${mid} 
    L ${cx + hw / 2} ${bot} 
    Q ${cx} ${bot + 4} ${cx - hw / 2} ${bot} 
    L ${cx - ww / 2} ${mid} Z`;
}

function shade(hex: string, amount: number) {
  const v = hex.replace('#', '');
  const num = parseInt(v, 16);
  let r = Math.max(0, Math.min(255, (num >> 16) + amount));
  let g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  let b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${(b | (g << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
}

function renderHair(id: number, c: string, s: string) {
  const base = (d: string, extra?: React.ReactNode) => <><path d={d} fill={c} />{extra}</>;
  switch (id) {
    case 0: // Raspado
      return <path d="M 43 52 Q 43 24 70 20 Q 97 24 97 52 Q 90 42 70 38 Q 50 42 43 52 Z" fill={c} opacity="0.3" />;
    case 1: // Curto
      return base("M 43 53 Q 43 22 70 18 Q 97 22 97 53 Q 90 38 70 34 Q 50 38 43 53 Z");
    case 2: // Lateral
      return <><path d="M 43 53 Q 45 22 72 18 Q 93 20 97 44 L 95 55 Q 90 42 72 38 Q 53 35 43 53 Z" fill={c} /><path d="M 85 26 L 97 38 L 96 56" fill={c} /></>;
    case 3: // Cacheado
      return <>{[48, 58, 70, 82, 92].map((x, i) => <circle key={x} cx={x} cy={32 + (i % 2) * 4} r="11" fill={c} />)}<path d="M 43 53 Q 50 42 70 40 Q 90 42 97 53" fill={c} /></>;
    case 4: // Moicano
      return <><path d="M 58 53 L 62 16 H 78 L 82 53 Z" fill={c} /><path d="M 63 22 L 70 10 L 77 22" fill={s} opacity="0.4" /></>;
    case 5: // Longo
      return <><path d="M 40 53 Q 40 20 70 16 Q 100 20 100 53 Q 94 35 70 30 Q 46 35 40 53 Z" fill={c} /><path d="M 45 52 L 43 115 L 52 112 L 53 62 Z" fill={c} /><path d="M 95 52 L 97 115 L 88 112 L 87 62 Z" fill={c} /></>;
    case 6: // Franja
      return <><path d="M 43 53 Q 43 22 70 18 Q 97 22 97 53 Q 90 38 70 34 Q 50 38 43 53 Z" fill={c} /><path d="M 44 42 Q 55 55 68 50 Q 78 47 85 38 Q 75 34 62 34 Q 49 34 44 42 Z" fill={s} opacity="0.4" /></>;
    case 7: // Coque
      return <><path d="M 43 53 Q 43 22 70 18 Q 97 22 97 53 Q 90 38 70 34 Q 50 38 43 53 Z" fill={c} /><circle cx="70" cy="16" r="12" fill={c} /></>;
    case 8: // Rabo de Cavalo
      return <><path d="M 43 53 Q 43 22 70 18 Q 97 22 97 53 Q 90 38 70 34 Q 50 38 43 53 Z" fill={c} /><path d="M 92 42 Q 110 46 107 66 Q 104 86 88 95 L 85 82 Q 96 72 96 57 Q 96 48 92 42 Z" fill={c} /></>;
    case 9: // Afro
      return <>{[44, 56, 70, 84, 96, 50, 90].map((x, i) => <circle key={`${x}-${i}`} cx={x} cy={30 + (i % 3) * 5} r="14" fill={c} />)}<path d="M 40 55 Q 50 44 70 42 Q 90 44 100 55" fill={c} /></>;
    case 10: // Tranças
      return <><path d="M 43 53 Q 43 22 70 18 Q 97 22 97 53 Q 90 38 70 34 Q 50 38 43 53 Z" fill={c} /><path d="M 48 46 L 44 90" stroke={c} strokeWidth="6" strokeLinecap="round" /><path d="M 60 47 L 57 92" stroke={c} strokeWidth="6" strokeLinecap="round" /><path d="M 80 47 L 83 92" stroke={c} strokeWidth="6" strokeLinecap="round" /><path d="M 92 46 L 96 90" stroke={c} strokeWidth="6" strokeLinecap="round" /></>;
    case 11: // Buzz Cut
      return <path d="M 45 50 Q 48 26 70 24 Q 92 26 95 50 Q 84 38 70 36 Q 56 38 45 50 Z" fill={c} opacity="0.85" />;
    default: return null;
  }
}

function renderEyes(id: number) {
  const eye = (iris: string, sz = 4, lids = false) => (
    <>
      <ellipse cx="57" cy="56" rx={sz + 2.5} ry={sz + 0.5} fill="white" />
      <ellipse cx="83" cy="56" rx={sz + 2.5} ry={sz + 0.5} fill="white" />
      <circle cx="57" cy="56.5" r={sz * 0.65} fill={iris} />
      <circle cx="83" cy="56.5" r={sz * 0.65} fill={iris} />
      <circle cx="55" cy="55" r={sz * 0.22} fill="white" />
      <circle cx="81" cy="55" r={sz * 0.22} fill="white" />
      {lids && <>
        <path d="M 51 54 Q 57 49 63 54" fill="none" stroke="hsl(220 18% 25%)" strokeWidth="1.6" />
        <path d="M 77 54 Q 83 49 89 54" fill="none" stroke="hsl(220 18% 25%)" strokeWidth="1.6" />
      </>}
    </>
  );
  switch (id) {
    case 0: return eye('#1E1E1E');
    case 1: return eye('#2563EB');
    case 2: return <><path d="M 51 57 Q 57 52 63 57" fill="none" stroke="hsl(220 18% 18%)" strokeWidth="2.2" strokeLinecap="round" /><path d="M 77 57 Q 83 52 89 57" fill="none" stroke="hsl(220 18% 18%)" strokeWidth="2.2" strokeLinecap="round" /></>;
    case 3: return eye('#1E1E1E', 3.5, true);
    case 4: return eye('#16A34A');
    case 5: return eye('#1E1E1E', 3);
    case 6: return eye('#6B4428');
    case 7: return eye('#94A3B8');
    case 8: return eye('#D97706');
    case 9: return <><path d="M 50 55 Q 57 48 64 55" fill="none" stroke="hsl(220 18% 18%)" strokeWidth="2" strokeLinecap="round" /><path d="M 76 55 Q 83 48 90 55" fill="none" stroke="hsl(220 18% 18%)" strokeWidth="2" strokeLinecap="round" /><circle cx="57" cy="56.5" r="1.8" fill="hsl(220 18% 18%)" /><circle cx="83" cy="56.5" r="1.8" fill="hsl(220 18% 18%)" /></>;
    default: return eye('#1E1E1E');
  }
}

function renderNose(id: number, shadow: string) {
  switch (id) {
    case 0: return <path d="M 69 59 Q 71 67 68 72 Q 70 74 74 71" fill="none" stroke={shadow} strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />;
    case 1: return <path d="M 68 58 Q 72 67 69 75 Q 72 77 77 72" fill="none" stroke={shadow} strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />;
    case 2: return <path d="M 69 59 L 70 73 Q 72 75 74 72" fill="none" stroke={shadow} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />;
    case 3: return <path d="M 68 63 Q 70 69 69 73 Q 71 75 75 69" fill="none" stroke={shadow} strokeWidth="1.7" strokeLinecap="round" opacity="0.55" />;
    default: return null;
  }
}

function renderMouth(id: number) {
  switch (id) {
    case 0: return <path d="M 60 77 Q 70 85 80 77" fill="none" stroke="#B5655D" strokeWidth="2" strokeLinecap="round" />;
    case 1: return <path d="M 62 78 H 78" fill="none" stroke="#A6645D" strokeWidth="2" strokeLinecap="round" />;
    case 2: return <ellipse cx="70" cy="78" rx="6" ry="4.5" fill="#B5655D" opacity="0.5" />;
    case 3: return <path d="M 61 77 Q 70 82 79 77" fill="none" stroke="#B5655D" strokeWidth="2" strokeLinecap="round" />;
    case 4: return <path d="M 64 79 Q 70 81 76 79" fill="none" stroke="#A6645D" strokeWidth="1.8" strokeLinecap="round" />;
    case 5: return <path d="M 58 77 Q 70 88 82 77" fill="none" stroke="#B5655D" strokeWidth="2" strokeLinecap="round" />;
    case 6: return <path d="M 61 79 Q 70 75 79 79" fill="none" stroke="#8B4F4A" strokeWidth="2" strokeLinecap="round" />;
    case 7: return <path d="M 63 78 Q 70 83 77 78" fill="none" stroke="#BD7A73" strokeWidth="1.8" strokeLinecap="round" />;
    case 8: return <><path d="M 59 77 Q 70 85 81 77" fill="none" stroke="#704234" strokeWidth="2" strokeLinecap="round" /><path d="M 57 73 Q 63 69 70 73 Q 77 69 83 73" fill="none" stroke="#4B2E25" strokeWidth="2" strokeLinecap="round" /></>;
    case 9: return <><path d="M 59 78 Q 70 85 81 78" fill="none" stroke="#704234" strokeWidth="2" strokeLinecap="round" /><path d="M 58 75 Q 70 83 82 75" fill="none" stroke="#3F2B22" strokeWidth="3" strokeLinecap="round" opacity="0.55" /></>;
    default: return null;
  }
}

function renderShirt(id: number, color: string, cx: number, sw: number, ww: number, hw: number, fem: boolean) {
  const torso = buildTorso(cx, sw, ww, hw, fem);
  const sleeveL = `M ${cx - sw / 2 + 2} 93 Q ${cx - sw / 2 - 14} 106 ${cx - sw / 2 - 12} 128 L ${cx - sw / 2 - 4} 130 Q ${cx - sw / 2 - 4} 114 ${cx - sw / 2 + 6} 98 Z`;
  const sleeveR = `M ${cx + sw / 2 - 2} 93 Q ${cx + sw / 2 + 14} 106 ${cx + sw / 2 + 12} 128 L ${cx + sw / 2 + 4} 130 Q ${cx + sw / 2 + 4} 114 ${cx + sw / 2 - 6} 98 Z`;

  const base = (c: string, extra?: React.ReactNode) => (
    <>
      <path d={torso} fill={c} />
      <path d={sleeveL} fill={c} />
      <path d={sleeveR} fill={c} />
      {extra}
    </>
  );

  switch (id) {
    case 2: // Jaleco
      return base('#F1F5F9', <>
        <line x1="62" y1="96" x2="66" y2="155" stroke="#D1D5DB" strokeWidth="1.5" />
        <line x1="74" y1="96" x2="78" y2="155" stroke="#D1D5DB" strokeWidth="1.5" />
        <circle cx="60" cy="110" r="2" fill="#3B82F6" opacity="0.7" />
      </>);
    case 3: // Moletom
      return base(color, <rect x="58" y="108" width="24" height="4" rx="2" fill="hsl(45 95% 61% / 0.7)" />);
    case 6: // Neon
      return base(color, <>
        <line x1="50" y1="116" x2="90" y2="116" stroke="hsl(192 93% 56% / 0.8)" strokeWidth="3.5" />
        <line x1="52" y1="126" x2="88" y2="126" stroke="hsl(0 0% 100% / 0.2)" strokeWidth="1.5" />
      </>);
    case 7: // Blazer
      return base(color, <path d="M 63 94 L 70 108 L 77 94" fill="hsl(210 40% 96%)" opacity="0.75" />);
    default:
      return base(color);
  }
}

function renderPants(id: number, color: string) {
  const waist = <path d="M 50 155 Q 70 150 90 155 L 88 172 Q 79 177 70 177 Q 61 177 52 172 Z" fill={color} />;
  const longLegs = <>
    <rect x="56" y="168" width="13" height="50" rx="6" fill={color} />
    <rect x="71" y="168" width="13" height="50" rx="6" fill={color} />
  </>;
  const shortLegs = <>
    <rect x="56" y="168" width="13" height="24" rx="6" fill={color} />
    <rect x="71" y="168" width="13" height="24" rx="6" fill={color} />
  </>;

  return <>
    {waist}
    {id === 3 ? shortLegs : longLegs}
    {id === 6 && <line x1="50" y1="162" x2="90" y2="162" stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" />}
  </>;
}

function renderShoes(id: number, color: string) {
  return <>
    <path d="M 53 217 H 69 Q 71 222 67 226 H 50 Q 46 223 48 217 Z" fill={color} />
    <path d="M 71 217 H 87 Q 94 222 89 226 H 73 Q 68 223 71 217 Z" fill={color} />
    <line x1="50" y1="224" x2="67" y2="224" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="73" y1="224" x2="89" y2="224" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
  </>;
}

function renderAccessory(id: number) {
  switch (id) {
    case 1: // Cordão
      return <><path d="M 64 90 L 61 114" stroke="#D4AF37" strokeWidth="1.8" /><path d="M 76 90 L 79 114" stroke="#D4AF37" strokeWidth="1.8" /><circle cx="70" cy="116" r="5" fill="#D4AF37" /><circle cx="70" cy="116" r="2.5" fill="#FDE68A" /></>;
    case 2: // Crachá
      return <><path d="M 64 90 L 59 124" stroke="#38BDF8" strokeWidth="1.5" /><path d="M 76 90 L 81 124" stroke="#38BDF8" strokeWidth="1.5" /><rect x="62" y="123" width="16" height="20" rx="3" fill="#E2E8F0" /><rect x="65" y="128" width="10" height="3" rx="1.5" fill="#94A3B8" /><rect x="66" y="133" width="8" height="2" rx="1" fill="#CBD5E1" /></>;
    case 3: // Óculos Aviador
      return <><line x1="50" y1="57" x2="90" y2="57" stroke="#78716C" strokeWidth="1.8" /><ellipse cx="58" cy="57" rx="10" ry="8" fill="rgba(255,255,255,0.04)" stroke="#F59E0B" strokeWidth="1.6" /><ellipse cx="82" cy="57" rx="10" ry="8" fill="rgba(255,255,255,0.04)" stroke="#F59E0B" strokeWidth="1.6" /></>;
    case 4: // Óculos Redondo
      return <><line x1="50" y1="57" x2="90" y2="57" stroke="#94A3B8" strokeWidth="1.8" /><circle cx="58" cy="57" r="8.5" fill="none" stroke="#CBD5E1" strokeWidth="1.6" /><circle cx="82" cy="57" r="8.5" fill="none" stroke="#CBD5E1" strokeWidth="1.6" /></>;
    case 5: // Visor Tech
      return <><line x1="47" y1="53" x2="93" y2="53" stroke="#22D3EE" strokeWidth="3.5" strokeLinecap="round" /><rect x="47" y="54" width="46" height="10" rx="5" fill="hsl(192 93% 56% / 0.12)" stroke="#22D3EE" strokeWidth="1.4" /></>;
    default: return null;
  }
}
