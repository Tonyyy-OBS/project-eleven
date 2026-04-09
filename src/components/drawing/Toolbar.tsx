import { motion, AnimatePresence } from 'framer-motion';
import {
  Paintbrush, Eraser, Trash2, Undo2, Redo2,
  Palette, Minus, Square, Circle, Type,
  PaintBucket, Pipette, ImagePlus, Download
} from 'lucide-react';
import type { Tool } from './types';
import { COLORS, BRUSH_SIZES } from './types';

interface ToolbarProps {
  tool: Tool;
  setTool: (t: Tool) => void;
  color: string;
  setColor: (c: string) => void;
  brushSize: number;
  setBrushSize: (s: number) => void;
  fillShape: boolean;
  setFillShape: (f: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onImport: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const TOOLS: { id: Tool; icon: typeof Paintbrush; label: string }[] = [
  { id: 'brush', icon: Paintbrush, label: 'Pincel' },
  { id: 'eraser', icon: Eraser, label: 'Borracha' },
  { id: 'line', icon: Minus, label: 'Linha' },
  { id: 'rect', icon: Square, label: 'Retângulo' },
  { id: 'circle', icon: Circle, label: 'Círculo' },
  { id: 'fill', icon: PaintBucket, label: 'Balde' },
  { id: 'text', icon: Type, label: 'Texto' },
  { id: 'eyedropper', icon: Pipette, label: 'Conta-gotas' },
];

export default function Toolbar(props: ToolbarProps) {
  const {
    tool, setTool, color, setColor, brushSize, setBrushSize,
    fillShape, setFillShape, onUndo, onRedo, onClear,
    onImport, onExport, canUndo, canRedo
  } = props;

  return (
    <div className="flex flex-col gap-2 w-full max-w-[380px]">
      {/* Row 1 — Tools */}
      <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1 border border-border/30 flex-wrap justify-center">
        {TOOLS.map(t => {
          const Icon = t.icon;
          const active = tool === t.id;
          return (
            <motion.button key={t.id} onClick={() => setTool(t.id)}
              title={t.label}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-all ${
                active
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}>
              <Icon size={15} />
            </motion.button>
          );
        })}

        <div className="w-px h-6 bg-border/40 mx-0.5" />

        <motion.button onClick={onUndo} disabled={!canUndo} whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 disabled:opacity-30 transition-all"
          title="Desfazer">
          <Undo2 size={15} />
        </motion.button>
        <motion.button onClick={onRedo} disabled={!canRedo} whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 disabled:opacity-30 transition-all"
          title="Refazer">
          <Redo2 size={15} />
        </motion.button>
        <motion.button onClick={onClear} whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-secondary/80 transition-all"
          title="Limpar">
          <Trash2 size={15} />
        </motion.button>
      </div>

      {/* Row 2 — Brush size + actions */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1.5 border border-border/30">
          {BRUSH_SIZES.map(size => (
            <button key={size} onClick={() => setBrushSize(size)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                brushSize === size ? 'bg-primary/20 border border-primary/50' : 'hover:bg-secondary/80'
              }`}>
              <div className="rounded-full bg-foreground" style={{ width: Math.min(size, 18), height: Math.min(size, 18) }} />
            </button>
          ))}
        </div>

        {/* Fill toggle for shapes */}
        {(tool === 'rect' || tool === 'circle') && (
          <motion.button onClick={() => setFillShape(!fillShape)}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              fillShape
                ? 'bg-primary/20 border-primary/50 text-foreground'
                : 'bg-secondary/50 border-border/30 text-muted-foreground'
            }`}>
            {fillShape ? 'Preenchido' : 'Contorno'}
          </motion.button>
        )}

        <div className="flex gap-1">
          <motion.button onClick={onImport} whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-secondary/50 border border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
            title="Importar imagem">
            <ImagePlus size={15} />
          </motion.button>
          <motion.button onClick={onExport} whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-secondary/50 border border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
            title="Baixar desenho">
            <Download size={15} />
          </motion.button>
        </div>
      </div>

      {/* Row 3 — Color palette (always visible, compact) */}
      <div className="flex items-center gap-2 flex-wrap justify-center bg-secondary/40 rounded-xl p-2 border border-border/30">
        {COLORS.map(c => (
          <button key={c} onClick={() => { setColor(c); if (tool === 'eraser' || tool === 'eyedropper') setTool('brush'); }}
            className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-125 ${
              color === c ? 'border-primary scale-110 shadow-lg shadow-primary/20' : 'border-transparent'
            }`}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}
