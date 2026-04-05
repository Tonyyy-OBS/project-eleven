import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DB, UserData, createUser, today, shuf, Mission, AvatarConfig } from '@/lib/gameStore';
import { xpFor, MISSIONS } from '@/lib/gameData';
import { SFX } from '@/lib/sounds';
import { toast } from 'sonner';

interface GameContextType {
  user: UserData | null;
  setUser: (u: UserData | null) => void;
  login: (name: string, pwd: string) => void;
  register: (name: string, pwd: string) => void;
  logout: () => void;
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

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);

  useEffect(() => {
    const id = DB.curId();
    if (id) {
      const u = DB.find(id);
      if (u) setUser(u);
    }
  }, []);

  const saveUser = useCallback((u: UserData) => {
    DB.save(u);
    setUser({ ...u });
  }, []);

  const login = useCallback((name: string, pwd: string) => {
    const u = DB.all().find(x => x.name.toLowerCase() === name.toLowerCase().trim());
    if (!u) throw new Error('Jogador não encontrado. Crie uma conta!');
    if (u.pwd !== pwd) throw new Error('Senha incorreta. Tente novamente.');
    DB.setCur(u.id);
    setUser(u);
  }, []);

  const register = useCallback((name: string, pwd: string) => {
    const all = DB.all();
    if (all.find(x => x.name.toLowerCase() === name.toLowerCase().trim())) throw new Error('Este nome já está em uso.');
    const u = createUser(name, pwd);
    DB.save(u);
    DB.setCur(u.id);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    SFX.click();
    DB.clrCur();
    setUser(null);
    toast('👋 Até logo!');
  }, []);

  const addXpCoins = useCallback((xp: number, coins: number) => {
    setUser(prev => {
      if (!prev) return prev;
      let nxp = prev.xp + xp, nc = prev.coins + coins, nlv = prev.lv, nxt = prev.xpNext;
      let leveled = false;
      while (nxp >= nxt) { nxp -= nxt; nlv++; nxt = xpFor(nlv); leveled = true; }
      const updated = { ...prev, xp: nxp, xpNext: nxt, lv: nlv, coins: nc };
      DB.save(updated);
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
    DB.save(updated);
    setUser(updated);
    setTimeout(() => setShowAchievement(k), 800);
  };

  const checkAch = useCallback((k: string, cond = true) => {
    setUser(prev => {
      if (!prev || !cond || prev.ach?.includes(k)) return prev;
      const updated = { ...prev, ach: [...(prev.ach || []), k] };
      DB.save(updated);
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
            toast(`🎯 Missão completa: ${m.l}! +${m.c}💰`);
          }
        }
      });
      const updated = { ...prev, coins: prev.coins + coinsEarned, dailyMs: ms };
      DB.save(updated);
      return updated;
    });
  }, []);

  return (
    <GameContext.Provider value={{
      user, setUser, login, register, logout, saveUser,
      addXpCoins, checkAch, trackMission,
      showLevelUp, setShowLevelUp, showAchievement, setShowAchievement
    }}>
      {children}
    </GameContext.Provider>
  );
}
