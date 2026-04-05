import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { SHOP_ITEMS } from '@/lib/gameData';
import { fmt } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';
import Avatar from '@/components/Avatar';
import { toast } from 'sonner';

type Cat = 'all' | 'hair' | 'outfit' | 'color';

export default function ShopScreen() {
  const { user, saveUser, checkAch } = useGame();
  const navigate = useNavigate();
  const [cat, setCat] = useState<Cat>('all');
  const [selId, setSelId] = useState<number | null>(null);

  if (!user) return null;

  const items = SHOP_ITEMS.filter(i => cat === 'all' || i.cat === cat);
  const sel = selId ? SHOP_ITEMS.find(i => i.id === selId) : null;
  const owned = (id: number) => user.owned?.includes(id) || SHOP_ITEMS.find(i => i.id === id)?.p === 0;

  const previewCfg = { c: user.c, h: user.h, o: user.o, e: user.e };
  if (sel) {
    if (sel.cat === 'hair') previewCfg.h = sel.idx;
    if (sel.cat === 'outfit') previewCfg.o = sel.idx;
    if (sel.cat === 'color') previewCfg.c = sel.idx;
  }

  const buy = () => {
    if (!sel || !user) return;
    if (user.coins < sel.p) { toast('Moedas insuficientes! 💸'); return; }
    const nOwned = [...(user.owned || []), sel.id];
    saveUser({ ...user, owned: nOwned, coins: user.coins - sel.p });
    SFX.buy();
    toast(`✅ ${sel.n} comprado!`);
    if (nOwned.filter(id => id > 3).length >= 3) checkAch('shopper');
  };

  const equip = () => {
    if (!sel || !user) return;
    const upd: Partial<typeof user> = {};
    if (sel.cat === 'hair') upd.h = sel.idx;
    if (sel.cat === 'outfit') upd.o = sel.idx;
    if (sel.cat === 'color') upd.c = sel.idx;
    saveUser({ ...user, ...upd });
    SFX.click();
    toast(`✨ ${sel.n} equipado!`);
  };

  const cats: { k: Cat; label: string }[] = [
    { k: 'all', label: 'Todos' },
    { k: 'hair', label: '💇 Cabelo' },
    { k: 'outfit', label: '👕 Roupa' },
    { k: 'color', label: '🎨 Cor' },
  ];

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="w-full border-b border-border px-3 py-2.5 flex items-center gap-3 sticky top-0 z-50 backdrop-blur-lg"
        style={{ background: 'rgba(3,3,17,0.92)' }}>
        <button onClick={() => navigate('/hub')}
          className="surface-1 border border-border text-primary px-3 py-1.5 rounded-md font-display text-[0.68rem] font-bold hover:surface-2 transition-all">
          ‹ MENU
        </button>
        <h1 className="font-display text-lg text-primary flex-1 text-center">🛒 LOJA</h1>
        <div className="font-display text-accent text-sm font-bold flex items-center gap-1">💰 {fmt(user.coins)}</div>
      </div>

      {/* Cats */}
      <div className="flex gap-2 px-3.5 pt-2.5 overflow-x-auto flex-shrink-0">
        {cats.map(c => (
          <button key={c.k} onClick={() => { SFX.click(); setCat(c.k); setSelId(null); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${cat === c.k
              ? 'bg-primary/10 border-primary text-primary'
              : 'surface-1 border-border text-muted-foreground hover:border-primary hover:text-primary'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-3 px-3.5 py-3 max-w-3xl mx-auto w-full">
        {/* Preview */}
        <div className="flex flex-row md:flex-col items-center gap-3 md:w-44 flex-shrink-0">
          <div className="w-36 h-40 md:w-40 md:h-44 surface-1 border-2 border-border rounded-lg flex items-center justify-center overflow-hidden transition-colors hover:border-primary">
            <Avatar {...previewCfg} size={118} />
          </div>
          <div className="flex flex-col gap-2 flex-1 md:w-full">
            <p className="text-xs font-bold text-muted-foreground text-center min-h-[2rem] flex items-center justify-center">
              {sel?.n || 'Selecione um item'}
            </p>
            {sel && !owned(sel.id) && (
              <button onClick={buy} disabled={user.coins < sel.p}
                className="w-full gradient-primary text-primary-foreground font-extrabold py-2.5 rounded-md glow-cyan text-sm disabled:opacity-35 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all">
                COMPRAR 💰 {sel.p}
              </button>
            )}
            {sel && owned(sel.id) && (
              <button onClick={equip}
                className="w-full surface-1 border border-border text-foreground font-bold py-2.5 rounded-md text-sm hover:border-primary transition-all">
                ✨ EQUIPAR
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-3 md:grid-cols-4 gap-2 auto-rows-min content-start pr-0.5">
          {items.map(item => {
            const isOwned = owned(item.id);
            const locked = user.lv < item.lv;
            const isSel = selId === item.id;
            return (
              <motion.div key={item.id}
                onClick={() => {
                  if (locked && !isOwned) { toast(`Nível ${item.lv} necessário! 🔒`); return; }
                  SFX.click(); setSelId(item.id);
                }}
                className={`surface-1 border-2 rounded-md p-2.5 flex flex-col items-center gap-1.5 cursor-pointer transition-all relative
                  ${isSel ? 'border-primary bg-primary/5' : isOwned ? 'border-success' : locked ? 'border-border opacity-40 cursor-not-allowed' : 'border-border hover:border-primary hover:bg-primary/5'}`}
                whileHover={!locked ? { scale: 1.05 } : undefined}
              >
                {isOwned && <span className="absolute top-1 right-1 text-[0.58rem] bg-success text-success-foreground px-1.5 rounded-md font-bold">✓</span>}
                {locked && !isOwned && <span className="absolute top-1 right-1 text-base">🔒</span>}
                <span className="text-3xl">{item.ico}</span>
                <span className="text-[0.7rem] font-bold text-center">{item.n}</span>
                <span className="font-display text-[0.65rem] text-accent">{item.p === 0 ? 'Grátis' : `💰 ${item.p}`}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
