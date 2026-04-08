import { HAIR_COLORS, SKIN_TONES } from '@/lib/gameData';
import { AvatarConfig } from '@/lib/gameStore';

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
  showShadow?: boolean;
}

// Derived shade utility
function shade(hex: string, amount: number) {
  const v = hex.replace('#', '');
  const num = parseInt(v, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${(b | (g << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
}

const SHIRT_FILLS = [
  // 0: Camiseta Grafite
  { main: '#3B3F47', detail: '#2D3135' },
  // 1: Jaqueta Azul
  { main: '#2563EB', detail: '#1D4ED8' },
  // 2: Jaleco Atômico
  { main: '#EFF3F8', detail: '#D1D5DB' },
  // 3: Moletom Âmbar
  { main: '#D97706', detail: '#B45309' },
  // 4: Camisa Ciano
  { main: '#06B6D4', detail: '#0891B2' },
  // 5: Blusa Rose
  { main: '#F472B6', detail: '#EC4899' },
  // 6: Jaqueta Neon
  { main: '#10B981', detail: '#059669' },
  // 7: Blazer Noite
  { main: '#1E293B', detail: '#0F172A' },
];

const PANTS_FILLS = [
  { main: '#4B5563', detail: '#374151' }, // Slim
  { main: '#1E3A8A', detail: '#1E2D5C' }, // Jeans Escuro
  { main: '#111827', detail: '#0A0E14' }, // Tática Preta
  { main: '#C4A97D', detail: '#A68B5B' }, // Areia
  { main: '#2563EB', detail: '#1D4ED8' }, // Azul Cobalto
  { main: '#0F172A', detail: '#080C14' }, // Noite
  { main: '#D1D5DB', detail: '#B0B5BD' }, // Clara
  { main: '#374151', detail: '#2D3440' }, // Chumbo
];

const SHOE_FILLS = [
  { main: '#F0F0F0', sole: '#D4D4D4', accent: '#E5E5E5' }, // Branco
  { main: '#1F1F1F', sole: '#111', accent: '#333' }, // Escuro
  { main: '#7C4A23', sole: '#5C3517', accent: '#9A6B3C' }, // Bota Marrom
  { main: '#06B6D4', sole: '#0891B2', accent: '#22D3EE' }, // Runner Ciano
  { main: '#1E293B', sole: '#0F172A', accent: '#334155' }, // Social
  { main: '#DC2626', sole: '#B91C1C', accent: '#EF4444' }, // Rubi
  { main: '#292524', sole: '#1C1917', accent: '#44403C' }, // Bota Tática
];

export default function Avatar({ config, size = 84, className = '', showShadow = true }: AvatarProps) {
  const skin = SKIN_TONES[config.skinTone] || SKIN_TONES[0];
  const hairColor = HAIR_COLORS[config.hairColor] || HAIR_COLORS[0];
  const isFemale = (config.gender ?? 'male') === 'female';
  const skinDark = shade(skin, -25);
  const skinLight = shade(skin, 15);
  const hairDark = shade(hairColor, -30);

  const sf = SHIRT_FILLS[config.shirt] || SHIRT_FILLS[0];
  const pf = PANTS_FILLS[config.pants] || PANTS_FILLS[0];
  const shf = SHOE_FILLS[config.shoes] || SHOE_FILLS[0];

  // Body geometry - centered at x=100, viewBox 0 0 200 340
  const cx = 100;
  const headCy = 58;
  const headRx = 30;
  const headRy = 33;
  const neckY = 88;
  const shoulderY = 100;
  const shoulderW = isFemale ? 38 : 44;
  const waistY = isFemale ? 150 : 155;
  const waistW = isFemale ? 30 : 38;
  const hipY = 175;
  const hipW = isFemale ? 38 : 34;

  // Leg geometry
  const legInset = 6;
  const legTop = hipY;
  const legBot = 280;
  const legW = 16;
  const leftLegX = cx - legInset - legW / 2;
  const rightLegX = cx + legInset - legW / 2;

  // Arm geometry
  const armW = 13;
  const armTop = shoulderY + 2;
  const armBot = 195;
  const leftArmX = cx - shoulderW / 2 - armW / 2 + 2;
  const rightArmX = cx + shoulderW / 2 - armW / 2 - 2;

  const uid = `av-${config.skinTone}-${config.hair}`;

  return (
    <svg
      className={className}
      viewBox="0 0 200 340"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * (340 / 200)}
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-skinG`} cx="50%" cy="35%">
          <stop offset="0%" stopColor={skinLight} />
          <stop offset="100%" stopColor={skin} />
        </radialGradient>
        <linearGradient id={`${uid}-shirtG`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sf.main} />
          <stop offset="100%" stopColor={sf.detail} />
        </linearGradient>
        <linearGradient id={`${uid}-pantsG`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pf.main} />
          <stop offset="100%" stopColor={pf.detail} />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      {showShadow && <ellipse cx={cx} cy="326" rx="32" ry="8" fill="rgba(0,0,0,0.15)" />}

      {/* === LEGS (behind torso) === */}
      {/* Left leg skin */}
      <rect x={leftLegX} y={legTop} width={legW} height={legBot - legTop} rx={legW / 2} fill={skin} />
      <rect x={leftLegX} y={legTop} width={legW * 0.35} height={legBot - legTop} rx={legW / 4} fill={skinDark} opacity="0.08" />
      {/* Right leg skin */}
      <rect x={rightLegX} y={legTop} width={legW} height={legBot - legTop} rx={legW / 2} fill={skin} />

      {/* === PANTS === */}
      {renderPants(config.pants, pf, cx, hipY, hipW, leftLegX, rightLegX, legW, legBot, uid)}

      {/* === SHOES === */}
      {renderShoes(config.shoes, shf, leftLegX, rightLegX, legW, legBot)}

      {/* === TORSO (skin) === */}
      <path
        d={`M ${cx - shoulderW / 2} ${shoulderY}
            Q ${cx} ${shoulderY - 6} ${cx + shoulderW / 2} ${shoulderY}
            L ${cx + waistW / 2} ${waistY}
            L ${cx + hipW / 2} ${hipY}
            Q ${cx} ${hipY + 5} ${cx - hipW / 2} ${hipY}
            L ${cx - waistW / 2} ${waistY}
            Z`}
        fill={`url(#${uid}-skinG)`}
      />
      {/* Torso shading */}
      <path
        d={`M ${cx - shoulderW / 2} ${shoulderY}
            Q ${cx} ${shoulderY - 6} ${cx + shoulderW / 2} ${shoulderY}
            L ${cx + waistW / 2} ${waistY}
            L ${cx + hipW / 2} ${hipY}
            Q ${cx} ${hipY + 5} ${cx - hipW / 2} ${hipY}
            L ${cx - waistW / 2} ${waistY}
            Z`}
        fill={skinDark}
        opacity="0.04"
      />

      {/* === SHIRT === */}
      {renderShirt(config.shirt, sf, cx, shoulderY, shoulderW, waistY, waistW, hipY, hipW, isFemale, uid)}

      {/* === ARMS === */}
      {/* Left arm */}
      <rect x={leftArmX} y={armTop} width={armW} height={armBot - armTop} rx={armW / 2} fill={skin} transform={`rotate(8 ${leftArmX + armW / 2} ${armTop})`} />
      {/* Right arm */}
      <rect x={rightArmX} y={armTop} width={armW} height={armBot - armTop} rx={armW / 2} fill={skin} transform={`rotate(-8 ${rightArmX + armW / 2} ${armTop})`} />

      {/* Sleeves on arms */}
      {renderSleeves(config.shirt, sf, leftArmX, rightArmX, armW, armTop, uid)}

      {/* Hands */}
      <ellipse cx={leftArmX + armW / 2 - 6} cy={armBot + 2} rx="8" ry="7" fill={skinLight} />
      <ellipse cx={rightArmX + armW / 2 + 6} cy={armBot + 2} rx="8" ry="7" fill={skinLight} />
      {/* Finger lines */}
      <g stroke={skinDark} strokeWidth="0.8" opacity="0.25" strokeLinecap="round">
        <line x1={leftArmX - 2} y1={armBot} x2={leftArmX - 4} y2={armBot + 6} />
        <line x1={leftArmX} y1={armBot + 1} x2={leftArmX - 2} y2={armBot + 8} />
        <line x1={leftArmX + 2} y1={armBot + 2} x2={leftArmX} y2={armBot + 9} />
        <line x1={rightArmX + armW + 2} y1={armBot} x2={rightArmX + armW + 4} y2={armBot + 6} />
        <line x1={rightArmX + armW} y1={armBot + 1} x2={rightArmX + armW + 2} y2={armBot + 8} />
        <line x1={rightArmX + armW - 2} y1={armBot + 2} x2={rightArmX + armW} y2={armBot + 9} />
      </g>

      {/* === NECK === */}
      <rect x={cx - 8} y={neckY - 4} width="16" height="18" rx="8" fill={skin} />
      <rect x={cx - 8} y={neckY - 4} width="5" height="18" rx="2.5" fill={skinDark} opacity="0.06" />

      {/* === HEAD === */}
      <ellipse cx={cx} cy={headCy} rx={headRx} ry={headRy} fill={`url(#${uid}-skinG)`} />
      
      {/* Ears */}
      <ellipse cx={cx - headRx - 2} cy={headCy + 4} rx="6" ry="8" fill={skin} />
      <ellipse cx={cx - headRx - 2} cy={headCy + 4} rx="3.5" ry="5" fill={skinDark} opacity="0.1" />
      <ellipse cx={cx + headRx + 2} cy={headCy + 4} rx="6" ry="8" fill={skin} />
      <ellipse cx={cx + headRx + 2} cy={headCy + 4} rx="3.5" ry="5" fill={skinDark} opacity="0.1" />

      {/* === EYEBROWS === */}
      <path d={`M ${cx - 20} ${headCy - 4} Q ${cx - 14} ${headCy - 10} ${cx - 6} ${headCy - 5}`}
        fill="none" stroke={hairDark} strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      <path d={`M ${cx + 6} ${headCy - 5} Q ${cx + 14} ${headCy - 10} ${cx + 20} ${headCy - 4}`}
        fill="none" stroke={hairDark} strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />

      {/* === EYES === */}
      {renderEyes(config.eyes, cx, headCy)}

      {/* === NOSE === */}
      {renderNose(config.nose, skinDark, cx, headCy)}

      {/* === MOUTH === */}
      {renderMouth(config.mouth, cx, headCy)}

      {/* Cheek blush */}
      <ellipse cx={cx - 18} cy={headCy + 18} rx="6" ry="3" fill="hsl(0 60% 70% / 0.12)" />
      <ellipse cx={cx + 18} cy={headCy + 18} rx="6" ry="3" fill="hsl(0 60% 70% / 0.12)" />

      {/* === HAIR (on top) === */}
      {renderHair(config.hair, hairColor, hairDark, cx, headCy, headRx, headRy)}

      {/* === ACCESSORY === */}
      {renderAccessory(config.accessory, cx, headCy, shoulderY)}
    </svg>
  );
}

/* ========== HAIR ========== */
function renderHair(id: number, c: string, dark: string, cx: number, cy: number, rx: number, ry: number) {
  const top = cy - ry;
  switch (id) {
    case 0: // Raspado
      return (
        <path d={`M ${cx - rx + 2} ${cy - 2} Q ${cx - rx + 2} ${top} ${cx} ${top - 3} Q ${cx + rx - 2} ${top} ${cx + rx - 2} ${cy - 2}`}
          fill={c} opacity="0.25" />
      );
    case 1: // Curto
      return (
        <path d={`M ${cx - rx + 1} ${cy + 2} Q ${cx - rx - 1} ${top - 4} ${cx} ${top - 8}
          Q ${cx + rx + 1} ${top - 4} ${cx + rx - 1} ${cy + 2}
          Q ${cx + rx - 6} ${cy - 10} ${cx} ${cy - 12}
          Q ${cx - rx + 6} ${cy - 10} ${cx - rx + 1} ${cy + 2} Z`}
          fill={c} />
      );
    case 2: // Lateral
      return (<>
        <path d={`M ${cx - rx + 1} ${cy + 2} Q ${cx - rx} ${top - 2} ${cx + 4} ${top - 7}
          Q ${cx + rx - 2} ${top - 4} ${cx + rx} ${cy - 4}
          Q ${cx + 8} ${cy - 14} ${cx - 6} ${cy - 12}
          Q ${cx - rx + 4} ${cy - 8} ${cx - rx + 1} ${cy + 2} Z`}
          fill={c} />
        <path d={`M ${cx + rx - 5} ${top + 4} L ${cx + rx + 2} ${cy - 6} L ${cx + rx} ${cy + 6}`}
          fill={c} />
      </>);
    case 3: // Cacheado
      return (<>
        {[-16, -6, 6, 16, -11, 0, 11].map((dx, i) => (
          <circle key={i} cx={cx + dx} cy={top + 2 + (i % 3) * 4} r="13" fill={c} />
        ))}
        <path d={`M ${cx - rx - 2} ${cy + 4} Q ${cx - 10} ${cy - 6} ${cx} ${cy - 8} Q ${cx + 10} ${cy - 6} ${cx + rx + 2} ${cy + 4}`}
          fill={c} />
      </>);
    case 4: // Moicano
      return (<>
        <path d={`M ${cx - 10} ${cy + 2} L ${cx - 7} ${top - 16} Q ${cx} ${top - 26} ${cx + 7} ${top - 16} L ${cx + 10} ${cy + 2}
          Q ${cx} ${cy - 6} ${cx - 10} ${cy + 2} Z`}
          fill={c} />
        <path d={`M ${cx - 4} ${top - 10} L ${cx} ${top - 22} L ${cx + 4} ${top - 10}`}
          fill={dark} opacity="0.3" />
      </>);
    case 5: // Longo
      return (<>
        <path d={`M ${cx - rx - 2} ${cy + 4} Q ${cx - rx - 4} ${top - 6} ${cx} ${top - 10}
          Q ${cx + rx + 4} ${top - 6} ${cx + rx + 2} ${cy + 4}
          Q ${cx + rx - 4} ${cy - 8} ${cx} ${cy - 10}
          Q ${cx - rx + 4} ${cy - 8} ${cx - rx - 2} ${cy + 4} Z`}
          fill={c} />
        {/* Long strands */}
        <path d={`M ${cx - rx - 1} ${cy + 2} Q ${cx - rx - 3} ${cy + 40} ${cx - rx + 4} ${cy + 70}`}
          stroke={c} strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d={`M ${cx + rx + 1} ${cy + 2} Q ${cx + rx + 3} ${cy + 40} ${cx + rx - 4} ${cy + 70}`}
          stroke={c} strokeWidth="10" fill="none" strokeLinecap="round" />
      </>);
    case 6: // Franja
      return (<>
        <path d={`M ${cx - rx + 1} ${cy + 2} Q ${cx - rx - 1} ${top - 4} ${cx} ${top - 8}
          Q ${cx + rx + 1} ${top - 4} ${cx + rx - 1} ${cy + 2}
          Q ${cx + rx - 6} ${cy - 10} ${cx} ${cy - 12}
          Q ${cx - rx + 6} ${cy - 10} ${cx - rx + 1} ${cy + 2} Z`}
          fill={c} />
        {/* Bangs */}
        <path d={`M ${cx - rx + 3} ${cy - 2} Q ${cx - 8} ${cy + 6} ${cx + 2} ${cy + 2}
          Q ${cx + 14} ${cy - 2} ${cx + rx - 6} ${cy - 6}`}
          fill={dark} opacity="0.3" />
      </>);
    case 7: // Coque
      return (<>
        <path d={`M ${cx - rx + 1} ${cy + 2} Q ${cx - rx - 1} ${top - 4} ${cx} ${top - 8}
          Q ${cx + rx + 1} ${top - 4} ${cx + rx - 1} ${cy + 2}
          Q ${cx + rx - 6} ${cy - 10} ${cx} ${cy - 12}
          Q ${cx - rx + 6} ${cy - 10} ${cx - rx + 1} ${cy + 2} Z`}
          fill={c} />
        <circle cx={cx} cy={top - 10} r="14" fill={c} />
        <circle cx={cx} cy={top - 10} r="7" fill={dark} opacity="0.15" />
      </>);
    case 8: // Rabo de Cavalo
      return (<>
        <path d={`M ${cx - rx + 1} ${cy + 2} Q ${cx - rx - 1} ${top - 4} ${cx} ${top - 8}
          Q ${cx + rx + 1} ${top - 4} ${cx + rx - 1} ${cy + 2}
          Q ${cx + rx - 6} ${cy - 10} ${cx} ${cy - 12}
          Q ${cx - rx + 6} ${cy - 10} ${cx - rx + 1} ${cy + 2} Z`}
          fill={c} />
        <path d={`M ${cx + rx - 4} ${cy - 4} Q ${cx + rx + 16} ${cy + 6} ${cx + rx + 12} ${cy + 40}
          Q ${cx + rx + 8} ${cy + 56} ${cx + rx - 2} ${cy + 60}`}
          stroke={c} strokeWidth="8" fill="none" strokeLinecap="round" />
      </>);
    case 9: // Afro
      return (
        <ellipse cx={cx} cy={cy - 6} rx={rx + 16} ry={ry + 10} fill={c} />
      );
    case 10: // Tranças
      return (<>
        <path d={`M ${cx - rx + 1} ${cy + 2} Q ${cx - rx - 1} ${top - 4} ${cx} ${top - 8}
          Q ${cx + rx + 1} ${top - 4} ${cx + rx - 1} ${cy + 2}
          Q ${cx + rx - 6} ${cy - 10} ${cx} ${cy - 12}
          Q ${cx - rx + 6} ${cy - 10} ${cx - rx + 1} ${cy + 2} Z`}
          fill={c} />
        {[-18, -6, 6, 18].map((dx, i) => (
          <path key={i} d={`M ${cx + dx} ${cy + 2} L ${cx + dx + (dx < 0 ? -3 : 3)} ${cy + 55}`}
            stroke={c} strokeWidth="7" strokeLinecap="round" fill="none" />
        ))}
        {[-18, -6, 6, 18].map((dx, i) => (
          <circle key={`tip-${i}`} cx={cx + dx + (dx < 0 ? -3 : 3)} cy={cy + 58} r="4" fill={dark} opacity="0.3" />
        ))}
      </>);
    case 11: // Buzz Cut
      return (
        <path d={`M ${cx - rx + 3} ${cy} Q ${cx - rx + 1} ${top + 2} ${cx} ${top - 2}
          Q ${cx + rx - 1} ${top + 2} ${cx + rx - 3} ${cy}
          Q ${cx + rx - 8} ${cy - 8} ${cx} ${cy - 9}
          Q ${cx - rx + 8} ${cy - 8} ${cx - rx + 3} ${cy} Z`}
          fill={c} opacity="0.8" />
      );
    default:
      return null;
  }
}

/* ========== EYES ========== */
function renderEyes(id: number, cx: number, cy: number) {
  const lx = cx - 13;
  const rx = cx + 13;
  const ey = cy + 4;

  const fullEye = (iris: string, sz = 4.5) => (<>
    {/* Eye whites */}
    <ellipse cx={lx} cy={ey} rx={sz + 3} ry={sz + 1} fill="white" />
    <ellipse cx={rx} cy={ey} rx={sz + 3} ry={sz + 1} fill="white" />
    {/* Iris */}
    <circle cx={lx} cy={ey + 0.5} r={sz * 0.7} fill={iris} />
    <circle cx={rx} cy={ey + 0.5} r={sz * 0.7} fill={iris} />
    {/* Pupil */}
    <circle cx={lx} cy={ey + 0.5} r={sz * 0.3} fill="#111" />
    <circle cx={rx} cy={ey + 0.5} r={sz * 0.3} fill="#111" />
    {/* Highlight */}
    <circle cx={lx - 1.5} cy={ey - 1} r={sz * 0.22} fill="white" opacity="0.9" />
    <circle cx={rx - 1.5} cy={ey - 1} r={sz * 0.22} fill="white" opacity="0.9" />
    {/* Lower lid line */}
    <path d={`M ${lx - sz - 1} ${ey + 2} Q ${lx} ${ey + sz + 2} ${lx + sz + 1} ${ey + 2}`}
      fill="none" stroke="hsl(220 15% 30%)" strokeWidth="0.8" opacity="0.2" />
    <path d={`M ${rx - sz - 1} ${ey + 2} Q ${rx} ${ey + sz + 2} ${rx + sz + 1} ${ey + 2}`}
      fill="none" stroke="hsl(220 15% 30%)" strokeWidth="0.8" opacity="0.2" />
  </>);

  switch (id) {
    case 0: return fullEye('#1A1A1A');        // Natural (marrom escuro)
    case 1: return fullEye('#2563EB');        // Azul
    case 2: // Sorridente (olhos fechados felizes)
      return (<>
        <path d={`M ${lx - 7} ${ey + 1} Q ${lx} ${ey - 5} ${lx + 7} ${ey + 1}`}
          fill="none" stroke="hsl(220 18% 18%)" strokeWidth="2.5" strokeLinecap="round" />
        <path d={`M ${rx - 7} ${ey + 1} Q ${rx} ${ey - 5} ${rx + 7} ${ey + 1}`}
          fill="none" stroke="hsl(220 18% 18%)" strokeWidth="2.5" strokeLinecap="round" />
      </>);
    case 3: // Focado (olhos com pálpebra)
      return (<>
        {fullEye('#1A1A1A', 4)}
        <path d={`M ${lx - 6} ${ey - 3} Q ${lx} ${ey - 7} ${lx + 6} ${ey - 3}`}
          fill="none" stroke="hsl(220 18% 25%)" strokeWidth="2" />
        <path d={`M ${rx - 6} ${ey - 3} Q ${rx} ${ey - 7} ${rx + 6} ${ey - 3}`}
          fill="none" stroke="hsl(220 18% 25%)" strokeWidth="2" />
      </>);
    case 4: return fullEye('#16A34A');        // Verde
    case 5: return fullEye('#1A1A1A', 3.5);   // Compacto
    case 6: return fullEye('#6B4428');         // Castanho
    case 7: return fullEye('#94A3B8');         // Cinza
    case 8: return fullEye('#D97706');         // Âmbar
    case 9: // Determinado
      return (<>
        {fullEye('#1A1A1A', 4)}
        <path d={`M ${lx - 7} ${ey - 5} L ${lx + 7} ${ey - 3}`}
          fill="none" stroke="hsl(220 18% 20%)" strokeWidth="2.2" strokeLinecap="round" />
        <path d={`M ${rx - 7} ${ey - 3} L ${rx + 7} ${ey - 5}`}
          fill="none" stroke="hsl(220 18% 20%)" strokeWidth="2.2" strokeLinecap="round" />
      </>);
    default: return fullEye('#1A1A1A');
  }
}

/* ========== NOSE ========== */
function renderNose(id: number, shadow: string, cx: number, cy: number) {
  const ny = cy + 12;
  switch (id) {
    case 0: // Reta
      return (<>
        <path d={`M ${cx - 1} ${cy + 2} L ${cx} ${ny} Q ${cx + 2} ${ny + 4} ${cx + 5} ${ny + 1}`}
          fill="none" stroke={shadow} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      </>);
    case 1: // Marcante
      return (<>
        <path d={`M ${cx - 1} ${cy} Q ${cx + 3} ${ny - 2} ${cx + 1} ${ny + 2} Q ${cx + 3} ${ny + 5} ${cx + 8} ${ny}`}
          fill="none" stroke={shadow} strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
      </>);
    case 2: // Fina
      return (
        <path d={`M ${cx} ${cy + 4} L ${cx + 1} ${ny + 2} Q ${cx + 2} ${ny + 4} ${cx + 5} ${ny + 1}`}
          fill="none" stroke={shadow} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      );
    case 3: // Leve
      return (
        <path d={`M ${cx - 2} ${ny - 2} Q ${cx + 1} ${ny + 3} ${cx + 5} ${ny - 1}`}
          fill="none" stroke={shadow} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
      );
    default: return null;
  }
}

/* ========== MOUTH ========== */
function renderMouth(id: number, cx: number, cy: number) {
  const my = cy + 22;
  const lipColor = '#B5655D';
  const lipDark = '#8B4F4A';
  switch (id) {
    case 0: // Sorriso
      return <path d={`M ${cx - 10} ${my} Q ${cx} ${my + 10} ${cx + 10} ${my}`}
        fill="none" stroke={lipColor} strokeWidth="2.2" strokeLinecap="round" />;
    case 1: // Sério
      return <path d={`M ${cx - 8} ${my + 2} H ${cx + 8}`}
        fill="none" stroke={lipColor} strokeWidth="2.2" strokeLinecap="round" />;
    case 2: // Aberto
      return (<>
        <ellipse cx={cx} cy={my + 2} rx="7" ry="5" fill={lipDark} opacity="0.4" />
        <ellipse cx={cx} cy={my + 2} rx="5" ry="3" fill="#2D1515" opacity="0.3" />
      </>);
    case 3: // Confiante
      return <path d={`M ${cx - 9} ${my} Q ${cx} ${my + 6} ${cx + 9} ${my}`}
        fill="none" stroke={lipColor} strokeWidth="2" strokeLinecap="round" />;
    case 4: // Sutil
      return <path d={`M ${cx - 6} ${my + 2} Q ${cx} ${my + 5} ${cx + 6} ${my + 2}`}
        fill="none" stroke={lipColor} strokeWidth="1.8" strokeLinecap="round" />;
    case 5: // Largo
      return <path d={`M ${cx - 14} ${my} Q ${cx} ${my + 12} ${cx + 14} ${my}`}
        fill="none" stroke={lipColor} strokeWidth="2.2" strokeLinecap="round" />;
    case 6: // Determinado
      return <path d={`M ${cx - 8} ${my + 3} Q ${cx} ${my - 1} ${cx + 8} ${my + 3}`}
        fill="none" stroke={lipDark} strokeWidth="2.2" strokeLinecap="round" />;
    case 7: // Calmo
      return <path d={`M ${cx - 7} ${my + 1} Q ${cx} ${my + 5} ${cx + 7} ${my + 1}`}
        fill="none" stroke="#BD7A73" strokeWidth="2" strokeLinecap="round" />;
    case 8: // Bigode
      return (<>
        <path d={`M ${cx - 9} ${my + 1} Q ${cx} ${my + 8} ${cx + 9} ${my + 1}`}
          fill="none" stroke={lipDark} strokeWidth="2" strokeLinecap="round" />
        <path d={`M ${cx - 12} ${my - 5} Q ${cx - 6} ${my - 8} ${cx} ${my - 5} Q ${cx + 6} ${my - 8} ${cx + 12} ${my - 5}`}
          fill="none" stroke="#3B2B22" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      </>);
    case 9: // Barba curta
      return (<>
        <path d={`M ${cx - 9} ${my + 1} Q ${cx} ${my + 8} ${cx + 9} ${my + 1}`}
          fill="none" stroke={lipDark} strokeWidth="2" strokeLinecap="round" />
        <path d={`M ${cx - 16} ${my} Q ${cx - 16} ${my + 16} ${cx} ${my + 20}
          Q ${cx + 16} ${my + 16} ${cx + 16} ${my}`}
          fill="none" stroke="#3B2B22" strokeWidth="3.5" strokeLinecap="round" opacity="0.4" />
      </>);
    default: return null;
  }
}

/* ========== SHIRT ========== */
function renderShirt(
  id: number, sf: { main: string; detail: string },
  cx: number, sy: number, sw: number, wy: number, ww: number, hy: number, hw: number,
  _fem: boolean, uid: string,
) {
  const torso = `M ${cx - sw / 2} ${sy}
    Q ${cx} ${sy - 6} ${cx + sw / 2} ${sy}
    L ${cx + ww / 2} ${wy}
    L ${cx + hw / 2} ${hy}
    Q ${cx} ${hy + 5} ${cx - hw / 2} ${hy}
    L ${cx - ww / 2} ${wy} Z`;

  const details: Record<number, React.ReactNode> = {
    2: (<> {/* Jaleco - lab coat lines */}
      <line x1={cx - 4} y1={sy + 8} x2={cx - 2} y2={hy - 4} stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1={cx + 4} y1={sy + 8} x2={cx + 2} y2={hy - 4} stroke="#CBD5E1" strokeWidth="1.5" />
      <circle cx={cx - 8} cy={sy + 20} r="2.5" fill="#3B82F6" opacity="0.6" />
    </>),
    3: (<> {/* Moletom - kangaroo pocket */}
      <rect x={cx - 14} y={wy - 12} width="28" height="8" rx="4" fill="hsl(45 95% 55% / 0.5)" />
    </>),
    6: (<> {/* Neon stripes */}
      <line x1={cx - sw / 2 + 6} y1={wy - 10} x2={cx + sw / 2 - 6} y2={wy - 10}
        stroke="hsl(160 80% 60% / 0.7)" strokeWidth="3" strokeLinecap="round" />
      <line x1={cx - sw / 2 + 8} y1={wy + 2} x2={cx + sw / 2 - 8} y2={wy + 2}
        stroke="hsl(160 80% 80% / 0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </>),
    7: (<> {/* Blazer lapels */}
      <path d={`M ${cx - 4} ${sy + 4} L ${cx} ${sy + 22} L ${cx + 4} ${sy + 4}`}
        fill="hsl(210 40% 90%)" opacity="0.6" />
    </>),
  };

  return (<>
    <path d={torso} fill={`url(#${uid}-shirtG)`} />
    {/* Collar / neckline */}
    <path d={`M ${cx - 10} ${sy + 2} Q ${cx} ${sy + 10} ${cx + 10} ${sy + 2}`}
      fill="none" stroke={sf.detail} strokeWidth="1.5" opacity="0.4" />
    {details[id]}
  </>);
}

/* ========== SLEEVES ========== */
function renderSleeves(id: number, sf: { main: string; detail: string }, lx: number, rx: number, w: number, top: number, _uid: string) {
  const sleeveH = id === 2 ? 60 : 35; // lab coat has longer sleeves
  return (<>
    <rect x={lx} y={top} width={w} height={sleeveH} rx={w / 2} fill={sf.main}
      transform={`rotate(8 ${lx + w / 2} ${top})`} />
    <rect x={rx} y={top} width={w} height={sleeveH} rx={w / 2} fill={sf.main}
      transform={`rotate(-8 ${rx + w / 2} ${top})`} />
  </>);
}

/* ========== PANTS ========== */
function renderPants(
  id: number, pf: { main: string; detail: string },
  cx: number, hy: number, hw: number,
  llx: number, rlx: number, lw: number, lb: number,
  uid: string,
) {
  const isShort = id === 3; // Areia = shorts
  const legH = isShort ? 35 : lb - hy + 6;

  return (<>
    {/* Waistband */}
    <path d={`M ${cx - hw / 2 - 2} ${hy - 2} Q ${cx} ${hy - 6} ${cx + hw / 2 + 2} ${hy - 2}
      L ${cx + hw / 2 + 2} ${hy + 6} Q ${cx} ${hy + 2} ${cx - hw / 2 - 2} ${hy + 6} Z`}
      fill={pf.detail} />
    {/* Left pant leg */}
    <rect x={llx - 1} y={hy + 2} width={lw + 2} height={legH} rx={lw / 2}
      fill={`url(#${uid}-pantsG)`} />
    {/* Right pant leg */}
    <rect x={rlx - 1} y={hy + 2} width={lw + 2} height={legH} rx={lw / 2}
      fill={`url(#${uid}-pantsG)`} />
    {/* Center seam */}
    <line x1={cx} y1={hy + 4} x2={cx} y2={hy + legH * 0.6}
      stroke={pf.detail} strokeWidth="1.2" opacity="0.25" />
  </>);
}

/* ========== SHOES ========== */
function renderShoes(id: number, sf: { main: string; sole: string; accent: string }, llx: number, rlx: number, lw: number, lb: number) {
  const y = lb - 4;
  const w = lw + 6;
  const isBoot = id === 2 || id === 6;
  const bootH = isBoot ? 18 : 0;

  return (<>
    {/* Boot shaft */}
    {isBoot && <>
      <rect x={llx - 2} y={y - bootH} width={lw + 4} height={bootH + 4} rx={4} fill={sf.main} />
      <rect x={rlx - 2} y={y - bootH} width={lw + 4} height={bootH + 4} rx={4} fill={sf.main} />
    </>}
    {/* Left shoe */}
    <path d={`M ${llx - 2} ${y} H ${llx + w} Q ${llx + w + 4} ${y + 5} ${llx + w - 2} ${y + 10}
      H ${llx - 4} Q ${llx - 8} ${y + 6} ${llx - 2} ${y} Z`}
      fill={sf.main} />
    {/* Right shoe */}
    <path d={`M ${rlx - 2} ${y} H ${rlx + w} Q ${rlx + w + 4} ${y + 5} ${rlx + w - 2} ${y + 10}
      H ${rlx - 4} Q ${rlx - 8} ${y + 6} ${rlx - 2} ${y} Z`}
      fill={sf.main} />
    {/* Soles */}
    <rect x={llx - 4} y={y + 8} width={w + 4} height="4" rx="2" fill={sf.sole} />
    <rect x={rlx - 4} y={y + 8} width={w + 4} height="4" rx="2" fill={sf.sole} />
    {/* Accent lines */}
    <line x1={llx} y1={y + 4} x2={llx + w - 2} y2={y + 4}
      stroke={sf.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <line x1={rlx} y1={y + 4} x2={rlx + w - 2} y2={y + 4}
      stroke={sf.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </>);
}

/* ========== ACCESSORY ========== */
function renderAccessory(id: number, cx: number, headCy: number, shoulderY: number) {
  switch (id) {
    case 1: // Cordão
      return (<>
        <path d={`M ${cx - 8} ${shoulderY + 2} Q ${cx} ${shoulderY + 24} ${cx + 8} ${shoulderY + 2}`}
          fill="none" stroke="#D4AF37" strokeWidth="2" />
        <circle cx={cx} cy={shoulderY + 22} r="5" fill="#D4AF37" />
        <circle cx={cx} cy={shoulderY + 22} r="2.5" fill="#FDE68A" />
      </>);
    case 2: // Crachá
      return (<>
        <path d={`M ${cx - 6} ${shoulderY + 2} L ${cx - 10} ${shoulderY + 32}`} stroke="#38BDF8" strokeWidth="1.8" />
        <path d={`M ${cx + 6} ${shoulderY + 2} L ${cx + 10} ${shoulderY + 32}`} stroke="#38BDF8" strokeWidth="1.8" />
        <rect x={cx - 10} y={shoulderY + 30} width="20" height="26" rx="3" fill="#E2E8F0" />
        <rect x={cx - 6} y={shoulderY + 36} width="12" height="3" rx="1.5" fill="#94A3B8" />
        <rect x={cx - 5} y={shoulderY + 42} width="10" height="2" rx="1" fill="#CBD5E1" />
      </>);
    case 3: // Óculos Aviador
      return (<>
        <line x1={cx - 24} y1={headCy + 5} x2={cx + 24} y2={headCy + 5} stroke="#78716C" strokeWidth="2" />
        <ellipse cx={cx - 12} cy={headCy + 5} rx="12" ry="9" fill="hsl(40 60% 50% / 0.06)" stroke="#F59E0B" strokeWidth="1.8" />
        <ellipse cx={cx + 12} cy={headCy + 5} rx="12" ry="9" fill="hsl(40 60% 50% / 0.06)" stroke="#F59E0B" strokeWidth="1.8" />
      </>);
    case 4: // Óculos Redondo
      return (<>
        <line x1={cx - 22} y1={headCy + 5} x2={cx + 22} y2={headCy + 5} stroke="#94A3B8" strokeWidth="2" />
        <circle cx={cx - 12} cy={headCy + 5} r="10" fill="none" stroke="#CBD5E1" strokeWidth="1.8" />
        <circle cx={cx + 12} cy={headCy + 5} r="10" fill="none" stroke="#CBD5E1" strokeWidth="1.8" />
      </>);
    case 5: // Visor Tech
      return (<>
        <rect x={cx - 26} y={headCy + 1} width="52" height="12" rx="6" fill="hsl(192 93% 56% / 0.1)" stroke="#22D3EE" strokeWidth="1.8" />
        <line x1={cx - 26} y1={headCy + 3} x2={cx + 26} y2={headCy + 3} stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </>);
    default: return null;
  }
}
