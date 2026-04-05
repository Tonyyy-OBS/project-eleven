import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { LEVELS, EMOJIS, SPECIALS, SpecialKey } from '@/lib/gameData';
import { shuf, fmtTime, DB } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';

interface Card { key: string; type: 'n' | 'sp'; spk?: string; }
interface GameState {
  lv: number; cols: number; rows: number;
  time: number; total: number; score: number; errors: number;
  combo: number; maxCombo: number; matched: number;
  cards: Card[]; flipped: number[]; busy: boolean;
  pups: Record<string, number>; done: boolean; startMs: number;
}

export default function GameScreen() {
  const { user, saveUser, addXpCoins, checkAch, trackMission } = useGame();
  const navigate = useNavigate();
  const [gs, setGs] = useState<GameState | null>(null);
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set());
  const [matchedSet, setMatchedSet] = useState<Set<number>>(new Set());
  const [shakeSet, setShakeSet] = useState<Set<number>>(new Set());
  const [overlay, setOverlay] = useState<{ won: boolean; elapsed: number; score: number; coins: number; xp: number } | null>(null);
  const [comboText, setComboText] = useState<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval>>();
  const gsRef = useRef(gs);
  gsRef.current = gs;

  const startGame = useCallback((lv: number) => {
    const maxLv = LEVELS.length;
    lv = Math.max(1, Math.min(lv, maxLv));
    const cfg = LEVELS[lv - 1];
    const total = cfg.cols * cfg.rows;
    const pairs = Math.floor(total / 2);
    const emojis = shuf(EMOJIS).slice(0, pairs);

    let cards: Card[] = [];
    emojis.forEach(em => {
      cards.push({ key: em, type: 'n' });
      cards.push({ key: em, type: 'n' });
    });
    if (pairs > 6) {
      const specs = shuf([...SPECIALS]).slice(0, pairs > 10 ? 2 : 1);
      specs.forEach(sp => {
        if (cards.length >= total) return;
        cards.splice(-2, 2);
        cards.push({ key: sp.e, type: 'sp', spk: sp.k });
        cards.push({ key: sp.e, type: 'sp', spk: sp.k });
      });
    }
    while (cards.length > total) cards.pop();
    while (cards.length < total) {
      const em = EMOJIS[cards.length % EMOJIS.length];
      cards.push({ key: em, type: 'n' }, { key: em, type: 'n' });
    }
    cards = shuf(cards).slice(0, total);

    setFlippedSet(new Set());
    setMatchedSet(new Set());
    setShakeSet(new Set());
    setOverlay(null);

    const state: GameState = {
      lv, cols: cfg.cols, rows: cfg.rows, time: cfg.time, total: cards.length,
      score: 0, errors: 0, combo: 0, maxCombo: 0, matched: 0,
      cards, flipped: [], busy: false,
      pups: { time: 1, reveal: 1, shuffle: 1 }, done: false, startMs: Date.now(),
    };
    setGs(state);

    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setGs(prev => {
        if (!prev || prev.done) return prev;
        const t = prev.time - 1;
        if (t <= 0) {
          clearInterval(tickRef.current);
          SFX.error();
          setOverlay({ won: false, elapsed: 0, score: 0, coins: 0, xp: 0 });
          return { ...prev, time: 0, done: true };
        }
        return { ...prev, time: t };
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startGame(user?.curLv || 1);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  const flip = useCallback(async (i: number) => {
    const g = gsRef.current;
    if (!g || g.busy || g.done) return;
    if (flippedSet.has(i) || matchedSet.has(i)) return;
    if (g.flipped.length >= 2) return;

    SFX.flip();
    const newFlipped = [...g.flipped, i];
    setFlippedSet(prev => new Set([...prev, i]));
    setGs(prev => prev ? { ...prev, flipped: newFlipped, busy: newFlipped.length >= 2 } : prev);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      const ca = g.cards[a], cb = g.cards[b];

      if (ca.key === cb.key) {
        const combo = g.combo + 1;
        const maxCombo = Math.max(combo, g.maxCombo);
        const score = g.score + 50 + combo * 20;
        const matched = g.matched + 2;

        await new Promise(r => setTimeout(r, 260));
        setMatchedSet(prev => new Set([...prev, a, b]));
        if (combo >= 2) { SFX.combo(combo); setComboText(`🔥 COMBO x${combo}!`); setTimeout(() => setComboText(null), 900); }
        else SFX.match();

        if (ca.type === 'sp' && ca.spk) {
          const sp = SPECIALS.find(s => s.k === ca.spk);
          SFX.powerup();
          setGs(prev => prev ? { ...prev, pups: { ...prev.pups, [ca.spk!]: (prev.pups[ca.spk!] || 0) + 1 } } : prev);
        }

        trackMission('match_10', 1);
        trackMission('match_20', 1);

        const newState: Partial<GameState> = { score, combo, maxCombo, matched, flipped: [], busy: false };

        if (matched >= g.total) {
          if (tickRef.current) clearInterval(tickRef.current);
          SFX.phase();
          await new Promise(r => setTimeout(r, 300));
          const elapsed = Math.floor((Date.now() - g.startMs) / 1000);
          const tBonus = (g.time - 1) * 3, ePen = g.errors * 25, cBonus = maxCombo * 15;
          const finalScore = Math.max(0, score + tBonus - ePen + cBonus);
          const coins = Math.max(1, g.lv * 10 + (maxCombo > 3 ? 25 : 0));
          const xp = g.lv * 28 + (g.errors === 0 ? 22 : 0);

          setOverlay({ won: true, elapsed, score: finalScore, coins, xp });
          newState.done = true;

          if (user) {
            const nLv = Math.max(user.curLv || 1, g.lv + 1);
            saveUser({ ...user, totalScore: (user.totalScore || 0) + finalScore, games: (user.games || 0) + 1, curLv: nLv,
              history: [{ type: `🧠 Nível ${g.lv}`, score: finalScore, date: new Date().toLocaleDateString('pt-BR'), detail: `${g.errors} erros · combo x${maxCombo}` }, ...(user.history || []).slice(0, 14)]
            });
            addXpCoins(xp, coins);
          }
          checkAch('first_game');
          if (g.errors === 0) checkAch('no_errors');
          if (elapsed < 30) checkAch('speed_demon');
          if (maxCombo >= 5) checkAch('combo_5');
          trackMission('complete', 1);
          trackMission('play_3', 1);
          if (g.errors === 0) trackMission('no_err', 1);
          if (maxCombo >= 3) trackMission('combo3', 1);
        }

        setGs(prev => prev ? { ...prev, ...newState } : prev);
      } else {
        SFX.error();
        setShakeSet(new Set([a, b]));
        await new Promise(r => setTimeout(r, 580));
        setFlippedSet(prev => { const n = new Set(prev); n.delete(a); n.delete(b); return n; });
        setShakeSet(new Set());
        setGs(prev => prev ? { ...prev, combo: 0, errors: prev.errors + 1, flipped: [], busy: false } : prev);
      }
    }
  }, [flippedSet, matchedSet, user]);

  const usePup = async (k: string) => {
    if (!gs || gs.busy || gs.done) return;
    if ((gs.pups[k] || 0) <= 0) return;
    SFX.powerup();
    setGs(prev => prev ? { ...prev, pups: { ...prev.pups, [k]: prev.pups[k] - 1 } } : prev);

    if (k === 'time') {
      setGs(prev => prev ? { ...prev, time: prev.time + 15 } : prev);
    } else if (k === 'reveal') {
      const all = gs.cards.map((_, i) => i).filter(i => !matchedSet.has(i));
      setFlippedSet(prev => new Set([...prev, ...all]));
      await new Promise(r => setTimeout(r, 2000));
      setFlippedSet(prev => { const n = new Set(prev); all.forEach(i => { if (!matchedSet.has(i)) n.delete(i); }); return n; });
    } else if (k === 'shuffle') {
      setGs(prev => {
        if (!prev) return prev;
        const unmatched = prev.cards.map((_, i) => i).filter(i => !matchedSet.has(i));
        const keys = shuf(unmatched.map(i => prev.cards[i].key));
        const newCards = [...prev.cards];
        unmatched.forEach((ci, j) => { newCards[ci] = { ...newCards[ci], key: keys[j] }; });
        return { ...prev, cards: newCards };
      });
    }
  };

  if (!gs) return null;

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Top bar */}
      <div className="w-full border-b border-border px-3 py-2.5 flex items-center gap-3 sticky top-0 z-50 backdrop-blur-lg flex-shrink-0"
        style={{ background: 'rgba(3,3,17,0.92)' }}>
        <button onClick={() => { if (tickRef.current) clearInterval(tickRef.current); navigate('/hub'); }}
          className="surface-1 border border-border text-primary px-3 py-1.5 rounded-md font-display text-[0.68rem] font-bold flex-shrink-0 hover:surface-2 transition-all">
          ‹ MENU
        </button>
        <div className="flex gap-2 flex-1 justify-center flex-wrap">
          {[
            { label: 'NÍVEL', val: String(gs.lv), cls: 'text-primary' },
            { label: 'SCORE', val: String(gs.score), cls: 'text-primary' },
            { label: 'COMBO', val: `x${gs.combo + 1}`, cls: 'text-accent' },
            { label: 'ERROS', val: String(gs.errors), cls: 'text-primary' },
            { label: 'TEMPO', val: fmtTime(gs.time), cls: gs.time <= 10 ? 'text-destructive animate-blink' : 'text-success' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center surface-2 border border-border rounded-md px-2 py-1 min-w-[48px]">
              <span className="text-[0.56rem] text-muted-foreground tracking-widest font-display">{s.label}</span>
              <span className={`font-display text-sm font-bold ${s.cls}`}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Powerups */}
      <div className="flex gap-2 px-3 py-2 justify-center flex-shrink-0">
        {[{ k: 'time', ico: '⏱️' }, { k: 'reveal', ico: '👁️' }, { k: 'shuffle', ico: '🔀' }].map(p => (
          <button key={p.k} onClick={() => usePup(p.k)} disabled={(gs.pups[p.k] || 0) <= 0}
            className="surface-2 border border-border rounded-md px-3 py-1.5 text-sm font-bold flex items-center gap-1 transition-all hover:border-primary hover:glow-cyan disabled:opacity-30 disabled:cursor-not-allowed">
            {p.ico} <span>{gs.pups[p.k] || 0}</span>
          </button>
        ))}
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-2 overflow-hidden relative">
        <div className="grid gap-1.5 w-full max-w-[680px]" style={{ gridTemplateColumns: `repeat(${gs.cols}, 1fr)` }}>
          {gs.cards.map((card, i) => {
            const isFlipped = flippedSet.has(i);
            const isMatched = matchedSet.has(i);
            const isShake = shakeSet.has(i);
            return (
              <div key={i} className="aspect-square" style={{ perspective: '900px' }}>
                <motion.div
                  onClick={() => flip(i)}
                  className="w-full h-full relative cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{
                    rotateY: isFlipped || isMatched ? 180 : 0,
                    x: isShake ? [0, -6, 6, -6, 6, 0] : 0,
                    scale: isMatched ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: isShake ? 0.38 : 0.42, ease: [0.175, 0.885, 0.32, 1.275] }}
                >
                  {/* Back */}
                  <div className="absolute inset-0 rounded-md flex items-center justify-center text-xl backface-hidden border-2 border-secondary/25"
                    style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #06042a, #100838)' }}>
                    <span className="opacity-20">⚛️</span>
                  </div>
                  {/* Front */}
                  <div className={`absolute inset-0 rounded-md flex items-center justify-center text-xl md:text-2xl border-2 ${isMatched ? 'border-success glow-green' : card.type === 'sp' ? 'border-secondary' : 'border-primary glow-cyan'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: isMatched ? 'rgba(16,185,129,0.1)' : card.type === 'sp' ? 'rgba(124,58,237,0.1)' : 'hsl(var(--surface-2))' }}>
                    {card.key}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Combo text */}
        <AnimatePresence>
          {comboText && (
            <motion.div
              className="fixed top-1/3 left-1/2 font-display text-2xl font-black text-accent text-glow-gold z-[300] pointer-events-none whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.5, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1.28, x: '-50%', y: '-68%' }}
              exit={{ opacity: 0, scale: 1, y: '-110%' }}
            >{comboText}</motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {overlay && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-lg"
            style={{ background: 'rgba(0,0,0,0.86)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="surface-1 border-2 border-primary rounded-lg p-8 max-w-sm w-[92%] text-center glow-cyan"
              initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}
            >
              <div className="text-5xl animate-float mb-2">{overlay.won ? (gs.errors === 0 ? '🎯' : '🎉') : '💀'}</div>
              <h2 className="font-display text-xl text-primary text-glow-cyan mb-4">
                {overlay.won ? 'FASE COMPLETA!' : 'TEMPO ESGOTADO!'}
              </h2>
              <div className="surface-1 rounded-md p-3 mb-5 flex flex-col gap-2">
                {[
                  ['⏱️ Tempo', fmtTime(overlay.elapsed)],
                  ['❌ Erros', String(gs.errors)],
                  ['🔥 Combo Máx.', `x${gs.maxCombo}`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm text-muted-foreground"><span>{l}</span><span>{v}</span></div>
                ))}
                <div className="border-t border-border pt-2 flex flex-col gap-1">
                  {[
                    ['⭐ Score', String(overlay.score)],
                    ['💰 Moedas', overlay.won ? `+${overlay.coins}` : '+0'],
                    ['⚡ XP', overlay.won ? `+${overlay.xp}` : '+0'],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between text-sm font-bold"><span>{l}</span><span className="text-accent font-display">{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <button onClick={() => startGame(gs.lv)}
                  className="surface-1 border border-border text-muted-foreground px-4 py-2.5 rounded-md text-sm font-bold hover:border-primary hover:text-foreground transition-all">
                  🔄 Repetir
                </button>
                {overlay.won && (
                  <button onClick={() => startGame(gs.lv + 1)}
                    className="gradient-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-extrabold glow-cyan hover:-translate-y-0.5 transition-all">
                    PRÓXIMA FASE ›
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
