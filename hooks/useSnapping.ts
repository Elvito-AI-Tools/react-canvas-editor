import { useState, useCallback } from 'react';
import type Konva from 'konva';

export interface SnapLine {
  orientation: 'vertical' | 'horizontal';
  position: number; // x for vertical, y for horizontal
}

export interface SnapResult {
  x: number;
  y: number;
  snapLines: SnapLine[];
}

interface UseSnappingProps {
  canvasWidth: number;
  canvasHeight: number;
  snapThreshold?: number; // Distance in pixels to trigger snap
}

export function useSnapping({ 
  canvasWidth, 
  canvasHeight, 
  snapThreshold = 5 
}: UseSnappingProps) {
  const [activeSnapLines, setActiveSnapLines] = useState<SnapLine[]>([]);

  const calculateSnapPosition = useCallback(
    (node: Konva.Node): SnapResult => {
      const nodeRect = node.getClientRect({ relativeTo: node.getParent()! });
      
      // Calculate key positions of the node
      const nodeLeft = nodeRect.x;
      const nodeRight = nodeRect.x + nodeRect.width;
      const nodeTop = nodeRect.y;
      const nodeBottom = nodeRect.y + nodeRect.height;
      const nodeCenterX = nodeRect.x + nodeRect.width / 2;
      const nodeCenterY = nodeRect.y + nodeRect.height / 2;

      // Canvas snap guides
      const canvasCenterX = canvasWidth / 2;
      const canvasCenterY = canvasHeight / 2;
      const canvasLeft = 0;
      const canvasRight = canvasWidth;
      const canvasTop = 0;
      const canvasBottom = canvasHeight;

      let snappedX = node.x();
      let snappedY = node.y();
      const snapLines: SnapLine[] = [];

      // Snap to vertical guides (X-axis)
      const verticalSnaps = [
        { guide: canvasLeft, nodePos: nodeLeft, offset: 0 }, // Snap left edge to canvas left
        { guide: canvasLeft, nodePos: nodeRight, offset: -nodeRect.width }, // Snap right edge to canvas left
        { guide: canvasCenterX, nodePos: nodeLeft, offset: 0 }, // Snap left edge to canvas center
        { guide: canvasCenterX, nodePos: nodeCenterX, offset: -nodeRect.width / 2 }, // Snap center to canvas center
        { guide: canvasCenterX, nodePos: nodeRight, offset: -nodeRect.width }, // Snap right edge to canvas center
        { guide: canvasRight, nodePos: nodeLeft, offset: 0 }, // Snap left edge to canvas right
        { guide: canvasRight, nodePos: nodeRight, offset: -nodeRect.width }, // Snap right edge to canvas right
      ];

      for (const snap of verticalSnaps) {
        const diff = Math.abs(snap.guide - snap.nodePos);
        if (diff < snapThreshold) {
          snappedX = snap.guide + snap.offset;
          snapLines.push({
            orientation: 'vertical',
            position: snap.guide,
          });
          break; // Only snap to one guide at a time
        }
      }

      // Snap to horizontal guides (Y-axis)
      const horizontalSnaps = [
        { guide: canvasTop, nodePos: nodeTop, offset: 0 }, // Snap top edge to canvas top
        { guide: canvasTop, nodePos: nodeBottom, offset: -nodeRect.height }, // Snap bottom edge to canvas top
        { guide: canvasCenterY, nodePos: nodeTop, offset: 0 }, // Snap top edge to canvas center
        { guide: canvasCenterY, nodePos: nodeCenterY, offset: -nodeRect.height / 2 }, // Snap center to canvas center
        { guide: canvasCenterY, nodePos: nodeBottom, offset: -nodeRect.height }, // Snap bottom edge to canvas center
        { guide: canvasBottom, nodePos: nodeTop, offset: 0 }, // Snap top edge to canvas bottom
        { guide: canvasBottom, nodePos: nodeBottom, offset: -nodeRect.height }, // Snap bottom edge to canvas bottom
      ];

      for (const snap of horizontalSnaps) {
        const diff = Math.abs(snap.guide - snap.nodePos);
        if (diff < snapThreshold) {
          snappedY = snap.guide + snap.offset;
          snapLines.push({
            orientation: 'horizontal',
            position: snap.guide,
          });
          break; // Only snap to one guide at a time
        }
      }

      return {
        x: snappedX,
        y: snappedY,
        snapLines,
      };
    },
    [canvasWidth, canvasHeight, snapThreshold]
  );

  const showSnapLines = useCallback((snapLines: SnapLine[]) => {
    setActiveSnapLines(snapLines);
  }, []);

  const hideSnapLines = useCallback(() => {
    setActiveSnapLines([]);
  }, []);

  return {
    calculateSnapPosition,
    activeSnapLines,
    showSnapLines,
    hideSnapLines,
  };
}

