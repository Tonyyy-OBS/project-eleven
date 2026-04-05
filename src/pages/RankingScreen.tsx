import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { FAKES } from '@/lib/gameData';
import { DB, fmt, defaultAvatar } from '@/lib/gameStore';
import Avatar from '@/components/Avatar';
import { ArrowLeft } from 'lucide-react';

export default function RankingScreen() {
  const { user } = useGame();
  const navigate = useNavigate();

  const all = useMemo(() => {
    if (!user) return [];
    const real = DB.all().map(u => ({
      n: u.name, s: (u.totalScore || 0) + (u.quizScore || 0), lv: u.lv || 1,
      avatar: u.avatar || defaultAvatar(), me: u.id === user.id,
    }));
    const names = new Set(real.map(p => p.n.toLowerCase()));
    const fakes = FAKES.filter(f => !names.has(f.n.toLowerCase())).map(f => ({
      n: f.n, s: f.s, lv: f.lv, avatar: { ...defaultAvatar(), skinTone: f.skin, hair: f.hair }, me: false,
    }));
    return [...real, ...fakes].sort((a, b) => b.s - a.s).slice(0, 10);
  }, [user]);

  const myPos = all.findIndex(p => p.me);
  const myScore = user ? (user.totalScore || 0) + (user.quizScore || 0) : 0;
  const medals = ['🥇', '🥈', '🥉'];
  const podiumOrder = [1, 0, 2];

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass-card mx-3 mt-3 mb-2 px-4 py-2.5 flex items-center gap-3 rounded-2xl flex-shrink-0">
        <button onClick={() => navigate('/hub')}
          className="bg-secondary text-foreground px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1">
          <ArrowLeft size={14} /> MENU
        </button>
        <h1 className="font-display text-lg text-primary flex-1 text-center">🏆 RANKING GLOBAL</h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto pb-6">
          {/* Podium */}
          <div className="flex items-end justify-center px-4 pt-6 gap-2">
            {podiumOrder.map(idx => {
              const p = all[idx];
              if (!p) return <div key={idx} className="flex-1" />;
              const isFirst = idx === 0;
              const height = idx === 0 ? 'h-20' : idx === 1 ? 'h-14' : 'h-10';
              const avSize = isFirst ? 64 : 50;
              const borderCol = idx === 0 ? 'border-amber-400' : idx === 1 ? 'border-gray-400' : 'border-amber-700';

              return (
                <motion.div key={idx} className="flex flex-col items-center gap-1.5 flex-1"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  style={{ order: idx === 0 ? 2 : idx === 1 ? 1 : 3 }}>
                  {isFirst && <div className="text-2xl animate-float">👑</div>}
                  <div className={`rounded-full bg-secondary/50 overflow-hidden flex items-center justify-center border-[3px] ${borderCol}`}
                    style={{ width: avSize, height: avSize }}>
                    <Avatar config={p.avatar} size={avSize - 8} />
                  </div>
                  <span className="text-xs font-extrabold text-center max-w-[80px] truncate">{p.n}</span>
                  <span className="text-[0.65rem] text-accent font-bold">{fmt(p.s)} pts</span>
                  <div className={`w-full rounded-t-xl flex items-center justify-center text-lg font-bold ${height} border-2 border-b-0 ${borderCol}`}
                    style={{ background: isFirst ? 'rgba(245,158,11,0.1)' : idx === 1 ? 'rgba(192,192,192,0.1)' : 'rgba(205,127,50,0.1)' }}>
                    {medals[idx]}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* List */}
          <div className="px-3.5 pt-4">
            <p className="font-display text-xs text-muted-foreground mb-2 tracking-wider">📋 TOP 10</p>
            <div className="flex flex-col gap-1.5">
              {all.map((p, i) => (
                <motion.div key={i}
                  className={`glass-card px-3 py-2.5 flex items-center gap-2.5 ${p.me ? 'border-2 border-primary' : ''}`}
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <span className="font-display text-sm text-muted-foreground w-7 text-center flex-shrink-0">
                    {i < 3 ? medals[i] : `#${i + 1}`}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-border bg-secondary/30 overflow-hidden flex items-center justify-center flex-shrink-0">
                    <Avatar config={p.avatar} size={28} />
                  </div>
                  <span className="flex-1 font-bold text-sm truncate">
                    {p.n}{p.me && <span className="text-primary text-[0.65rem] ml-1">(Você)</span>}
                  </span>
                  <span className="text-[0.65rem] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-lg flex-shrink-0">Lv.{p.lv}</span>
                  <span className="font-display text-xs text-accent font-bold flex-shrink-0">{fmt(p.s)}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* My rank */}
          {user && (
            <div className="mx-3.5 mt-3">
              <div className="glass-card flex items-center gap-2.5 p-3 border-2 border-primary">
                <span className="font-display text-lg text-primary font-bold min-w-[36px]">
                  {myPos >= 0 ? `#${myPos + 1}` : '#?'}
                </span>
                <div className="w-9 h-9 rounded-full border-2 border-primary bg-secondary/30 overflow-hidden flex items-center justify-center flex-shrink-0">
                  <Avatar config={user.avatar || defaultAvatar()} size={32} />
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
