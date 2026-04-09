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

export default function DrawingCanvas({ width = 400, height = 480, onSave, initialData }: DrawingCanvasProps) {
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
      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-border/30"
        style={{ width: '100%', maxWidth: width }}>
        
        {/* Canvas background glow */}
        <div className="absolute -inset-1 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 rounded-2xl -z-10 blur-sm" />
        
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
                className="bg-card/95 border border-primary/50 rounded-lg px-3 py-1.5 text-sm text-foreground outline-none min-w-[140px] backdrop-blur-sm shadow-lg"
                style={{ color: engine.color }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner label */}
        <div className="absolute bottom-2 right-2 pointer-events-none">
          <span className="text-[0.55rem] text-foreground/15 font-display tracking-wider">UNIVERSOS ATÔMICOS</span>
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
