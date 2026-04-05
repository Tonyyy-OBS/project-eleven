import { xpFor } from './gameData';

// We'll use a simple store approach instead of zustand for now
// Using React context + localStorage

export interface UserData {
  id: string;
  name: string;
  email: string;
  pwd: string;
  lv: number;
  xp: number;
  xpNext: number;
  coins: number;
  c: number; h: number; o: number; e: number;
  charCreated: boolean;
  totalScore: number;
  quizScore: number;
  games: number;
  owned: number[];
  ach: string[];
  history: { type: string; score: number; date: string; detail: string }[];
  dailyDate: string;
  dailyMs: Mission[];
  curLv: number;
}

export interface Mission {
  k: string; l: string; t: number; c: number; x: number; prog: number; done: boolean;
}

const DB_KEY = 'ua2_users';
const CUR_KEY = 'ua2_cur';

export const DB = {
  all(): UserData[] {
    try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); } catch { return []; }
  },
  save(u: UserData) {
    const a = this.all();
    const i = a.findIndex(x => x.id === u.id);
    if (i >= 0) a[i] = u; else a.push(u);
    localStorage.setItem(DB_KEY, JSON.stringify(a));
    return u;
  },
  find(id: string) { return this.all().find(u => u.id === id) || null; },
  curId() { return localStorage.getItem(CUR_KEY) || null; },
  setCur(id: string) { localStorage.setItem(CUR_KEY, id); },
  clrCur() { localStorage.removeItem(CUR_KEY); },
};

export function createUser(name: string, email: string, pwd: string): UserData {
  return {
    id: 'u' + Date.now() + Math.random().toString(36).slice(2, 6),
    name: name.trim(), email: email.toLowerCase().trim(), pwd,
    lv: 1, xp: 0, xpNext: xpFor(1), coins: 50,
    c: 0, h: 0, o: 0, e: 0, charCreated: false,
    totalScore: 0, quizScore: 0, games: 0,
    owned: [1, 6, 11], ach: [], history: [],
    dailyDate: '', dailyMs: [], curLv: 1,
  };
}

export const today = () => new Date().toISOString().split('T')[0];

export const fmt = (n: number) =>
  n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' :
  n >= 1000 ? (n / 1000).toFixed(1) + 'k' :
  String(n | 0);

export const fmtTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export const shuf = <T,>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};
