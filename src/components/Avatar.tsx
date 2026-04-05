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
  
  // Darken skin for nose/shadow
  const skinDark = darken(skin, 25);
  const skinShadow = darken(skin, 12);

  const hi = config.hair;
  const ei = config.eyes;
  const ni = config.nose;
  const mi = config.mouth;
  const si = config.shirt;
  const pi = config.pants;
  const shi = config.shoes;
  const ai = config.accessory;

  // Gender affects body shape slightly
  const isFemale = config.bodyType >= 3;

  return (
    <svg
      className={className}
      viewBox="0 0 120 240"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 2}
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Shadow */}
      <ellipse cx="60" cy="232" rx="24" ry="5" fill="rgba(0,0,0,0.08)" />

      {/* Legs */}
      <rect x="42" y="155" width="14" height="55" rx="7" fill={skin} />
      <rect x="64" y="155" width="14" height="55" rx="7" fill={skin} />
      <rect x="42" y="155" width="14" height="55" rx="7" fill={skinShadow} opacity="0.15" />

      {/* Pants */}
      {renderPants(pi, skin)}

      {/* Shoes */}
      {renderShoes(shi)}

      {/* Body/Torso */}
      {isFemale ? (
        <path d="M38 95 C38 88 44 82 52 82 L68 82 C76 82 82 88 82 95 L84 155 L36 155Z" fill={skin} />
      ) : (
        <rect x="36" y="82" width="48" height="73" rx="14" fill={skin} />
      )}
      <rect x="36" y="82" width="48" height="73" rx="14" fill={skinShadow} opacity="0.08" />

      {/* Shirt */}
      {renderShirt(si, isFemale)}

      {/* Neck */}
      <rect x="52" y="74" width="16" height="14" rx="6" fill={skin} />

      {/* Arms */}
      <rect x="22" y="88" width="13" height="48" rx="6.5" fill={skin} />
      <rect x="85" y="88" width="13" height="48" rx="6.5" fill={skin} />
      <rect x="22" y="88" width="13" height="48" rx="6.5" fill={skinShadow} opacity="0.1" />

      {/* Hands */}
      <ellipse cx="28" cy="138" rx="7.5" ry="6.5" fill={skin} />
      <ellipse cx="92" cy="138" rx="7.5" ry="6.5" fill={skin} />

      {/* Head */}
      <ellipse cx="60" cy="52" rx="27" ry="28" fill={skin} />

      {/* Ears */}
      <ellipse cx="33" cy="55" rx="5" ry="6" fill={skin} />
      <ellipse cx="87" cy="55" rx="5" ry="6" fill={skin} />
      <ellipse cx="33" cy="55" rx="3.5" ry="4" fill={skinShadow} opacity="0.15" />
      <ellipse cx="87" cy="55" rx="3.5" ry="4" fill={skinShadow} opacity="0.15" />

      {/* Eyes */}
      {renderEyes(ei)}

      {/* Eyebrows */}
      <path d="M44 48 Q48 45 52 48" fill="none" stroke={skinDark} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      <path d="M68 48 Q72 45 76 48" fill="none" stroke={skinDark} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />

      {/* Nose */}
      {renderNose(ni, skinDark)}

      {/* Mouth */}
      {renderMouth(mi)}

      {/* Cheeks */}
      <ellipse cx="40" cy="66" rx="5" ry="3" fill="#FF9999" opacity="0.12" />
      <ellipse cx="80" cy="66" rx="5" ry="3" fill="#FF9999" opacity="0.12" />

      {/* Hair (on top of head) */}
      {renderHair(hi, hairCol)}

      {/* Accessories */}
      {renderAccessory(ai)}
    </svg>
  );
}

function darken(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function renderHair(id: number, col: string) {
  switch (id) {
    case 0: return null; // Bald
    case 1: return <path d="M33 52 Q33 22 60 18 Q87 22 87 52 Q82 36 60 32 Q38 36 33 52Z" fill={col} />; // Short
    case 2: return <><path d="M30 55 Q30 20 60 16 Q90 20 90 55 Q84 34 60 30 Q36 34 30 55Z" fill={col} /><path d="M30 52 Q28 60 30 70 L33 55Z" fill={col} /><path d="M90 52 Q92 60 90 70 L87 55Z" fill={col} /></>; // Liso
    case 3: return <><ellipse cx="60" cy="38" rx="32" ry="26" fill={col} /><ellipse cx="60" cy="42" rx="27" ry="22" fill={SKIN_TONES[0]} opacity="0" /></>; // Cacheado/Afro short
    case 4: return <path d="M50 48 L50 14 Q60 6 70 14 L70 48 Q66 40 60 38 Q54 40 50 48Z" fill={col} />; // Moicano
    case 5: return <><path d="M30 55 Q30 18 60 14 Q90 18 90 55 Q84 34 60 28 Q36 34 30 55Z" fill={col} /><path d="M30 52 L27 110 L35 108 L33 56Z" fill={col} /><path d="M90 52 L93 110 L85 108 L87 56Z" fill={col} /></>; // Longo
    case 6: return <><path d="M33 52 Q33 22 60 18 Q87 22 87 52 Q82 36 60 32 Q38 36 33 52Z" fill={col} /><path d="M35 48 Q35 44 60 42 Q35 40 38 32Z" fill={col} /></>; // Franja
    case 7: return <><path d="M33 52 Q33 22 60 18 Q87 22 87 52 Q82 36 60 32 Q38 36 33 52Z" fill={col} /><ellipse cx="60" cy="22" rx="12" ry="12" fill={col} /></>; // Coque
    case 8: return <><path d="M30 55 Q30 20 60 16 Q90 20 90 55 Q84 34 60 30 Q36 34 30 55Z" fill={col} /><path d="M75 40 Q88 30 90 48 Q92 68 84 80 L78 68Z" fill={col} /></>; // Rabo de cavalo
    case 9: return <ellipse cx="60" cy="40" rx="34" ry="30" fill={col} />; // Afro
    case 10: return <><path d="M33 52 Q33 22 60 18 Q87 22 87 52 Q82 36 60 32 Q38 36 33 52Z" fill={col} /><path d="M36 50 L32 85 L38 82Z" fill={col} /><path d="M84 50 L88 85 L82 82Z" fill={col} /><path d="M52 48 L48 88 L54 85Z" fill={col} /><path d="M68 48 L72 88 L66 85Z" fill={col} /></>; // Trançado
    case 11: return <path d="M36 50 Q36 34 60 32 Q84 34 84 50 Q80 42 60 40 Q40 42 36 50Z" fill={col} opacity="0.45" />; // Raspado
    default: return null;
  }
}

function renderEyes(id: number) {
  const base = (irisCol: string, size = 4) => (
    <>
      <ellipse cx="48" cy="56" rx={size} ry={size} fill="white" />
      <ellipse cx="72" cy="56" rx={size} ry={size} fill="white" />
      <circle cx="48" cy="57" r={size * 0.55} fill={irisCol} />
      <circle cx="72" cy="57" r={size * 0.55} fill={irisCol} />
      <circle cx="49.2" cy="55.5" r={size * 0.22} fill="white" />
      <circle cx="73.2" cy="55.5" r={size * 0.22} fill="white" />
    </>
  );

  switch (id) {
    case 0: return base('#1a1a2e');
    case 1: return base('#DC2626');
    case 2: return <><path d="M44 56 Q48 52 52 56" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" /><path d="M64 56 Q68 52 72 56" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" /></>;
    case 3: return base('#1a1a2e', 5); // Big
    case 4: return base('#2563EB');
    case 5: return base('#1a1a2e', 3); // Small
    case 6: return base('#8B4513');
    case 7: return base('#16A34A');
    case 8: return base('#9CA3AF');
    case 9: return base('#F59E0B');
    default: return base('#1a1a2e');
  }
}

function renderNose(id: number, darkSkin: string) {
  switch (id) {
    case 0: return <path d="M58 62 Q60 68 62 62" fill="none" stroke={darkSkin} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />;
    case 1: return <path d="M56 60 Q60 70 64 60" fill="none" stroke={darkSkin} strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />; // Grande
    case 2: return <path d="M59 62 L60 67 L61 62" fill="none" stroke={darkSkin} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />; // Fino
    case 3: return <path d="M57 64 Q60 67 63 64" fill="none" stroke={darkSkin} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />; // Arrebitado
    default: return <path d="M58 62 Q60 68 62 62" fill="none" stroke={darkSkin} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />;
  }
}

function renderMouth(id: number) {
  switch (id) {
    case 0: return <path d="M52 72 Q60 78 68 72" fill="none" stroke="#C4756A" strokeWidth="2" strokeLinecap="round" />; // Sorriso
    case 1: return <><path d="M52 72 Q60 78 68 72" fill="none" stroke="#C4756A" strokeWidth="2" strokeLinecap="round" /><path d="M52 74 Q60 77 68 74" fill="#5C4033" /></>; // Bigode
    case 2: return <><rect x="40" y="52" width="40" height="10" rx="5" fill="rgba(0,0,0,0.7)" /><path d="M52 74 Q60 77 68 74" fill="#5C4033" /></>; // Óculos+Bigode
    case 3: return <path d="M52 73 L68 73" stroke="#C4756A" strokeWidth="2" strokeLinecap="round" />; // Neutro
    case 4: return <ellipse cx="60" cy="73" rx="6" ry="4" fill="#C4756A" opacity="0.3" />; // Aberto
    case 5: return <path d="M52 72 Q60 78 68 72" fill="#7C3AED" strokeWidth="1" />; // Batom Roxo
    case 6: return <path d="M52 72 Q60 78 68 72" fill="#DC2626" strokeWidth="1" />; // Batom Vermelho
    case 7: return <path d="M52 72 Q60 78 68 72" fill="#EC4899" strokeWidth="1" />; // Batom Rosa
    case 8: return <path d="M54 73 Q60 76 66 73" fill="none" stroke="#C4756A" strokeWidth="1.8" strokeLinecap="round" />; // Tímido
    case 9: return <><path d="M50 71 Q60 82 70 71" fill="none" stroke="#C4756A" strokeWidth="2" strokeLinecap="round" /><path d="M52 72 Q60 80 68 72" fill="white" opacity="0.5" /></>; // Sorriso Largo
    default: return <path d="M52 72 Q60 78 68 72" fill="none" stroke="#C4756A" strokeWidth="2" strokeLinecap="round" />;
  }
}

function renderShirt(id: number, isFemale: boolean) {
  const torso = isFemale
    ? "M38 95 C38 88 44 82 52 82 L68 82 C76 82 82 88 82 95 L84 155 L36 155Z"
    : "M36 82 C36 74 44 82 44 82 L76 82 C76 82 84 74 84 82 L84 155 L36 155Z";

  switch (id) {
    case 0: return null;
    case 1: return <path d={torso} fill="#1a1a2e" />;
    case 2: return <path d={torso} fill="#22C55E" />;
    case 3: return <path d={torso} fill="#EC4899" />;
    case 4: return <path d={torso} fill="#3B82F6" />;
    case 5: return <><path d={torso} fill="#EF4444" /><text x="60" y="125" fontSize="18" fill="white" textAnchor="middle" fontFamily="sans-serif">★</text></>;
    case 6: return <path d={torso} fill="#F97316" />;
    case 7: return <><path d={torso} fill="white" /><path d="M36 155 L36 82 C36 74 40 82 44 82 L44 155Z" fill="#f0f0f0" /><path d="M84 155 L84 82 C84 74 80 82 76 82 L76 155Z" fill="#f0f0f0" /></>;
    default: return null;
  }
}

function renderPants(id: number, _skin: string) {
  const shorts = "M34 152 L32 190 L46 190 L50 168 L60 172 L70 168 L74 190 L88 190 L86 152Z";
  const long = "M34 152 L32 210 L46 210 L50 175 L60 180 L70 175 L74 210 L88 210 L86 152Z";

  switch (id) {
    case 0: return null;
    case 1: return <path d={shorts} fill="#F97316" />;
    case 2: return <path d={shorts} fill="#DC2626" />;
    case 3: return <path d={shorts} fill="#93C5FD" />;
    case 4: return <path d={shorts} fill="#1a1a2e" />;
    case 5: return <path d={long} fill="#1E40AF" />;
    case 6: return <path d={long} fill="#1a1a2e" />;
    case 7: return <path d={long} fill="#2563EB" />;
    default: return null;
  }
}

function renderShoes(id: number) {
  switch (id) {
    case 0: return null;
    case 1: return <><ellipse cx="49" cy="218" rx="12" ry="6" fill="white" /><ellipse cx="71" cy="218" rx="12" ry="6" fill="white" /></>;
    case 2: return <><path d="M38 212 L38 220 Q49 228 60 220 L60 212Z" fill="#8B4513" /><path d="M60 212 L60 220 Q71 228 82 220 L82 212Z" fill="#8B4513" /></>;
    case 3: return <><path d="M40 216 L58 216 L58 222 L38 222Z" fill="#F59E0B" /><path d="M62 216 L80 216 L80 222 L60 222Z" fill="#F59E0B" /></>;
    case 4: return <><ellipse cx="49" cy="218" rx="12" ry="6" fill="#1a1a2e" /><ellipse cx="71" cy="218" rx="12" ry="6" fill="#1a1a2e" /></>;
    case 5: return <><ellipse cx="49" cy="218" rx="12" ry="6" fill="#DC2626" /><ellipse cx="71" cy="218" rx="12" ry="6" fill="#DC2626" /></>;
    case 6: return <><ellipse cx="49" cy="218" rx="12" ry="6" fill="#111" /><ellipse cx="71" cy="218" rx="12" ry="6" fill="#111" /></>;
    default: return null;
  }
}

function renderAccessory(id: number) {
  switch (id) {
    case 0: return null;
    case 1: return <><path d="M54 80 L50 100" stroke="#22C55E" strokeWidth="2" fill="none" /><path d="M66 80 L70 100" stroke="#22C55E" strokeWidth="2" fill="none" /><circle cx="60" cy="100" r="4" fill="#22C55E" /></>;
    case 2: return <><path d="M54 80 L50 100" stroke="#F59E0B" strokeWidth="2" fill="none" /><path d="M66 80 L70 100" stroke="#EC4899" strokeWidth="2" fill="none" /><circle cx="60" cy="100" r="4" fill="#3B82F6" /></>;
    case 3: return <><rect x="38" y="53" width="44" height="10" rx="5" fill="rgba(0,0,0,0.6)" /><circle cx="48" cy="57" r="6.5" fill="rgba(0,0,0,0.45)" stroke="#F59E0B" strokeWidth="1.2" /><circle cx="72" cy="57" r="6.5" fill="rgba(0,0,0,0.45)" stroke="#F59E0B" strokeWidth="1.2" /></>;
    case 4: return <><circle cx="48" cy="57" r="7.5" fill="none" stroke="#9CA3AF" strokeWidth="1.2" /><circle cx="72" cy="57" r="7.5" fill="none" stroke="#9CA3AF" strokeWidth="1.2" /><path d="M55.5 57 L64.5 57" stroke="#9CA3AF" strokeWidth="1.2" /></>;
    case 5: return <><rect x="38" y="53" width="44" height="10" rx="5" fill="rgba(0,0,0,0.85)" /><rect x="40" y="54" width="16" height="8" rx="4" fill="rgba(30,30,30,0.9)" /><rect x="64" y="54" width="16" height="8" rx="4" fill="rgba(30,30,30,0.9)" /></>;
    default: return null;
  }
}
