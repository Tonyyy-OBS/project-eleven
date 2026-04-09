import { useRef, useState, useCallback, useEffect } from 'react';
import type { Tool, DrawAction } from './types';

interface UseDrawingEngineProps {
  width: number;
  height: number;
  onSave?: (dataUrl: string) => void;
  initialData?: string;
}

export function useDrawingEngine({ width, height, onSave, initialData }: UseDrawingEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ecf0f1');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<Tool>('brush');
  const [fillShape, setFillShape] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textInput, setTextInput] = useState('');
  const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, width, height);
    setHistory(prev => {
      const truncated = prev.slice(0, historyIndex + 1);
      const next = [...truncated, data].slice(-30);
      return next;
    });
    setHistoryIndex(prev => {
      const truncated = history.slice(0, prev + 1);
      return Math.min(truncated.length, 29);
    });
  }, [width, height, historyIndex, history]);

  // Init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, width, height);
        setHistory([data]);
        setHistoryIndex(0);
      };
      img.src = initialData;
    } else {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);
      drawGuide(ctx, width, height);
      const data = ctx.getImageData(0, 0, width, height);
      setHistory([data]);
      setHistoryIndex(0);
    }
  }, []);

  // Expose save fn
  useEffect(() => {
    if (onSave) {
      (window as any).__drawingCanvasSave = () => {
        onSave(canvasRef.current?.toDataURL('image/png') || '');
      };
    }
    return () => { delete (window as any).__drawingCanvasSave; };
  }, [onSave]);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
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
  }, [width, height]);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e);

    if (tool === 'eyedropper') {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
      const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, '0')).join('');
      setColor(hex);
      setTool('brush');
      return;
    }

    if (tool === 'fill') {
      floodFill(pos.x, pos.y, color);
      return;
    }

    if (tool === 'text') {
      setTextPos(pos);
      return;
    }

    setIsDrawing(true);
    lastPos.current = pos;
    startPos.current = pos;

    if (tool === 'brush' || tool === 'eraser') {
      drawDot(pos);
    }
  }, [tool, color, getPos]);

  const drawDot = useCallback((pos: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [tool, color, brushSize]);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);

    if (tool === 'brush' || tool === 'eraser') {
      const ctx = canvasRef.current?.getContext('2d');
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
      }
      lastPos.current = pos;
    } else if (tool === 'line' || tool === 'rect' || tool === 'circle') {
      // Draw preview on overlay
      const overlay = overlayRef.current;
      if (!overlay || !startPos.current) return;
      const octx = overlay.getContext('2d');
      if (!octx) return;
      octx.clearRect(0, 0, width, height);
      octx.strokeStyle = color;
      octx.fillStyle = color;
      octx.lineWidth = brushSize;
      octx.lineCap = 'round';

      const sx = startPos.current.x, sy = startPos.current.y;

      if (tool === 'line') {
        octx.beginPath();
        octx.moveTo(sx, sy);
        octx.lineTo(pos.x, pos.y);
        octx.stroke();
      } else if (tool === 'rect') {
        const w = pos.x - sx, h = pos.y - sy;
        if (fillShape) {
          octx.fillRect(sx, sy, w, h);
        } else {
          octx.strokeRect(sx, sy, w, h);
        }
      } else if (tool === 'circle') {
        const rx = Math.abs(pos.x - sx) / 2;
        const ry = Math.abs(pos.y - sy) / 2;
        const cx = sx + (pos.x - sx) / 2;
        const cy = sy + (pos.y - sy) / 2;
        octx.beginPath();
        octx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        fillShape ? octx.fill() : octx.stroke();
      }
    }
  }, [isDrawing, tool, color, brushSize, fillShape, width, height, getPos]);

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Commit overlay shape to main canvas
    if ((tool === 'line' || tool === 'rect' || tool === 'circle') && startPos.current) {
      const overlay = overlayRef.current;
      const canvas = canvasRef.current;
      if (overlay && canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(overlay, 0, 0);
        }
        const octx = overlay.getContext('2d');
        octx?.clearRect(0, 0, width, height);
      }
    }

    lastPos.current = null;
    startPos.current = null;

    // Save state
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, width, height);
    setHistory(prev => {
      const truncated = prev.slice(0, historyIndex + 1);
      return [...truncated, data].slice(-30);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 29));
  }, [isDrawing, tool, width, height, historyIndex]);

  const commitText = useCallback((text: string) => {
    if (!textPos || !text.trim()) { setTextPos(null); return; }
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = color;
    ctx.font = `bold ${Math.max(brushSize * 2, 16)}px 'Space Grotesk', sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillText(text, textPos.x, textPos.y);

    setTextPos(null);
    setTextInput('');

    const data = ctx.getImageData(0, 0, width, height);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), data].slice(-30));
    setHistoryIndex(prev => Math.min(prev + 1, 29));
  }, [textPos, color, brushSize, width, height, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIdx = historyIndex - 1;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIndex(newIdx);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIdx = historyIndex + 1;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIndex(newIdx);
  }, [history, historyIndex]);

  const clear = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    drawGuide(ctx, width, height);

    const data = ctx.getImageData(0, 0, width, height);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), data].slice(-30));
    setHistoryIndex(prev => Math.min(prev + 1, 29));
  }, [width, height, historyIndex]);

  const importImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d');
          if (!ctx) return;
          // Fit image proportionally
          const scale = Math.min(width / img.width, height / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = (width - w) / 2;
          const y = (height - h) / 2;
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(img, x, y, w, h);

          const data = ctx.getImageData(0, 0, width, height);
          setHistory(prev => [...prev.slice(0, historyIndex + 1), data].slice(-30));
          setHistoryIndex(prev => Math.min(prev + 1, 29));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [width, height, historyIndex]);

  const exportImage = useCallback(() => {
    const url = canvasRef.current?.toDataURL('image/png');
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meu-avatar.png';
    a.click();
  }, []);

  const floodFill = useCallback((startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const sx = Math.floor(startX);
    const sy = Math.floor(startY);
    const startIdx = (sy * width + sx) * 4;
    const startR = data[startIdx], startG = data[startIdx + 1], startB = data[startIdx + 2], startA = data[startIdx + 3];

    // Parse fill color
    const hex = fillColor.replace('#', '');
    const fr = parseInt(hex.substring(0, 2), 16);
    const fg = parseInt(hex.substring(2, 4), 16);
    const fb = parseInt(hex.substring(4, 6), 16);

    if (startR === fr && startG === fg && startB === fb && startA === 255) return;

    const tolerance = 32;
    const match = (i: number) =>
      Math.abs(data[i] - startR) <= tolerance &&
      Math.abs(data[i + 1] - startG) <= tolerance &&
      Math.abs(data[i + 2] - startB) <= tolerance &&
      Math.abs(data[i + 3] - startA) <= tolerance;

    const stack = [[sx, sy]];
    const visited = new Uint8Array(width * height);

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const idx = cy * width + cx;
      if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
      if (visited[idx]) continue;
      const pi = idx * 4;
      if (!match(pi)) continue;

      visited[idx] = 1;
      data[pi] = fr;
      data[pi + 1] = fg;
      data[pi + 2] = fb;
      data[pi + 3] = 255;

      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    ctx.putImageData(imageData, 0, 0);

    const newData = ctx.getImageData(0, 0, width, height);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newData].slice(-30));
    setHistoryIndex(prev => Math.min(prev + 1, 29));
  }, [width, height, historyIndex]);

  return {
    canvasRef, overlayRef,
    tool, setTool, color, setColor, brushSize, setBrushSize,
    fillShape, setFillShape,
    textPos, textInput, setTextInput, commitText,
    startDraw, onMove, endDraw,
    undo, redo, clear, importImage, exportImage,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}

function drawGuide(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = 'rgba(100,200,255,0.12)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  const cx = w / 2;
  ctx.beginPath(); ctx.arc(cx, 90, 35, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 125); ctx.lineTo(cx, 250); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 50, 170); ctx.lineTo(cx + 50, 170); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 250); ctx.lineTo(cx - 35, 340); ctx.moveTo(cx, 250); ctx.lineTo(cx + 35, 340); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(100,200,255,0.2)';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Desenhe seu personagem!', cx, h - 15);
}
