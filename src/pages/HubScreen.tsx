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
import {
  LogOut, Gamepad2, Brain, Trophy, ShoppingBag, User, Sparkles, Coins, Info,
  Lock, Target, Zap, Star,
} from 'lucide-react';

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
    { key: 'play', icon: Gamepad2, title: 'JOGAR', sub: 'Jogo da Memória', path: '/game', gradient: 'from-blue-500/20 to-blue-600/5', iconBg: 'bg-blue-500' },
    { key: 'quiz', icon: Brain, title: 'QUIZ', sub: quizUnlocked ? 'Teste seus conhecimentos' : `Nível ${QUIZ_UNLOCK} para desbloquear`, path: '/quiz', gradient: 'from-purple-500/20 to-purple-600/5', iconBg: 'bg-purple-500', locked: !quizUnlocked },
    { key: 'rank', icon: Trophy, title: 'RANKING', sub: 'Top jogadores', path: '/ranking', gradient: 'from-amber-500/20 to-amber-600/5', iconBg: 'bg-amber-500' },
    { key: 'shop', icon: ShoppingBag, title: 'LOJA', sub: 'Itens & Costumes', path: '/shop', gradient: 'from-emerald-500/20 to-emerald-600/5', iconBg: 'bg-emerald-500' },
    { key: 'profile', icon: User, title: 'PERFIL', sub: 'Stats & Conquistas', path: '/profile', gradient: 'from-pink-500/20 to-pink-600/5', iconBg: 'bg-pink-500' },
    { key: 'avatar', icon: Sparkles, title: 'AVATAR', sub: 'Personalizar', path: '/avatar', gradient: 'from-cyan-500/20 to-cyan-600/5', iconBg: 'bg-cyan-500' },
    { key: 'credits', icon: Info, title: 'CRÉDITOS', sub: 'Equipe do projeto', path: '/credits', gradient: 'from-slate-500/20 to-slate-600/5', iconBg: 'bg-slate-500' },
  ];

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Header */}
      <div className="glass-card mx-3 mt-3 mb-2 px-4 py-3 flex items-center justify-between rounded-2xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <motion.div className="w-12 h-12 rounded-full border-2 border-primary/60 overflow-hidden flex items-center justify-center bg-secondary/40 cursor-pointer"
            onClick={() => navigate('/profile')} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Avatar config={user.avatar || defaultAvatar()} size={40} />
          </motion.div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-sm text-foreground">{user.name}</span>
            <div className="flex items-center gap-2">
              <span className="bg-primary/15 text-primary font-display text-[0.6rem] px-2 py-0.5 rounded-md border border-primary/20">
                Lv.{user.lv}
              </span>
              <div className="w-20 h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                  initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 0.8 }} />
              </div>
              <span className="text-[0.55rem] text-muted-foreground">{user.xp}/{user.xpNext}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-sm text-accent">
            <Coins size={15} /> {fmt(user.coins)}
          </div>
          <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-secondary/40">
            <LogOut size={17} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {/* Missions */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-primary" />
              <span className="font-display text-xs text-muted-foreground tracking-wider">MISSÕES DIÁRIAS</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {missions.map((m, i) => (
                <motion.div key={i}
                  className={`bg-secondary/30 border rounded-xl p-3 min-w-[170px] flex-shrink-0 flex flex-col gap-1.5 transition-colors ${
                    m.done ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border/30'}`}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <div className="flex items-center gap-1.5">
                    {m.done ? <Check size={12} className="text-emerald-500" /> : <Zap size={12} className="text-primary" />}
                    <span className="text-xs font-bold">{m.l}</span>
                  </div>
                  <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                      style={{ width: `${Math.min(100, (m.prog / m.t) * 100)}%` }} />
                  </div>
                  <div className="flex items-center gap-2 text-[0.63rem] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Coins size={9} className="text-accent" /> {m.c}</span>
                    <span className="flex items-center gap-0.5"><Star size={9} className="text-primary" /> {m.x} XP</span>
                    <span className="ml-auto font-bold">{m.prog}/{m.t}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.button key={card.key}
                  onClick={() => {
                    SFX.click();
                    if (card.locked) { toast.error(`Quiz disponível no Nível ${QUIZ_UNLOCK}`); return; }
                    navigate(card.path);
                  }}
                  className={`glass-card p-4 flex flex-col items-center gap-2.5 text-center transition-all relative overflow-hidden group ${
                    card.locked ? 'opacity-45 cursor-not-allowed' : ''}`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={!card.locked ? { y: -3, scale: 1.01 } : undefined}
                  whileTap={!card.locked ? { scale: 0.97 } : undefined}>
                  {/* Gradient bg */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className={`relative w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center text-white shadow-lg`}>
                    {card.locked ? <Lock size={18} /> : <Icon size={20} />}
                  </div>
                  <div className="relative flex flex-col gap-0.5">
                    <b className="font-display text-xs">{card.title}</b>
                    <small className="text-[0.63rem] text-muted-foreground leading-tight">{card.sub}</small>
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

function Check({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
