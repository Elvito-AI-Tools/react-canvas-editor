import { SnapLine } from "@/hooks/useSnapping";
import { CanvasElement, TextElement } from "@/types/editor";
import Konva from "konva";
import { Label, Tag, Text as KonvaText } from "react-konva";

/**
 * TextElementComponent - Handles rendering of text elements
 */
interface TextElementComponentProps {
  element: TextElement
  elementNodeRefs: React.MutableRefObject<Record<string, Konva.Node | null>>
  containerRef: React.RefObject<HTMLDivElement | null>
  calculateSnapPosition: (node: Konva.Node) => { x: number; y: number; snapLines: SnapLine[] }
  showSnapLines: (lines: SnapLine[]) => void
  hideSnapLines: () => void
  handleElementClick: (id: string, metaKey?: boolean, shiftKey?: boolean) => void
  updateElement: (id: string, props: Partial<CanvasElement>, options?: { skipHistory?: boolean }) => void
  hoveredElementId: string | null
  setHoveredElementId: (id: string | null) => void
  selectedId: string | null
  selectedIds: string[]
  onContextMenu: (e: Konva.KonvaEventObject<PointerEvent>, elementId: string) => void
  editingTextId: string | null
  handleTextDoubleClick: (id: string) => void
}

const TextElementComponent = ({
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
  editingTextId,
  handleTextDoubleClick,
}: TextElementComponentProps) => {
  const fontStyleParts: string[] = []
  if (element.isBold) fontStyleParts.push('bold')
  if (element.isItalic) fontStyleParts.push('italic')
  if (fontStyleParts.length === 0) {
    fontStyleParts.push('normal')
  }

  const decorationParts: string[] = []
  if (element.isUnderline) decorationParts.push('underline')
  if (element.isStrikethrough) decorationParts.push('line-through')

  const isEditing = editingTextId === element.id

  return (
    <Label
      key={element.id}
      opacity={isEditing ? 0 : 1}
      listening={!isEditing}
      ref={(node) => {
        if (node) {
          elementNodeRefs.current[element.id] = node
        } else {
          delete elementNodeRefs.current[element.id]
        }
      }}
      x={element.x}
      y={element.y}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      draggable={element.draggable && !isEditing}
      rotation={element.rotation}
      name={element.id}
      onClick={(e) => {
        e.cancelBubble = true
        handleElementClick(element.id, e.evt.metaKey || e.evt.ctrlKey, e.evt.shiftKey)
      }}
      onTap={(e) => {
        e.cancelBubble = true
        handleElementClick(element.id, false, false)
      }}
      onDblClick={(e) => {
        e.cancelBubble = true
        handleTextDoubleClick(element.id)
      }}
      onDblTap={(e) => {
        e.cancelBubble = true
        handleTextDoubleClick(element.id)
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
        const node = e.target as unknown as Konva.Label
        hideSnapLines()
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        const newWidth = Math.max(50, element.width * scaleX)
        const newFontSize = Math.max(6, element.fontSize * scaleY)
        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.round(newWidth),
          fontSize: Math.round(newFontSize),
          scaleX: 1,
          scaleY: 1,
        })
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
    >
      <Tag
        fill={element.backgroundColor ?? 'transparent'}
        cornerRadius={6}
        stroke="transparent"
        strokeWidth={0}
      />
      <KonvaText
        text={element.text}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        fontStyle={fontStyleParts.join(' ')}
        fill={element.fill}
        align={element.align}
        padding={element.padding}
        textDecoration={decorationParts.join(' ')}
        width={element.width}
        wrap="word"
      />
    </Label>
  )
}

export default TextElementComponent;

