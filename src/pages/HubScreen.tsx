import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { QUIZ_UNLOCK, MISSIONS as MISSION_DEFS } from '@/lib/gameData';
import { fmt, today, shuf } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';
import Avatar from '@/components/Avatar';
import { defaultAvatar } from '@/lib/gameStore';
import { toast } from 'sonner';
import { LogOut, Gamepad2, Brain, Trophy, ShoppingBag, User, Star, Coins } from 'lucide-react';

export default function HubScreen() {
  const { user, saveUser, logout } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.dailyDate !== today() || !(user.dailyMs?.length)) {
      const ms = shuf(MISSION_DEFS).slice(0, 3).map(m => ({ ...m, prog: 0, done: false }));
      saveUser({ ...user, dailyDate: today(), dailyMs: ms });
    }
  }, []);

  if (!user) return null;

  const xpPct = Math.min(100, (user.xp / user.xpNext) * 100);
  const quizUnlocked = user.lv >= QUIZ_UNLOCK;
  const missions = user.dailyMs || [];

  const cards = [
    { key: 'play', icon: Gamepad2, title: 'JOGAR', sub: 'Jogo da Memória', path: '/game', color: 'from-blue-400 to-blue-600' },
    { key: 'quiz', icon: Brain, title: 'QUIZ ATÔMICO', sub: quizUnlocked ? 'Testar conhecimento!' : `Nível ${QUIZ_UNLOCK} para desbloquear`, path: '/quiz', color: 'from-purple-400 to-purple-600', locked: !quizUnlocked },
    { key: 'rank', icon: Trophy, title: 'RANKING', sub: 'Top jogadores', path: '/ranking', color: 'from-amber-400 to-amber-600' },
    { key: 'shop', icon: ShoppingBag, title: 'LOJA', sub: 'Itens & Costumes', path: '/shop', color: 'from-emerald-400 to-emerald-600' },
    { key: 'profile', icon: User, title: 'PERFIL', sub: 'Stats & Conquistas', path: '/profile', color: 'from-pink-400 to-pink-600' },
    { key: 'avatar', icon: Star, title: 'AVATAR', sub: 'Personalizar', path: '/avatar', color: 'from-cyan-400 to-cyan-600' },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="glass-card mx-3 mt-3 mb-2 px-4 py-3 flex items-center justify-between rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden flex items-center justify-center bg-secondary/50 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/profile')}>
            <Avatar config={user.avatar || defaultAvatar()} size={40} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-sm text-primary">{user.name}</span>
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground font-display text-[0.6rem] px-2 py-0.5 rounded-lg">
                Lv.{user.lv}
              </span>
              <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 0.6 }} />
              </div>
              <span className="text-[0.6rem] text-muted-foreground">{user.xp}/{user.xpNext}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-bold text-sm text-accent">
            <Coins size={16} /> {fmt(user.coins)}
          </div>
          <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors p-1">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {/* Missions */}
          <div className="glass-card p-4">
            <p className="font-display text-xs text-muted-foreground mb-3 tracking-wider">📅 MISSÕES DIÁRIAS</p>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {missions.map((m, i) => (
                <div key={i} className={`bg-secondary/40 border rounded-xl p-3 min-w-[180px] flex-shrink-0 flex flex-col gap-1.5 transition-colors ${m.done ? 'border-emerald-400' : 'border-border/50'}`}>
                  <span className="text-xs font-bold">{m.done ? '✅ ' : ''}{m.l}</span>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, (m.prog / m.t) * 100)}%` }} />
                  </div>
                  <span className="text-[0.68rem] text-accent font-semibold">🪙 {m.c} · ⚡ {m.x} XP · {m.prog}/{m.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.key}
                  onClick={() => {
                    SFX.click();
                    if (card.locked) { toast(`🔒 Quiz disponível no Nível ${QUIZ_UNLOCK}!`); return; }
                    if (card.key === 'avatar') { navigate('/avatar'); return; }
                    navigate(card.path);
                  }}
                  className={`glass-card p-4 flex flex-col items-center gap-2 text-center transition-all relative overflow-hidden ${card.locked ? 'opacity-50' : 'hover:shadow-lg hover:-translate-y-1'}`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  whileTap={!card.locked ? { scale: 0.97 } : undefined}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md`}>
                    {card.locked ? <span className="text-xl">🔒</span> : <Icon size={22} />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <b className="font-display text-xs">{card.title}</b>
                    <small className="text-[0.68rem] text-muted-foreground leading-tight">{card.sub}</small>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
