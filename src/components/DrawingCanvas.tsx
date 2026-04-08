import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Paintbrush, Eraser, Trash2, Undo2, Download, Palette } from 'lucide-react';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
  initialData?: string;
}

const COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#e94560', '#f39c12', '#2ecc71', '#3498db',
  '#9b59b6', '#1abc9c', '#e74c3c', '#f1c40f',
  '#ecf0f1', '#ffffff', '#95a5a6', '#34495e',
  '#d35400', '#c0392b', '#7f8c8d', '#2c3e50',
  '#F6D9BE', '#E7BD97', '#CF9D78', '#AF7D5C',
  '#8D6248', '#694431', '#41261A', '#23180E',
];

const BRUSH_SIZES = [2, 4, 8, 14, 22, 32];

export default function DrawingCanvas({ width = 320, height = 400, onSave, initialData }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ecf0f1');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [showPalette, setShowPalette] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        saveState();
      };
      img.src = initialData;
    } else {
      // Draw guide silhouette
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);
      drawGuide(ctx);
      saveState();
    }
  }, []);

  const drawGuide = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(100,200,255,0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    const cx = width / 2;
    // Head circle
    ctx.beginPath();
    ctx.arc(cx, 90, 35, 0, Math.PI * 2);
    ctx.stroke();
    // Body
    ctx.beginPath();
    ctx.moveTo(cx, 125);
    ctx.lineTo(cx, 250);
    ctx.stroke();
    // Arms
    ctx.beginPath();
    ctx.moveTo(cx - 50, 170);
    ctx.lineTo(cx + 50, 170);
    ctx.stroke();
    // Legs
    ctx.beginPath();
    ctx.moveTo(cx, 250);
    ctx.lineTo(cx - 35, 340);
    ctx.moveTo(cx, 250);
    ctx.lineTo(cx + 35, 340);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Label
    ctx.fillStyle = 'rgba(100,200,255,0.25)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Desenhe seu personagem!', cx, height - 15);
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, width, height);
    setHistory(prev => [...prev.slice(-20), data]);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;
    draw(pos);
  };

  const draw = (pos: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }
    ctx.lineWidth = brushSize;

    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    lastPos.current = pos;
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    draw(getPos(e));
  };

  const endDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPos.current = null;
      saveState();
    }
  };

  const undo = () => {
    if (history.length < 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const newHistory = [...history];
    newHistory.pop();
    const prev = newHistory[newHistory.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory(newHistory);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    drawGuide(ctx);
    saveState();
  };

  const getDataUrl = useCallback(() => {
    return canvasRef.current?.toDataURL('image/png') || '';
  }, []);

  // Expose save
  useEffect(() => {
    if (onSave) {
      (window as any).__drawingCanvasSave = () => onSave(getDataUrl());
    }
    return () => { delete (window as any).__drawingCanvasSave; };
  }, [onSave, getDataUrl]);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10"
        style={{ width: '100%', maxWidth: width }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full cursor-crosshair touch-none"
          style={{ aspectRatio: `${width}/${height}` }}
          onMouseDown={startDraw}
          onMouseMove={onMove}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={onMove}
          onTouchEnd={endDraw}
        />
        
        {/* Atom decoration in corner */}
        <div className="absolute top-3 right-3 pointer-events-none opacity-30">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="4" fill="hsl(var(--primary))" />
            <ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8">
              <animateTransform attributeName="transform" type="rotate" values="0 20 20;360 20 20" dur="8s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8">
              <animateTransform attributeName="transform" type="rotate" values="60 20 20;420 20 20" dur="6s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8">
              <animateTransform attributeName="transform" type="rotate" values="120 20 20;480 20 20" dur="10s" repeatCount="indefinite" />
            </ellipse>
          </svg>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Tool buttons */}
        <div className="flex gap-1 bg-secondary/40 rounded-xl p-1 border border-border/30">
          <button onClick={() => setTool('brush')}
            className={`p-2 rounded-lg transition-all ${tool === 'brush' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}>
            <Paintbrush size={16} />
          </button>
          <button onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-all ${tool === 'eraser' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}>
            <Eraser size={16} />
          </button>
          <button onClick={undo} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
            <Undo2 size={16} />
          </button>
          <button onClick={clear} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-secondary/60 transition-all">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Brush sizes */}
        <div className="flex items-center gap-1.5 bg-secondary/40 rounded-xl p-1.5 border border-border/30">
          {BRUSH_SIZES.map(size => (
            <button key={size} onClick={() => setBrushSize(size)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                brushSize === size ? 'bg-primary/20 border border-primary/50' : 'hover:bg-secondary/60'}`}>
              <div className="rounded-full bg-foreground" style={{ width: Math.min(size, 20), height: Math.min(size, 20) }} />
            </button>
          ))}
        </div>

        {/* Color picker toggle */}
        <button onClick={() => setShowPalette(!showPalette)}
          className="p-2 rounded-xl border border-border/30 bg-secondary/40 hover:bg-secondary/60 transition-all flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full border-2 border-border/50" style={{ background: color }} />
          <Palette size={14} className="text-muted-foreground" />
        </button>
      </div>

      {/* Color palette */}
      {showPalette && (
        <motion.div className="grid grid-cols-7 gap-1.5 p-3 bg-secondary/40 rounded-xl border border-border/30"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          {COLORS.map(c => (
            <button key={c} onClick={() => { setColor(c); setTool('brush'); }}
              className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                color === c ? 'border-primary scale-110 shadow-lg' : 'border-transparent'}`}
              style={{ background: c }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
