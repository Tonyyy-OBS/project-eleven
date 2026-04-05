import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { QUESTIONS } from '@/lib/gameData';
import { shuf } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';
import { ArrowLeft, Trophy } from 'lucide-react';

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
    const state: QState = {
      qs: shuf([...QUESTIONS]).slice(0, 10),
      cur: 0, score: 0, ok: 0,
      combo: 0, maxCombo: 0,
      timeLeft: 15, answered: false,
    };
    setQs(state);
    setPhase('play');
    setSelected(null);
    setFeedback(null);
    startTimer();
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
    setFeedback({ correct: false, text: `⏱️ Tempo! ${q.f}` });
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
        ? `✅ Correto! +${pts} pts${updated.combo > 1 ? ` 🔥 Combo x${updated.combo}` : ''}`
        : `❌ ${q.f}`,
    });
    setQs(updated);
    await new Promise(r => setTimeout(r, 1900));
    nextQuestion(updated);
  };

  const nextQuestion = (state: QState) => {
    const next = state.cur + 1;
    if (next >= state.qs.length) {
      endQuiz(state);
    } else {
      setQs({ ...state, cur: next, timeLeft: 15, answered: false });
      setSelected(null);
      setFeedback(null);
      startTimer();
    }
  };

  const endQuiz = (state: QState) => {
    SFX.phase();
    const wrong = state.qs.length - state.ok;
    const coins = Math.floor(state.score / 10) + state.ok * 5;
    setResult({ score: state.score, ok: state.ok, bad: wrong, maxCombo: state.maxCombo, coins });
    setPhase('result');
    if (user) {
      saveUser({
        ...user, quizScore: Math.max(user.quizScore || 0, state.score),
        history: [{ type: '🧪 Quiz', score: state.score, date: new Date().toLocaleDateString('pt-BR'), detail: `${state.ok}/${state.qs.length} certas` }, ...(user.history || []).slice(0, 14)]
      });
      addXpCoins(state.ok * 8, coins);
    }
    if (state.ok === state.qs.length) checkAch('quiz_perfect');
    trackMission('quiz', 1);
  };

  const optColors = ['#EF4444', '#3B82F6', '#F59E0B', '#22C55E'];
  const optLetters = ['A', 'B', 'C', 'D'];

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {phase === 'intro' && (
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div className="glass-card p-8 max-w-md text-center flex flex-col gap-4" initial={{ scale: 0.85 }} animate={{ scale: 1 }}>
            <div className="text-6xl animate-float">🧪</div>
            <h1 className="font-display text-2xl text-primary">QUIZ ATÔMICO</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Teste seus conhecimentos sobre modelos atômicos!<br />10 perguntas · 15 segundos cada
            </p>
            <div className="flex flex-col gap-2">
              {['⚡ Resposta rápida = mais pontos', '🔥 Acertos seguidos = combo!', '🏆 Seu score vai pro ranking'].map(r => (
                <div key={r} className="bg-secondary/40 rounded-lg px-3.5 py-2 text-sm font-semibold">{r}</div>
              ))}
            </div>
            <div className="flex gap-2.5 justify-center mt-2">
              <button onClick={() => navigate('/hub')}
                className="bg-secondary text-foreground px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5">
                <ArrowLeft size={14} /> VOLTAR
              </button>
              <button onClick={startQuiz} className="btn-primary text-sm">
                COMEÇAR ⚛️
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {phase === 'play' && qs && (
        <div className="flex-1 flex flex-col">
          <div className="glass-card mx-3 mt-3 px-4 py-3 flex flex-col gap-2 rounded-2xl flex-shrink-0">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(qs.cur / qs.qs.length) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <span>{qs.cur + 1}/{qs.qs.length}</span>
              <span>{qs.score} pts</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-transform duration-100 origin-left"
                style={{ background: `linear-gradient(90deg, #22C55E, #F59E0B, #EF4444)`, transform: `scaleX(${qs.timeLeft / 15})` }} />
            </div>
            <div className={`font-display text-xl text-center ${qs.timeLeft <= 5 ? 'text-destructive' : 'text-emerald-600'}`}>
              {qs.timeLeft}
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
                let cls = 'glass-card border-2 border-transparent';
                if (selected !== null) {
                  if (isCorrect) cls = 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700';
                  else if (isSelected) cls = 'bg-red-50 border-2 border-destructive text-destructive';
                }
                return (
                  <motion.button key={j} onClick={() => answer(j)} disabled={qs.answered}
                    className={`${cls} rounded-xl px-4 py-3 text-sm font-bold text-left transition-all hover:shadow-md disabled:cursor-not-allowed`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: j * 0.05 }}>
                    <span className="font-black mr-2" style={{ color: optColors[j] }}>{optLetters[j]}</span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className={`max-w-lg w-full px-4 py-3 rounded-xl text-sm font-bold text-center ${feedback.correct ? 'bg-emerald-50 border border-emerald-400 text-emerald-700' : 'bg-red-50 border border-destructive text-destructive'}`}
                >{feedback.text}</motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div className="glass-card p-8 max-w-sm text-center flex flex-col items-center gap-3 shadow-xl"
            initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
            <div className="text-6xl animate-float">
              {result.ok >= 9 ? '🥇' : result.ok >= 7 ? '🥈' : '🥉'}
            </div>
            <h2 className="font-display text-xl text-primary">QUIZ CONCLUÍDO!</h2>
            <div className="font-display text-5xl text-accent">{result.score}</div>
            <div className="text-xs text-muted-foreground font-display tracking-wider">PONTOS</div>
            <div className="bg-secondary/30 rounded-xl p-3 w-full flex flex-col gap-2">
              {[['✅ Certas', result.ok], ['❌ Erradas', result.bad], ['🔥 Combo Máx', result.maxCombo], ['🪙 Moedas', `+${result.coins}`]].map(([l, v]) => (
                <div key={l as string} className="flex justify-between text-sm text-muted-foreground">
                  <span>{l}</span><span className="font-bold text-foreground">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 mt-2">
              <button onClick={() => { setPhase('intro'); setQs(null); setResult(null); }}
                className="bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-bold">
                🔄 Novamente
              </button>
              <button onClick={() => navigate('/ranking')} className="btn-primary text-sm flex items-center gap-1.5">
                <Trophy size={14} /> RANKING
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
