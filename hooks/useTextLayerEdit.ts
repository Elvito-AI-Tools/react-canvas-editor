import { useState, useRef, useCallback } from 'react'
import type Konva from 'konva'
import type { TextElement, CanvasElement } from '@/types/editor'

interface UseTextLayerEditProps {
  getElementById: (id: string) => CanvasElement | undefined
  updateElement: (id: string, props: Partial<CanvasElement>, options?: { skipHistory?: boolean }) => void
  zoom: number
  position: { x: number; y: number }
  stageRef: React.RefObject<Konva.Stage | null>
  elementNodeRefs: React.MutableRefObject<Record<string, Konva.Node | null>>
}

export const useTextLayerEdit = ({
  getElementById,
  updateElement,
  zoom,
  position,
  stageRef,
  elementNodeRefs,
}: UseTextLayerEditProps) => {
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [])

  const handleTextDoubleClick = useCallback((id: string) => {
    const element = getElementById(id)
    if (element && element.type === 'text') {
      setEditingTextId(id)
      // Focus the textarea after a small delay to ensure it's rendered
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          // Move cursor to end
          const length = textareaRef.current.value.length
          textareaRef.current.setSelectionRange(length, length)
          // Auto-resize the textarea
          autoResizeTextarea()
        }
      }, 0)
    }
  }, [getElementById, autoResizeTextarea])

  const handleTextEdit = useCallback((newText: string) => {
    if (editingTextId) {
      updateElement(editingTextId, { text: newText })
      // Auto-resize after text change
      setTimeout(() => autoResizeTextarea(), 0)
    }
  }, [editingTextId, updateElement, autoResizeTextarea])

  const handleTextEditComplete = useCallback(() => {
    setEditingTextId(null)
  }, [])

  const getTextareaStyle = useCallback((element: TextElement): React.CSSProperties => {
    const node = elementNodeRefs.current[element.id] as Konva.Label | null
    if (!node) return { display: 'none' }

    // Get the text node bounds
    const textNode = node.findOne('Text') as Konva.Text | null
    if (!textNode) return { display: 'none' }

    // Get the stage to convert coordinates
    const stage = stageRef.current
    if (!stage) return { display: 'none' }

    // Calculate position in screen coordinates
    // The element's x, y are in canvas coordinates
    const canvasX = element.x
    const canvasY = element.y

    // Convert to screen coordinates using stage transformation
    const screenX = canvasX * zoom + position.x
    const screenY = canvasY * zoom + position.y

    // Get text width (fixed width for word wrapping)
    const textWidth = textNode.width()
    const textHeight = textNode.height()

    const fontWeight = element.isBold ? 'bold' : 'normal'
    const fontStyle = element.isItalic ? 'italic' : 'normal'

    const decorationParts: string[] = []
    if (element.isUnderline) decorationParts.push('underline')
    if (element.isStrikethrough) decorationParts.push('line-through')

    return {
      position: 'absolute',
      left: `${screenX}px`,
      top: `${screenY}px`,
      width: `${textWidth * element.scaleX * zoom}px`,
      height: 'auto',
      minHeight: `${textHeight * element.scaleY * zoom}px`,
      fontSize: `${element.fontSize * zoom}px`,
      fontFamily: element.fontFamily,
      fontWeight,
      fontStyle,
      textDecoration: decorationParts.join(' '),
      color: element.fill,
      backgroundColor: element.backgroundColor || 'transparent',
      padding: `${element.padding * zoom}px`,
      border: 'none',
      outline: 'none',
      resize: 'none',
      overflow: 'hidden',
      lineHeight: '1.2',
      textAlign: element.align,
      transformOrigin: 'top left',
      transform: `rotate(${element.rotation}deg)`,
      zIndex: 1000,
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      boxSizing: 'border-box',
    }
  }, [elementNodeRefs, stageRef, zoom, position])

  return {
    editingTextId,
    textareaRef,
    handleTextDoubleClick,
    handleTextEdit,
    handleTextEditComplete,
    getTextareaStyle,
  }
}

