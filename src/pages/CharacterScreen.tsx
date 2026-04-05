import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { X, Check } from 'lucide-react';

type Step = 'gender' | 'customize';

export default function CharacterScreen() {
  const { user, saveUser } = useGame();
  const [step, setStep] = useState<Step>(user?.charCreated ? 'customize' : 'gender');
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
    toast.success('Personagem salvo!');
  };

  const selectGender = (isFemale: boolean) => {
    SFX.click();
    const base: Partial<AvatarConfig> = isFemale
      ? { bodyType: 3, hair: 5, mouth: 7, shirt: 3, pants: 3 }
      : { bodyType: 0, hair: 1, mouth: 0, shirt: 4, pants: 4 };
    setAvatar(prev => ({ ...prev, ...base }));
    setStep('customize');
  };

  const isOwned = (category: string, item: AvatarItem) => {
    if (item.free) return true;
    if (!user) return false;
    return ownsItem(user, category, item.id);
  };

  const buyItem = (category: string, item: AvatarItem) => {
    if (!user || item.free) return;
    if (user.coins < (item.price || 0)) {
      toast.error('Moedas insuficientes!');
      return;
    }
    SFX.buy();
    saveUser({
      ...user,
      coins: user.coins - (item.price || 0),
      ownedItems: [...user.ownedItems, `${category}:${item.id}`],
    });
    toast.success(`${item.n} comprado!`);
  };

  // Gender selection screen
  if (step === 'gender') {
    return (
      <motion.div
        className="fixed inset-0 z-10 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <motion.div
          className="glass-card p-8 max-w-md w-full text-center flex flex-col items-center gap-6"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="text-5xl animate-float">🧬</div>
          <h1 className="font-display text-2xl text-primary">Crie seu Personagem</h1>
          <p className="text-muted-foreground text-sm">Escolha a base do seu avatar:</p>
          <div className="grid grid-cols-2 gap-4 w-full">
            <motion.button
              onClick={() => selectGender(false)}
              className="glass-card p-6 flex flex-col items-center gap-3 border-2 border-transparent hover:border-primary/50 transition-all"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <Avatar config={{ ...avatar, bodyType: 0, hair: 1, shirt: 4, pants: 4 }} size={60} />
              <span className="font-display text-sm text-primary">Masculino</span>
            </motion.button>
            <motion.button
              onClick={() => selectGender(true)}
              className="glass-card p-6 flex flex-col items-center gap-3 border-2 border-transparent hover:border-primary/50 transition-all"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <Avatar config={{ ...avatar, bodyType: 3, hair: 5, mouth: 7, shirt: 3, pants: 3 }} size={60} />
              <span className="font-display text-sm text-primary">Feminino</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const renderItemGrid = (items: AvatarItem[], category: string, avatarKey: keyof AvatarConfig, title: string) => (
    <div className="mb-5">
      <h4 className="font-display text-xs text-muted-foreground mb-3 uppercase tracking-wider">{title}</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {items.map(item => {
          const owned = isOwned(category, item);
          const selected = avatar[avatarKey] === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                if (!owned) { buyItem(category, item); return; }
                update(avatarKey, item.id);
              }}
              className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all min-h-[85px]
                ${selected
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                  : owned
                    ? 'border-border/50 bg-card/80 hover:border-primary/30'
                    : 'border-border/30 bg-card/50 opacity-75 hover:opacity-100'
                }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {selected && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              )}
              <span className="text-2xl">{item.emoji}</span>
              {item.free ? (
                <span className="text-[0.6rem] font-bold text-emerald-600">Grátis</span>
              ) : owned ? (
                <span className="text-[0.6rem] font-bold text-emerald-600">✓ Adquirido</span>
              ) : (
                <span className="badge-price">🪙 {item.price}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const renderColorGrid = (colors: string[], avatarKey: keyof AvatarConfig, title: string) => (
    <div className="mb-5">
      <h4 className="font-display text-xs text-muted-foreground mb-3 uppercase tracking-wider">{title}</h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((col, i) => (
          <motion.button
            key={i}
            onClick={() => update(avatarKey, i)}
            className={`w-11 h-11 rounded-full border-[3px] transition-all ${
              avatar[avatarKey] === i
                ? 'border-primary scale-115 shadow-lg shadow-primary/20'
                : 'border-white/50 hover:border-primary/40'
            }`}
            style={{ background: col }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
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
      {/* Top bar */}
      <div className="flex justify-between items-center gap-3 px-4 py-3 flex-shrink-0">
        <h2 className="font-display text-sm text-primary">Personalizar Avatar</h2>
        <div className="flex items-center gap-3">
          <div className="currency-pill">
            💎 {user?.gems || 0} &nbsp; 🪙 {user?.coins || 0}
          </div>
          {user?.charCreated && (
            <button onClick={save} className="text-foreground/60 hover:text-foreground transition-colors">
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Avatar preview */}
        <div className="flex flex-col items-center gap-4 p-4 lg:w-[320px] flex-shrink-0">
          <motion.div
            className="relative bg-gradient-to-b from-secondary/30 to-secondary/10 rounded-2xl p-4"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Avatar config={avatar} size={120} />
          </motion.div>
          <motion.button
            onClick={save}
            className="btn-primary w-full max-w-[260px] text-sm flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Check size={16} /> Concluir
          </motion.button>
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
                  <span className="hidden sm:inline text-xs">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Sub-tabs for corpo */}
            <AnimatePresence>
              {tab === 'corpo' && (
                <motion.div
                  className="flex gap-2 px-4 pt-3 flex-shrink-0"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                >
                  {[
                    { k: 'formato', l: 'FORMATO' },
                    { k: 'tom', l: 'TOM DE PELE' },
                  ].map(st => (
                    <button key={st.k}
                      onClick={() => { SFX.click(); setSubTab(st.k); }}
                      className={`px-5 py-2 rounded-xl text-xs font-bold border transition-all ${
                        subTab === st.k
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-card text-foreground border-border hover:border-primary/40'
                      }`}>
                      {st.l}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Separator */}
            <div className="h-0.5 mx-4 mt-3 rounded-full bg-gradient-to-r from-transparent via-primary/20 to-transparent flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab + subTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
