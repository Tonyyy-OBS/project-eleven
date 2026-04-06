import { HAIR_COLORS, SKIN_TONES } from '@/lib/gameData';
import { AvatarConfig } from '@/lib/gameStore';

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

const SHIRT_COLORS = ['#2D3748', '#3B82F6', '#F1F5F9', '#F59E0B', '#06B6D4', '#E879F9', '#22C55E', '#111827'];
const PANTS_COLORS = ['#374151', '#1E3A8A', '#111827', '#A16207', '#2563EB', '#0F172A', '#E5E7EB', '#4B5563'];
const SHOE_COLORS = ['#F8FAFC', '#111827', '#7C4A23', '#06B6D4', '#1E293B', '#DC2626', '#0F172A'];

export default function Avatar({ config, size = 84, className = '' }: AvatarProps) {
  const skin = SKIN_TONES[config.skinTone] || SKIN_TONES[0];
  const hair = HAIR_COLORS[config.hairColor] || HAIR_COLORS[0];
  const gender = config.gender ?? (config.bodyType >= 3 ? 'female' : 'male');
  const bodyType = config.bodyType ?? 0;
  const shirt = SHIRT_COLORS[config.shirt] || SHIRT_COLORS[0];
  const pants = PANTS_COLORS[config.pants] || PANTS_COLORS[0];
  const shoes = SHOE_COLORS[config.shoes] || SHOE_COLORS[0];
  const skinShadow = shade(skin, -18);
  const skinSoft = shade(skin, -8);
  const hairShadow = shade(hair, -22);
  const isFemale = gender === 'female';
  const torsoWidth = [42, 38, 48, 40, 36, 41][bodyType] || 42;
  const torsoX = 70 - torsoWidth / 2;
  const shoulderSpread = [15, 18, 13, 17, 14, 16][bodyType] || 15;
  const hipSpread = isFemale ? 13 : 11;
  const leftLegX = 56;
  const rightLegX = 72;

  const torsoPath = isFemale
    ? `M ${torsoX} 98 C ${torsoX - 2} 90, ${torsoX + 8} 84, 70 84 C ${torsoX + torsoWidth - 8} 84, ${torsoX + torsoWidth + 2} 90, ${torsoX + torsoWidth} 98 L ${torsoX + torsoWidth - hipSpread} 156 C 86 164, 80 168, 70 168 C 60 168, 54 164, ${torsoX + hipSpread} 156 Z`
    : `M ${torsoX} 97 C ${torsoX} 89, ${torsoX + 8} 84, 70 84 C ${torsoX + torsoWidth - 8} 84, ${torsoX + torsoWidth} 89, ${torsoX + torsoWidth} 97 L ${torsoX + torsoWidth - 8} 157 C 84 163, 77 166, 70 166 C 63 166, 56 163, ${torsoX + 8} 157 Z`;

  return (
    <svg
      className={className}
      viewBox="0 0 140 260"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 1.82}
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <ellipse cx="70" cy="244" rx="28" ry="7" fill="hsl(220 32% 6% / 0.28)" />

      <rect x="61" y="80" width="18" height="16" rx="7" fill={skin} />

      <rect x="37" y="102" width="15" height="55" rx="7.5" fill={skin} transform={`rotate(${isFemale ? 8 : 6} 44 128)`} />
      <rect x="88" y="102" width="15" height="55" rx="7.5" fill={skin} transform={`rotate(${isFemale ? -8 : -6} 95 128)`} />
      <ellipse cx="40" cy="158" rx="8" ry="7" fill={skinSoft} />
      <ellipse cx="100" cy="158" rx="8" ry="7" fill={skinSoft} />

      <path d={torsoPath} fill={skin} />
      <path d={torsoPath} fill={skinShadow} opacity="0.08" />

      <rect x={leftLegX} y="156" width="14" height="62" rx="7" fill={skin} />
      <rect x={rightLegX} y="156" width="14" height="62" rx="7" fill={skin} />
      <rect x={leftLegX + 1} y="156" width="5" height="62" rx="2.5" fill={skinShadow} opacity="0.18" />
      <rect x={rightLegX + 1} y="156" width="5" height="62" rx="2.5" fill={skinShadow} opacity="0.12" />

      {renderShirt(config.shirt, shirt, torsoX, torsoWidth, isFemale, shoulderSpread)}
      {renderPants(config.pants, pants, leftLegX, rightLegX)}
      {renderShoes(config.shoes, shoes)}

      <ellipse cx="70" cy="52" rx="28" ry="30" fill={skin} />
      <ellipse cx="44" cy="55" rx="4.5" ry="6" fill={skin} />
      <ellipse cx="96" cy="55" rx="4.5" ry="6" fill={skin} />

      <path d="M 54 46 Q 60 42 65 45" fill="none" stroke={hairShadow} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M 75 45 Q 80 42 86 46" fill="none" stroke={hairShadow} strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {renderEyes(config.eyes)}
      {renderNose(config.nose, skinShadow)}
      {renderMouth(config.mouth)}

      <ellipse cx="52" cy="69" rx="5" ry="3" fill="hsl(0 72% 78% / 0.18)" />
      <ellipse cx="88" cy="69" rx="5" ry="3" fill="hsl(0 72% 78% / 0.18)" />

      {renderHair(config.hair, hair, hairShadow)}
      {renderAccessory(config.accessory)}
    </svg>
  );
}

function shade(hex: string, amount: number) {
  const value = hex.replace('#', '');
  const num = parseInt(value, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return `#${(b | (g << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
}

function renderHair(id: number, color: string, shadow: string) {
  switch (id) {
    case 0:
      return <path d="M 48 48 Q 58 30 70 30 Q 82 30 92 48" fill="none" stroke={shadow} strokeWidth="1.5" opacity="0.1" />;
    case 1:
      return <path d="M 42 54 Q 42 24 70 20 Q 98 24 98 54 Q 90 39 70 35 Q 50 39 42 54 Z" fill={color} />;
    case 2:
      return <><path d="M 42 53 Q 44 23 72 20 Q 92 22 98 46 L 94 56 Q 90 44 74 40 Q 54 36 42 53 Z" fill={color} /><path d="M 84 28 L 96 40 L 95 58" fill={color} /></>;
    case 3:
      return <>{[48, 58, 70, 82, 92].map((cx, i) => <circle key={cx} cx={cx} cy={34 + (i % 2) * 3} r="10" fill={color} />)}<path d="M 42 54 Q 48 42 70 40 Q 92 42 98 54" fill={color} /></>;
    case 4:
      return <><path d="M 58 55 L 63 18 H 77 L 82 55 Z" fill={color} /><path d="M 61 24 L 70 12 L 79 24" fill={shadow} opacity="0.45" /></>;
    case 5:
      return <><path d="M 40 54 Q 40 21 70 18 Q 100 21 100 54 Q 94 36 70 32 Q 46 36 40 54 Z" fill={color} /><path d="M 46 53 L 44 110 L 53 108 L 54 63 Z" fill={color} /><path d="M 94 53 L 96 110 L 87 108 L 86 63 Z" fill={color} /></>;
    case 6:
      return <><path d="M 42 54 Q 42 24 70 20 Q 98 24 98 54 Q 91 38 72 35 Q 50 38 42 54 Z" fill={color} /><path d="M 44 43 Q 54 56 68 52 Q 77 49 84 40 Q 74 36 61 36 Q 49 36 44 43 Z" fill={shadow} opacity="0.45" /></>;
    case 7:
      return <><path d="M 42 53 Q 42 24 70 20 Q 98 24 98 53 Q 90 40 70 36 Q 50 40 42 53 Z" fill={color} /><circle cx="70" cy="18" r="11" fill={color} /></>;
    case 8:
      return <><path d="M 42 53 Q 42 24 70 20 Q 98 24 98 53 Q 90 40 70 36 Q 50 40 42 53 Z" fill={color} /><path d="M 92 44 Q 108 48 105 66 Q 103 84 88 92 L 84 80 Q 95 72 95 57 Q 95 49 92 44 Z" fill={color} /></>;
    case 9:
      return <>{[45, 58, 70, 82, 95, 52, 88].map((cx, i) => <circle key={`${cx}-${i}`} cx={cx} cy={33 + (i % 3) * 4} r="11" fill={color} />)}<path d="M 42 56 Q 52 46 70 46 Q 88 46 98 56" fill={color} /></>;
    case 10:
      return <><path d="M 42 53 Q 42 24 70 20 Q 98 24 98 53 Q 90 40 70 36 Q 50 40 42 53 Z" fill={color} /><path d="M 48 48 L 44 86" stroke={color} strokeWidth="5" strokeLinecap="round" /><path d="M 59 49 L 56 88" stroke={color} strokeWidth="5" strokeLinecap="round" /><path d="M 81 49 L 84 88" stroke={color} strokeWidth="5" strokeLinecap="round" /><path d="M 92 48 L 96 86" stroke={color} strokeWidth="5" strokeLinecap="round" /></>;
    case 11:
      return <path d="M 45 50 Q 48 27 70 26 Q 92 27 95 50 Q 84 39 70 38 Q 56 39 45 50 Z" fill={color} opacity="0.9" />;
    default:
      return null;
  }
}

function renderEyes(id: number) {
  const standard = (iris: string, size = 4, lid = false) => (
    <>
      <ellipse cx="57" cy="57" rx={size + 2} ry={size} fill="white" />
      <ellipse cx="83" cy="57" rx={size + 2} ry={size} fill="white" />
      <circle cx="57" cy="57.5" r={size * 0.6} fill={iris} />
      <circle cx="83" cy="57.5" r={size * 0.6} fill={iris} />
      <circle cx="58.5" cy="56" r={size * 0.18} fill="white" />
      <circle cx="84.5" cy="56" r={size * 0.18} fill="white" />
      {lid && <><path d="M 51 55 Q 57 50 63 55" fill="none" stroke="hsl(220 20% 22%)" strokeWidth="1.5" /><path d="M 77 55 Q 83 50 89 55" fill="none" stroke="hsl(220 20% 22%)" strokeWidth="1.5" /></>}
    </>
  );

  switch (id) {
    case 0: return standard('#111827');
    case 1: return standard('#2563EB');
    case 2: return <><path d="M 51 58 Q 57 53 63 58" fill="none" stroke="hsl(220 20% 15%)" strokeWidth="2" strokeLinecap="round" /><path d="M 77 58 Q 83 53 89 58" fill="none" stroke="hsl(220 20% 15%)" strokeWidth="2" strokeLinecap="round" /></>;
    case 3: return standard('#111827', 3, true);
    case 4: return standard('#16A34A');
    case 5: return standard('#111827', 3);
    case 6: return standard('#6B4428');
    case 7: return standard('#94A3B8');
    case 8: return standard('#D97706');
    case 9: return <><path d="M 50 56 Q 57 49 64 56" fill="none" stroke="hsl(220 20% 16%)" strokeWidth="2" strokeLinecap="round" /><path d="M 76 56 Q 83 49 90 56" fill="none" stroke="hsl(220 20% 16%)" strokeWidth="2" strokeLinecap="round" /><circle cx="57" cy="57" r="1.6" fill="hsl(220 20% 16%)" /><circle cx="83" cy="57" r="1.6" fill="hsl(220 20% 16%)" /></>;
    default: return standard('#111827');
  }
}

function renderNose(id: number, shadow: string) {
  switch (id) {
    case 0: return <path d="M 69 60 Q 71 68 68 73 Q 70 75 74 72" fill="none" stroke={shadow} strokeWidth="1.7" strokeLinecap="round" opacity="0.72" />;
    case 1: return <path d="M 68 59 Q 72 68 69 76 Q 72 78 77 73" fill="none" stroke={shadow} strokeWidth="2" strokeLinecap="round" opacity="0.78" />;
    case 2: return <path d="M 69 60 L 70 74 Q 72 76 74 73" fill="none" stroke={shadow} strokeWidth="1.6" strokeLinecap="round" opacity="0.72" />;
    case 3: return <path d="M 68 64 Q 70 70 69 74 Q 71 76 75 70" fill="none" stroke={shadow} strokeWidth="1.7" strokeLinecap="round" opacity="0.68" />;
    default: return null;
  }
}

function renderMouth(id: number) {
  switch (id) {
    case 0: return <path d="M 59 78 Q 70 86 81 78" fill="none" stroke="#B5655D" strokeWidth="2" strokeLinecap="round" />;
    case 1: return <path d="M 61 79 H 79" fill="none" stroke="#A6645D" strokeWidth="2" strokeLinecap="round" />;
    case 2: return <ellipse cx="70" cy="79" rx="7" ry="5" fill="#B5655D" opacity="0.55" />;
    case 3: return <path d="M 60 78 Q 70 83 80 78" fill="none" stroke="#B5655D" strokeWidth="2" strokeLinecap="round" />;
    case 4: return <path d="M 63 80 Q 70 82 77 80" fill="none" stroke="#A6645D" strokeWidth="1.8" strokeLinecap="round" />;
    case 5: return <path d="M 57 78 Q 70 89 83 78" fill="none" stroke="#B5655D" strokeWidth="2" strokeLinecap="round" />;
    case 6: return <path d="M 60 80 Q 70 76 80 80" fill="none" stroke="#8B4F4A" strokeWidth="2" strokeLinecap="round" />;
    case 7: return <path d="M 62 79 Q 70 84 78 79" fill="none" stroke="#BD7A73" strokeWidth="1.8" strokeLinecap="round" />;
    case 8: return <><path d="M 58 78 Q 70 86 82 78" fill="none" stroke="#704234" strokeWidth="2" strokeLinecap="round" /><path d="M 56 74 Q 63 70 70 74" fill="none" stroke="#4B2E25" strokeWidth="2" strokeLinecap="round" /><path d="M 70 74 Q 77 70 84 74" fill="none" stroke="#4B2E25" strokeWidth="2" strokeLinecap="round" /></>;
    case 9: return <><path d="M 58 79 Q 70 86 82 79" fill="none" stroke="#704234" strokeWidth="2" strokeLinecap="round" /><path d="M 57 76 Q 70 84 83 76" fill="none" stroke="#3F2B22" strokeWidth="3" strokeLinecap="round" opacity="0.65" /></>;
    default: return null;
  }
}

function renderShirt(id: number, color: string, torsoX: number, torsoWidth: number, isFemale: boolean, shoulderSpread: number) {
  const torso = isFemale
    ? `M ${torsoX} 97 C ${torsoX - 2} 90, ${torsoX + 8} 84, 70 84 C ${torsoX + torsoWidth - 8} 84, ${torsoX + torsoWidth + 2} 90, ${torsoX + torsoWidth} 97 L ${torsoX + torsoWidth - 12} 156 C 86 164, 80 167, 70 167 C 60 167, 54 164, ${torsoX + 12} 156 Z`
    : `M ${torsoX} 96 C ${torsoX} 88, ${torsoX + 8} 84, 70 84 C ${torsoX + torsoWidth - 8} 84, ${torsoX + torsoWidth} 88, ${torsoX + torsoWidth} 96 L ${torsoX + torsoWidth - 8} 157 C 84 163, 77 166, 70 166 C 63 166, 56 163, ${torsoX + 8} 157 Z`;
  const leftSleeve = `M ${torsoX + 2} 96 Q ${torsoX - shoulderSpread} 108 ${torsoX - shoulderSpread + 2} 126 L ${torsoX - shoulderSpread + 10} 128 Q ${torsoX - shoulderSpread + 10} 114 ${torsoX + 6} 100 Z`;
  const rightSleeve = `M ${torsoX + torsoWidth - 2} 96 Q ${torsoX + torsoWidth + shoulderSpread} 108 ${torsoX + torsoWidth + shoulderSpread - 2} 126 L ${torsoX + torsoWidth + shoulderSpread - 10} 128 Q ${torsoX + torsoWidth + shoulderSpread - 10} 114 ${torsoX + torsoWidth - 6} 100 Z`;

  if (id === 2) {
    return (
      <>
        <path d={torso} fill="#F8FAFC" />
        <path d={leftSleeve} fill="#F8FAFC" />
        <path d={rightSleeve} fill="#F8FAFC" />
        <path d={`M ${torsoX + 11} 98 L 65 156`} stroke="#D1D5DB" strokeWidth="2" />
        <path d={`M ${torsoX + torsoWidth - 11} 98 L 75 156`} stroke="#D1D5DB" strokeWidth="2" />
      </>
    );
  }

  if (id === 3) {
    return (
      <>
        <path d={torso} fill={color} />
        <path d={leftSleeve} fill={color} />
        <path d={rightSleeve} fill={color} />
        <rect x="58" y="105" width="24" height="4" rx="2" fill="hsl(45 95% 61% / 0.8)" />
      </>
    );
  }

  if (id === 6) {
    return (
      <>
        <path d={torso} fill={color} />
        <path d={leftSleeve} fill={color} />
        <path d={rightSleeve} fill={color} />
        <path d="M 50 114 H 90" stroke="hsl(192 93% 56% / 0.85)" strokeWidth="4" />
        <path d="M 50 124 H 90" stroke="hsl(0 0% 100% / 0.3)" strokeWidth="2" />
      </>
    );
  }

  if (id === 7) {
    return (
      <>
        <path d={torso} fill={color} />
        <path d={leftSleeve} fill={color} />
        <path d={rightSleeve} fill={color} />
        <path d="M 62 96 L 70 109 L 78 96" fill="hsl(210 40% 96%)" opacity="0.82" />
      </>
    );
  }

  return (
    <>
      <path d={torso} fill={color} />
      <path d={leftSleeve} fill={color} />
      <path d={rightSleeve} fill={color} />
    </>
  );
}

function renderPants(id: number, color: string, leftLegX: number, rightLegX: number) {
  const waist = <path d="M 49 152 Q 70 146 91 152 L 89 171 Q 79 176 70 176 Q 61 176 51 171 Z" fill={color} />;
  const long = (
    <>
      <rect x={leftLegX} y="165" width="14" height="52" rx="6" fill={color} />
      <rect x={rightLegX} y="165" width="14" height="52" rx="6" fill={color} />
    </>
  );
  const short = (
    <>
      <rect x={leftLegX} y="164" width="14" height="25" rx="6" fill={color} />
      <rect x={rightLegX} y="164" width="14" height="25" rx="6" fill={color} />
    </>
  );

  return (
    <>
      {waist}
      {id === 3 ? short : long}
      {id === 6 && <path d="M 49 160 H 91" stroke="hsl(221 44% 10% / 0.14)" strokeWidth="3" />}
    </>
  );
}

function renderShoes(id: number, color: string) {
  const sole = id === 4 ? 'hsl(210 40% 96%)' : 'hsl(221 44% 10% / 0.25)';
  return (
    <>
      <path d="M 52 216 H 70 Q 72 222 67 226 H 49 Q 44 223 46 216 Z" fill={color} />
      <path d="M 70 216 H 88 Q 96 222 89 226 H 71 Q 66 223 70 216 Z" fill={color} />
      <path d="M 49 224 H 68" stroke={sole} strokeWidth="2" strokeLinecap="round" />
      <path d="M 72 224 H 90" stroke={sole} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function renderAccessory(id: number) {
  switch (id) {
    case 1:
      return <><path d="M 64 92 L 60 116" stroke="#D4AF37" strokeWidth="2" /><path d="M 76 92 L 80 116" stroke="#D4AF37" strokeWidth="2" /><circle cx="70" cy="117" r="5" fill="#D4AF37" /></>;
    case 2:
      return <><path d="M 64 90 L 58 126" stroke="#38BDF8" strokeWidth="2" /><path d="M 76 90 L 82 126" stroke="#38BDF8" strokeWidth="2" /><rect x="61" y="125" width="18" height="22" rx="3" fill="#E2E8F0" /><rect x="64" y="130" width="12" height="4" rx="2" fill="#0F172A" opacity="0.35" /></>;
    case 3:
      return <><path d="M 50 58 H 90" stroke="#64748B" strokeWidth="2" /><ellipse cx="58" cy="58" rx="10" ry="8" fill="hsl(210 40% 96% / 0.06)" stroke="#F59E0B" strokeWidth="1.5" /><ellipse cx="82" cy="58" rx="10" ry="8" fill="hsl(210 40% 96% / 0.06)" stroke="#F59E0B" strokeWidth="1.5" /></>;
    case 4:
      return <><path d="M 50 58 H 90" stroke="#94A3B8" strokeWidth="2" /><circle cx="58" cy="58" r="8.5" fill="none" stroke="#CBD5E1" strokeWidth="1.5" /><circle cx="82" cy="58" r="8.5" fill="none" stroke="#CBD5E1" strokeWidth="1.5" /></>;
    case 5:
      return <><path d="M 47 53 H 93" stroke="#22D3EE" strokeWidth="4" strokeLinecap="round" /><rect x="47" y="54" width="46" height="10" rx="5" fill="hsl(192 93% 56% / 0.18)" stroke="#22D3EE" strokeWidth="1.4" /></>;
    default:
      return null;
  }
}
