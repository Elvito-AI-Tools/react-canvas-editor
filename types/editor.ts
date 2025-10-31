// Base interface for all canvas elements
export interface BaseElement {
  id: string;
  type: 'text' | 'rectangle' | 'image';
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  draggable: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align: string;
}

export interface RectangleElement extends BaseElement {
  type: 'rectangle';
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  width: number;
  height: number;
}

export type CanvasElement = TextElement | RectangleElement | ImageElement;

export interface CanvasSize {
  id: string;
  name: string;
  width: number;
  height: number;
  ratio: string;
}

export const CANVAS_SIZES: CanvasSize[] = [
  { id: 'square', name: 'Square (1:1)', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'landscape', name: 'Landscape (16:9)', width: 1920, height: 1080, ratio: '16:9' },
  { id: 'portrait', name: 'Portrait (9:16)', width: 1080, height: 1920, ratio: '9:16' },
];

export interface FrameBackground {
  type: 'color' | 'image';
  value: string; // hex color or image URL
}

export interface EditorContextType {
  elements: CanvasElement[];
  selectedId: string | null;
  canvasSize: CanvasSize;
  frameBgColor: string;
  frameBgImage: string | null;
  setCanvasSize: (size: CanvasSize) => void;
  setFrameBgColor: (color: string) => void;
  setFrameBgImage: (url: string | null) => void;
  addElement: (type: CanvasElement['type'], initialProps?: Partial<CanvasElement>) => void;
  updateElement: (id: string, props: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  getElementById: (id: string) => CanvasElement | undefined;
}
