import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AtomSpinner from '@/components/AtomSpinner';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const tips = ['Iniciando o reator...', 'Calibrando elétrons...', 'Carregando modelos atômicos...', 'Preparando laboratório...', 'Pronto!'];
  const tipIdx = Math.min(Math.floor(progress / 25), tips.length - 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onComplete, 300); return 100; }
        return p + 2;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <AtomSpinner size={160} />
      <h1 className="font-display text-3xl font-black text-primary text-glow-cyan tracking-widest text-center">
        UNIVERSO ATÔMICO
      </h1>
      <div className="w-72 h-1.5 surface-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full gradient-primary"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <p className="text-muted-foreground text-sm">{tips[tipIdx]}</p>
    </motion.div>
  );
}
