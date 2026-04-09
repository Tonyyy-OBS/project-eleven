import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Toolbar from './drawing/Toolbar';
import { useDrawingEngine } from './drawing/useDrawingEngine';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
  initialData?: string;
}

export default function DrawingCanvas({ width = 320, height = 400, onSave, initialData }: DrawingCanvasProps) {
  const engine = useDrawingEngine({ width, height, onSave, initialData });
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (engine.textPos && textRef.current) textRef.current.focus();
  }, [engine.textPos]);

  const cursorStyle = (): string => {
    switch (engine.tool) {
      case 'eyedropper': return 'crosshair';
      case 'fill': return 'cell';
      case 'text': return 'text';
      default: return 'crosshair';
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Canvas area */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10"
        style={{ width: '100%', maxWidth: width }}>
        <canvas
          ref={engine.canvasRef}
          width={width}
          height={height}
          className="w-full touch-none"
          style={{ aspectRatio: `${width}/${height}`, cursor: cursorStyle() }}
          onMouseDown={engine.startDraw}
          onMouseMove={engine.onMove}
          onMouseUp={engine.endDraw}
          onMouseLeave={engine.endDraw}
          onTouchStart={engine.startDraw}
          onTouchMove={engine.onMove}
          onTouchEnd={engine.endDraw}
        />
        {/* Shape preview overlay */}
        <canvas
          ref={engine.overlayRef}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ aspectRatio: `${width}/${height}` }}
        />

        {/* Text input overlay */}
        <AnimatePresence>
          {engine.textPos && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-20"
              style={{
                left: `${(engine.textPos.x / width) * 100}%`,
                top: `${(engine.textPos.y / height) * 100}%`,
              }}>
              <input
                ref={textRef}
                value={engine.textInput}
                onChange={e => engine.setTextInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') engine.commitText(engine.textInput);
                  if (e.key === 'Escape') engine.commitText('');
                }}
                onBlur={() => engine.commitText(engine.textInput)}
                placeholder="Digite aqui..."
                className="bg-background/90 border border-primary/50 rounded-lg px-2 py-1 text-sm text-foreground outline-none min-w-[120px] backdrop-blur-sm"
                style={{ color: engine.color }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Atom decoration */}
        <div className="absolute top-3 right-3 pointer-events-none opacity-20">
          <svg width="36" height="36" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="3" fill="hsl(var(--primary))" />
            <ellipse cx="20" cy="20" rx="17" ry="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.7">
              <animateTransform attributeName="transform" type="rotate" values="0 20 20;360 20 20" dur="8s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="20" cy="20" rx="17" ry="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.7">
              <animateTransform attributeName="transform" type="rotate" values="60 20 20;420 20 20" dur="6s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="20" cy="20" rx="17" ry="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.7">
              <animateTransform attributeName="transform" type="rotate" values="120 20 20;480 20 20" dur="10s" repeatCount="indefinite" />
            </ellipse>
          </svg>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        tool={engine.tool}
        setTool={engine.setTool}
        color={engine.color}
        setColor={engine.setColor}
        brushSize={engine.brushSize}
        setBrushSize={engine.setBrushSize}
        fillShape={engine.fillShape}
        setFillShape={engine.setFillShape}
        onUndo={engine.undo}
        onRedo={engine.redo}
        onClear={engine.clear}
        onImport={engine.importImage}
        onExport={engine.exportImage}
        canUndo={engine.canUndo}
        canRedo={engine.canRedo}
      />
    </div>
  );
}
