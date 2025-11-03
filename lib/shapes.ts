import type { ShapeType } from '@/types/editor';

export interface ShapeDefinition {
  id: ShapeType;
  name: string;
  category: 'basic' | 'geometric' | 'decorative' | 'arrows' | 'organic';
  // SVG path for preview (normalized to 100x100 viewBox)
  svgPath: string;
  // Function to draw the shape on canvas context
  drawFunc: (context: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const SHAPE_DEFINITIONS: Record<ShapeType, ShapeDefinition> = {
  rectangle: {
    id: 'rectangle',
    name: 'Rectangle',
    category: 'basic',
    svgPath: 'M 10 10 L 90 10 L 90 90 L 10 90 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.closePath();
    },
  },
  'rounded-rectangle': {
    id: 'rounded-rectangle',
    name: 'Rounded Rectangle',
    category: 'basic',
    svgPath: 'M 20 10 L 80 10 Q 90 10 90 20 L 90 80 Q 90 90 80 90 L 20 90 Q 10 90 10 80 L 10 20 Q 10 10 20 10 Z',
    drawFunc: (ctx, w, h) => {
      const radius = Math.min(w, h) * 0.1;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(w - radius, 0);
      ctx.quadraticCurveTo(w, 0, w, radius);
      ctx.lineTo(w, h - radius);
      ctx.quadraticCurveTo(w, h, w - radius, h);
      ctx.lineTo(radius, h);
      ctx.quadraticCurveTo(0, h, 0, h - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
    },
  },
  circle: {
    id: 'circle',
    name: 'Circle',
    category: 'basic',
    svgPath: 'M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10 Z',
    drawFunc: (ctx, w, h) => {
      const radius = Math.min(w, h) / 2;
      const centerX = w / 2;
      const centerY = h / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
    },
  },
  triangle: {
    id: 'triangle',
    name: 'Triangle',
    category: 'geometric',
    svgPath: 'M 50 10 L 90 90 L 10 90 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
    },
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    category: 'geometric',
    svgPath: 'M 50 10 L 90 50 L 50 90 L 10 50 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w, h / 2);
      ctx.lineTo(w / 2, h);
      ctx.lineTo(0, h / 2);
      ctx.closePath();
    },
  },
  star: {
    id: 'star',
    name: 'Star',
    category: 'decorative',
    svgPath: 'M 50 10 L 61 38 L 90 38 L 68 55 L 79 83 L 50 66 L 21 83 L 32 55 L 10 38 L 39 38 Z',
    drawFunc: (ctx, w, h) => {
      const centerX = w / 2;
      const centerY = h / 2;
      const outerRadius = Math.min(w, h) / 2;
      const innerRadius = outerRadius * 0.4;
      const spikes = 5;

      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI * 2 * i) / (spikes * 2) - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
    },
  },
  pentagon: {
    id: 'pentagon',
    name: 'Pentagon',
    category: 'geometric',
    svgPath: 'M 50 10 L 90 40 L 75 85 L 25 85 L 10 40 Z',
    drawFunc: (ctx, w, h) => {
      const centerX = w / 2;
      const centerY = h / 2;
      const radius = Math.min(w, h) / 2;
      const sides = 5;

      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
    },
  },
  hexagon: {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'geometric',
    svgPath: 'M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z',
    drawFunc: (ctx, w, h) => {
      const centerX = w / 2;
      const centerY = h / 2;
      const radius = Math.min(w, h) / 2;
      const sides = 6;

      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
    },
  },
  heart: {
    id: 'heart',
    name: 'Heart',
    category: 'decorative',
    svgPath: 'M 50 85 C 50 85 15 60 15 40 C 15 28 22 20 30 20 C 38 20 45 26 50 35 C 55 26 62 20 70 20 C 78 20 85 28 85 40 C 85 60 50 85 50 85 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w / 2, h * 0.3);
      
      // Left side
      ctx.bezierCurveTo(
        w / 2, h * 0.15,
        0, h * 0.15,
        0, h * 0.4
      );
      ctx.bezierCurveTo(
        0, h * 0.6,
        w / 2, h * 0.8,
        w / 2, h
      );
      
      // Right side
      ctx.bezierCurveTo(
        w / 2, h * 0.8,
        w, h * 0.6,
        w, h * 0.4
      );
      ctx.bezierCurveTo(
        w, h * 0.15,
        w / 2, h * 0.15,
        w / 2, h * 0.3
      );
      
      ctx.closePath();
    },
  },
  'arrow-right': {
    id: 'arrow-right',
    name: 'Arrow Right',
    category: 'arrows',
    svgPath: 'M 10 35 L 60 35 L 60 15 L 90 50 L 60 85 L 60 65 L 10 65 Z',
    drawFunc: (ctx, w, h) => {
      const arrowWidth = w * 0.7;
      
      ctx.beginPath();
      ctx.moveTo(0, h * 0.35);
      ctx.lineTo(arrowWidth, h * 0.35);
      ctx.lineTo(arrowWidth, 0);
      ctx.lineTo(w, h / 2);
      ctx.lineTo(arrowWidth, h);
      ctx.lineTo(arrowWidth, h * 0.65);
      ctx.lineTo(0, h * 0.65);
      ctx.closePath();
    },
  },
  cloud: {
    id: 'cloud',
    name: 'Cloud',
    category: 'decorative',
    svgPath: 'M 20 55 Q 10 55 10 45 Q 10 35 20 30 Q 25 20 35 20 Q 40 15 50 15 Q 60 15 65 20 Q 75 20 80 30 Q 90 35 90 45 Q 90 55 80 55 Z',
    drawFunc: (ctx, w, h) => {
      // Create a smooth cloud shape using bezier curves
      ctx.beginPath();
      
      const centerY = h * 0.6;
      const topY = h * 0.25;
      
      // Start from left bottom
      ctx.moveTo(w * 0.15, centerY);
      
      // Left bump (small)
      ctx.bezierCurveTo(
        w * 0.15, h * 0.45,
        w * 0.05, h * 0.35,
        w * 0.2, h * 0.35
      );
      
      // Left-center bump (medium)
      ctx.bezierCurveTo(
        w * 0.25, topY,
        w * 0.35, topY - h * 0.05,
        w * 0.45, topY
      );
      
      // Center-right bump (tall)
      ctx.bezierCurveTo(
        w * 0.55, topY - h * 0.1,
        w * 0.65, topY - h * 0.05,
        w * 0.7, topY + h * 0.05
      );
      
      // Right bump (medium)
      ctx.bezierCurveTo(
        w * 0.8, h * 0.35,
        w * 0.95, h * 0.4,
        w * 0.9, centerY
      );
      
      // Bottom curve
      ctx.bezierCurveTo(
        w * 0.85, centerY + h * 0.05,
        w * 0.2, centerY + h * 0.05,
        w * 0.15, centerY
      );
      
      ctx.closePath();
    },
  },
  'cloud-2': {
    id: 'cloud-2',
    name: 'Cloud 2',
    category: 'decorative',
    svgPath: 'M 15 58 Q 8 58 8 48 Q 8 40 15 35 Q 18 28 28 25 Q 35 20 45 22 Q 52 18 60 22 Q 68 25 73 32 Q 82 38 85 48 Q 88 58 80 62 Q 70 65 60 62 Q 50 60 40 62 Q 30 65 20 62 Q 12 60 15 58 Z',
    drawFunc: (ctx, w, h) => {
      // Puffy cloud with multiple rounded bumps
      ctx.beginPath();
      
      const baseY = h * 0.7;
      
      // Start left
      ctx.moveTo(w * 0.12, baseY);
      
      // Left puff
      ctx.bezierCurveTo(
        w * 0.05, h * 0.6,
        w * 0.08, h * 0.4,
        w * 0.2, h * 0.3
      );
      
      // Left-center puff
      ctx.bezierCurveTo(
        w * 0.28, h * 0.22,
        w * 0.38, h * 0.18,
        w * 0.48, h * 0.22
      );
      
      // Center puff (tallest)
      ctx.bezierCurveTo(
        w * 0.55, h * 0.15,
        w * 0.65, h * 0.2,
        w * 0.7, h * 0.32
      );
      
      // Right puff
      ctx.bezierCurveTo(
        w * 0.78, h * 0.38,
        w * 0.92, h * 0.45,
        w * 0.9, baseY
      );
      
      // Bottom smooth curve
      ctx.bezierCurveTo(
        w * 0.75, h * 0.75,
        w * 0.25, h * 0.75,
        w * 0.12, baseY
      );
      
      ctx.closePath();
    },
  },
  'cloud-3': {
    id: 'cloud-3',
    name: 'Cloud 3',
    category: 'decorative',
    svgPath: 'M 25 60 Q 12 60 10 48 Q 10 38 20 32 Q 28 25 40 28 Q 48 22 58 28 Q 68 32 75 40 Q 82 48 78 58 Q 70 65 58 62 Q 48 60 38 62 Q 28 65 25 60 Z',
    drawFunc: (ctx, w, h) => {
      // Elongated horizontal cloud
      ctx.beginPath();
      
      ctx.moveTo(w * 0.18, h * 0.65);
      
      // Left side
      ctx.bezierCurveTo(
        w * 0.08, h * 0.6,
        w * 0.05, h * 0.45,
        w * 0.15, h * 0.35
      );
      
      // Top curve with gentle bumps
      ctx.bezierCurveTo(
        w * 0.25, h * 0.28,
        w * 0.35, h * 0.25,
        w * 0.45, h * 0.28
      );
      
      ctx.bezierCurveTo(
        w * 0.55, h * 0.22,
        w * 0.65, h * 0.25,
        w * 0.75, h * 0.32
      );
      
      // Right side
      ctx.bezierCurveTo(
        w * 0.88, h * 0.4,
        w * 0.92, h * 0.55,
        w * 0.85, h * 0.65
      );
      
      // Bottom
      ctx.bezierCurveTo(
        w * 0.7, h * 0.7,
        w * 0.3, h * 0.7,
        w * 0.18, h * 0.65
      );
      
      ctx.closePath();
    },
  },
  'cloud-4': {
    id: 'cloud-4',
    name: 'Cloud 4',
    category: 'decorative',
    svgPath: 'M 30 65 Q 18 65 15 55 Q 12 45 20 38 Q 28 32 38 35 Q 45 28 55 32 Q 62 28 70 32 Q 78 38 82 48 Q 85 58 78 65 Q 68 70 58 68 Q 48 65 38 68 Q 32 70 30 65 Z',
    drawFunc: (ctx, w, h) => {
      // Compact puffy cloud with 3 distinct bumps
      ctx.beginPath();
      
      ctx.moveTo(w * 0.2, h * 0.68);
      
      // Left bump
      ctx.bezierCurveTo(
        w * 0.12, h * 0.62,
        w * 0.1, h * 0.48,
        w * 0.2, h * 0.38
      );
      
      ctx.bezierCurveTo(
        w * 0.28, h * 0.3,
        w * 0.38, h * 0.32,
        w * 0.45, h * 0.38
      );
      
      // Middle bump (tallest)
      ctx.bezierCurveTo(
        w * 0.5, h * 0.25,
        w * 0.6, h * 0.28,
        w * 0.65, h * 0.35
      );
      
      // Right bump
      ctx.bezierCurveTo(
        w * 0.7, h * 0.3,
        w * 0.8, h * 0.32,
        w * 0.88, h * 0.42
      );
      
      ctx.bezierCurveTo(
        w * 0.92, h * 0.55,
        w * 0.88, h * 0.68,
        w * 0.78, h * 0.72
      );
      
      // Bottom
      ctx.bezierCurveTo(
        w * 0.6, h * 0.75,
        w * 0.4, h * 0.75,
        w * 0.2, h * 0.68
      );
      
      ctx.closePath();
    },
  },
  'cloud-5': {
    id: 'cloud-5',
    name: 'Cloud 5',
    category: 'decorative',
    svgPath: 'M 22 62 Q 10 62 8 50 Q 8 40 18 32 Q 28 25 40 28 Q 50 20 62 25 Q 72 28 80 38 Q 90 48 88 60 Q 82 70 70 68 Q 58 65 45 68 Q 32 70 22 62 Z',
    drawFunc: (ctx, w, h) => {
      // Wide stretched cloud with smooth contours
      ctx.beginPath();
      
      ctx.moveTo(w * 0.15, h * 0.65);
      
      // Left side - smooth rise
      ctx.bezierCurveTo(
        w * 0.08, h * 0.58,
        w * 0.08, h * 0.45,
        w * 0.18, h * 0.35
      );
      
      // Left peak
      ctx.bezierCurveTo(
        w * 0.25, h * 0.28,
        w * 0.35, h * 0.25,
        w * 0.45, h * 0.3
      );
      
      // Center dip and rise
      ctx.bezierCurveTo(
        w * 0.52, h * 0.35,
        w * 0.58, h * 0.28,
        w * 0.68, h * 0.3
      );
      
      // Right peak
      ctx.bezierCurveTo(
        w * 0.78, h * 0.32,
        w * 0.88, h * 0.4,
        w * 0.92, h * 0.55
      );
      
      // Right descent
      ctx.bezierCurveTo(
        w * 0.92, h * 0.68,
        w * 0.85, h * 0.72,
        w * 0.75, h * 0.7
      );
      
      // Bottom smooth curve
      ctx.bezierCurveTo(
        w * 0.55, h * 0.75,
        w * 0.35, h * 0.73,
        w * 0.15, h * 0.65
      );
      
      ctx.closePath();
    },
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    category: 'basic',
    svgPath: 'M 40 10 L 60 10 L 60 40 L 90 40 L 90 60 L 60 60 L 60 90 L 40 90 L 40 60 L 10 60 L 10 40 L 40 40 Z',
    drawFunc: (ctx, w, h) => {
      const thickness = Math.min(w, h) * 0.25;
      const centerX = w / 2;
      const centerY = h / 2;
      
      ctx.beginPath();
      // Horizontal bar
      ctx.rect(0, centerY - thickness / 2, w, thickness);
      // Vertical bar
      ctx.rect(centerX - thickness / 2, 0, thickness, h);
      ctx.closePath();
    },
  },
  parallelogram: {
    id: 'parallelogram',
    name: 'Parallelogram',
    category: 'geometric',
    svgPath: 'M 20 10 L 90 10 L 80 90 L 10 90 Z',
    drawFunc: (ctx, w, h) => {
      const skew = w * 0.2;
      ctx.beginPath();
      ctx.moveTo(skew, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w - skew, h);
      ctx.lineTo(0, h);
      ctx.closePath();
    },
  },
  trapezoid: {
    id: 'trapezoid',
    name: 'Trapezoid',
    category: 'geometric',
    svgPath: 'M 25 10 L 75 10 L 90 90 L 10 90 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w * 0.25, 0);
      ctx.lineTo(w * 0.75, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
    },
  },
  'blob-1': {
    id: 'blob-1',
    name: 'Blob 1',
    category: 'organic',
    svgPath: 'M 30 10 Q 50 5 70 20 Q 85 35 85 55 Q 80 75 60 85 Q 40 90 25 75 Q 10 60 15 40 Q 20 20 30 10 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.1);
      ctx.bezierCurveTo(w * 0.5, h * 0.05, w * 0.7, h * 0.15, w * 0.85, h * 0.35);
      ctx.bezierCurveTo(w * 0.9, h * 0.55, w * 0.85, h * 0.75, w * 0.65, h * 0.9);
      ctx.bezierCurveTo(w * 0.45, h * 0.95, w * 0.25, h * 0.8, w * 0.15, h * 0.6);
      ctx.bezierCurveTo(w * 0.1, h * 0.4, w * 0.15, h * 0.2, w * 0.3, h * 0.1);
      ctx.closePath();
    },
  },
  'blob-2': {
    id: 'blob-2',
    name: 'Blob 2',
    category: 'organic',
    svgPath: 'M 40 15 Q 60 10 75 25 Q 90 45 80 65 Q 65 80 45 85 Q 25 85 15 70 Q 5 50 15 30 Q 25 15 40 15 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w * 0.4, h * 0.15);
      ctx.bezierCurveTo(w * 0.6, h * 0.08, w * 0.8, h * 0.2, w * 0.9, h * 0.45);
      ctx.bezierCurveTo(w * 0.92, h * 0.65, w * 0.75, h * 0.82, w * 0.5, h * 0.88);
      ctx.bezierCurveTo(w * 0.25, h * 0.9, w * 0.1, h * 0.75, w * 0.08, h * 0.5);
      ctx.bezierCurveTo(w * 0.07, h * 0.3, w * 0.2, h * 0.15, w * 0.4, h * 0.15);
      ctx.closePath();
    },
  },
  'blob-3': {
    id: 'blob-3',
    name: 'Blob 3',
    category: 'organic',
    svgPath: 'M 50 10 Q 70 15 80 35 Q 90 55 75 70 Q 55 85 35 80 Q 15 70 10 50 Q 10 30 25 15 Q 40 5 50 10 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.1);
      ctx.bezierCurveTo(w * 0.7, h * 0.12, w * 0.85, h * 0.3, w * 0.9, h * 0.5);
      ctx.bezierCurveTo(w * 0.88, h * 0.7, w * 0.7, h * 0.88, w * 0.45, h * 0.9);
      ctx.bezierCurveTo(w * 0.2, h * 0.85, w * 0.08, h * 0.65, w * 0.1, h * 0.4);
      ctx.bezierCurveTo(w * 0.15, h * 0.2, w * 0.3, h * 0.08, w * 0.5, h * 0.1);
      ctx.closePath();
    },
  },
  'blob-4': {
    id: 'blob-4',
    name: 'Blob 4',
    category: 'organic',
    svgPath: 'M 45 10 Q 65 8 78 22 Q 92 40 88 60 Q 80 78 60 88 Q 40 92 22 82 Q 8 68 10 48 Q 15 25 30 12 Q 40 8 45 10 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w * 0.45, h * 0.1);
      ctx.bezierCurveTo(w * 0.65, h * 0.05, w * 0.82, h * 0.18, w * 0.92, h * 0.4);
      ctx.bezierCurveTo(w * 0.95, h * 0.62, w * 0.85, h * 0.82, w * 0.6, h * 0.92);
      ctx.bezierCurveTo(w * 0.35, h * 0.95, w * 0.15, h * 0.85, w * 0.08, h * 0.6);
      ctx.bezierCurveTo(w * 0.05, h * 0.35, w * 0.15, h * 0.15, w * 0.35, h * 0.08);
      ctx.bezierCurveTo(w * 0.42, h * 0.07, w * 0.45, h * 0.1, w * 0.45, h * 0.1);
      ctx.closePath();
    },
  },
  'blob-5': {
    id: 'blob-5',
    name: 'Blob 5',
    category: 'organic',
    svgPath: 'M 35 12 Q 55 8 72 20 Q 88 38 85 58 Q 78 75 58 85 Q 38 90 20 80 Q 8 65 10 45 Q 15 22 35 12 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w * 0.35, h * 0.12);
      ctx.bezierCurveTo(w * 0.55, h * 0.06, w * 0.75, h * 0.15, w * 0.88, h * 0.38);
      ctx.bezierCurveTo(w * 0.92, h * 0.6, w * 0.82, h * 0.8, w * 0.58, h * 0.9);
      ctx.bezierCurveTo(w * 0.35, h * 0.95, w * 0.15, h * 0.82, w * 0.08, h * 0.6);
      ctx.bezierCurveTo(w * 0.05, h * 0.38, w * 0.12, h * 0.18, w * 0.35, h * 0.12);
      ctx.closePath();
    },
  },
  'blob-6': {
    id: 'blob-6',
    name: 'Blob 6',
    category: 'organic',
    svgPath: 'M 42 15 Q 58 12 72 25 Q 85 42 82 60 Q 75 78 55 86 Q 35 90 20 78 Q 10 62 12 45 Q 18 25 35 15 Q 40 13 42 15 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.15);
      ctx.bezierCurveTo(w * 0.58, h * 0.1, w * 0.75, h * 0.22, w * 0.85, h * 0.42);
      ctx.bezierCurveTo(w * 0.88, h * 0.62, w * 0.78, h * 0.82, w * 0.55, h * 0.9);
      ctx.bezierCurveTo(w * 0.32, h * 0.93, w * 0.15, h * 0.8, w * 0.1, h * 0.58);
      ctx.bezierCurveTo(w * 0.08, h * 0.38, w * 0.18, h * 0.2, w * 0.38, h * 0.14);
      ctx.bezierCurveTo(w * 0.41, h * 0.14, w * 0.42, h * 0.15, w * 0.42, h * 0.15);
      ctx.closePath();
    },
  },
  'blob-7': {
    id: 'blob-7',
    name: 'Blob 7',
    category: 'organic',
    svgPath: 'M 48 10 Q 68 12 80 28 Q 90 48 82 66 Q 70 82 50 88 Q 30 88 18 72 Q 10 55 15 38 Q 22 18 40 10 Q 46 9 48 10 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w * 0.48, h * 0.1);
      ctx.bezierCurveTo(w * 0.68, h * 0.1, w * 0.82, h * 0.25, w * 0.9, h * 0.48);
      ctx.bezierCurveTo(w * 0.9, h * 0.7, w * 0.75, h * 0.88, w * 0.5, h * 0.92);
      ctx.bezierCurveTo(w * 0.25, h * 0.9, w * 0.12, h * 0.72, w * 0.1, h * 0.5);
      ctx.bezierCurveTo(w * 0.1, h * 0.28, w * 0.22, h * 0.12, w * 0.42, h * 0.08);
      ctx.bezierCurveTo(w * 0.46, h * 0.09, w * 0.48, h * 0.1, w * 0.48, h * 0.1);
      ctx.closePath();
    },
  },
  'blob-8': {
    id: 'blob-8',
    name: 'Blob 8',
    category: 'organic',
    svgPath: 'M 38 18 Q 55 15 68 28 Q 82 45 78 62 Q 70 78 52 85 Q 35 88 22 75 Q 12 60 15 43 Q 20 25 35 18 Q 37 17 38 18 Z',
    drawFunc: (ctx, w, h) => {
      ctx.beginPath();
      ctx.moveTo(w * 0.38, h * 0.18);
      ctx.bezierCurveTo(w * 0.55, h * 0.13, w * 0.72, h * 0.25, w * 0.82, h * 0.45);
      ctx.bezierCurveTo(w * 0.85, h * 0.65, w * 0.72, h * 0.82, w * 0.5, h * 0.9);
      ctx.bezierCurveTo(w * 0.28, h * 0.92, w * 0.15, h * 0.78, w * 0.12, h * 0.58);
      ctx.bezierCurveTo(w * 0.1, h * 0.38, w * 0.18, h * 0.22, w * 0.35, h * 0.16);
      ctx.bezierCurveTo(w * 0.37, h * 0.17, w * 0.38, h * 0.18, w * 0.38, h * 0.18);
      ctx.closePath();
    },
  },
  'blob-9': {
    id: 'blob-9',
    name: 'Blob 9',
    category: 'organic',
    svgPath: 'M 25 25 Q 15 35 15 50 Q 15 70 30 82 Q 50 92 70 85 Q 85 78 88 60 Q 90 40 75 25 Q 60 12 40 15 Q 28 18 25 25 Z',
    drawFunc: (ctx, w, h) => {
      // Wide blob - heavier on bottom left
      ctx.beginPath();
      ctx.moveTo(w * 0.15, h * 0.3);
      ctx.bezierCurveTo(w * 0.08, h * 0.4, w * 0.08, h * 0.6, w * 0.2, h * 0.75);
      ctx.bezierCurveTo(w * 0.35, h * 0.88, w * 0.55, h * 0.92, w * 0.75, h * 0.85);
      ctx.bezierCurveTo(w * 0.9, h * 0.78, w * 0.95, h * 0.58, w * 0.92, h * 0.38);
      ctx.bezierCurveTo(w * 0.88, h * 0.2, w * 0.72, h * 0.08, w * 0.5, h * 0.1);
      ctx.bezierCurveTo(w * 0.3, h * 0.12, w * 0.2, h * 0.22, w * 0.15, h * 0.3);
      ctx.closePath();
    },
  },
  'blob-10': {
    id: 'blob-10',
    name: 'Blob 10',
    category: 'organic',
    svgPath: 'M 50 15 Q 65 18 75 30 Q 85 45 82 55 Q 78 60 75 65 Q 78 70 75 78 Q 65 88 50 90 Q 35 88 25 78 Q 22 70 25 65 Q 22 60 18 55 Q 15 45 25 30 Q 35 18 50 15 Z',
    drawFunc: (ctx, w, h) => {
      // Pinched/hourglass blob with indent in middle
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.1);
      ctx.bezierCurveTo(w * 0.68, h * 0.12, w * 0.82, h * 0.25, w * 0.88, h * 0.4);
      ctx.bezierCurveTo(w * 0.85, h * 0.48, w * 0.7, h * 0.5, w * 0.6, h * 0.5);
      ctx.bezierCurveTo(w * 0.7, h * 0.5, w * 0.85, h * 0.52, w * 0.88, h * 0.6);
      ctx.bezierCurveTo(w * 0.92, h * 0.75, w * 0.8, h * 0.88, w * 0.5, h * 0.92);
      ctx.bezierCurveTo(w * 0.2, h * 0.88, w * 0.08, h * 0.75, w * 0.12, h * 0.6);
      ctx.bezierCurveTo(w * 0.15, h * 0.52, w * 0.3, h * 0.5, w * 0.4, h * 0.5);
      ctx.bezierCurveTo(w * 0.3, h * 0.5, w * 0.15, h * 0.48, w * 0.12, h * 0.4);
      ctx.bezierCurveTo(w * 0.18, h * 0.25, w * 0.32, h * 0.12, w * 0.5, h * 0.1);
      ctx.closePath();
    },
  },
  'blob-11': {
    id: 'blob-11',
    name: 'Blob 11',
    category: 'organic',
    svgPath: 'M 50 12 Q 68 15 80 30 Q 88 48 85 65 Q 78 80 60 88 Q 42 92 28 82 Q 15 70 12 52 Q 10 35 22 22 Q 35 10 50 12 Z',
    drawFunc: (ctx, w, h) => {
      // Smooth rounded egg-like blob
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.08);
      ctx.bezierCurveTo(w * 0.7, h * 0.1, w * 0.85, h * 0.25, w * 0.9, h * 0.48);
      ctx.bezierCurveTo(w * 0.92, h * 0.68, w * 0.82, h * 0.85, w * 0.6, h * 0.92);
      ctx.bezierCurveTo(w * 0.38, h * 0.95, w * 0.2, h * 0.82, w * 0.12, h * 0.62);
      ctx.bezierCurveTo(w * 0.08, h * 0.42, w * 0.15, h * 0.22, w * 0.32, h * 0.12);
      ctx.bezierCurveTo(w * 0.42, h * 0.08, w * 0.5, h * 0.08, w * 0.5, h * 0.08);
      ctx.closePath();
    },
  },
  'blob-12': {
    id: 'blob-12',
    name: 'Blob 12',
    category: 'organic',
    svgPath: 'M 40 18 Q 58 12 72 22 Q 88 35 88 52 Q 85 70 70 82 Q 52 92 35 85 Q 18 75 12 58 Q 8 40 18 25 Q 28 15 40 18 Z',
    drawFunc: (ctx, w, h) => {
      // Organic blob with subtle asymmetry
      ctx.beginPath();
      ctx.moveTo(w * 0.35, h * 0.15);
      ctx.bezierCurveTo(w * 0.55, h * 0.08, w * 0.75, h * 0.18, w * 0.88, h * 0.38);
      ctx.bezierCurveTo(w * 0.92, h * 0.58, w * 0.85, h * 0.78, w * 0.65, h * 0.9);
      ctx.bezierCurveTo(w * 0.45, h * 0.95, w * 0.25, h * 0.85, w * 0.15, h * 0.65);
      ctx.bezierCurveTo(w * 0.08, h * 0.45, w * 0.12, h * 0.25, w * 0.25, h * 0.15);
      ctx.bezierCurveTo(w * 0.3, h * 0.13, w * 0.35, h * 0.15, w * 0.35, h * 0.15);
      ctx.closePath();
    },
  },
};

// Helper to get shapes by category
export function getShapesByCategory(category: ShapeDefinition['category']): ShapeDefinition[] {
  return Object.values(SHAPE_DEFINITIONS).filter(shape => shape.category === category);
}

// Helper to get all shapes
export function getAllShapes(): ShapeDefinition[] {
  return Object.values(SHAPE_DEFINITIONS);
}

