import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { COLORS, HAIR, OUTFIT, EYES, HAIR_ICO, OUTFIT_ICO, EYES_ICO } from '@/lib/gameData';
import { SFX } from '@/lib/sounds';
import Avatar from '@/components/Avatar';

export default function CharacterScreen() {
  const { user, saveUser } = useGame();
  const [c, setC] = useState(user?.c || 0);
  const [h, setH] = useState(user?.h || 0);
  const [o, setO] = useState(user?.o || 0);
  const [e, setE] = useState(user?.e || 0);

  const nav = (type: 'h' | 'o' | 'e', dir: number) => {
    SFX.click();
    const map = { h: { arr: HAIR, set: setH, val: h }, o: { arr: OUTFIT, set: setO, val: o }, e: { arr: EYES, set: setE, val: e } };
    const m = map[type];
    m.set((m.val + dir + m.arr.length) % m.arr.length);
  };

  const save = () => {
    if (!user) return;
    SFX.click();
    saveUser({ ...user, c, h, o, e, charCreated: true });
  };

  const renderSlot = (type: 'h' | 'o' | 'e') => {
    const map = {
      h: { arr: HAIR, icos: HAIR_ICO, val: h, label: '💇 Cabelo' },
      o: { arr: OUTFIT, icos: OUTFIT_ICO, val: o, label: '👕 Roupa' },
      e: { arr: EYES, icos: EYES_ICO, val: e, label: '👁️ Olhos' },
    };
    const m = map[type];
    const item = m.arr[m.val];
    const locked = item.lv && (user?.lv || 1) < item.lv;

    return (
      <div className="surface-1 border border-border rounded-lg p-3.5">
        <h3 className="font-display text-[0.7rem] text-primary mb-2.5 tracking-widest">{m.label}</h3>
        <div className="flex items-center gap-3">
          <button onClick={() => nav(type, -1)}
            className="w-9 h-9 rounded-full surface-2 border border-border text-primary font-bold text-lg flex items-center justify-center hover:surface-3 hover:scale-105 transition-all flex-shrink-0">
            ‹
          </button>
          <div className="flex-1 surface-2 border border-border rounded-md p-2.5 text-center min-h-[60px] flex flex-col items-center justify-center gap-1">
            <span className="text-2xl">{m.icos[m.val] || '?'}</span>
            <span className="text-xs font-bold">{item.n}</span>
            {locked && <span className="text-[0.65rem] text-destructive">🔒 Nível {item.lv}</span>}
          </div>
          <button onClick={() => nav(type, 1)}
            className="w-9 h-9 rounded-full surface-2 border border-border text-primary font-bold text-lg flex items-center justify-center hover:surface-3 hover:scale-105 transition-all flex-shrink-0">
            ›
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col items-center overflow-y-auto p-4 pt-5"
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
    >
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="font-display text-2xl text-primary text-glow-cyan text-center">🧍 Crie seu Personagem</h1>
        <p className="text-center text-muted-foreground text-sm mt-1 mb-5">Personalize antes de explorar o universo!</p>

        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* Preview */}
          <div className="flex flex-col items-center gap-3.5 md:min-w-[200px] w-full md:w-auto">
            <motion.div
              className="w-48 h-56 surface-1 border-2 border-border rounded-lg flex flex-col items-center justify-center gap-2 relative overflow-hidden hover:border-primary transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-7"
                style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.18), transparent)' }} />
              <Avatar c={c} h={h} o={o} e={e} size={128} />
              <p className="text-xs font-extrabold text-muted-foreground">{user?.name || 'Jogador'}</p>
            </motion.div>
            <button onClick={save}
              className="w-full gradient-primary text-primary-foreground font-extrabold py-3 rounded-md glow-cyan hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm">
              PRONTO! VAMOS LÁ ⚡
            </button>
          </div>

          {/* Options */}
          <div className="flex-1 flex flex-col gap-3 w-full">
            <div className="surface-1 border border-border rounded-lg p-3.5">
              <h3 className="font-display text-[0.7rem] text-primary mb-2.5 tracking-widest">🎨 Cor</h3>
              <div className="flex flex-wrap gap-2.5">
                {COLORS.map((col, i) => (
                  <button key={i} onClick={() => { SFX.click(); setC(i); }}
                    className={`w-9 h-9 rounded-full border-[3px] transition-all cursor-pointer hover:scale-110 ${i === c ? 'border-primary scale-110 glow-cyan' : 'border-transparent'}`}
                    style={{ background: col }} />
                ))}
              </div>
            </div>
            {renderSlot('h')}
            {renderSlot('o')}
            {renderSlot('e')}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
