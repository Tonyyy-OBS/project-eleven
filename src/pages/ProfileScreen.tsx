import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { ACHIEVEMENTS, TITLES } from '@/lib/gameData';
import { fmt } from '@/lib/gameStore';
import Avatar from '@/components/Avatar';

export default function ProfileScreen() {
  const { user } = useGame();
  const navigate = useNavigate();

  if (!user) return null;

  const titleIdx = Math.min((user.lv || 1) - 1, TITLES.length - 1);
  const totalScore = (user.totalScore || 0) + (user.quizScore || 0);

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="w-full border-b border-border px-3 py-2.5 flex items-center gap-3 sticky top-0 z-50 backdrop-blur-lg"
        style={{ background: 'rgba(3,3,17,0.92)' }}>
        <button onClick={() => navigate('/hub')}
          className="surface-1 border border-border text-primary px-3 py-1.5 rounded-md font-display text-[0.68rem] font-bold hover:surface-2 transition-all">
          ‹ MENU
        </button>
        <h1 className="font-display text-lg text-primary flex-1 text-center">👤 MEU PERFIL</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-xl mx-auto px-3.5 py-4 flex flex-col gap-3">
          {/* Profile card */}
          <motion.div className="surface-1 border-2 border-primary rounded-lg p-6 flex flex-col items-center gap-3 glow-cyan"
            initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <div className="w-24 h-24 rounded-full border-[3.5px] border-primary surface-2 overflow-hidden flex items-center justify-center glow-cyan">
              <Avatar c={user.c} h={user.h} o={user.o} e={user.e} size={98} />
            </div>
            <h2 className="font-display text-xl text-primary">{user.name}</h2>
            <span className="gradient-primary text-primary-foreground font-display text-[0.7rem] font-bold px-3 py-0.5 rounded-xl">
              {TITLES[titleIdx]}
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full mt-1">
              {[
                { n: user.lv || 1, l: 'Nível' },
                { n: fmt(user.coins || 0), l: 'Moedas' },
                { n: user.games || 0, l: 'Partidas' },
                { n: fmt(totalScore), l: 'Score Total' },
              ].map(s => (
                <div key={s.l} className="flex flex-col items-center gap-1 surface-1 rounded-md p-2.5">
                  <span className="font-display text-lg font-bold text-accent">{s.n}</span>
                  <span className="text-[0.65rem] text-muted-foreground">{s.l}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <div className="surface-1 border border-border rounded-lg p-3.5">
            <p className="font-display text-[0.68rem] text-muted-foreground tracking-widest mb-2.5">🏅 CONQUISTAS</p>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
              {ACHIEVEMENTS.map(a => {
                const done = user.ach?.includes(a.k);
                return (
                  <motion.div key={a.k}
                    className={`flex flex-col items-center gap-1 p-2 surface-2 border rounded-md cursor-default transition-all
                      ${done ? 'border-accent bg-accent/5 hover:-translate-y-0.5 hover:glow-gold' : 'border-border'}`}
                    title={a.d}
                    whileHover={done ? { scale: 1.05 } : undefined}
                  >
                    <span className={`text-2xl ${!done ? 'grayscale opacity-30' : ''}`}>{a.ico}</span>
                    <span className={`text-[0.6rem] font-bold text-center ${done ? 'text-accent' : 'text-muted-foreground'}`}>{a.n}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* History */}
          <div className="surface-1 border border-border rounded-lg p-3.5">
            <p className="font-display text-[0.68rem] text-muted-foreground tracking-widest mb-2.5">📜 HISTÓRICO RECENTE</p>
            {(!user.history || user.history.length === 0) ? (
              <p className="text-muted-foreground text-sm text-center py-4">Nenhuma partida ainda. Comece a jogar!</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {user.history.slice(0, 8).map((h, i) => (
                  <div key={i} className="flex justify-between items-center surface-2 rounded-md px-3 py-2 text-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold">{h.type}</span>
                      <span className="text-[0.7rem] text-muted-foreground">{h.date}</span>
                    </div>
                    <span className="font-display text-xs text-accent font-bold">{fmt(h.score)} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
