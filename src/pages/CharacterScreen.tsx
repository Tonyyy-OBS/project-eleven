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
import { Check, Lock, Coins, Sparkles, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Step = 'gender' | 'customize';

export default function CharacterScreen() {
  const { user, saveUser } = useGame();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(user?.charCreated ? 'customize' : 'gender');
  const [tabIdx, setTabIdx] = useState(0);
  const tab = AVATAR_TABS[tabIdx]?.key || 'corpo';
  const [subTab, setSubTab] = useState<string>('formato');
  const [avatar, setAvatar] = useState<AvatarConfig>(user?.avatar || {
    skinTone: 0, bodyType: 0, hair: 1, hairColor: 0,
    eyes: 0, nose: 0, mouth: 0, shirt: 0,
    pants: 1, shoes: 0, accessory: 0,
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
    if (user.charCreated) navigate('/hub');
  };

  const selectGender = (isFemale: boolean) => {
    SFX.click();
    const base: Partial<AvatarConfig> = isFemale
      ? { gender: 'female', bodyType: 3, hair: 5, hairColor: 0, mouth: 7, shirt: 5, pants: 3 }
      : { gender: 'male', bodyType: 0, hair: 1, hairColor: 0, mouth: 0, shirt: 0, pants: 1 };
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
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(180 40% 8%) 100%)' }}>
        <motion.div className="glass-card p-8 max-w-md w-full text-center flex flex-col items-center gap-8"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 20 }}>
          <motion.div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <User size={32} className="text-primary" />
          </motion.div>
          <div>
            <h1 className="font-display text-2xl text-foreground mb-2">Crie seu Personagem</h1>
            <p className="text-muted-foreground text-sm">Escolha a base do seu avatar para começar</p>
          </div>
          <div className="grid grid-cols-2 gap-6 w-full">
            {[
              { fem: false, label: 'Masculino', cfg: { gender: 'male' as const, bodyType: 0, hair: 1, mouth: 0, shirt: 0, pants: 1, shoes: 0 } },
              { fem: true, label: 'Feminino', cfg: { gender: 'female' as const, bodyType: 3, hair: 5, mouth: 7, shirt: 5, pants: 3, shoes: 0 } },
            ].map(opt => (
              <motion.button key={opt.label} onClick={() => selectGender(opt.fem)}
                className="glass-card p-6 flex flex-col items-center gap-4 border-2 border-transparent hover:border-primary/50 transition-all rounded-2xl cursor-pointer"
                whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}>
                <div className="rounded-xl p-2" style={{ background: 'linear-gradient(180deg, hsl(180 30% 15%) 0%, hsl(180 20% 10%) 100%)' }}>
                  <Avatar config={{ ...avatar, ...opt.cfg }} size={100} showShadow={false} />
                </div>
                <span className="font-display text-base text-primary">{opt.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const renderItemGrid = (items: AvatarItem[], category: string, avatarKey: keyof AvatarConfig) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {items.map(item => {
        const owned = isOwned(category, item);
        const selected = avatar[avatarKey] === item.id;
        return (
          <motion.button key={item.id}
            onClick={() => {
              if (!owned) { buyItem(category, item); return; }
              update(avatarKey, item.id);
            }}
            className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all min-h-[80px]
              ${selected ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : owned ? 'border-border/40 bg-card/60 hover:border-primary/30 hover:bg-card/80'
                  : 'border-border/20 bg-card/30 opacity-60 hover:opacity-100'}`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {selected && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check size={11} className="text-primary-foreground" strokeWidth={3} />
              </div>
            )}
            {!owned && (
              <div className="absolute top-1.5 left-1.5">
                <Lock size={11} className="text-muted-foreground" />
              </div>
            )}
            <span className="text-xs font-bold text-center leading-tight text-foreground">{item.n}</span>
            {item.free ? (
              <span className="text-[0.6rem] font-bold text-emerald-400">Grátis</span>
            ) : owned ? (
              <span className="text-[0.6rem] font-bold text-emerald-400">Adquirido</span>
            ) : (
              <span className="flex items-center gap-0.5 text-[0.6rem] font-bold text-accent">
                <Coins size={10} /> {item.price}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );

  const renderColorGrid = (colors: string[], avatarKey: keyof AvatarConfig, title: string) => (
    <div className="mb-4">
      <h4 className="font-display text-xs text-muted-foreground mb-3 uppercase tracking-widest">{title}</h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((col, i) => (
          <motion.button key={i} onClick={() => update(avatarKey, i)}
            className={`w-11 h-11 rounded-full border-[3px] transition-all ${
              avatar[avatarKey] === i ? 'border-primary scale-110 shadow-lg shadow-primary/30' : 'border-border/40 hover:border-primary/40'
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
          <div className="mt-5">{renderColorGrid(HAIR_COLORS, 'hairColor', 'Cor do cabelo')}</div>
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
    <div className="fixed inset-0 z-10 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(180 40% 8%) 100%)' }}>
      {/* Top bar */}
      <div className="flex justify-between items-center gap-3 px-4 py-3 flex-shrink-0 border-b border-border/20">
        <div className="flex items-center gap-3">
          {user?.charCreated && (
            <button onClick={() => navigate('/hub')} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
              <ArrowLeft size={18} />
            </button>
          )}
          <h2 className="font-display text-base text-foreground">Personalizar Avatar</h2>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary/60 border border-border/40 rounded-full px-3 py-1.5">
          <Coins size={14} className="text-accent" />
          <span className="font-display text-sm text-accent">{user?.coins || 0}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Avatar preview panel */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 lg:w-[320px] flex-shrink-0">
          <motion.div
            className="relative rounded-2xl p-4"
            style={{ background: 'linear-gradient(180deg, hsl(180 25% 16%) 0%, hsl(190 30% 10%) 100%)' }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <Avatar config={avatar} size={140} />
          </motion.div>
          <motion.button onClick={save}
            className="btn-primary w-full max-w-[260px] text-sm flex items-center justify-center gap-2 py-3"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Sparkles size={16} />
            {user?.charCreated ? 'Salvar Alterações' : 'Concluir'}
          </motion.button>
        </div>

        {/* Customization panel */}
        <div className="flex-1 flex flex-col overflow-hidden mx-3 lg:mr-4 mb-3">
          <div className="glass-card flex-1 flex flex-col overflow-hidden rounded-2xl">
            {/* Category tabs - scrollable */}
            <div className="flex items-center px-1 py-2 border-b border-border/15 flex-shrink-0 overflow-x-auto scrollbar-hide">
              {AVATAR_TABS.map((t, i) => (
                <button key={t.key}
                  onClick={() => { SFX.click(); setTabIdx(i); setSubTab('formato'); }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all mx-0.5 ${
                    tabIdx === i
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Sub-tabs for corpo */}
            <AnimatePresence>
              {tab === 'corpo' && (
                <motion.div className="flex gap-2 px-3 pt-3 flex-shrink-0"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  {[{ k: 'formato', l: 'Tipo de corpo' }, { k: 'tom', l: 'Tom de pele' }].map(st => (
                    <button key={st.k} onClick={() => { SFX.click(); setSubTab(st.k); }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
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

            {/* Content area - scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                <motion.div key={tab + subTab}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
