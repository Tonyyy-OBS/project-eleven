import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { QUIZ_UNLOCK, MISSIONS as MISSION_DEFS } from '@/lib/gameData';
import { fmt, today, shuf, DB } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';
import Avatar from '@/components/Avatar';
import { toast } from 'sonner';

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

  const refreshMissions = () => {
    SFX.click();
    const ms = shuf(MISSION_DEFS).slice(0, 3).map(m => ({ ...m, prog: 0, done: false }));
    saveUser({ ...user, dailyDate: today(), dailyMs: ms });
    toast('Missões atualizadas!');
  };

  const cards = [
    { key: 'play', ico: '🧠', title: 'JOGAR', sub: 'Jogo da Memória', path: '/game', hoverClass: 'hover:border-primary hover:shadow-[var(--glow-cyan)]' },
    { key: 'quiz', ico: '🧪', title: 'QUIZ ATÔMICO', sub: quizUnlocked ? 'Testar conhecimento!' : `Desbloqueie no Nível ${QUIZ_UNLOCK}`, path: '/quiz', hoverClass: 'hover:border-secondary hover:shadow-[var(--glow-purple)]', locked: !quizUnlocked },
    { key: 'rank', ico: '🏆', title: 'RANKING', sub: 'Melhores do universo', path: '/ranking', hoverClass: 'hover:border-accent hover:shadow-[var(--glow-gold)]' },
    { key: 'shop', ico: '🛒', title: 'LOJA', sub: 'Itens & Costumes', path: '/shop', hoverClass: 'hover:border-success hover:shadow-[var(--glow-green)]' },
    { key: 'profile', ico: '👤', title: 'PERFIL', sub: 'Stats & Conquistas', path: '/profile', hoverClass: 'hover:border-secondary hover:shadow-[var(--glow-purple)]' },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
    >
      {/* Header */}
      <div className="w-full border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-lg"
        style={{ background: 'rgba(3,3,17,0.88)' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-primary surface-2 overflow-hidden flex items-center justify-center glow-cyan flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/profile')}>
            <Avatar c={user.c} h={user.h} o={user.o} e={user.e} size={44} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-sm font-bold text-primary">{user.name}</span>
            <div className="flex items-center gap-1.5">
              <span className="gradient-primary text-primary-foreground font-display text-[0.6rem] font-bold px-2 py-0.5 rounded-xl whitespace-nowrap">
                Lv.{user.lv}
              </span>
              <div className="w-24 h-1.5 surface-2 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full gradient-primary" initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
              </div>
              <span className="text-[0.6rem] text-muted-foreground whitespace-nowrap">{user.xp}/{user.xpNext}</span>
            </div>
          </div>
        </div>
        <div className="font-display text-accent font-bold text-sm flex items-center gap-1 text-glow-gold">
          <span>💰</span><span>{fmt(user.coins)}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto px-4 py-4 flex flex-col gap-4">
          {/* Missions */}
          <div className="surface-1 border border-border rounded-lg p-3.5">
            <div className="flex justify-between items-center mb-2.5">
              <span className="font-display text-[0.68rem] text-muted-foreground tracking-widest">📅 MISSÕES DIÁRIAS</span>
              <button onClick={refreshMissions} className="text-muted-foreground hover:text-primary hover:rotate-180 transition-all text-base p-0.5" title="Atualizar">↺</button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {missions.map((m, i) => (
                <div key={i} className={`surface-2 border rounded-md p-2.5 min-w-[185px] flex-shrink-0 flex flex-col gap-1.5 transition-colors ${m.done ? 'border-success' : 'border-border'}`}>
                  <span className="text-xs font-bold">{m.done ? '✅ ' : ''}{m.l}</span>
                  <div className="h-1 surface-1 rounded-full overflow-hidden">
                    <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${Math.min(100, (m.prog / m.t) * 100)}%` }} />
                  </div>
                  <span className="text-[0.68rem] text-accent">💰 {m.c} · ⚡ {m.x} XP · {m.prog}/{m.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {cards.map((card, i) => (
              <motion.button
                key={card.key}
                onClick={() => {
                  SFX.click();
                  if (card.locked) { toast(`🔒 Quiz disponível no Nível ${QUIZ_UNLOCK}!`); SFX.error(); return; }
                  navigate(card.path);
                }}
                className={`surface-1 border border-border rounded-lg p-4 flex items-center gap-3 text-left transition-all relative overflow-hidden cursor-pointer ${card.hoverClass}`}
                whileHover={{ y: -3 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none" />
                <span className="text-3xl flex-shrink-0">{card.ico}</span>
                <div className="flex-1 flex flex-col gap-0.5">
                  <b className="font-display text-xs font-bold">{card.title}</b>
                  <small className="text-[0.72rem] text-muted-foreground">{card.sub}</small>
                </div>
                <span className={`text-xl font-bold ml-auto ${card.locked ? 'text-muted-foreground' : 'text-primary'}`}>
                  {card.locked ? '🔒' : '›'}
                </span>
              </motion.button>
            ))}

            <motion.button
              onClick={logout}
              className="surface-1 border border-border rounded-lg p-4 flex items-center gap-3 text-left transition-all hover:border-destructive hover:shadow-[var(--glow-red)] cursor-pointer relative overflow-hidden"
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <span className="text-3xl flex-shrink-0">🚪</span>
              <div className="flex-1 flex flex-col gap-0.5">
                <b className="font-display text-xs font-bold">SAIR</b>
                <small className="text-[0.72rem] text-muted-foreground">Trocar de conta</small>
              </div>
              <span className="text-xl font-bold ml-auto text-destructive">›</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
