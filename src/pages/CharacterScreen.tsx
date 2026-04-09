import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { SFX } from '@/lib/sounds';
import DrawingCanvas from '@/components/DrawingCanvas';
import { toast } from 'sonner';
import { ArrowLeft, Atom, Save, Sparkles, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CharacterScreen() {
  const { user, saveUser } = useGame();
  const navigate = useNavigate();

  const save = useCallback(() => {
    if (!user) return;
    SFX.click();
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
      style={{ background: 'linear-gradient(160deg, hsl(var(--background)) 0%, hsl(200 50% 6%) 50%, hsl(var(--background)) 100%)' }}>
      
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-border/15 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {user?.charCreated && (
            <motion.button onClick={() => navigate('/hub')} 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl hover:bg-secondary/50 text-muted-foreground transition-colors">
              <ArrowLeft size={18} />
            </motion.button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Atom size={16} className="text-primary" />
            </div>
            <div>
              <h1 className="font-display text-sm text-foreground leading-tight">Estúdio de Avatar</h1>
              <p className="text-[0.6rem] text-muted-foreground">Desenhe seu personagem único</p>
            </div>
          </div>
        </div>

        <motion.button onClick={save}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/30"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}>
          <Save size={14} />
          {user?.charCreated ? 'Salvar' : 'Concluir'}
        </motion.button>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center py-4 px-4 gap-4">
        {/* Tips */}
        {!user?.charCreated && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-xl px-4 py-2.5 max-w-[420px] w-full">
            <Lightbulb size={14} className="text-primary flex-shrink-0" />
            <p className="text-[0.65rem] text-muted-foreground leading-relaxed">
              Use o <strong className="text-foreground">pincel</strong> para desenhar, <strong className="text-foreground">formas</strong> para estrutura, e <strong className="text-foreground">balde</strong> para preencher áreas. Importe uma foto de referência!
            </p>
          </motion.div>
        )}

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', damping: 25 }}>
          <DrawingCanvas
            width={400}
            height={480}
            onSave={onCanvasSave}
            initialData={user?.avatarDrawing}
          />
        </motion.div>

        {/* Bottom save (mobile) */}
        <motion.button onClick={save}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground w-full max-w-[420px] py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-primary/25 md:hidden"
          whileHover={{ scale: 1.02 }}
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
