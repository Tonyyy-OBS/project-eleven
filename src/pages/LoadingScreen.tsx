import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Atom } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const tips = ['Iniciando laboratório', 'Calibrando núcleo', 'Sincronizando elementos', 'Preparando desafios', 'Tudo pronto'];
  const tipIdx = Math.min(Math.floor(progress / 25), tips.length - 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onComplete, 260); return 100; }
        return p + 2.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
      <motion.div
        className="w-24 h-24 rounded-[2rem] avatar-stage flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
      >
        <Atom size={42} className="text-primary" />
      </motion.div>
      <div className="text-center">
        <h1 className="font-display text-3xl text-foreground tracking-wide">Universos Atômicos</h1>
        <p className="text-muted-foreground text-sm mt-2">{tips[tipIdx]}</p>
      </div>
      <div className="w-72 h-2.5 bg-secondary rounded-full overflow-hidden border border-border">
        <motion.div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} transition={{ duration: 0.15 }} />
      </div>
    </motion.div>
  );
}
