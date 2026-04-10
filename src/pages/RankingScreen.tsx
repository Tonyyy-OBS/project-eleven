import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { FAKES } from '@/lib/gameData';
import { fmt, defaultAvatar, AvatarConfig } from '@/lib/gameStore';
import { supabase } from '@/integrations/supabase/client';
import Avatar from '@/components/Avatar';
import { ArrowLeft, Trophy, Crown, Medal } from 'lucide-react';

interface RankEntry {
  n: string; s: number; lv: number; avatar: AvatarConfig; me: boolean; avatarDrawing?: string;
}

export default function RankingScreen() {
  const { user } = useGame();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('profiles').select('*').then(({ data }) => {
      if (data) setProfiles(data);
    });
  }, []);

  const all = useMemo(() => {
    if (!user) return [];
    const real: RankEntry[] = profiles.map(u => ({
      n: u.name || 'Jogador',
      s: (u.total_score || 0) + (u.quiz_score || 0),
      lv: u.lv || 1,
      avatar: (u.avatar_config as AvatarConfig) || defaultAvatar(),
      avatarDrawing: u.avatar_drawing,
      me: u.user_id === user.user_id,
    }));
    const names = new Set(real.map(p => p.n.toLowerCase()));
    const fakes: RankEntry[] = FAKES.filter(f => !names.has(f.n.toLowerCase())).map(f => ({
      n: f.n, s: f.s, lv: f.lv, avatar: { ...defaultAvatar(), skinTone: f.skin, hair: f.hair }, me: false,
    }));
    return [...real, ...fakes].sort((a, b) => b.s - a.s).slice(0, 10);
  }, [user, profiles]);

  const myPos = all.findIndex(p => p.me);
  const myScore = user ? (user.totalScore || 0) + (user.quizScore || 0) : 0;
  const medalColors = ['text-blue-400', 'text-slate-400', 'text-blue-300'];
  const podiumOrder = [1, 0, 2];

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass-card mx-3 mt-3 mb-2 px-4 py-2.5 flex items-center gap-3 rounded-2xl flex-shrink-0">
        <button onClick={() => navigate('/hub')}
          className="bg-secondary/60 text-foreground px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 border border-border/30 hover:bg-secondary transition-colors">
          <ArrowLeft size={14} />
        </button>
        <div className="flex items-center gap-1.5 flex-1 justify-center">
          <Trophy size={16} className="text-primary" />
          <h1 className="font-display text-base text-foreground">Ranking</h1>
        </div>
        <div className="w-10" />
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
              const borderCol = idx === 0 ? 'border-blue-400/60' : idx === 1 ? 'border-slate-400/60' : 'border-blue-300/60';

              return (
                <motion.div key={idx} className="flex flex-col items-center gap-1.5 flex-1"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  style={{ order: idx === 0 ? 2 : idx === 1 ? 1 : 3 }}>
                  {isFirst && <Crown size={22} className="text-blue-400 animate-float" />}
                  <div className={`rounded-full bg-secondary/30 overflow-hidden flex items-center justify-center border-[3px] ${borderCol}`}
                    style={{ width: avSize, height: avSize }}>
                    {p.avatarDrawing ? (
                      <img src={p.avatarDrawing} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Avatar config={p.avatar} size={avSize - 8} />
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-center max-w-[80px] truncate">{p.n}</span>
                  <span className="text-[0.6rem] text-primary font-bold">{fmt(p.s)} pts</span>
                  <div className={`w-full rounded-t-xl flex items-center justify-center text-lg font-bold ${height} border border-b-0 ${borderCol} bg-secondary/10`}>
                    <Medal size={18} className={medalColors[idx]} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* List */}
          <div className="px-3.5 pt-4">
            <span className="font-display text-xs text-muted-foreground tracking-wider">TOP 10</span>
            <div className="flex flex-col gap-1.5 mt-2">
              {all.map((p, i) => (
                <motion.div key={i}
                  className={`glass-card px-3 py-2.5 flex items-center gap-2.5 ${p.me ? 'border-2 border-primary' : ''}`}
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <span className="font-display text-sm text-muted-foreground w-7 text-center flex-shrink-0">
                    {i < 3 ? <Medal size={15} className={medalColors[i]} /> : `#${i + 1}`}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-border/30 bg-secondary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {p.avatarDrawing ? (
                      <img src={p.avatarDrawing} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Avatar config={p.avatar} size={28} />
                    )}
                  </div>
                  <span className="flex-1 font-bold text-sm truncate">
                    {p.n}{p.me && <span className="text-primary text-[0.6rem] ml-1">(Você)</span>}
                  </span>
                  <span className="text-[0.6rem] text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded-md flex-shrink-0 border border-border/15">Lv.{p.lv}</span>
                  <span className="font-display text-xs text-primary font-bold flex-shrink-0">{fmt(p.s)}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* My rank */}
          {user && (
            <div className="mx-3.5 mt-3">
              <div className="glass-card flex items-center gap-2.5 p-3 border-2 border-primary/50">
                <span className="font-display text-lg text-primary font-bold min-w-[36px]">
                  {myPos >= 0 ? `#${myPos + 1}` : '#?'}
                </span>
                <div className="w-9 h-9 rounded-full border-2 border-primary/40 bg-secondary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {user.avatarDrawing ? (
                    <img src={user.avatarDrawing} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Avatar config={user.avatar || defaultAvatar()} size={32} />
                  )}
                </div>
                <span className="flex-1 font-extrabold truncate">{user.name}</span>
                <span className="font-display text-sm text-primary font-bold flex-shrink-0">{fmt(myScore)} pts</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
