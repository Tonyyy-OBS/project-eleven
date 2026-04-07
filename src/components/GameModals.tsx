import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { ACHIEVEMENTS } from '@/lib/gameData';
import { SFX } from '@/lib/sounds';
import { Atom, Sparkles, Trophy, Star } from 'lucide-react';

export default function GameModals() {
  const { showLevelUp, setShowLevelUp, showAchievement, setShowAchievement } = useGame();

  return (
    <>
      <AnimatePresence>
        {showLevelUp && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLevelUp(null)}>
            <motion.div className="glass-card p-8 text-center max-w-xs shadow-2xl"
              initial={{ scale: 0.7, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 18 }} onClick={e => e.stopPropagation()}>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl avatar-stage">
                <Star size={28} className="text-accent" />
              </div>
              <h2 className="font-display text-2xl text-foreground mb-2">Level Up!</h2>
              <p className="font-display text-5xl text-primary mb-4">{showLevelUp}</p>
              <button onClick={() => { SFX.click(); setShowLevelUp(null); }} className="btn-primary text-sm w-full">
                Continuar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAchievement && (() => {
          const ach = ACHIEVEMENTS.find(a => a.k === showAchievement);
          if (!ach) return null;
          return (
            <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAchievement(null)}>
              <motion.div className="glass-card p-8 text-center max-w-xs shadow-2xl"
                initial={{ scale: 0.7, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', damping: 18 }} onClick={e => e.stopPropagation()}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl avatar-stage">
                  <Trophy size={26} className="text-accent" />
                </div>
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-black text-primary font-display">{ach.ico}</div>
                <h2 className="font-display text-xl text-foreground mb-1">Conquista Liberada</h2>
                <p className="font-display text-lg text-primary mb-1">{ach.n}</p>
                <p className="text-muted-foreground text-sm mb-4">{ach.d}</p>
                <button onClick={() => { SFX.click(); setShowAchievement(null); }} className="btn-primary text-sm w-full inline-flex items-center justify-center gap-2">
                  <Sparkles size={14} /> Fechar
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
