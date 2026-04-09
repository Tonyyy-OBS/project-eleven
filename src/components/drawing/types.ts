export type Tool = 'brush' | 'eraser' | 'line' | 'rect' | 'circle' | 'fill' | 'text' | 'eyedropper';

export interface DrawAction {
  type: 'stroke' | 'shape' | 'text' | 'image' | 'fill';
  imageData: ImageData;
}

export const COLORS = [
  // Row 1 — Essentials
  '#000000', '#FFFFFF', '#F5F5F5', '#BDBDBD', '#757575', '#424242',
  // Row 2 — Warm
  '#E53935', '#FF7043', '#FFA726', '#FFCA28', '#FFD54F', '#FFF176',
  // Row 3 — Cool
  '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65',
  // Row 4 — Rich
  '#7E57C2', '#AB47BC', '#EC407A', '#EF5350', '#8D6E63', '#78909C',
  // Row 5 — Skin tones
  '#FDDCB5', '#E8B88A', '#D4956B', '#B47550', '#8D5638', '#5D3A1A',
];

export const BRUSH_SIZES = [1, 3, 6, 12, 20, 32];
