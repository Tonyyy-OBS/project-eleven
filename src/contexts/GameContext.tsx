import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { xpFor, MISSIONS } from '@/lib/gameData';
import { shuf, today, AvatarConfig, defaultAvatar } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';
import { toast } from 'sonner';
import type { User as SupaUser } from '@supabase/supabase-js';

export interface UserData {
  id: string;
  user_id: string;
  name: string;
  lv: number;
  xp: number;
  xpNext: number;
  coins: number;
  gems: number;
  avatar: AvatarConfig;
  avatarDrawing?: string;
  charCreated: boolean;
  totalScore: number;
  quizScore: number;
  games: number;
  ownedItems: string[];
  ach: string[];
  history: { type: string; score: number; date: string; detail: string }[];
  dailyDate: string;
  dailyMs: Mission[];
  curLv: number;
}

export interface Mission {
  k: string; l: string; t: number; c: number; x: number; prog: number; done: boolean;
}

interface GameContextType {
  user: UserData | null;
  authUser: SupaUser | null;
  loading: boolean;
  setUser: (u: UserData | null) => void;
  login: (email: string, pwd: string) => Promise<void>;
  register: (name: string, email: string, pwd: string) => Promise<void>;
  logout: () => Promise<void>;
  saveUser: (u: UserData) => void;
  addXpCoins: (xp: number, coins: number) => void;
  checkAch: (k: string, cond?: boolean) => void;
  trackMission: (k: string, amt?: number) => void;
  showLevelUp: number | null;
  setShowLevelUp: (v: number | null) => void;
  showAchievement: string | null;
  setShowAchievement: (v: string | null) => void;
}

const GameContext = createContext<GameContextType>(null!);
export const useGame = () => useContext(GameContext);

function profileToUser(row: any): UserData {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name || '',
    lv: row.lv || 1,
    xp: row.xp || 0,
    xpNext: row.xp_next || 80,
    coins: row.coins || 260,
    gems: row.gems || 0,
    avatar: (row.avatar_config as AvatarConfig) || defaultAvatar(),
    avatarDrawing: row.avatar_drawing || undefined,
    charCreated: row.char_created || false,
    totalScore: row.total_score || 0,
    quizScore: row.quiz_score || 0,
    games: row.games || 0,
    ownedItems: row.owned_items || [],
    ach: row.achievements || [],
    history: (row.history as any[]) || [],
    dailyDate: row.daily_date || '',
    dailyMs: (row.daily_missions as any[]) || [],
    curLv: row.cur_lv || 1,
  };
}

function userToProfile(u: UserData) {
  return {
    name: u.name,
    avatar_drawing: u.avatarDrawing || null,
    avatar_config: u.avatar as any,
    lv: u.lv,
    xp: u.xp,
    xp_next: u.xpNext,
    coins: u.coins,
    gems: u.gems,
    total_score: u.totalScore,
    quiz_score: u.quizScore,
    games: u.games,
    owned_items: u.ownedItems,
    achievements: u.ach,
    history: u.history as any,
    daily_date: u.dailyDate,
    daily_missions: u.dailyMs as any,
    cur_lv: u.curLv,
    char_created: u.charCreated,
  };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [authUser, setAuthUser] = useState<SupaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (data) {
      setUser(profileToUser(data));
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setAuthUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const saveUser = useCallback((u: UserData) => {
    setUser({ ...u });
    // Save to Supabase in background
    supabase.from('profiles').update(userToProfile(u)).eq('user_id', u.user_id).then();
  }, []);

  const login = useCallback(async (email: string, pwd: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Email ou senha incorretos.' : error.message);
  }, []);

  const register = useCallback(async (name: string, email: string, pwd: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pwd,
      options: { data: { name } }
    });
    if (error) throw new Error(error.message);
    // Update profile name after signup
    if (data.user) {
      await supabase.from('profiles').update({ name }).eq('user_id', data.user.id);
    }
  }, []);

  const logout = useCallback(async () => {
    SFX.click();
    await supabase.auth.signOut();
    setUser(null);
    setAuthUser(null);
    toast('Até logo!');
  }, []);

  const addXpCoins = useCallback((xp: number, coins: number) => {
    setUser(prev => {
      if (!prev) return prev;
      let nxp = prev.xp + xp, nc = prev.coins + coins, nlv = prev.lv, nxt = prev.xpNext;
      let leveled = false;
      while (nxp >= nxt) { nxp -= nxt; nlv++; nxt = xpFor(nlv); leveled = true; }
      const updated = { ...prev, xp: nxp, xpNext: nxt, lv: nlv, coins: nc };
      supabase.from('profiles').update(userToProfile(updated)).eq('user_id', updated.user_id).then();
      if (leveled) setTimeout(() => setShowLevelUp(nlv), 500);
      if (nlv >= 5) checkAchInternal(updated, 'level_5');
      if (nlv >= 10) checkAchInternal(updated, 'level_10');
      if (nc >= 500) checkAchInternal(updated, 'rich');
      return updated;
    });
  }, []);

  const checkAchInternal = (u: UserData, k: string) => {
    if (u.ach?.includes(k)) return;
    const updated = { ...u, ach: [...(u.ach || []), k] };
    supabase.from('profiles').update(userToProfile(updated)).eq('user_id', updated.user_id).then();
    setUser(updated);
    setTimeout(() => setShowAchievement(k), 800);
  };

  const checkAch = useCallback((k: string, cond = true) => {
    setUser(prev => {
      if (!prev || !cond || prev.ach?.includes(k)) return prev;
      const updated = { ...prev, ach: [...(prev.ach || []), k] };
      supabase.from('profiles').update(userToProfile(updated)).eq('user_id', updated.user_id).then();
      setTimeout(() => setShowAchievement(k), 800);
      return updated;
    });
  }, []);

  const trackMission = useCallback((k: string, amt = 1) => {
    setUser(prev => {
      if (!prev) return prev;
      const ms = [...(prev.dailyMs || [])];
      let coinsEarned = 0;
      ms.forEach(m => {
        if (!m.done && m.k === k) {
          m.prog = Math.min(m.t, m.prog + amt);
          if (m.prog >= m.t) {
            m.done = true;
            coinsEarned += m.c;
            toast(`Missão completa: ${m.l}! +${m.c} moedas`);
          }
        }
      });
      const updated = { ...prev, coins: prev.coins + coinsEarned, dailyMs: ms };
      supabase.from('profiles').update(userToProfile(updated)).eq('user_id', updated.user_id).then();
      return updated;
    });
  }, []);

  return (
    <GameContext.Provider value={{
      user, authUser, loading, setUser, login, register, logout, saveUser,
      addXpCoins, checkAch, trackMission,
      showLevelUp, setShowLevelUp, showAchievement, setShowAchievement
    }}>
      {children}
    </GameContext.Provider>
  );
}
