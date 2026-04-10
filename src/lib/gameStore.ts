import { xpFor } from './gameData';

export interface AvatarConfig {
  gender?: 'male' | 'female';
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

export function defaultAvatar(): AvatarConfig {
  return {
    gender: 'male',
    skinTone: 1,
    bodyType: 0,
    hair: 1,
    hairColor: 1,
    eyes: 0,
    nose: 0,
    mouth: 0,
    shirt: 0,
    pants: 1,
    shoes: 0,
    accessory: 0,
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

export function ownsItem(ownedItems: string[], category: string, id: number): boolean {
  return ownedItems.includes(`${category}:${id}`);
}
