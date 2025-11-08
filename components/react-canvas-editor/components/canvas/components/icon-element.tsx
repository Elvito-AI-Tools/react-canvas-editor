import { SnapLine } from "@/hooks/useSnapping";
import { CanvasElement, IconElement } from "@/types/editor";
import Konva from "konva";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { iconToDataURL } from "@/lib/icons";
import React from "react";

/**
 * IconElementComponent - Handles rendering of icon elements
 */
interface IconElementComponentProps {
  element: IconElement
  elementNodeRefs: React.MutableRefObject<Record<string, Konva.Node | null>>
  containerRef: React.RefObject<HTMLDivElement | null>
  calculateSnapPosition: (node: Konva.Node) => { x: number; y: number; snapLines: SnapLine[] }
  showSnapLines: (lines: SnapLine[]) => void
  hideSnapLines: () => void
  handleElementClick: (id: string, metaKey?: boolean, shiftKey?: boolean) => void
  updateElement: (id: string, props: Partial<CanvasElement>, options?: { skipHistory?: boolean }) => void
  hoveredElementId: string | null
  setHoveredElementId: (id: string | null) => void
  selectedIds: string[]
  onContextMenu: (e: Konva.KonvaEventObject<PointerEvent>, elementId: string) => void
}

const IconElementComponent = ({ 
  element, 
  elementNodeRefs, 
  containerRef,
  calculateSnapPosition,
  showSnapLines,
  hideSnapLines,
  handleElementClick,
  updateElement,
  setHoveredElementId,
  selectedIds,
  onContextMenu,
}: IconElementComponentProps) => {
  // Convert icon to data URL
  const dataUrl = React.useMemo(() => {
    return iconToDataURL(element.iconComponent, element.color, 512)
  }, [element.iconComponent, element.color])

  const [image] = useImage(dataUrl)

  return (
    <KonvaImage
      ref={(node) => {
        if (node) {
          elementNodeRefs.current[element.id] = node
        } else {
          delete elementNodeRefs.current[element.id]
        }
      }}
      image={image}
      x={element.x}
      y={element.y}
      width={element.size}
      height={element.size}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      draggable={element.draggable}
      name={element.id}
      onClick={(e) => {
        e.cancelBubble = true
        handleElementClick(element.id, e.evt.metaKey || e.evt.ctrlKey, e.evt.shiftKey)
      }}
      onTap={(e) => {
        e.cancelBubble = true
        handleElementClick(element.id, false, false)
      }}
      onDragStart={() => handleElementClick(element.id)}
      onDragMove={(e) => {
        const node = e.target
        // Skip individual snapping when part of multi-selection
        if (selectedIds.length > 1) {
          return
        }
        const snapResult = calculateSnapPosition(node)
        node.x(snapResult.x)
        node.y(snapResult.y)
        showSnapLines(snapResult.snapLines)
      }}
      onDragEnd={(e) => {
        const node = e.target
        hideSnapLines()
        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
        })
      }}
      onTransform={(e) => {
        const node = e.target
        // Skip individual snapping when part of multi-selection
        if (selectedIds.length > 1) {
          return
        }
        const snapResult = calculateSnapPosition(node)
        showSnapLines(snapResult.snapLines)
      }}
      onTransformEnd={(e) => {
        const node = e.target as Konva.Image
        hideSnapLines()
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        
        // Update element with new size (maintain aspect ratio)
        const avgScale = (scaleX + scaleY) / 2
        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
          size: Math.max(20, element.size * avgScale),
          rotation: node.rotation(),
          scaleX: 1,
          scaleY: 1,
        })
        
        // Reset scale
        node.scaleX(1)
        node.scaleY(1)
      }}
      onMouseEnter={() => {
        setHoveredElementId(element.id)
        if (containerRef.current) {
          containerRef.current.style.cursor = element.draggable ? 'move' : 'default'
        }
      }}
      onMouseLeave={() => {
        setHoveredElementId(null)
        if (containerRef.current) {
          containerRef.current.style.cursor = 'default'
        }
      }}
      onContextMenu={(e) => onContextMenu(e, element.id)}
    />
  )
}

export default IconElementComponent;