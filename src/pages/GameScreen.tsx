import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { LEVELS, ELEMENT_CARDS } from '@/lib/gameData';
import { shuf, fmtTime } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';
import MatchParticles from '@/components/MatchParticles';
import { ArrowLeft, RotateCcw, Zap, Clock, Flame, AlertTriangle, Trophy, Atom, Coins } from 'lucide-react';

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
  const [particleTrigger, setParticleTrigger] = useState<{ x: number; y: number; color: string } | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval>>();
  const gsRef = useRef(gs);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
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
    setFlippedSet(new Set()); setMatchedSet(new Set()); setShakeSet(new Set()); setOverlay(null);
    setParticleTrigger(null);
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
        if (t <= 0) { clearInterval(tickRef.current); SFX.error(); setOverlay({ won: false, elapsed: 0, score: 0, coins: 0, xp: 0 }); return { ...prev, time: 0, done: true }; }
        return { ...prev, time: t };
      });
    }, 1000);
  }, []);

  useEffect(() => { startGame(user?.curLv || 1); return () => { if (tickRef.current) clearInterval(tickRef.current); }; }, []);

  const emitParticles = useCallback((cardIdx: number, color: string) => {
    const el = cardRefs.current.get(cardIdx);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setParticleTrigger({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, color });
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
        await new Promise(r => setTimeout(r, 350));
        setMatchedSet(prev => new Set([...prev, a, b]));
        emitParticles(a, ca.color);
        setTimeout(() => emitParticles(b, cb.color), 100);
        if (combo >= 2) { SFX.combo(combo); setComboText(`COMBO x${combo}!`); setTimeout(() => setComboText(null), 900); }
        else SFX.match();
        trackMission('match_10', 1); trackMission('match_20', 1);
        const newState: Partial<GameState> = { score, combo, maxCombo, matched, flipped: [], busy: false };
        if (matched >= g.total) {
          if (tickRef.current) clearInterval(tickRef.current);
          SFX.phase(); await new Promise(r => setTimeout(r, 300));
          const elapsed = Math.floor((Date.now() - g.startMs) / 1000);
          const tBonus = (g.time - 1) * 3, ePen = g.errors * 25, cBonus = maxCombo * 15;
          const finalScore = Math.max(0, score + tBonus - ePen + cBonus);
          const coins = Math.max(1, g.lv * 12 + (maxCombo > 3 ? 25 : 0));
          const xp = g.lv * 28 + (g.errors === 0 ? 22 : 0);
          setOverlay({ won: true, elapsed, score: finalScore, coins, xp });
          newState.done = true;
          if (user) {
            const nLv = Math.max(user.curLv || 1, g.lv + 1);
            saveUser({ ...user, totalScore: (user.totalScore || 0) + finalScore, games: (user.games || 0) + 1, curLv: nLv,
              history: [{ type: `Nível ${g.lv}`, score: finalScore, date: new Date().toLocaleDateString('pt-BR'), detail: `${g.errors} erros · combo x${maxCombo}` }, ...(user.history || []).slice(0, 14)] });
            addXpCoins(xp, coins);
          }
          checkAch('first_game'); if (g.errors === 0) checkAch('no_errors'); if (elapsed < 30) checkAch('speed_demon'); if (maxCombo >= 5) checkAch('combo_5');
          trackMission('complete', 1); trackMission('play_3', 1); if (g.errors === 0) trackMission('no_err', 1); if (maxCombo >= 3) trackMission('combo3', 1);
        }
        setGs(prev => prev ? { ...prev, ...newState } : prev);
      } else {
        SFX.error(); setShakeSet(new Set([a, b]));
        await new Promise(r => setTimeout(r, 580));
        setFlippedSet(prev => { const n = new Set(prev); n.delete(a); n.delete(b); return n; });
        setShakeSet(new Set());
        setGs(prev => prev ? { ...prev, combo: 0, errors: prev.errors + 1, flipped: [], busy: false } : prev);
      }
    }
  }, [flippedSet, matchedSet, user]);

  if (!gs) return null;

  const timeWarning = gs.time <= 10;
  const stats = [
    { icon: Zap, label: 'LV', val: String(gs.lv), color: 'text-primary' },
    { icon: Trophy, label: 'PTS', val: String(gs.score), color: 'text-primary' },
    { icon: Flame, label: 'CMB', val: `x${gs.combo + 1}`, color: 'text-accent' },
    { icon: AlertTriangle, label: 'ERR', val: String(gs.errors), color: 'text-destructive' },
    { icon: Clock, label: '', val: fmtTime(gs.time), color: timeWarning ? 'text-destructive animate-pulse' : 'text-emerald-500' },
  ];

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MatchParticles trigger={particleTrigger} />
      
      {/* Top bar */}
      <div className="glass-card mx-3 mt-3 mb-2 px-3 py-2 flex items-center gap-2 rounded-2xl flex-shrink-0">
        <button onClick={() => { if (tickRef.current) clearInterval(tickRef.current); navigate('/hub'); }}
          className="bg-secondary/60 text-foreground px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-secondary transition-colors border border-border/30">
          <ArrowLeft size={13} />
        </button>
        <div className="flex gap-1.5 flex-1 justify-center flex-wrap">
          {stats.map(s => (
            <div key={s.label || 'time'} className="flex items-center gap-1 bg-secondary/30 rounded-lg px-2 py-1">
              <s.icon size={11} className={s.color} />
              <span className={`font-display text-xs ${s.color}`}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-hidden relative">
        <div className="grid gap-1.5 w-full max-w-[680px]" style={{ gridTemplateColumns: `repeat(${gs.cols}, 1fr)` }}>
          {gs.cards.map((card, i) => {
            const isFlipped = flippedSet.has(i);
            const isMatched = matchedSet.has(i);
            const isShake = shakeSet.has(i);
            return (
              <div key={i} className="aspect-square" style={{ perspective: '1200px' }}
                ref={el => { if (el) cardRefs.current.set(i, el); }}>
                <motion.div onClick={() => flip(i)}
                  className={`w-full h-full relative cursor-pointer card-3d ${isMatched ? 'matched-glow' : ''}`}
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{
                    rotateY: isFlipped || isMatched ? 180 : 0,
                    x: isShake ? [0, -6, 6, -6, 6, 0] : 0,
                    scale: isMatched ? [1, 1.1, 0.95, 1] : 1,
                  }}
                  transition={{
                    rotateY: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                    x: { duration: 0.4 },
                    scale: { duration: 0.5, ease: 'easeOut' },
                  }}>
                  {/* Back of card */}
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center border border-primary/30 shadow-lg card-back"
                    style={{
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(145deg, hsl(var(--primary) / 0.85), hsl(var(--primary) / 0.5))',
                    }}>
                    <div className="relative">
                      <Atom size={22} className="text-white/25" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white/15" />
                      </div>
                    </div>
                  </div>
                  {/* Front of card */}
                  <div className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center border shadow-lg transition-all duration-300 ${
                    isMatched
                      ? 'border-emerald-400/60 bg-emerald-500/10 shadow-emerald-500/20'
                      : 'border-border/50 bg-card/95'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <span className="text-[0.5rem] text-muted-foreground font-bold opacity-60">{card.number}</span>
                    <motion.span
                      className="font-display text-lg md:text-xl leading-none"
                      style={{ color: card.color }}
                      animate={isMatched ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.4 }}>
                      {card.symbol}
                    </motion.span>
                    <span className="text-[0.45rem] text-muted-foreground leading-tight text-center px-0.5 mt-0.5">{card.name}</span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Combo text */}
        <AnimatePresence>
          {comboText && (
            <motion.div className="fixed top-1/3 left-1/2 font-display text-3xl z-[300] pointer-events-none whitespace-nowrap flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.3, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1.3, x: '-50%', y: '-80%' }}
              exit={{ opacity: 0, scale: 0.8, y: '-150%' }}
              transition={{ type: 'spring', damping: 12 }}>
              <Flame size={28} className="text-accent" />
              <span className="text-accent font-display" style={{ textShadow: '0 0 20px rgba(245,158,11,0.6), 0 4px 16px rgba(245,158,11,0.3)' }}>
                {comboText}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Victory/Loss overlay */}
      <AnimatePresence>
        {overlay && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="glass-card p-7 max-w-sm w-[92%] text-center shadow-2xl"
              initial={{ scale: 0.5, rotateX: 20 }} animate={{ scale: 1, rotateX: 0 }} transition={{ type: 'spring', damping: 15 }}>
              <motion.div className="mx-auto mb-3 w-16 h-16 rounded-2xl avatar-stage flex items-center justify-center"
                animate={{ rotate: overlay.won ? [0, 10, -10, 0] : [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}>
                {overlay.won ? <Trophy size={28} className="text-accent" /> : <AlertTriangle size={28} className="text-destructive" />}
              </motion.div>
              <h2 className="font-display text-xl text-foreground mb-4">
                {overlay.won ? 'FASE COMPLETA!' : 'TEMPO ESGOTADO!'}
              </h2>
              <div className="bg-secondary/20 rounded-xl p-4 mb-5 flex flex-col gap-2 border border-border/20">
                {[
                  { icon: Clock, l: 'Tempo', v: fmtTime(overlay.elapsed) },
                  { icon: AlertTriangle, l: 'Erros', v: String(gs.errors) },
                  { icon: Flame, l: 'Combo Máx.', v: `x${gs.maxCombo}` },
                ].map((row, idx) => (
                  <motion.div key={row.l} className="flex items-center justify-between text-sm text-muted-foreground"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.1 }}>
                    <span className="flex items-center gap-1.5"><row.icon size={12} /> {row.l}</span>
                    <span className="font-bold text-foreground">{row.v}</span>
                  </motion.div>
                ))}
                <div className="border-t border-border/20 pt-2 flex flex-col gap-1 mt-1">
                  {[
                    { icon: Trophy, l: 'Score', v: String(overlay.score) },
                    { icon: Coins, l: 'Moedas', v: `+${overlay.coins}` },
                    { icon: Zap, l: 'XP', v: `+${overlay.xp}` },
                  ].map((row, idx) => (
                    <motion.div key={row.l} className="flex items-center justify-between text-sm font-bold"
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.1 }}>
                      <span className="flex items-center gap-1.5 text-muted-foreground"><row.icon size={12} /> {row.l}</span>
                      <span className="text-accent font-display">{row.v}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <motion.button onClick={() => startGame(gs.lv)}
                  className="bg-secondary/60 text-foreground px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-secondary transition-colors border border-border/30"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <RotateCcw size={14} /> Repetir
                </motion.button>
                {overlay.won && (
                  <motion.button onClick={() => startGame(gs.lv + 1)} className="btn-primary text-sm flex items-center gap-1.5"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    PRÓXIMA <Zap size={14} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
