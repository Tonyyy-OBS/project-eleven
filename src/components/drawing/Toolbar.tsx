import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paintbrush, Eraser, Trash2, Undo2, Redo2,
  Minus, Square, Circle, Type,
  PaintBucket, Pipette, ImagePlus, Download,
  ChevronDown, Palette
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

  const [showColors, setShowColors] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full max-w-[420px]">
      {/* Main toolbar row */}
      <div className="flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-2xl p-1.5 border border-border/40 shadow-lg">
        {/* Tools */}
        <div className="flex items-center gap-0.5">
          {TOOLS.map(t => {
            const Icon = t.icon;
            const active = tool === t.id;
            return (
              <motion.button key={t.id} onClick={() => setTool(t.id)}
                title={t.label}
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.08 }}
                className={`relative p-2 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/40'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}>
                <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                {active && (
                  <motion.div layoutId="tool-indicator" 
                    className="absolute inset-0 rounded-xl bg-primary -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="w-px h-7 bg-border/40 mx-1" />

        {/* Undo/Redo/Clear */}
        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={onUndo} disabled={!canUndo} title="Desfazer"><Undo2 size={14} /></ToolBtn>
          <ToolBtn onClick={onRedo} disabled={!canRedo} title="Refazer"><Redo2 size={14} /></ToolBtn>
          <ToolBtn onClick={onClear} title="Limpar" danger><Trash2 size={14} /></ToolBtn>
        </div>

        <div className="w-px h-7 bg-border/40 mx-1" />

        {/* Import/Export */}
        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={onImport} title="Importar"><ImagePlus size={14} /></ToolBtn>
          <ToolBtn onClick={onExport} title="Baixar"><Download size={14} /></ToolBtn>
        </div>
      </div>

      {/* Brush size + Color row */}
      <div className="flex items-center gap-2">
        {/* Brush sizes */}
        <div className="flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-xl p-1 border border-border/40 shadow-md">
          {BRUSH_SIZES.map(size => (
            <motion.button key={size} onClick={() => setBrushSize(size)}
              whileTap={{ scale: 0.9 }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                brushSize === size 
                  ? 'bg-primary/20 ring-1 ring-primary/60' 
                  : 'hover:bg-secondary/60'
              }`}>
              <div className="rounded-full bg-foreground transition-all" 
                style={{ width: Math.max(3, Math.min(size * 0.7, 18)), height: Math.max(3, Math.min(size * 0.7, 18)) }} />
            </motion.button>
          ))}
        </div>

        {/* Fill toggle */}
        <AnimatePresence>
          {(tool === 'rect' || tool === 'circle') && (
            <motion.button onClick={() => setFillShape(!fillShape)}
              initial={{ opacity: 0, scale: 0.8, width: 0 }} 
              animate={{ opacity: 1, scale: 1, width: 'auto' }}
              exit={{ opacity: 0, scale: 0.8, width: 0 }}
              className={`px-3 py-1.5 rounded-xl text-[0.65rem] font-bold border whitespace-nowrap transition-all ${
                fillShape
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-card/80 border-border/40 text-muted-foreground'
              }`}>
              {fillShape ? 'Preenchido' : 'Contorno'}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Active color preview + toggle palette */}
        <motion.button 
          onClick={() => setShowColors(!showColors)}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-xl px-2 py-1.5 border border-border/40 shadow-md ml-auto">
          <div className="w-5 h-5 rounded-md border border-border/60 shadow-inner" style={{ background: color }} />
          <ChevronDown size={12} className={`text-muted-foreground transition-transform ${showColors ? 'rotate-180' : ''}`} />
        </motion.button>

        {/* Custom color input */}
        <div className="relative">
          <input type="color" value={color} onChange={e => { setColor(e.target.value); if (tool === 'eraser') setTool('brush'); }}
            className="w-7 h-7 rounded-lg border border-border/40 cursor-pointer bg-transparent" 
            title="Cor personalizada" />
        </div>
      </div>

      {/* Color palette (collapsible) */}
      <AnimatePresence>
        {showColors && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="grid grid-cols-12 gap-1 bg-card/80 backdrop-blur-sm rounded-xl p-2 border border-border/40 shadow-md">
              {COLORS.map(c => (
                <motion.button key={c} onClick={() => { setColor(c); if (tool === 'eraser' || tool === 'eyedropper') setTool('brush'); }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-full aspect-square rounded-md border-2 transition-all ${
                    color === c ? 'border-primary shadow-lg shadow-primary/30 scale-110' : 'border-transparent hover:border-foreground/20'
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolBtn({ children, onClick, disabled, title, danger }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; title: string; danger?: boolean;
}) {
  return (
    <motion.button onClick={onClick} disabled={disabled}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      className={`p-2 rounded-xl transition-all disabled:opacity-25 disabled:cursor-not-allowed ${
        danger 
          ? 'text-muted-foreground hover:text-destructive hover:bg-destructive/10' 
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
      }`}
      title={title}>
      {children}
    </motion.button>
  );
}
