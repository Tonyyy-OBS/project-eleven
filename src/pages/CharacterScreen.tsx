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
import { Check, ChevronLeft, ChevronRight, Lock, Coins, Sparkles, User } from 'lucide-react';

type Step = 'gender' | 'customize';

export default function CharacterScreen() {
  const { user, saveUser } = useGame();
  const [step, setStep] = useState<Step>(user?.charCreated ? 'customize' : 'gender');
  const [tabIdx, setTabIdx] = useState(0);
  const tab = AVATAR_TABS[tabIdx]?.key || 'corpo';
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
      ? { gender: 'female', bodyType: 3, hair: 5, mouth: 7, shirt: 5, pants: 3 }
      : { gender: 'male', bodyType: 0, hair: 1, mouth: 0, shirt: 0, pants: 4 };
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
    toast.success(`${item.n} desbloqueado!`);
  };

  // Gender selection
  if (step === 'gender') {
    return (
      <motion.div className="fixed inset-0 z-10 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div className="glass-card p-8 max-w-sm w-full text-center flex flex-col items-center gap-6"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', damping: 20 }}>
          <motion.div className="w-16 h-16 rounded-2xl avatar-stage flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <User size={28} className="text-primary" />
          </motion.div>
          <h1 className="font-display text-2xl text-foreground">Crie seu Personagem</h1>
          <p className="text-muted-foreground text-sm">Escolha a base do seu avatar</p>
          <div className="grid grid-cols-2 gap-4 w-full">
            {[
              { fem: false, label: 'Masculino', cfg: { bodyType: 0, hair: 1, shirt: 0, pants: 4 } },
              { fem: true, label: 'Feminino', cfg: { bodyType: 3, hair: 5, mouth: 7, shirt: 5, pants: 3 } },
            ].map(opt => (
              <motion.button key={opt.label} onClick={() => selectGender(opt.fem)}
                className="glass-card p-5 flex flex-col items-center gap-3 border-2 border-transparent hover:border-primary/50 transition-all rounded-2xl"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <div className="bg-secondary/30 rounded-xl p-3">
                  <Avatar config={{ ...avatar, ...opt.cfg }} size={70} />
                </div>
                <span className="font-display text-sm text-primary">{opt.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const renderItemGrid = (items: AvatarItem[], category: string, avatarKey: keyof AvatarConfig) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {items.map(item => {
        const owned = isOwned(category, item);
        const selected = avatar[avatarKey] === item.id;
        return (
          <motion.button key={item.id}
            onClick={() => {
              if (!owned) { buyItem(category, item); return; }
              update(avatarKey, item.id);
            }}
            className={`relative flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border-2 transition-all min-h-[72px]
              ${selected ? 'border-primary bg-primary/8 shadow-md shadow-primary/15'
                : owned ? 'border-border/40 bg-card/60 hover:border-primary/30'
                  : 'border-border/20 bg-card/30 opacity-70 hover:opacity-100'}`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {selected && (
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <Check size={10} className="text-primary-foreground" />
              </div>
            )}
            {!owned && (
              <div className="absolute top-1 left-1">
                <Lock size={10} className="text-muted-foreground" />
              </div>
            )}
            <span className="text-xs font-bold text-center leading-tight">{item.n}</span>
            {item.free ? (
              <span className="text-[0.58rem] font-bold text-emerald-500">Grátis</span>
            ) : owned ? (
              <span className="text-[0.58rem] font-bold text-emerald-500">Adquirido</span>
            ) : (
              <span className="flex items-center gap-0.5 text-[0.58rem] font-bold text-accent">
                <Coins size={9} /> {item.price}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );

  const renderColorGrid = (colors: string[], avatarKey: keyof AvatarConfig, title: string) => (
    <div className="mb-4">
      <h4 className="font-display text-[0.65rem] text-muted-foreground mb-2.5 uppercase tracking-widest">{title}</h4>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((col, i) => (
          <motion.button key={i} onClick={() => update(avatarKey, i)}
            className={`w-10 h-10 rounded-full border-[3px] transition-all ${
              avatar[avatarKey] === i ? 'border-primary scale-110 shadow-lg shadow-primary/25' : 'border-border/50 hover:border-primary/40'
            }`}
            style={{ background: col }}
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (tab) {
      case 'corpo':
        return <>
          {subTab === 'formato' && renderItemGrid(BODY_TYPES.map(b => ({ ...b, price: 0, gems: 0 })), 'body', 'bodyType')}
          {subTab === 'tom' && renderColorGrid(SKIN_TONES, 'skinTone', 'Tom de pele')}
        </>;
      case 'cabelo':
        return <>
          {renderItemGrid(HAIR_STYLES, 'hair', 'hair')}
          <div className="mt-4">{renderColorGrid(HAIR_COLORS, 'hairColor', 'Cor do cabelo')}</div>
        </>;
      case 'olhos': return renderItemGrid(EYE_TYPES, 'eyes', 'eyes');
      case 'nariz': return renderItemGrid(NOSE_TYPES, 'nose', 'nose');
      case 'boca': return renderItemGrid(MOUTH_TYPES, 'mouth', 'mouth');
      case 'roupa': return renderItemGrid(SHIRT_TYPES, 'shirt', 'shirt');
      case 'calca': return renderItemGrid(PANTS_TYPES, 'pants', 'pants');
      case 'calcado': return renderItemGrid(SHOE_TYPES, 'shoes', 'shoes');
      case 'acessorios': return renderItemGrid(ACCESSORY_TYPES, 'accessory', 'accessory');
      default: return null;
    }
  };

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Header */}
      <div className="flex justify-between items-center gap-3 px-4 py-3 flex-shrink-0">
        <h2 className="font-display text-sm text-foreground">Personalizar</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-secondary/60 border border-border/50 rounded-full px-3 py-1">
            <Coins size={13} className="text-accent" />
            <span className="font-display text-xs text-accent">{user?.coins || 0}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Avatar preview */}
        <div className="flex flex-col items-center gap-3 p-3 lg:w-[280px] flex-shrink-0">
          <motion.div className="relative rounded-2xl p-4 avatar-stage"
            animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
            <Avatar config={avatar} size={110} />
          </motion.div>
          <motion.button onClick={save}
            className="btn-primary w-full max-w-[240px] text-sm flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Sparkles size={14} /> Concluir
          </motion.button>
        </div>

        {/* Customization panel */}
        <div className="flex-1 flex flex-col overflow-hidden mx-2 lg:mr-3 mb-2">
          <div className="glass-card flex-1 flex flex-col overflow-hidden">
            {/* Category nav with arrows */}
            <div className="flex items-center gap-1 px-2 py-2 border-b border-border/20 flex-shrink-0">
              <button onClick={() => setTabIdx(i => Math.max(0, i - 1))}
                className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1 flex-1 overflow-x-auto scrollbar-hide">
                {AVATAR_TABS.map((t, i) => (
                  <button key={t.key}
                    onClick={() => { SFX.click(); setTabIdx(i); setSubTab('formato'); }}
                    className={`px-3 py-1.5 rounded-lg text-[0.7rem] font-bold whitespace-nowrap transition-all ${
                      tabIdx === i
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setTabIdx(i => Math.min(AVATAR_TABS.length - 1, i + 1))}
                className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Sub-tabs for corpo */}
            <AnimatePresence>
              {tab === 'corpo' && (
                <motion.div className="flex gap-2 px-3 pt-2 flex-shrink-0"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  {[{ k: 'formato', l: 'Formato' }, { k: 'tom', l: 'Tom de pele' }].map(st => (
                    <button key={st.k} onClick={() => { SFX.click(); setSubTab(st.k); }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        subTab === st.k
                          ? 'bg-primary/15 text-primary border-primary/40'
                          : 'bg-card/50 text-muted-foreground border-border/30 hover:border-primary/30'
                      }`}>
                      {st.l}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Separator */}
            <div className="h-px mx-3 mt-2 bg-border/20 flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3">
              <AnimatePresence mode="wait">
                <motion.div key={tab + subTab}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
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
