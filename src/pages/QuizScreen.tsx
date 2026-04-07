import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { QUESTIONS } from '@/lib/gameData';
import { shuf } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';
import { ArrowLeft, Trophy, Atom, Clock, Flame, CheckCircle, XCircle, Zap, RotateCcw, Coins } from 'lucide-react';

type Phase = 'intro' | 'play' | 'result';
interface QState {
  qs: typeof QUESTIONS;
  cur: number; score: number; ok: number;
  combo: number; maxCombo: number;
  timeLeft: number; answered: boolean;
}

export default function QuizScreen() {
  const { user, saveUser, addXpCoins, checkAch, trackMission } = useGame();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('intro');
  const [qs, setQs] = useState<QState | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [result, setResult] = useState<{ score: number; ok: number; bad: number; maxCombo: number; coins: number } | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval>>();

  const startQuiz = () => {
    SFX.click();
    const state: QState = { qs: shuf([...QUESTIONS]).slice(0, 10), cur: 0, score: 0, ok: 0, combo: 0, maxCombo: 0, timeLeft: 15, answered: false };
    setQs(state); setPhase('play'); setSelected(null); setFeedback(null); startTimer();
  };

  const startTimer = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setQs(prev => {
        if (!prev || prev.answered) return prev;
        const t = prev.timeLeft - 1;
        if (t <= 0) { clearInterval(tickRef.current); handleTimeout(prev); return { ...prev, timeLeft: 0 }; }
        return { ...prev, timeLeft: t };
      });
    }, 1000);
  };

  useEffect(() => () => { if (tickRef.current) clearInterval(tickRef.current); }, []);

  const handleTimeout = async (state: QState) => {
    SFX.wrong();
    const q = state.qs[state.cur];
    setSelected(-1);
    setFeedback({ correct: false, text: `Tempo esgotado! ${q.f}` });
    await new Promise(r => setTimeout(r, 1900));
    nextQuestion({ ...state, combo: 0, answered: true });
  };

  const answer = async (idx: number) => {
    if (!qs || qs.answered) return;
    if (tickRef.current) clearInterval(tickRef.current);
    setSelected(idx);
    const q = qs.qs[qs.cur];
    const correct = idx === q.ans;
    const tBonus = Math.floor(qs.timeLeft * 6.5);
    const pts = correct ? 100 + tBonus + qs.combo * 18 : 0;
    const updated: QState = {
      ...qs, answered: true, score: qs.score + pts,
      ok: correct ? qs.ok + 1 : qs.ok,
      combo: correct ? qs.combo + 1 : 0,
      maxCombo: correct ? Math.max(qs.combo + 1, qs.maxCombo) : qs.maxCombo,
    };
    if (correct) SFX.correct(); else SFX.wrong();
    setFeedback({
      correct,
      text: correct
        ? `Correto! +${pts} pts${updated.combo > 1 ? ` · Combo x${updated.combo}` : ''}`
        : q.f,
    });
    setQs(updated);
    await new Promise(r => setTimeout(r, 1900));
    nextQuestion(updated);
  };

  const nextQuestion = (state: QState) => {
    const next = state.cur + 1;
    if (next >= state.qs.length) { endQuiz(state); }
    else { setQs({ ...state, cur: next, timeLeft: 15, answered: false }); setSelected(null); setFeedback(null); startTimer(); }
  };

  const endQuiz = (state: QState) => {
    SFX.phase();
    const wrong = state.qs.length - state.ok;
    const coins = Math.floor(state.score / 10) + state.ok * 5;
    setResult({ score: state.score, ok: state.ok, bad: wrong, maxCombo: state.maxCombo, coins });
    setPhase('result');
    if (user) {
      saveUser({ ...user, quizScore: Math.max(user.quizScore || 0, state.score),
        history: [{ type: 'Quiz Atômico', score: state.score, date: new Date().toLocaleDateString('pt-BR'), detail: `${state.ok}/${state.qs.length} certas` }, ...(user.history || []).slice(0, 14)] });
      addXpCoins(state.ok * 8, coins);
    }
    if (state.ok === state.qs.length) checkAch('quiz_perfect');
    trackMission('quiz', 1);
  };

  const optColors = ['bg-red-500/15 border-red-500/30 hover:border-red-500/60', 'bg-blue-500/15 border-blue-500/30 hover:border-blue-500/60', 'bg-amber-500/15 border-amber-500/30 hover:border-amber-500/60', 'bg-emerald-500/15 border-emerald-500/30 hover:border-emerald-500/60'];
  const optLetterColors = ['text-red-400', 'text-blue-400', 'text-amber-400', 'text-emerald-400'];
  const optLetters = ['A', 'B', 'C', 'D'];

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {phase === 'intro' && (
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div className="glass-card p-8 max-w-md text-center flex flex-col gap-5 items-center" initial={{ scale: 0.85 }} animate={{ scale: 1 }}>
            <motion.div className="w-20 h-20 rounded-2xl avatar-stage flex items-center justify-center"
              animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <Atom size={36} className="text-primary" />
            </motion.div>
            <h1 className="font-display text-2xl text-foreground">QUIZ ATÔMICO</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Teste seus conhecimentos sobre modelos atômicos!<br />10 perguntas · 15 segundos cada
            </p>
            <div className="flex flex-col gap-2 w-full">
              {[
                { icon: Zap, text: 'Resposta rápida = mais pontos' },
                { icon: Flame, text: 'Acertos seguidos = combo!' },
                { icon: Trophy, text: 'Seu score vai pro ranking' },
              ].map(r => (
                <div key={r.text} className="flex items-center gap-2.5 bg-secondary/30 rounded-lg px-3.5 py-2.5 text-sm font-semibold border border-border/20">
                  <r.icon size={15} className="text-primary flex-shrink-0" />
                  <span>{r.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 justify-center mt-1">
              <button onClick={() => navigate('/hub')}
                className="bg-secondary/60 text-foreground px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 border border-border/30 hover:bg-secondary transition-colors">
                <ArrowLeft size={14} /> Voltar
              </button>
              <button onClick={startQuiz} className="btn-primary text-sm flex items-center gap-1.5">
                Começar <Atom size={15} />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {phase === 'play' && qs && (
        <div className="flex-1 flex flex-col">
          <div className="glass-card mx-3 mt-3 px-4 py-3 flex flex-col gap-2 rounded-2xl flex-shrink-0">
            <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${(qs.cur / qs.qs.length) * 100}%` }} transition={{ duration: 0.4 }} />
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
              <span>{qs.cur + 1}/{qs.qs.length}</span>
              <span className="flex items-center gap-1"><Trophy size={11} /> {qs.score} pts</span>
            </div>
            {/* Timer bar */}
            <div className="h-2 bg-secondary/40 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full origin-left"
                style={{ background: `linear-gradient(90deg, #22C55E, #F59E0B, #EF4444)` }}
                animate={{ scaleX: qs.timeLeft / 15 }} transition={{ duration: 0.3 }} />
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Clock size={14} className={qs.timeLeft <= 5 ? 'text-destructive' : 'text-emerald-500'} />
              <span className={`font-display text-lg ${qs.timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-emerald-500'}`}>
                {qs.timeLeft}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 overflow-y-auto">
            <motion.div key={qs.cur} className="glass-card p-5 max-w-lg w-full text-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-base font-bold leading-relaxed">{qs.qs[qs.cur].t}</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-lg w-full">
              {qs.qs[qs.cur].opts.map((opt, j) => {
                const isCorrect = j === qs.qs[qs.cur].ans;
                const isSelected = selected === j;
                let cls = `${optColors[j]} border`;
                if (selected !== null) {
                  if (isCorrect) cls = 'bg-emerald-500/15 border-2 border-emerald-400';
                  else if (isSelected) cls = 'bg-red-500/15 border-2 border-destructive';
                  else cls = 'opacity-40 border border-border/20 bg-secondary/10';
                }
                return (
                  <motion.button key={j} onClick={() => answer(j)} disabled={qs.answered}
                    className={`${cls} rounded-xl px-4 py-3 text-sm font-bold text-left transition-all disabled:cursor-not-allowed`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: j * 0.05 }}
                    whileHover={!qs.answered ? { scale: 1.02 } : undefined} whileTap={!qs.answered ? { scale: 0.98 } : undefined}>
                    <span className={`font-black mr-2 ${optLetterColors[j]}`}>{optLetters[j]}</span>
                    {opt}
                    {selected !== null && isCorrect && <CheckCircle size={14} className="inline ml-1.5 text-emerald-400" />}
                    {selected !== null && isSelected && !isCorrect && <XCircle size={14} className="inline ml-1.5 text-destructive" />}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className={`max-w-lg w-full px-4 py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2 ${
                    feedback.correct ? 'bg-emerald-500/10 border border-emerald-400/40 text-emerald-400' : 'bg-red-500/10 border border-destructive/40 text-destructive'}`}>
                  {feedback.correct ? <CheckCircle size={15} /> : <XCircle size={15} />}
                  {feedback.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div className="glass-card p-8 max-w-sm text-center flex flex-col items-center gap-3 shadow-2xl"
            initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
            <div className="w-16 h-16 rounded-2xl avatar-stage flex items-center justify-center">
              <Trophy size={28} className={result.ok >= 7 ? 'text-accent' : 'text-muted-foreground'} />
            </div>
            <h2 className="font-display text-xl text-foreground">QUIZ CONCLUÍDO!</h2>
            <div className="font-display text-5xl text-accent">{result.score}</div>
            <div className="text-xs text-muted-foreground font-display tracking-wider">PONTOS</div>
            <div className="bg-secondary/20 rounded-xl p-3 w-full flex flex-col gap-2 border border-border/20">
              {[
                { icon: CheckCircle, l: 'Certas', v: result.ok, color: 'text-emerald-500' },
                { icon: XCircle, l: 'Erradas', v: result.bad, color: 'text-destructive' },
                { icon: Flame, l: 'Combo Máx', v: result.maxCombo, color: 'text-accent' },
                { icon: Coins, l: 'Moedas', v: `+${result.coins}`, color: 'text-accent' },
              ].map(row => (
                <div key={row.l} className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><row.icon size={13} className={row.color} /> {row.l}</span>
                  <span className="font-bold text-foreground">{row.v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 mt-2">
              <button onClick={() => { setPhase('intro'); setQs(null); setResult(null); }}
                className="bg-secondary/60 text-foreground px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 border border-border/30 hover:bg-secondary transition-colors">
                <RotateCcw size={14} /> Novamente
              </button>
              <button onClick={() => navigate('/ranking')} className="btn-primary text-sm flex items-center gap-1.5">
                <Trophy size={14} /> Ranking
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
