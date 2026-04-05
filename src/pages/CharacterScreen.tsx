import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import {
  AVATAR_TABS, AvatarCategory, SKIN_TONES, BODY_TYPES, HAIR_STYLES, HAIR_COLORS,
  EYE_TYPES, NOSE_TYPES, MOUTH_TYPES, SHIRT_TYPES, PANTS_TYPES, SHOE_TYPES, ACCESSORY_TYPES,
  AvatarItem,
} from '@/lib/gameData';
import { AvatarConfig, ownsItem } from '@/lib/gameStore';
import { SFX } from '@/lib/sounds';
import Avatar from '@/components/Avatar';
import { toast } from 'sonner';
import { X } from 'lucide-react';

export default function CharacterScreen() {
  const { user, saveUser } = useGame();
  const [tab, setTab] = useState<AvatarCategory>('corpo');
  const [subTab, setSubTab] = useState<string>('formato');
  const [avatar, setAvatar] = useState<AvatarConfig>(user?.avatar || {
    skinTone: 0, bodyType: 0, hair: 0, hairColor: 0,
    eyes: 0, nose: 0, mouth: 0, shirt: 0,
    pants: 4, shoes: 0, accessory: 0,
  });

  const update = (key: keyof AvatarConfig, val: number) => {
    SFX.click();
    setAvatar(prev => ({ ...prev, [key]: val }));
  };

  const save = () => {
    if (!user) return;
    SFX.click();
    saveUser({ ...user, avatar, charCreated: true });
    toast('✨ Personagem salvo!');
  };

  const isOwned = (category: string, item: AvatarItem) => {
    if (item.free) return true;
    if (!user) return false;
    return ownsItem(user, category, item.id);
  };

  const buyItem = (category: string, item: AvatarItem) => {
    if (!user || item.free) return;
    if (user.coins < (item.price || 0)) {
      toast('💸 Moedas insuficientes!');
      return;
    }
    SFX.buy();
    saveUser({
      ...user,
      coins: user.coins - (item.price || 0),
      ownedItems: [...user.ownedItems, `${category}:${item.id}`],
    });
    toast(`✅ ${item.n} comprado!`);
  };

  const renderItemGrid = (items: AvatarItem[], category: string, avatarKey: keyof AvatarConfig, title: string) => (
    <div className="mb-4">
      <h4 className="font-display text-sm text-foreground/70 mb-3 italic">{title}</h4>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {items.map(item => {
          const owned = isOwned(category, item);
          const selected = avatar[avatarKey] === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                if (!owned) {
                  buyItem(category, item);
                  return;
                }
                update(avatarKey, item.id);
              }}
              className={`item-card ${selected ? 'item-card-selected' : ''} ${!owned ? 'opacity-70' : ''}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="text-2xl">{item.emoji}</span>
              {item.free ? (
                <span className="badge-free">Grátis</span>
              ) : owned ? (
                <span className="badge-free">✅ Adquirido</span>
              ) : (
                <span className="badge-price">
                  🪙 {item.price} 💎 {item.gems}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const renderColorGrid = (colors: string[], avatarKey: keyof AvatarConfig, title: string) => (
    <div className="mb-4">
      <h4 className="font-display text-sm text-foreground/70 mb-3 italic">{title}</h4>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((col, i) => (
          <button key={i} onClick={() => update(avatarKey, i)}
            className={`w-10 h-10 rounded-full border-[3px] transition-all hover:scale-110 ${avatar[avatarKey] === i ? 'border-primary scale-110 shadow-lg' : 'border-border/40'}`}
            style={{ background: col }}
          />
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (tab) {
      case 'corpo':
        return (
          <>
            {subTab === 'formato' && renderItemGrid(
              BODY_TYPES.map(b => ({ ...b, emoji: b.id <= 3 ? '🧍' : '♿', price: 0, gems: 0 })),
              'body', 'bodyType', 'Formato do corpo'
            )}
            {subTab === 'tom' && renderColorGrid(SKIN_TONES, 'skinTone', 'Tom de pele')}
          </>
        );
      case 'cabelo':
        return (
          <>
            {renderItemGrid(HAIR_STYLES, 'hair', 'hair', 'Tipos de cabelo')}
            {renderColorGrid(HAIR_COLORS, 'hairColor', 'Cores de cabelo')}
          </>
        );
      case 'olhos': return renderItemGrid(EYE_TYPES, 'eyes', 'eyes', 'Tipos de olhos');
      case 'nariz': return renderItemGrid(NOSE_TYPES, 'nose', 'nose', 'Tipos de nariz');
      case 'boca': return renderItemGrid(MOUTH_TYPES, 'mouth', 'mouth', 'Tipos de boca');
      case 'roupa': return renderItemGrid(SHIRT_TYPES, 'shirt', 'shirt', 'Camisetas & Roupas');
      case 'calca': return renderItemGrid(PANTS_TYPES, 'pants', 'pants', 'Bermudas & Calças');
      case 'calcado': return renderItemGrid(SHOE_TYPES, 'shoes', 'shoes', 'Calçados');
      case 'acessorios': return renderItemGrid(ACCESSORY_TYPES, 'accessory', 'accessory', 'Acessórios');
      default: return null;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Top bar with currency */}
      <div className="flex justify-end items-center gap-3 p-3">
        <div className="currency-pill">
          💎 {user?.gems || 0} &nbsp; 🪙 {user?.coins || 0} &nbsp; ⭐ 200
        </div>
        {user?.charCreated && (
          <button onClick={save} className="text-foreground/60 hover:text-foreground transition-colors">
            <X size={28} />
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Avatar preview */}
        <div className="flex flex-col items-center gap-3 p-4 lg:w-[360px] flex-shrink-0">
          <motion.div
            className="relative"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Avatar config={avatar} size={160} />
          </motion.div>
          <button onClick={save}
            className="btn-primary w-full max-w-[280px] text-sm">
            Concluir
          </button>
        </div>

        {/* Right: Customization panel */}
        <div className="flex-1 flex flex-col overflow-hidden mx-2 lg:mr-4 mb-2">
          <div className="glass-card flex-1 flex flex-col overflow-hidden">
            {/* Category tabs */}
            <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-hide border-b border-border/30 flex-shrink-0">
              {AVATAR_TABS.map(t => (
                <button key={t.key}
                  onClick={() => { SFX.click(); setTab(t.key); setSubTab('formato'); }}
                  className={`tab-btn ${tab === t.key ? 'tab-active' : 'tab-inactive'}`}>
                  <span>{t.emoji}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Sub-tabs for corpo */}
            {tab === 'corpo' && (
              <div className="flex gap-2 px-4 pt-3 flex-shrink-0">
                {[
                  { k: 'formato', l: 'FORMATO' },
                  { k: 'tom', l: 'TOM DE PELE' },
                ].map(st => (
                  <button key={st.k}
                    onClick={() => { SFX.click(); setSubTab(st.k); }}
                    className={`px-5 py-2 rounded-xl text-xs font-bold border transition-all ${subTab === st.k ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:border-primary/40'}`}>
                    {st.l}
                  </button>
                ))}
              </div>
            )}

            {/* Separator line */}
            <div className="h-1 mx-4 mt-2 rounded-full bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
