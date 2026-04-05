import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { ACHIEVEMENTS } from '@/lib/gameData';
import { SFX } from '@/lib/sounds';

export default function GameModals() {
  const { showLevelUp, setShowLevelUp, showAchievement, setShowAchievement } = useGame();

  return (
    <>
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLevelUp(null)}
          >
            <motion.div
              className="glass-card p-8 text-center max-w-xs shadow-xl"
              initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              transition={{ type: 'spring', damping: 15 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-6xl mb-3 animate-float">🎉</div>
              <h2 className="font-display text-2xl text-primary mb-2">LEVEL UP!</h2>
              <p className="font-display text-4xl text-accent mb-4">{showLevelUp}</p>
              <button onClick={() => { SFX.click(); setShowLevelUp(null); }}
                className="btn-primary text-sm w-full">
                INCRÍVEL! ⚡
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
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAchievement(null)}
            >
              <motion.div
                className="glass-card p-8 text-center max-w-xs shadow-xl"
                initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                transition={{ type: 'spring', damping: 15 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="text-6xl mb-3">{ach.ico}</div>
                <h2 className="font-display text-xl text-accent mb-1">CONQUISTA!</h2>
                <p className="font-display text-lg text-primary mb-1">{ach.n}</p>
                <p className="text-muted-foreground text-sm mb-4">{ach.d}</p>
                <button onClick={() => { SFX.click(); setShowAchievement(null); }}
                  className="btn-primary text-sm w-full">
                  DEMAIS! 🏅
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
