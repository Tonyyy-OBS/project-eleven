import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { SFX } from '@/lib/sounds';
import DrawingCanvas from '@/components/DrawingCanvas';
import { toast } from 'sonner';
import { Sparkles, ArrowLeft, Atom, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CharacterScreen() {
  const { user, saveUser } = useGame();
  const navigate = useNavigate();
  const [drawingData, setDrawingData] = useState<string>(user?.avatarDrawing || '');
  const canvasRef = useRef<any>(null);

  const save = useCallback(() => {
    if (!user) return;
    SFX.click();
    // Trigger save from canvas
    const saveFn = (window as any).__drawingCanvasSave;
    if (saveFn) saveFn();
  }, [user]);

  const onCanvasSave = useCallback((dataUrl: string) => {
    if (!user) return;
    saveUser({ ...user, avatarDrawing: dataUrl, charCreated: true });
    toast.success('Personagem salvo com sucesso!');
    if (user.charCreated) navigate('/hub');
  }, [user, saveUser, navigate]);

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
          <div className="flex items-center gap-2">
            <Atom size={18} className="text-primary" />
            <h2 className="font-display text-base text-foreground">Crie seu Personagem</h2>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 gap-6">
        {/* Atom decoration + Title */}
        <motion.div className="flex items-center gap-4"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="4" fill="hsl(var(--primary))" />
              <ellipse cx="24" cy="24" rx="20" ry="8" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" values="0 24 24;360 24 24" dur="4s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="24" cy="24" rx="20" ry="8" fill="none" stroke="hsl(var(--accent))" strokeWidth="1" opacity="0.4">
                <animateTransform attributeName="transform" type="rotate" values="60 24 24;420 24 24" dur="6s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="24" cy="24" rx="20" ry="8" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.3">
                <animateTransform attributeName="transform" type="rotate" values="120 24 24;480 24 24" dur="8s" repeatCount="indefinite" />
              </ellipse>
            </svg>
          </motion.div>
          <div>
            <h1 className="font-display text-xl text-foreground">Desenhe seu Avatar</h1>
            <p className="text-xs text-muted-foreground">Use as ferramentas para criar seu personagem único!</p>
          </div>
        </motion.div>

        {/* Canvas area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', damping: 20 }}>
          <DrawingCanvas
            width={320}
            height={400}
            onSave={onCanvasSave}
            initialData={user?.avatarDrawing}
          />
        </motion.div>

        {/* Save button */}
        <motion.button onClick={save}
          className="btn-primary text-sm flex items-center justify-center gap-2 py-3 px-8 rounded-xl"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          <Save size={16} />
          {user?.charCreated ? 'Salvar Alterações' : 'Concluir e Jogar!'}
          <Sparkles size={14} />
        </motion.button>
      </div>
    </div>
  );
}
