import { SKIN_TONES, HAIR_COLORS } from '@/lib/gameData';
import { AvatarConfig } from '@/lib/gameStore';

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

export default function Avatar({ config, size = 80, className = '' }: AvatarProps) {
  const skin = SKIN_TONES[config.skinTone] || SKIN_TONES[0];
  const hairCol = HAIR_COLORS[config.hairColor] || HAIR_COLORS[0];

  // Full body proportions - viewBox 100x200
  const vw = 100, vh = 200;
  const scale = size / vw;

  const HAIR_PATHS: Record<number, React.ReactNode> = {
    0: null, // bald
    1: <path d="M30 60 Q30 30 50 25 Q70 30 70 60 Q65 42 50 40 Q35 42 30 60Z" fill={hairCol} />,
    2: <><path d="M28 62 Q28 28 50 24 Q72 28 72 62 Q66 42 50 38 Q34 42 28 62Z" fill={hairCol} /><path d="M28 60 Q28 65 32 70 L28 62Z" fill={hairCol} /><path d="M72 60 Q72 65 68 70 L72 62Z" fill={hairCol} /></>,
    3: <><ellipse cx="50" cy="38" rx="28" ry="22" fill={hairCol} /><ellipse cx="50" cy="40" rx="24" ry="18" fill={skin} /></>,
    4: <path d="M42 55 L42 22 Q50 15 58 22 L58 55 Q55 50 50 48 Q45 50 42 55Z" fill={hairCol} />,
    5: <><path d="M28 62 Q28 26 50 22 Q72 26 72 62 Q66 42 50 38 Q34 42 28 62Z" fill={hairCol} /><path d="M28 60 L26 100 L32 100 L30 62Z" fill={hairCol} /><path d="M72 60 L74 100 L68 100 L70 62Z" fill={hairCol} /></>,
    6: <><path d="M28 58 Q28 28 50 24 Q72 28 72 58 Q66 40 50 36 Q34 40 28 58Z" fill={hairCol} /><path d="M30 55 Q30 52 50 50 Q30 48 32 42Z" fill={hairCol} /></>,
    7: <><path d="M30 60 Q30 30 50 26 Q70 30 70 60 Q65 42 50 40 Q35 42 30 60Z" fill={hairCol} /><ellipse cx="50" cy="30" rx="10" ry="10" fill={hairCol} /></>,
    8: <><path d="M28 60 Q28 28 50 24 Q72 28 72 60 Q66 40 50 38 Q34 40 28 60Z" fill={hairCol} /><path d="M60 45 Q70 35 72 50 Q74 65 68 75 L62 65Z" fill={hairCol} /></>,
    9: <ellipse cx="50" cy="40" rx="28" ry="25" fill={hairCol} />,
    10: <><path d="M30 58 Q30 28 50 24 Q70 28 70 58 Q65 40 50 38 Q35 40 30 58Z" fill={hairCol} /><path d="M32 55 L28 80 L34 78Z" fill={hairCol} /><path d="M68 55 L72 80 L66 78Z" fill={hairCol} /><path d="M45 55 L42 82 L48 80Z" fill={hairCol} /><path d="M55 55 L58 82 L52 80Z" fill={hairCol} /></>,
    11: <path d="M32 56 Q32 42 50 40 Q68 42 68 56 Q64 48 50 46 Q36 48 32 56Z" fill={hairCol} opacity="0.5" />,
  };

  const EYE_PATHS: Record<number, React.ReactNode> = {
    0: <><circle cx="42" cy="54" r="3.5" fill="white" /><circle cx="58" cy="54" r="3.5" fill="white" /><circle cx="42" cy="55" r="2" fill="#1a1a2e" /><circle cx="58" cy="55" r="2" fill="#1a1a2e" /><circle cx="43" cy="53.5" r="0.8" fill="white" /><circle cx="59" cy="53.5" r="0.8" fill="white" /></>,
    1: <><circle cx="42" cy="54" r="3.5" fill="white" /><circle cx="58" cy="54" r="3.5" fill="white" /><circle cx="42" cy="55" r="2" fill="#DC2626" /><circle cx="58" cy="55" r="2" fill="#DC2626" /><circle cx="43" cy="53.5" r="0.8" fill="white" /><circle cx="59" cy="53.5" r="0.8" fill="white" /></>,
    2: <><path d="M38 54 Q42 50 46 54" fill="none" stroke="#1a1a2e" strokeWidth="1.5" /><path d="M54 54 Q58 50 62 54" fill="none" stroke="#1a1a2e" strokeWidth="1.5" /></>,
    3: <><circle cx="42" cy="54" r="4" fill="white" /><circle cx="58" cy="54" r="4" fill="white" /><circle cx="43" cy="55" r="2.5" fill="#1a1a2e" /><circle cx="59" cy="55" r="2.5" fill="#1a1a2e" /><circle cx="44" cy="53.5" r="1" fill="white" /><circle cx="60" cy="53.5" r="1" fill="white" /></>,
    4: <><circle cx="42" cy="54" r="3.5" fill="white" /><circle cx="58" cy="54" r="3.5" fill="white" /><circle cx="42" cy="55" r="2" fill="#2563EB" /><circle cx="58" cy="55" r="2" fill="#2563EB" /><circle cx="43" cy="53.5" r="0.8" fill="white" /><circle cx="59" cy="53.5" r="0.8" fill="white" /></>,
    5: <><circle cx="42" cy="54" r="2.5" fill="white" /><circle cx="58" cy="54" r="2.5" fill="white" /><circle cx="42" cy="54.5" r="1.5" fill="#1a1a2e" /><circle cx="58" cy="54.5" r="1.5" fill="#1a1a2e" /></>,
    6: <><circle cx="42" cy="54" r="3.5" fill="white" /><circle cx="58" cy="54" r="3.5" fill="white" /><circle cx="42" cy="55" r="2" fill="#8B4513" /><circle cx="58" cy="55" r="2" fill="#8B4513" /><circle cx="43" cy="53.5" r="0.8" fill="white" /><circle cx="59" cy="53.5" r="0.8" fill="white" /></>,
    7: <><circle cx="42" cy="54" r="3.5" fill="white" /><circle cx="58" cy="54" r="3.5" fill="white" /><circle cx="42" cy="55" r="2" fill="#16A34A" /><circle cx="58" cy="55" r="2" fill="#16A34A" /><circle cx="43" cy="53.5" r="0.8" fill="white" /><circle cx="59" cy="53.5" r="0.8" fill="white" /></>,
    8: <><circle cx="42" cy="54" r="3.5" fill="white" /><circle cx="58" cy="54" r="3.5" fill="white" /><circle cx="42" cy="55" r="2" fill="#9CA3AF" /><circle cx="58" cy="55" r="2" fill="#9CA3AF" /><circle cx="43" cy="53.5" r="0.8" fill="white" /><circle cx="59" cy="53.5" r="0.8" fill="white" /></>,
    9: <><circle cx="42" cy="54" r="3.5" fill="white" /><circle cx="58" cy="54" r="3.5" fill="white" /><circle cx="42" cy="55" r="2" fill="#F59E0B" /><circle cx="58" cy="55" r="2" fill="#F59E0B" /><circle cx="43" cy="53.5" r="0.8" fill="white" /><circle cx="59" cy="53.5" r="0.8" fill="white" /></>,
  };

  const NOSE_PATHS: Record<number, React.ReactNode> = {
    0: <path d="M49 58 Q50 64 51 58" fill="none" stroke={`${skin}99`} strokeWidth="1.5" strokeLinecap="round" />,
    1: <path d="M48 57 Q50 66 52 57" fill="none" stroke={`${skin}99`} strokeWidth="2" strokeLinecap="round" />,
    2: <path d="M49 58 L50 63 L51 58" fill="none" stroke={`${skin}99`} strokeWidth="1" strokeLinecap="round" />,
    3: <path d="M48 60 Q50 63 52 60" fill="none" stroke={`${skin}99`} strokeWidth="1.5" strokeLinecap="round" />,
  };

  const MOUTH_PATHS: Record<number, React.ReactNode> = {
    0: <path d="M44 67 Q50 72 56 67" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round" />,
    1: <><path d="M44 67 Q50 72 56 67" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round" /><path d="M44 69 Q50 72 56 69" fill="#5C4033" /></>,
    2: <><path d="M44 67 Q50 72 56 67" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round" /><path d="M44 69 Q50 72 56 69" fill="#5C4033" /><rect x="36" y="50" width="28" height="9" rx="4" fill="rgba(0,0,0,0.7)" /></>,
    3: <path d="M44 68 L56 68" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" />,
    4: <ellipse cx="50" cy="68" rx="5" ry="3" fill="rgba(0,0,0,0.15)" />,
    5: <path d="M44 67 Q50 72 56 67" fill="#7C3AED" strokeWidth="1" />,
    6: <path d="M44 67 Q50 72 56 67" fill="#DC2626" strokeWidth="1" />,
    7: <path d="M44 67 Q50 72 56 67" fill="#EC4899" strokeWidth="1" />,
    8: <path d="M46 68 Q50 70 54 68" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" />,
    9: <><path d="M42 66 Q50 76 58 66" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round" /><path d="M44 67 Q50 74 56 67" fill="white" opacity="0.6" /></>,
  };

  const SHIRT_PATHS: Record<number, React.ReactNode> = {
    0: null,
    1: <path d="M30 88 C30 82 36 78 42 78 L58 78 C64 78 70 82 70 88 L74 130 L26 130Z" fill="#1a1a2e" />,
    2: <path d="M30 88 C30 82 36 78 42 78 L58 78 C64 78 70 82 70 88 L74 130 L26 130Z" fill="#22C55E" />,
    3: <path d="M30 88 C30 82 36 78 42 78 L58 78 C64 78 70 82 70 88 L74 130 L26 130Z" fill="#EC4899" />,
    4: <path d="M30 88 C30 82 36 78 42 78 L58 78 C64 78 70 82 70 88 L74 130 L26 130Z" fill="#3B82F6" />,
    5: <><path d="M30 88 C30 82 36 78 42 78 L58 78 C64 78 70 82 70 88 L74 130 L26 130Z" fill="#EF4444" /><text x="50" y="110" fontSize="16" fill="white" textAnchor="middle" fontFamily="sans-serif">★</text></>,
    6: <path d="M30 88 C30 82 36 78 42 78 L58 78 C64 78 70 82 70 88 L74 130 L26 130Z" fill="#F97316" />,
    7: <><path d="M30 88 C30 82 36 78 42 78 L58 78 C64 78 70 82 70 88 L74 130 L26 130Z" fill="white" /><path d="M26 130 L30 88 C30 82 34 78 38 78 L38 130Z" fill="#f0f0f0" /><path d="M74 130 L70 88 C70 82 66 78 62 78 L62 130Z" fill="#f0f0f0" /></>,
  };

  const PANTS_PATHS: Record<number, React.ReactNode> = {
    0: null,
    1: <path d="M28 128 L26 158 L38 158 L42 140 L50 145 L58 140 L62 158 L74 158 L72 128Z" fill="#F97316" />,
    2: <path d="M28 128 L26 158 L38 158 L42 140 L50 145 L58 140 L62 158 L74 158 L72 128Z" fill="#DC2626" />,
    3: <path d="M28 128 L26 158 L38 158 L42 140 L50 145 L58 140 L62 158 L74 158 L72 128Z" fill="#93C5FD" />,
    4: <path d="M28 128 L26 158 L38 158 L42 140 L50 145 L58 140 L62 158 L74 158 L72 128Z" fill="#1a1a2e" />,
    5: <path d="M28 128 L26 178 L38 178 L42 148 L50 152 L58 148 L62 178 L74 178 L72 128Z" fill="#1E40AF" />,
    6: <path d="M28 128 L26 178 L38 178 L42 148 L50 152 L58 148 L62 178 L74 178 L72 128Z" fill="#1a1a2e" />,
    7: <path d="M28 128 L26 178 L38 178 L42 148 L50 152 L58 148 L62 178 L74 178 L72 128Z" fill="#2563EB" />,
  };

  const SHOE_PATHS: Record<number, React.ReactNode> = {
    0: null,
    1: <><ellipse cx="32" cy="185" rx="10" ry="5" fill="white" /><ellipse cx="68" cy="185" rx="10" ry="5" fill="white" /></>,
    2: <><path d="M24 178 L24 185 Q32 192 40 185 L40 178Z" fill="#8B4513" /><path d="M60 178 L60 185 Q68 192 76 185 L76 178Z" fill="#8B4513" /></>,
    3: <><path d="M26 182 L40 182 L40 188 L24 188Z" fill="#F59E0B" /><path d="M60 182 L74 182 L74 188 L58 188Z" fill="#F59E0B" /></>,
    4: <><ellipse cx="32" cy="185" rx="10" ry="5" fill="#1a1a2e" /><ellipse cx="68" cy="185" rx="10" ry="5" fill="#1a1a2e" /></>,
    5: <><ellipse cx="32" cy="185" rx="10" ry="5" fill="#DC2626" /><ellipse cx="68" cy="185" rx="10" ry="5" fill="#DC2626" /></>,
    6: <><ellipse cx="32" cy="185" rx="10" ry="5" fill="#111" /><ellipse cx="68" cy="185" rx="10" ry="5" fill="#111" /></>,
  };

  const ACC_PATHS: Record<number, React.ReactNode> = {
    0: null,
    1: <><path d="M46 76 L42 92" stroke="#22C55E" strokeWidth="1.5" fill="none" /><path d="M54 76 L58 92" stroke="#22C55E" strokeWidth="1.5" fill="none" /><circle cx="50" cy="92" r="3" fill="#22C55E" /></>,
    2: <><path d="M46 76 L42 92" stroke="#F59E0B" strokeWidth="1.5" fill="none" /><path d="M54 76 L58 92" stroke="#EC4899" strokeWidth="1.5" fill="none" /><circle cx="50" cy="92" r="3" fill="#3B82F6" /></>,
    3: <><rect x="34" y="51" width="32" height="9" rx="4" fill="rgba(0,0,0,0.6)" /><circle cx="42" cy="55" r="5" fill="rgba(0,0,0,0.5)" stroke="#F59E0B" strokeWidth="1" /><circle cx="58" cy="55" r="5" fill="rgba(0,0,0,0.5)" stroke="#F59E0B" strokeWidth="1" /></>,
    4: <><circle cx="42" cy="55" r="6" fill="none" stroke="#9CA3AF" strokeWidth="1" /><circle cx="58" cy="55" r="6" fill="none" stroke="#9CA3AF" strokeWidth="1" /><path d="M48 55 L52 55" stroke="#9CA3AF" strokeWidth="1" /></>,
    5: <><rect x="34" y="51" width="32" height="9" rx="4" fill="rgba(0,0,0,0.8)" /><rect x="36" y="52" width="12" height="7" rx="3" fill="rgba(40,40,40,0.9)" /><rect x="52" y="52" width="12" height="7" rx="3" fill="rgba(40,40,40,0.9)" /></>,
  };

  const hi = Math.min(config.hair, Object.keys(HAIR_PATHS).length - 1);
  const ei = Math.min(config.eyes, Object.keys(EYE_PATHS).length - 1);
  const ni = Math.min(config.nose, Object.keys(NOSE_PATHS).length - 1);
  const mi = Math.min(config.mouth, Object.keys(MOUTH_PATHS).length - 1);
  const si = Math.min(config.shirt, Object.keys(SHIRT_PATHS).length - 1);
  const pi = Math.min(config.pants, Object.keys(PANTS_PATHS).length - 1);
  const shi = Math.min(config.shoes, Object.keys(SHOE_PATHS).length - 1);
  const ai = Math.min(config.accessory, Object.keys(ACC_PATHS).length - 1);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${vw} ${vh}`}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 2}
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Shadow */}
      <ellipse cx="50" cy="194" rx="22" ry="4" fill="rgba(0,0,0,0.1)" />
      
      {/* Legs */}
      <rect x="38" y="130" width="10" height="52" rx="5" fill={skin} />
      <rect x="52" y="130" width="10" height="52" rx="5" fill={skin} />
      
      {/* Pants */}
      {PANTS_PATHS[pi]}
      
      {/* Shoes */}
      {SHOE_PATHS[shi]}
      
      {/* Body */}
      <rect x="32" y="78" width="36" height="54" rx="12" fill={skin} />
      
      {/* Shirt */}
      {SHIRT_PATHS[si]}
      
      {/* Neck */}
      <rect x="45" y="72" width="10" height="10" rx="4" fill={skin} />
      
      {/* Arms */}
      <rect x="20" y="82" width="10" height="40" rx="5" fill={skin} />
      <rect x="70" y="82" width="10" height="40" rx="5" fill={skin} />
      
      {/* Hands */}
      <ellipse cx="25" cy="124" rx="6" ry="5" fill={skin} />
      <ellipse cx="75" cy="124" rx="6" ry="5" fill={skin} />
      
      {/* Head */}
      <ellipse cx="50" cy="50" rx="22" ry="24" fill={skin} />
      
      {/* Ears */}
      <ellipse cx="28" cy="52" rx="4" ry="5" fill={skin} />
      <ellipse cx="72" cy="52" rx="4" ry="5" fill={skin} />
      
      {/* Eyes */}
      {EYE_PATHS[ei]}
      
      {/* Nose */}
      {NOSE_PATHS[ni]}
      
      {/* Mouth */}
      {MOUTH_PATHS[mi]}
      
      {/* Cheeks */}
      <ellipse cx="36" cy="62" rx="4" ry="2.5" fill="rgba(255,150,150,0.15)" />
      <ellipse cx="64" cy="62" rx="4" ry="2.5" fill="rgba(255,150,150,0.15)" />
      
      {/* Hair (on top) */}
      {HAIR_PATHS[hi]}
      
      {/* Accessories (on top of everything) */}
      {ACC_PATHS[ai]}
    </svg>
  );
}
