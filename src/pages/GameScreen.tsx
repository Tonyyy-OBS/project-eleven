import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { LEVELS, ELEMENT_CARDS } from '@/lib/gameData';
import { shuf, fmtTime } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';
import { ArrowLeft, RotateCcw, Zap } from 'lucide-react';

interface Card { key: string; symbol: string; name: string; color: string; number: number; }
interface GameState {
  lv: number; cols: number; rows: number;
  time: number; total: number; score: number; errors: number;
  combo: number; maxCombo: number; matched: number;
  cards: Card[]; flipped: number[]; busy: boolean;
  done: boolean; startMs: number;
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
    const elements = shuf(ELEMENT_CARDS).slice(0, pairs);

    let cards: Card[] = [];
    elements.forEach(el => {
      const card: Card = { key: el.symbol, symbol: el.symbol, name: el.name, color: el.color, number: el.number };
      cards.push(card, { ...card });
    });
    while (cards.length < total) {
      const el = ELEMENT_CARDS[cards.length % ELEMENT_CARDS.length];
      const card: Card = { key: el.symbol, symbol: el.symbol, name: el.name, color: el.color, number: el.number };
      cards.push(card, { ...card });
    }
    cards = shuf(cards).slice(0, total);

    setFlippedSet(new Set());
    setMatchedSet(new Set());
    setShakeSet(new Set());
    setOverlay(null);

    const state: GameState = {
      lv, cols: cfg.cols, rows: cfg.rows, time: cfg.time, total: cards.length,
      score: 0, errors: 0, combo: 0, maxCombo: 0, matched: 0,
      cards, flipped: [], busy: false, done: false, startMs: Date.now(),
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

        await new Promise(r => setTimeout(r, 280));
        setMatchedSet(prev => new Set([...prev, a, b]));
        if (combo >= 2) { SFX.combo(combo); setComboText(`🔥 COMBO x${combo}!`); setTimeout(() => setComboText(null), 900); }
        else SFX.match();

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
          const coins = Math.max(1, g.lv * 12 + (maxCombo > 3 ? 25 : 0));
          const xp = g.lv * 28 + (g.errors === 0 ? 22 : 0);

          setOverlay({ won: true, elapsed, score: finalScore, coins, xp });
          newState.done = true;

          if (user) {
            const nLv = Math.max(user.curLv || 1, g.lv + 1);
            saveUser({
              ...user, totalScore: (user.totalScore || 0) + finalScore, games: (user.games || 0) + 1, curLv: nLv,
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

  if (!gs) return null;

  const stats = [
    { label: 'NÍVEL', val: String(gs.lv), color: 'text-primary' },
    { label: 'SCORE', val: String(gs.score), color: 'text-primary' },
    { label: 'COMBO', val: `x${gs.combo + 1}`, color: 'text-accent' },
    { label: 'ERROS', val: String(gs.errors), color: 'text-destructive' },
    { label: 'TEMPO', val: fmtTime(gs.time), color: gs.time <= 10 ? 'text-destructive' : 'text-emerald-600' },
  ];

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Top bar */}
      <div className="glass-card mx-3 mt-3 mb-2 px-3 py-2.5 flex items-center gap-2 rounded-2xl flex-shrink-0">
        <button onClick={() => { if (tickRef.current) clearInterval(tickRef.current); navigate('/hub'); }}
          className="bg-secondary text-foreground px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-secondary/80 transition-colors">
          <ArrowLeft size={14} /> MENU
        </button>
        <div className="flex gap-1.5 flex-1 justify-center flex-wrap">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col items-center bg-secondary/40 rounded-lg px-2.5 py-1 min-w-[48px]">
              <span className="text-[0.5rem] text-muted-foreground font-bold tracking-wider">{s.label}</span>
              <span className={`font-display text-sm ${s.color}`}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-hidden relative">
        <div className="grid gap-2 w-full max-w-[720px]" style={{ gridTemplateColumns: `repeat(${gs.cols}, 1fr)` }}>
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
                    scale: isMatched ? [1, 1.08, 1] : 1,
                  }}
                  transition={{ duration: isShake ? 0.38 : 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
                >
                  {/* Back */}
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 border-2 border-primary/30 shadow-md"
                    style={{ backfaceVisibility: 'hidden' }}>
                    <span className="text-2xl text-white/20 font-display">⚛️</span>
                  </div>
                  {/* Front */}
                  <div className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center border-2 shadow-md ${isMatched ? 'border-emerald-400 bg-emerald-50' : 'border-border bg-card'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <span className="text-[0.55rem] text-muted-foreground font-bold">{card.number}</span>
                    <span className="font-display text-lg md:text-xl" style={{ color: card.color }}>{card.symbol}</span>
                    <span className="text-[0.5rem] text-muted-foreground leading-tight text-center px-0.5">{card.name}</span>
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
              className="fixed top-1/3 left-1/2 font-display text-2xl text-accent z-[300] pointer-events-none whitespace-nowrap"
              style={{ textShadow: '0 2px 8px rgba(245,158,11,0.4)' }}
              initial={{ opacity: 0, scale: 0.5, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1.2, x: '-50%', y: '-80%' }}
              exit={{ opacity: 0, y: '-120%' }}
            >{comboText}</motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Victory/Loss overlay */}
      <AnimatePresence>
        {overlay && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <motion.div
              className="glass-card p-8 max-w-sm w-[92%] text-center shadow-xl"
              initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}
            >
              <div className="text-5xl animate-float mb-3">{overlay.won ? '🎉' : '💀'}</div>
              <h2 className="font-display text-xl text-primary mb-4">
                {overlay.won ? 'FASE COMPLETA!' : 'TEMPO ESGOTADO!'}
              </h2>
              <div className="bg-secondary/30 rounded-xl p-4 mb-5 flex flex-col gap-2">
                {[['⏱️ Tempo', fmtTime(overlay.elapsed)], ['❌ Erros', String(gs.errors)], ['🔥 Combo Máx.', `x${gs.maxCombo}`]].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm text-muted-foreground"><span>{l}</span><span className="font-bold text-foreground">{v}</span></div>
                ))}
                <div className="border-t border-border/50 pt-2 flex flex-col gap-1 mt-1">
                  {[['⭐ Score', String(overlay.score)], ['🪙 Moedas', `+${overlay.coins}`], ['⚡ XP', `+${overlay.xp}`]].map(([l, v]) => (
                    <div key={l} className="flex justify-between text-sm font-bold"><span>{l}</span><span className="text-accent font-display">{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <button onClick={() => startGame(gs.lv)}
                  className="bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-secondary/80 transition-colors">
                  <RotateCcw size={14} /> Repetir
                </button>
                {overlay.won && (
                  <button onClick={() => startGame(gs.lv + 1)}
                    className="btn-primary text-sm flex items-center gap-1.5">
                    PRÓXIMA <Zap size={14} />
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
