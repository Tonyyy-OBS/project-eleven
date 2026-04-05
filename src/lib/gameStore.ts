import { xpFor } from './gameData';

export interface AvatarConfig {
  skinTone: number;
  bodyType: number;
  hair: number;
  hairColor: number;
  eyes: number;
  nose: number;
  mouth: number;
  shirt: number;
  pants: number;
  shoes: number;
  accessory: number;
}

export interface UserData {
  id: string;
  name: string;
  pwd: string;
  lv: number;
  xp: number;
  xpNext: number;
  coins: number;
  gems: number;
  avatar: AvatarConfig;
  charCreated: boolean;
  totalScore: number;
  quizScore: number;
  games: number;
  ownedItems: string[]; // "category:id" format
  ach: string[];
  history: { type: string; score: number; date: string; detail: string }[];
  dailyDate: string;
  dailyMs: Mission[];
  curLv: number;
}

export interface Mission {
  k: string; l: string; t: number; c: number; x: number; prog: number; done: boolean;
}

const DB_KEY = 'ua3_users';
const CUR_KEY = 'ua3_cur';

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

export function defaultAvatar(): AvatarConfig {
  return {
    skinTone: 0, bodyType: 0, hair: 0, hairColor: 0,
    eyes: 0, nose: 0, mouth: 0, shirt: 0,
    pants: 4, shoes: 0, accessory: 0,
  };
}

export function createUser(name: string, pwd: string): UserData {
  return {
    id: 'u' + Date.now() + Math.random().toString(36).slice(2, 6),
    name: name.trim(), pwd,
    lv: 1, xp: 0, xpNext: xpFor(1), coins: 224, gems: 0,
    avatar: defaultAvatar(),
    charCreated: false,
    totalScore: 0, quizScore: 0, games: 0,
    ownedItems: [], ach: [], history: [],
    dailyDate: '', dailyMs: [], curLv: 1,
  };
}

export const today = () => new Date().toISOString().split('T')[0];

export const fmt = (n: number) =>
  n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' :
  n >= 1000 ? (n / 1000).toFixed(1) + 'k' :
  String(Math.floor(n));

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

export function ownsItem(user: UserData, category: string, id: number): boolean {
  return user.ownedItems.includes(`${category}:${id}`);
}
