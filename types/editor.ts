// Base interface for all canvas elements
export interface BaseElement {
  id: string;
  type: 'text' | 'rectangle' | 'image' | 'shape' | 'icon';
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
  align: 'left' | 'center' | 'right' | 'justify';
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  backgroundColor: string | null;
  padding: number;
  width: number;
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

export type ShapeType = 
  | 'rectangle'
  | 'circle' 
  | 'triangle'
  | 'star'
  | 'pentagon'
  | 'hexagon'
  | 'diamond'
  | 'heart'
  | 'arrow-right'
  | 'cloud'
  | 'cloud-2'
  | 'cloud-3'
  | 'cloud-4'
  | 'cloud-5'
  | 'plus'
  | 'rounded-rectangle'
  | 'parallelogram'
  | 'trapezoid'
  | 'blob-1'
  | 'blob-2'
  | 'blob-3'
  | 'blob-4'
  | 'blob-5'
  | 'blob-6'
  | 'blob-7'
  | 'blob-8'
  | 'blob-9'
  | 'blob-10'
  | 'blob-11'
  | 'blob-12';

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number; // for rounded shapes
}

export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string;
  iconComponent: string;
  size: number;
  color: string;
}

export type CanvasElement = TextElement | RectangleElement | ImageElement | ShapeElement | IconElement;

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

export interface Frame {
  id: string;
  elements: CanvasElement[];
  bgColor: string;
  bgImage: string | null;
  name: string;
}

export interface EditorContextType {
  // Frame management
  frames: Frame[];
  currentFrameIndex: number;
  currentFrame: Frame;
  
  // Frame operations
  addFrame: () => void;
  duplicateFrame: (index: number) => void;
  deleteFrame: (index: number) => void;
  goToFrame: (index: number) => void;
  nextFrame: () => void;
  previousFrame: () => void;
  
  // Element operations (scoped to current frame)
  elements: CanvasElement[];
  selectedId: string | null;
  addElement: (type: CanvasElement['type'], initialProps?: Partial<CanvasElement>) => string;
  updateElement: (id: string, props: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  getElementById: (id: string) => CanvasElement | undefined;
  
  // Layering operations
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  reorderElements: (fromIndex: number, toIndex: number) => void;
  
  // Canvas settings (shared across all frames)
  canvasSize: CanvasSize;
  setCanvasSize: (size: CanvasSize) => void;
  
  // Frame background (specific to current frame)
  frameBgColor: string;
  frameBgImage: string | null;
  setFrameBgColor: (color: string) => void;
  setFrameBgImage: (url: string | null) => void;
  
  // Stage ref for export functionality
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stageRef: React.RefObject<any> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setStageRef: (ref: React.RefObject<any>) => void;
}
