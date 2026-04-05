import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { FAKES } from '@/lib/gameData';
import { DB, fmt } from '@/lib/gameStore';
import Avatar from '@/components/Avatar';

export default function RankingScreen() {
  const { user } = useGame();
  const navigate = useNavigate();

  const all = useMemo(() => {
    if (!user) return [];
    const real = DB.all().map(u => ({
      n: u.name, s: (u.totalScore || 0) + (u.quizScore || 0), lv: u.lv || 1,
      c: u.c || 0, h: u.h || 0, o: u.o || 0, e: u.e || 0, me: u.id === user.id,
    }));
    const names = new Set(real.map(p => p.n.toLowerCase()));
    const fakes = FAKES.filter(f => !names.has(f.n.toLowerCase())).map(f => ({
      n: f.n, s: f.s, lv: f.lv, c: f.c, h: f.h, o: f.o, e: f.e, me: false,
    }));
    return [...real, ...fakes].sort((a, b) => b.s - a.s).slice(0, 10);
  }, [user]);

  const myPos = all.findIndex(p => p.me);
  const myScore = user ? (user.totalScore || 0) + (user.quizScore || 0) : 0;
  const medals = ['🥇', '🥈', '🥉'];
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="w-full border-b border-border px-3 py-2.5 flex items-center gap-3 sticky top-0 z-50 backdrop-blur-lg"
        style={{ background: 'rgba(3,3,17,0.92)' }}>
        <button onClick={() => navigate('/hub')}
          className="surface-1 border border-border text-primary px-3 py-1.5 rounded-md font-display text-[0.68rem] font-bold hover:surface-2 transition-all">
          ‹ MENU
        </button>
        <h1 className="font-display text-lg text-primary flex-1 text-center">🏆 RANKING GLOBAL</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto pb-6">
          {/* Podium */}
          <div className="flex items-end justify-center px-4 pt-6 gap-1">
            {podiumOrder.map((idx) => {
              const p = all[idx];
              if (!p) return <div key={idx} className="flex-1" />;
              const isFirst = idx === 0;
              const baseH = idx === 0 ? 'min-h-[76px]' : idx === 1 ? 'min-h-[54px]' : 'min-h-[40px]';
              const borderCol = idx === 0 ? 'border-accent' : idx === 1 ? 'border-gray-400' : 'border-amber-700';
              const avSize = isFirst ? 72 : idx === 1 ? 58 : 54;
              const avBorder = isFirst ? 'border-accent glow-gold' : idx === 1 ? 'border-gray-400' : 'border-amber-700';

              return (
                <motion.div key={idx} className="flex flex-col items-center gap-1 flex-1"
                  initial={{ opacity: 0, y: 38 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  style={{ order: idx === 0 ? 2 : idx === 1 ? 1 : 3 }}>
                  {isFirst && <div className="text-2xl animate-float">👑</div>}
                  <div className={`rounded-full surface-2 overflow-hidden flex items-center justify-center border-[3px] ${avBorder}`}
                    style={{ width: avSize, height: avSize }}>
                    <Avatar c={p.c} h={p.h} o={p.o} e={p.e} size={avSize - 6} />
                  </div>
                  <span className="text-xs font-extrabold text-center max-w-[88px] truncate">{p.n}</span>
                  <span className="font-display text-[0.66rem] text-accent">{fmt(p.s)} pts</span>
                  <div className={`w-full rounded-t-lg flex items-center justify-center text-lg font-bold ${baseH} border-2 border-b-0 ${borderCol}`}
                    style={{ background: isFirst ? 'rgba(245,158,11,0.1)' : idx === 1 ? 'rgba(192,192,192,0.1)' : 'rgba(205,127,50,0.1)' }}>
                    {medals[idx]}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* List */}
          <div className="px-3.5 pt-3.5">
            <p className="font-display text-[0.66rem] text-muted-foreground mb-2 tracking-widest">📋 TOP 10</p>
            <div className="flex flex-col gap-1.5">
              {all.map((p, i) => (
                <motion.div key={i}
                  className={`surface-1 border rounded-md px-3 py-2.5 flex items-center gap-2.5 ${p.me ? 'border-primary bg-primary/5' : 'border-border'}`}
                  initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <span className="font-display text-sm text-muted-foreground w-6 text-center flex-shrink-0">
                    {i < 3 ? medals[i] : `#${i + 1}`}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-border surface-2 overflow-hidden flex items-center justify-center flex-shrink-0">
                    <Avatar c={p.c} h={p.h} o={p.o} e={p.e} size={30} />
                  </div>
                  <span className="flex-1 font-bold text-sm truncate">
                    {p.n}{p.me && <span className="text-primary text-[0.68rem] ml-1">(Você)</span>}
                  </span>
                  <span className="text-[0.68rem] text-muted-foreground surface-1 px-1.5 py-0.5 rounded-lg flex-shrink-0">Lv.{p.lv}</span>
                  <span className="font-display text-xs text-accent font-bold flex-shrink-0">{fmt(p.s)}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* My rank */}
          {user && (
            <div className="mx-3.5 mt-3">
              <div className="flex items-center gap-2.5 p-3 rounded-md border-2 border-primary glow-cyan"
                style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(124,58,237,0.08))' }}>
                <span className="font-display text-lg text-primary font-bold min-w-[36px]">
                  {myPos >= 0 ? `#${myPos + 1}` : '#?'}
                </span>
                <div className="w-9 h-9 rounded-full border-2 border-primary surface-2 overflow-hidden flex items-center justify-center flex-shrink-0">
                  <Avatar c={user.c} h={user.h} o={user.o} e={user.e} size={34} />
                </div>
                <span className="flex-1 font-extrabold truncate">{user.name}</span>
                <span className="font-display text-sm text-accent font-bold flex-shrink-0">{fmt(myScore)} pts</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
