import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { ACHIEVEMENTS, TITLES } from '@/lib/gameData';
import { fmt, defaultAvatar } from '@/lib/gameStore';
import Avatar from '@/components/Avatar';
import { ArrowLeft, Trophy, Coins, Gamepad2, Star, Clock, Medal } from 'lucide-react';

export default function ProfileScreen() {
  const { user } = useGame();
  const navigate = useNavigate();
  if (!user) return null;

  const titleIdx = Math.min((user.lv || 1) - 1, TITLES.length - 1);
  const totalScore = (user.totalScore || 0) + (user.quizScore || 0);

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass-card mx-3 mt-3 mb-2 px-4 py-2.5 flex items-center gap-3 rounded-2xl flex-shrink-0">
        <button onClick={() => navigate('/hub')}
          className="bg-secondary/60 text-foreground px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 border border-border/30 hover:bg-secondary transition-colors">
          <ArrowLeft size={14} />
        </button>
        <h1 className="font-display text-base text-foreground flex-1 text-center">Meu Perfil</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-3.5 py-4 flex flex-col gap-3">
          <motion.div className="glass-card p-6 flex flex-col items-center gap-3" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <div className="w-24 h-32 rounded-2xl border-2 border-primary/40 bg-secondary/20 overflow-hidden flex items-center justify-center">
              <Avatar config={user.avatar || defaultAvatar()} size={72} />
            </div>
            <h2 className="font-display text-xl text-foreground">{user.name}</h2>
            <span className="bg-primary/15 text-primary font-display text-[0.7rem] px-3 py-0.5 rounded-lg border border-primary/20">
              {TITLES[titleIdx]}
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full mt-1">
              {[
                { icon: Star, n: user.lv || 1, l: 'Nível', color: 'text-primary' },
                { icon: Coins, n: fmt(user.coins || 0), l: 'Moedas', color: 'text-accent' },
                { icon: Gamepad2, n: user.games || 0, l: 'Partidas', color: 'text-blue-400' },
                { icon: Trophy, n: fmt(totalScore), l: 'Score', color: 'text-amber-400' },
              ].map(s => (
                <div key={s.l} className="flex flex-col items-center gap-1 bg-secondary/20 rounded-xl p-2.5 border border-border/15">
                  <s.icon size={14} className={s.color} />
                  <span className="font-display text-lg text-foreground">{s.n}</span>
                  <span className="text-[0.6rem] text-muted-foreground">{s.l}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Medal size={14} className="text-accent" />
              <span className="font-display text-xs text-muted-foreground tracking-wider">CONQUISTAS</span>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
              {ACHIEVEMENTS.map(a => {
                const done = user.ach?.includes(a.k);
                return (
                  <motion.div key={a.k}
                    className={`flex flex-col items-center gap-1 p-2 bg-secondary/20 border rounded-xl cursor-default transition-all ${
                      done ? 'border-accent/40 bg-accent/5' : 'border-border/15 opacity-40'}`}
                    title={a.d} whileHover={done ? { scale: 1.05 } : undefined}>
                    <span className="font-display text-[0.7rem] text-primary font-black">{a.ico}</span>
                    <span className={`text-[0.5rem] font-bold text-center leading-tight ${done ? 'text-accent' : 'text-muted-foreground'}`}>{a.n}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-primary" />
              <span className="font-display text-xs text-muted-foreground tracking-wider">HISTÓRICO RECENTE</span>
            </div>
            {(!user.history || user.history.length === 0) ? (
              <p className="text-muted-foreground text-sm text-center py-4">Nenhuma partida ainda</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {user.history.slice(0, 8).map((h, i) => (
                  <div key={i} className="flex justify-between items-center bg-secondary/20 rounded-xl px-3 py-2 text-sm border border-border/10">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-foreground">{h.type}</span>
                      <span className="text-[0.6rem] text-muted-foreground">{h.date}</span>
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
