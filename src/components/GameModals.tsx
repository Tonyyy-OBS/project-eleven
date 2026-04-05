import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { ACHIEVEMENTS } from '@/lib/gameData';
import { SFX } from '@/lib/sounds';

export default function GameModals() {
  const { showLevelUp, setShowLevelUp, showAchievement, setShowAchievement } = useGame();
  const ach = showAchievement ? ACHIEVEMENTS.find(a => a.k === showAchievement) : null;

  return (
    <>
      <AnimatePresence>
        {showLevelUp !== null && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-lg"
            style={{ background: 'rgba(0,0,0,0.82)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { SFX.click(); setShowLevelUp(null); }}>
            <motion.div className="surface-1 border-2 border-accent rounded-lg p-9 max-w-[340px] w-[92%] text-center relative overflow-hidden glow-gold"
              initial={{ scale: 0.75 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
              onClick={e => e.stopPropagation()}>
              <div className="absolute inset-[-2px] rounded-lg animate-conic-spin opacity-30 -z-10"
                style={{ background: 'conic-gradient(hsl(var(--accent)), hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))' }} />
              <div className="text-5xl animate-float">⚡</div>
              <h2 className="font-display text-2xl text-accent text-glow-gold mt-1">LEVEL UP!</h2>
              <div className="font-display text-6xl font-black text-accent leading-none mt-2">{showLevelUp}</div>
              <p className="text-success font-bold text-sm mt-3">Você está no Nível {showLevelUp}!</p>
              <button onClick={() => { SFX.click(); setShowLevelUp(null); }}
                className="mt-4 gradient-primary text-primary-foreground font-extrabold py-3 px-6 rounded-md text-sm">
                INCRÍVEL! ⚡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ach && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-lg"
            style={{ background: 'rgba(0,0,0,0.82)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { SFX.click(); setShowAchievement(null); }}>
            <motion.div className="surface-1 border-2 border-secondary rounded-lg p-9 max-w-[340px] w-[92%] text-center"
              initial={{ scale: 0.75 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
              onClick={e => e.stopPropagation()}>
              <div className="text-5xl animate-spin-y">{ach.ico}</div>
              <h3 className="font-display text-base text-secondary mt-2">CONQUISTA!</h3>
              <p className="text-lg font-extrabold text-accent mt-1">{ach.n}</p>
              <p className="text-muted-foreground text-sm mt-1">{ach.d}</p>
              <button onClick={() => { SFX.click(); setShowAchievement(null); }}
                className="mt-4 surface-1 border border-border text-muted-foreground font-bold py-2.5 px-6 rounded-md text-sm hover:border-primary hover:text-foreground transition-all">
                SHOW!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
