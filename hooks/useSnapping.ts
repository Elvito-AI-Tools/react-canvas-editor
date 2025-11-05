import { useState, useCallback } from 'react';
import type Konva from 'konva';

export interface SnapLine {
  orientation: 'vertical' | 'horizontal';
  position: number; // x for vertical, y for horizontal
  type?: 'snap' | 'spacing'; // 'snap' for alignment guides, 'spacing' for equal spacing indicators
  length?: number; // For spacing indicators, the length of the gap being shown
  start?: number; // Starting position for spacing indicators
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
  elementNodesRef?: React.MutableRefObject<Record<string, Konva.Node | null>>; // All element nodes for element-to-element snapping
  currentElementId?: string; // ID of the element being dragged (to exclude from snapping calculations)
}

/**
 * SNAPPING GUIDE RULES
 * ====================
 * 
 * This hook provides intelligent snapping for canvas elements with visual guide lines.
 * Snapping occurs in the following scenarios:
 * 
 * 1. CANVAS BOUNDARY SNAPPING
 *    - Left edge to canvas left boundary
 *    - Right edge to canvas right boundary
 *    - Top edge to canvas top boundary
 *    - Bottom edge to canvas bottom boundary
 *    - Horizontal center to canvas horizontal center
 *    - Vertical center to canvas vertical center
 * 
 * 2. ELEMENT EDGE ALIGNMENT SNAPPING
 *    - Left edge aligns with left edge of another element
 *    - Right edge aligns with right edge of another element
 *    - Top edge aligns with top edge of another element
 *    - Bottom edge aligns with bottom edge of another element
 *    - Horizontal center aligns with horizontal center of another element
 *    - Vertical center aligns with vertical center of another element
 * 
 * 3. ELEMENT EDGE-TO-EDGE SNAPPING (Adjacent Positioning)
 *    - Left edge snaps to right edge of another element (element on the left)
 *    - Right edge snaps to left edge of another element (element on the right)
 *    - Top edge snaps to bottom edge of another element (element above)
 *    - Bottom edge snaps to top edge of another element (element below)
 * 
 * 4. SPACING DISTRIBUTION SNAPPING
 *    - Equal horizontal spacing between three or more aligned elements
 *    - Equal vertical spacing between three or more aligned elements
 *    - Maintains consistent gaps when moving elements
 * 
 * 5. EQUAL SPACING INDICATORS
 *    - Visual guide lines appear when an element has equal spacing between two others
 *    - Shows horizontal spacing lines when element is vertically centered between two elements
 *    - Shows vertical spacing lines when element is horizontally centered between two elements
 *    - Helps achieve balanced layouts by providing visual feedback
 * 
 * All snapping activates when the element comes within the snapThreshold distance
 * (default: 5 pixels) of any snap point. Visual guide lines appear to indicate
 * active snap positions.
 */

interface SpacingResult {
  snapPosition: number;
  snapLines: SnapLine[];
}

/**
 * Helper function to detect equal spacing between three elements
 * Returns spacing guide lines when element is centered between two others
 */
function detectEqualSpacing(
  nodeRect: { x: number; y: number; width: number; height: number },
  otherRects: Array<{ x: number; y: number; width: number; height: number }>,
  threshold: number
): SnapLine[] {
  const spacingLines: SnapLine[] = [];

  // Check vertical equal spacing (element between two others vertically)
  for (let i = 0; i < otherRects.length; i++) {
    for (let j = 0; j < otherRects.length; j++) {
      if (i === j) continue;

      const rect1 = otherRects[i];
      const rect2 = otherRects[j];

      // Determine which is above and which is below
      const above = rect1.y < rect2.y ? rect1 : rect2;
      const below = rect1.y < rect2.y ? rect2 : rect1;

      // Check if current node is between them
      if (nodeRect.y > above.y + above.height && nodeRect.y + nodeRect.height < below.y) {
        // Calculate gaps
        const gapAbove = nodeRect.y - (above.y + above.height);
        const gapBelow = below.y - (nodeRect.y + nodeRect.height);

        // If gaps are equal (within threshold), show spacing indicators
        if (Math.abs(gapAbove - gapBelow) < threshold) {
          // Guide line for gap above
          spacingLines.push({
            orientation: 'horizontal',
            position: above.y + above.height + gapAbove / 2,
            type: 'spacing',
            length: gapAbove,
            start: Math.min(nodeRect.x, above.x),
          });

          // Guide line for gap below
          spacingLines.push({
            orientation: 'horizontal',
            position: nodeRect.y + nodeRect.height + gapBelow / 2,
            type: 'spacing',
            length: gapBelow,
            start: Math.min(nodeRect.x, below.x),
          });
        }
      }
    }
  }

  // Check horizontal equal spacing (element between two others horizontally)
  for (let i = 0; i < otherRects.length; i++) {
    for (let j = 0; j < otherRects.length; j++) {
      if (i === j) continue;

      const rect1 = otherRects[i];
      const rect2 = otherRects[j];

      // Determine which is left and which is right
      const left = rect1.x < rect2.x ? rect1 : rect2;
      const right = rect1.x < rect2.x ? rect2 : rect1;

      // Check if current node is between them
      if (nodeRect.x > left.x + left.width && nodeRect.x + nodeRect.width < right.x) {
        // Calculate gaps
        const gapLeft = nodeRect.x - (left.x + left.width);
        const gapRight = right.x - (nodeRect.x + nodeRect.width);

        // If gaps are equal (within threshold), show spacing indicators
        if (Math.abs(gapLeft - gapRight) < threshold) {
          // Guide line for gap on left
          spacingLines.push({
            orientation: 'vertical',
            position: left.x + left.width + gapLeft / 2,
            type: 'spacing',
            length: gapLeft,
            start: Math.min(nodeRect.y, left.y),
          });

          // Guide line for gap on right
          spacingLines.push({
            orientation: 'vertical',
            position: nodeRect.x + nodeRect.width + gapRight / 2,
            type: 'spacing',
            length: gapRight,
            start: Math.min(nodeRect.y, right.y),
          });
        }
      }
    }
  }

  return spacingLines;
}

/**
 * Helper function to detect spacing patterns between elements
 * Used for maintaining equal gaps between multiple elements
 */
function detectSpacingPattern(
  nodeRect: { x: number; y: number; width: number; height: number },
  otherRects: Array<{ x: number; y: number; width: number; height: number }>,
  direction: 'horizontal' | 'vertical',
  threshold: number
): SpacingResult | null {
  if (otherRects.length < 2) return null; // Need at least 2 other elements for spacing

  // Sort elements based on direction
  const sorted = [...otherRects].sort((a, b) => {
    if (direction === 'horizontal') {
      return a.x - b.x; // Sort left to right
    }
    return a.y - b.y; // Sort top to bottom
  });

  // Calculate gaps between consecutive elements
  const gaps: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (direction === 'horizontal') {
      const gap = sorted[i + 1].x - (sorted[i].x + sorted[i].width);
      gaps.push(gap);
    } else {
      const gap = sorted[i + 1].y - (sorted[i].y + sorted[i].height);
      gaps.push(gap);
    }
  }

  // Check if there's a consistent gap pattern (all gaps are similar)
  if (gaps.length > 0) {
    const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    const isConsistent = gaps.every(gap => Math.abs(gap - avgGap) < threshold * 2);

    if (isConsistent && avgGap > 0) {
      // Try to maintain this gap when positioning the current element
      for (let i = 0; i < sorted.length; i++) {
        if (direction === 'horizontal') {
          // Check if placing element after this one maintains the gap
          const suggestedX = sorted[i].x + sorted[i].width + avgGap;
          if (Math.abs(nodeRect.x - suggestedX) < threshold) {
            return {
              snapPosition: suggestedX,
              snapLines: [{ orientation: 'vertical', position: suggestedX }],
            };
          }
          // Check if placing element before this one maintains the gap
          if (i === 0) {
            const suggestedX = sorted[i].x - nodeRect.width - avgGap;
            if (Math.abs(nodeRect.x - suggestedX) < threshold) {
              return {
                snapPosition: suggestedX,
                snapLines: [{ orientation: 'vertical', position: sorted[i].x - avgGap }],
              };
            }
          }
        } else {
          // Check if placing element after this one maintains the gap
          const suggestedY = sorted[i].y + sorted[i].height + avgGap;
          if (Math.abs(nodeRect.y - suggestedY) < threshold) {
            return {
              snapPosition: suggestedY,
              snapLines: [{ orientation: 'horizontal', position: suggestedY }],
            };
          }
          // Check if placing element before this one maintains the gap
          if (i === 0) {
            const suggestedY = sorted[i].y - nodeRect.height - avgGap;
            if (Math.abs(nodeRect.y - suggestedY) < threshold) {
              return {
                snapPosition: suggestedY,
                snapLines: [{ orientation: 'horizontal', position: sorted[i].y - avgGap }],
              };
            }
          }
        }
      }
    }
  }

  return null;
}

export function useSnapping({ 
  canvasWidth, 
  canvasHeight, 
  snapThreshold = 5,
  elementNodesRef,
  currentElementId,
}: UseSnappingProps) {
  const [activeSnapLines, setActiveSnapLines] = useState<SnapLine[]>([]);

  const calculateSnapPosition = useCallback(
    (node: Konva.Node): SnapResult => {
      const nodeRect = node.getClientRect({ relativeTo: node.getParent()! });
      
      // Calculate key positions of the current node being dragged
      const nodeLeft = nodeRect.x;
      const nodeRight = nodeRect.x + nodeRect.width;
      const nodeTop = nodeRect.y;
      const nodeBottom = nodeRect.y + nodeRect.height;
      const nodeCenterX = nodeRect.x + nodeRect.width / 2;
      const nodeCenterY = nodeRect.y + nodeRect.height / 2;

      // Canvas snap guides (boundaries and center)
      const canvasCenterX = canvasWidth / 2;
      const canvasCenterY = canvasHeight / 2;
      const canvasLeft = 0;
      const canvasRight = canvasWidth;
      const canvasTop = 0;
      const canvasBottom = canvasHeight;

      let snappedX = node.x();
      let snappedY = node.y();
      const snapLines: SnapLine[] = [];

      // ==========================================
      // 1. CANVAS BOUNDARY SNAPPING (X-axis)
      // ==========================================
      const verticalSnaps = [
        { guide: canvasLeft, nodePos: nodeLeft, offset: 0, label: 'Left edge → Canvas left' },
        { guide: canvasLeft, nodePos: nodeRight, offset: -nodeRect.width, label: 'Right edge → Canvas left' },
        { guide: canvasCenterX, nodePos: nodeLeft, offset: 0, label: 'Left edge → Canvas center' },
        { guide: canvasCenterX, nodePos: nodeCenterX, offset: -nodeRect.width / 2, label: 'Center → Canvas center' },
        { guide: canvasCenterX, nodePos: nodeRight, offset: -nodeRect.width, label: 'Right edge → Canvas center' },
        { guide: canvasRight, nodePos: nodeLeft, offset: 0, label: 'Left edge → Canvas right' },
        { guide: canvasRight, nodePos: nodeRight, offset: -nodeRect.width, label: 'Right edge → Canvas right' },
      ];

      // ==========================================
      // 2. ELEMENT-TO-ELEMENT SNAPPING (X-axis)
      // ==========================================
      if (elementNodesRef?.current) {
        Object.entries(elementNodesRef.current).forEach(([id, otherNode]) => {
          // Skip the current node being dragged and null nodes
          if (!otherNode || id === currentElementId) return;

          const otherRect = otherNode.getClientRect({ relativeTo: otherNode.getParent()! });
          const otherLeft = otherRect.x;
          const otherRight = otherRect.x + otherRect.width;
          const otherCenterX = otherRect.x + otherRect.width / 2;

          // Edge alignment snapping
          verticalSnaps.push(
            { guide: otherLeft, nodePos: nodeLeft, offset: 0, label: 'Left edge → Other left edge' },
            { guide: otherRight, nodePos: nodeRight, offset: -nodeRect.width, label: 'Right edge → Other right edge' },
            { guide: otherCenterX, nodePos: nodeCenterX, offset: -nodeRect.width / 2, label: 'Center → Other center' },
          );

          // Edge-to-edge snapping (adjacent positioning)
          verticalSnaps.push(
            { guide: otherRight, nodePos: nodeLeft, offset: 0, label: 'Left edge → Other right edge (adjacent)' },
            { guide: otherLeft, nodePos: nodeRight, offset: -nodeRect.width, label: 'Right edge → Other left edge (adjacent)' },
          );
        });
      }

      // Find best vertical snap
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

      // ==========================================
      // 1. CANVAS BOUNDARY SNAPPING (Y-axis)
      // ==========================================
      const horizontalSnaps = [
        { guide: canvasTop, nodePos: nodeTop, offset: 0, label: 'Top edge → Canvas top' },
        { guide: canvasTop, nodePos: nodeBottom, offset: -nodeRect.height, label: 'Bottom edge → Canvas top' },
        { guide: canvasCenterY, nodePos: nodeTop, offset: 0, label: 'Top edge → Canvas center' },
        { guide: canvasCenterY, nodePos: nodeCenterY, offset: -nodeRect.height / 2, label: 'Center → Canvas center' },
        { guide: canvasCenterY, nodePos: nodeBottom, offset: -nodeRect.height, label: 'Bottom edge → Canvas center' },
        { guide: canvasBottom, nodePos: nodeTop, offset: 0, label: 'Top edge → Canvas bottom' },
        { guide: canvasBottom, nodePos: nodeBottom, offset: -nodeRect.height, label: 'Bottom edge → Canvas bottom' },
      ];

      // ==========================================
      // 2. ELEMENT-TO-ELEMENT SNAPPING (Y-axis)
      // ==========================================
      if (elementNodesRef?.current) {
        Object.entries(elementNodesRef.current).forEach(([id, otherNode]) => {
          // Skip the current node being dragged and null nodes
          if (!otherNode || id === currentElementId) return;

          const otherRect = otherNode.getClientRect({ relativeTo: otherNode.getParent()! });
          const otherTop = otherRect.y;
          const otherBottom = otherRect.y + otherRect.height;
          const otherCenterY = otherRect.y + otherRect.height / 2;

          // Edge alignment snapping
          horizontalSnaps.push(
            { guide: otherTop, nodePos: nodeTop, offset: 0, label: 'Top edge → Other top edge' },
            { guide: otherBottom, nodePos: nodeBottom, offset: -nodeRect.height, label: 'Bottom edge → Other bottom edge' },
            { guide: otherCenterY, nodePos: nodeCenterY, offset: -nodeRect.height / 2, label: 'Center → Other center' },
          );

          // Edge-to-edge snapping (adjacent positioning)
          horizontalSnaps.push(
            { guide: otherBottom, nodePos: nodeTop, offset: 0, label: 'Top edge → Other bottom edge (adjacent)' },
            { guide: otherTop, nodePos: nodeBottom, offset: -nodeRect.height, label: 'Bottom edge → Other top edge (adjacent)' },
          );
        });
      }

      // Find best horizontal snap
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

      // ==========================================
      // 4. SPACING DISTRIBUTION SNAPPING
      // ==========================================
      // This feature detects equal spacing patterns between elements
      // and helps maintain consistent gaps when positioning elements
      if (elementNodesRef?.current) {
        const otherNodes = Object.entries(elementNodesRef.current)
          .filter(([id, otherNode]) => otherNode && id !== currentElementId)
          .map(([, otherNode]) => otherNode!.getClientRect({ relativeTo: otherNode!.getParent()! }));

        // Check for horizontal spacing patterns (elements aligned vertically)
        const horizontalSpacing = detectSpacingPattern(
          nodeRect,
          otherNodes,
          'horizontal',
          snapThreshold
        );
        if (horizontalSpacing) {
          snappedX = horizontalSpacing.snapPosition;
          snapLines.push(...horizontalSpacing.snapLines);
        }

        // Check for vertical spacing patterns (elements aligned horizontally)
        const verticalSpacing = detectSpacingPattern(
          nodeRect,
          otherNodes,
          'vertical',
          snapThreshold
        );
        if (verticalSpacing) {
          snappedY = verticalSpacing.snapPosition;
          snapLines.push(...verticalSpacing.snapLines);
        }

        // ==========================================
        // 5. EQUAL SPACING INDICATORS
        // ==========================================
        // Show visual guides when element has equal spacing between two others
        const equalSpacingLines = detectEqualSpacing(
          nodeRect,
          otherNodes,
          snapThreshold
        );
        if (equalSpacingLines.length > 0) {
          snapLines.push(...equalSpacingLines);
        }
      }

      return {
        x: snappedX,
        y: snappedY,
        snapLines,
      };
    },
    [canvasWidth, canvasHeight, snapThreshold, elementNodesRef, currentElementId]
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

