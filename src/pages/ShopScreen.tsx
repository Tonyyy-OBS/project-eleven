import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import {
  HAIR_STYLES, EYE_TYPES, MOUTH_TYPES, SHIRT_TYPES, PANTS_TYPES, SHOE_TYPES, ACCESSORY_TYPES, AvatarItem
} from '@/lib/gameData';
import { fmt, ownsItem, AvatarConfig } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';
import Avatar from '@/components/Avatar';
import { toast } from 'sonner';
import { ArrowLeft, Coins, ShoppingBag, Check, Lock, Sparkles } from 'lucide-react';

type ShopCat = 'all' | 'hair' | 'eyes' | 'mouth' | 'shirt' | 'pants' | 'shoes' | 'accessory';

interface ShopItem extends AvatarItem { cat: ShopCat; avatarKey: keyof AvatarConfig; }

function buildShopItems(): ShopItem[] {
  const items: ShopItem[] = [];
  HAIR_STYLES.forEach(i => items.push({ ...i, cat: 'hair', avatarKey: 'hair' }));
  EYE_TYPES.forEach(i => items.push({ ...i, cat: 'eyes', avatarKey: 'eyes' }));
  MOUTH_TYPES.forEach(i => items.push({ ...i, cat: 'mouth', avatarKey: 'mouth' }));
  SHIRT_TYPES.forEach(i => items.push({ ...i, cat: 'shirt', avatarKey: 'shirt' }));
  PANTS_TYPES.forEach(i => items.push({ ...i, cat: 'pants', avatarKey: 'pants' }));
  SHOE_TYPES.forEach(i => items.push({ ...i, cat: 'shoes', avatarKey: 'shoes' }));
  ACCESSORY_TYPES.forEach(i => items.push({ ...i, cat: 'accessory', avatarKey: 'accessory' }));
  return items;
}

const ALL_ITEMS = buildShopItems();

export default function ShopScreen() {
  const { user, saveUser, checkAch } = useGame();
  const navigate = useNavigate();
  const [cat, setCat] = useState<ShopCat>('all');
  const [selItem, setSelItem] = useState<ShopItem | null>(null);

  if (!user) return null;
  const items = cat === 'all' ? ALL_ITEMS.filter(i => !i.free) : ALL_ITEMS.filter(i => i.cat === cat);
  const isOwned = (item: ShopItem) => item.free || ownsItem(user.ownedItems, item.cat, item.id);
  const previewAvatar: AvatarConfig = selItem ? { ...user.avatar, [selItem.avatarKey]: selItem.id } : user.avatar;

  const buy = () => {
    if (!selItem || !user) return;
    if (user.coins < (selItem.price || 0)) { toast.error('Moedas insuficientes!'); return; }
    SFX.buy();
    const newOwned = [...user.ownedItems, `${selItem.cat}:${selItem.id}`];
    saveUser({ ...user, ownedItems: newOwned, coins: user.coins - (selItem.price || 0) });
    toast.success(`${selItem.n} comprado!`);
    if (newOwned.length >= 3) checkAch('shopper');
    if (newOwned.length >= 10) checkAch('collector');
  };

  const equip = () => {
    if (!selItem || !user) return;
    SFX.click();
    saveUser({ ...user, avatar: { ...user.avatar, [selItem.avatarKey]: selItem.id } });
    toast.success(`${selItem.n} equipado!`);
  };

  const cats: { k: ShopCat; l: string }[] = [
    { k: 'all', l: 'Todos' }, { k: 'hair', l: 'Cabelo' }, { k: 'shirt', l: 'Roupa' },
    { k: 'pants', l: 'Calça' }, { k: 'shoes', l: 'Calçado' }, { k: 'accessory', l: 'Acessórios' },
  ];

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass-card mx-3 mt-3 mb-2 px-3 py-2.5 flex items-center gap-3 rounded-2xl flex-shrink-0">
        <button onClick={() => navigate('/hub')}
          className="bg-secondary/60 text-foreground px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 border border-border/30 hover:bg-secondary transition-colors">
          <ArrowLeft size={14} />
        </button>
        <div className="flex items-center gap-1.5 flex-1">
          <ShoppingBag size={16} className="text-primary" />
          <h1 className="font-display text-base text-foreground">Loja</h1>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-sm text-accent">
          <Coins size={15} /> {fmt(user.coins)}
        </div>
      </div>

      <div className="flex gap-1.5 px-4 overflow-x-auto scrollbar-hide flex-shrink-0 pb-1">
        {cats.map(c => (
          <button key={c.k} onClick={() => { SFX.click(); setCat(c.k); setSelItem(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
              cat === c.k ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card/50 text-muted-foreground border-border/30 hover:border-primary/30'}`}>
            {c.l}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-3 px-3 py-3 max-w-4xl mx-auto w-full">
        {/* Preview */}
        <div className="flex flex-row md:flex-col items-center gap-3 md:w-44 flex-shrink-0">
          <div className="w-32 h-48 md:w-40 md:h-56 glass-card flex items-center justify-center overflow-hidden transition-all rounded-2xl">
            <Avatar config={previewAvatar} size={100} />
          </div>
          <div className="flex flex-col gap-2 flex-1 md:w-full">
            <p className="text-xs font-bold text-muted-foreground text-center min-h-[1.5rem]">
              {selItem?.n || 'Selecione um item'}
            </p>
            {selItem && !isOwned(selItem) && (
              <button onClick={buy} disabled={user.coins < (selItem.price || 0)}
                className="btn-primary w-full text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
                <Coins size={12} /> COMPRAR {selItem.price}
              </button>
            )}
            {selItem && isOwned(selItem) && (
              <button onClick={equip}
                className="bg-secondary/60 text-foreground font-bold py-2.5 rounded-xl text-xs w-full hover:bg-secondary transition-colors border border-border/30 flex items-center justify-center gap-1.5">
                <Sparkles size={12} /> EQUIPAR
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 auto-rows-min content-start">
          {items.map(item => {
            const owned = isOwned(item);
            const isSel = selItem?.cat === item.cat && selItem?.id === item.id;
            return (
              <motion.div key={`${item.cat}-${item.id}`}
                onClick={() => { SFX.click(); setSelItem(item); }}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all min-h-[90px] ${
                  isSel ? 'border-primary bg-primary/8 shadow-md shadow-primary/15'
                    : owned ? 'border-border/30 bg-card/60 hover:border-primary/30'
                      : 'border-border/20 bg-card/40 opacity-70 hover:opacity-100'}`}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                {owned && <Check size={12} className="text-emerald-500" />}
                {!owned && <Lock size={12} className="text-muted-foreground" />}
                <span className="text-[0.65rem] font-bold text-center leading-tight">{item.n}</span>
                {item.free ? (
                  <span className="text-[0.55rem] font-bold text-emerald-500">Grátis</span>
                ) : owned ? (
                  <span className="text-[0.55rem] font-bold text-emerald-500">Adquirido</span>
                ) : (
                  <span className="flex items-center gap-0.5 text-[0.6rem] font-bold text-accent">
                    <Coins size={9} /> {item.price}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
