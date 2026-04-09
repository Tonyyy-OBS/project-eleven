export type Tool = 'brush' | 'eraser' | 'line' | 'rect' | 'circle' | 'fill' | 'text' | 'eyedropper';

export interface DrawAction {
  type: 'stroke' | 'shape' | 'text' | 'image' | 'fill';
  imageData: ImageData;
}

export const COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#e94560', '#f39c12', '#2ecc71', '#3498db',
  '#9b59b6', '#1abc9c', '#e74c3c', '#f1c40f',
  '#ecf0f1', '#ffffff', '#95a5a6', '#34495e',
  '#d35400', '#c0392b', '#7f8c8d', '#2c3e50',
  '#F6D9BE', '#E7BD97', '#CF9D78', '#AF7D5C',
  '#8D6248', '#694431', '#41261A', '#23180E',
];

export const BRUSH_SIZES = [2, 4, 8, 14, 22, 32];
