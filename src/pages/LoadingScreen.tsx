import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const tips = ['Iniciando o reator...', 'Calibrando elétrons...', 'Carregando elementos...', 'Preparando laboratório...', 'Pronto!'];
  const tipIdx = Math.min(Math.floor(progress / 25), tips.length - 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onComplete, 300); return 100; }
        return p + 2.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
    >
      <motion.div
        className="text-7xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >⚛️</motion.div>
      <h1 className="font-display text-3xl text-primary text-center tracking-wide">
        Universos Atômicos
      </h1>
      <div className="w-72 h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.15 }}
        />
      </div>
      <p className="text-muted-foreground text-sm font-semibold">{tips[tipIdx]}</p>
    </motion.div>
  );
}
