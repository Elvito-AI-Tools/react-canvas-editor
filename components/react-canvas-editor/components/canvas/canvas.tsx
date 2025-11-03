"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Rect, Label, Tag, Text as KonvaText, Transformer, Line, Image as KonvaImage, Shape } from 'react-konva'
import { useEditor } from '@/contexts/EditorContext'
import { useZoom } from '@/hooks/useZoom'
import { useSnapping, type SnapLine } from '@/hooks/useSnapping'
import { useTextLayerEdit } from '@/hooks/useTextLayerEdit'
import type Konva from 'konva'
import { Button } from '@/components/ui/button'
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import { FrameToolbar } from '../frame-toolbar/frame-toolbar'
import { TextToolbar } from '../text-toolbar/text-toolbar'
import { ImageToolbar } from '../image-toolbar/image-toolbar'
import { ShapeToolbar } from '../shape-toolbar/shape-toolbar'
import { IconToolbar } from '../icon-toolbar/icon-toolbar'
import { FrameNavigation } from '../frame-navigation/frame-navigation'
import type { CanvasElement, TextElement, ImageElement, ShapeElement, IconElement } from '@/types/editor'
import useImage from 'use-image'
import { SHAPE_DEFINITIONS } from '@/lib/shapes'
import { iconToDataURL } from '@/lib/icons'

/**
 * ImageElementComponent - Handles loading and rendering of image elements
 */
interface ImageElementComponentProps {
  element: ImageElement
  elementNodeRefs: React.MutableRefObject<Record<string, Konva.Node | null>>
  containerRef: React.RefObject<HTMLDivElement | null>
  calculateSnapPosition: (node: Konva.Node) => { x: number; y: number; snapLines: SnapLine[] }
  showSnapLines: (lines: SnapLine[]) => void
  hideSnapLines: () => void
  handleElementClick: (id: string) => void
  updateElement: (id: string, props: Partial<CanvasElement>) => void
}

const ImageElementComponent = ({ 
  element, 
  elementNodeRefs, 
  containerRef,
  calculateSnapPosition,
  showSnapLines,
  hideSnapLines,
  handleElementClick,
  updateElement
}: ImageElementComponentProps) => {
  const [image] = useImage(element.src, 'anonymous')

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
      width={element.width}
      height={element.height}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      draggable={element.draggable}
      name={element.id}
      onClick={(e) => {
        e.cancelBubble = true
        handleElementClick(element.id)
      }}
      onTap={(e) => {
        e.cancelBubble = true
        handleElementClick(element.id)
      }}
      onDragStart={() => handleElementClick(element.id)}
      onDragMove={(e) => {
        const node = e.target
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
        const snapResult = calculateSnapPosition(node)
        showSnapLines(snapResult.snapLines)
      }}
      onTransformEnd={(e) => {
        const node = e.target as Konva.Image
        hideSnapLines()
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        
        // Update element with new dimensions
        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
          width: Math.max(5, element.width * scaleX),
          height: Math.max(5, element.height * scaleY),
          rotation: node.rotation(),
        })
        
        // Reset scale
        node.scaleX(1)
        node.scaleY(1)
      }}
      onMouseEnter={() => {
        if (containerRef.current) {
          containerRef.current.style.cursor = element.draggable ? 'move' : 'default'
        }
      }}
      onMouseLeave={() => {
        if (containerRef.current) {
          containerRef.current.style.cursor = 'default'
        }
      }}
    />
  )
}

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
  handleElementClick: (id: string) => void
  updateElement: (id: string, props: Partial<CanvasElement>) => void
}

const IconElementComponent = ({ 
  element, 
  elementNodeRefs, 
  containerRef,
  calculateSnapPosition,
  showSnapLines,
  hideSnapLines,
  handleElementClick,
  updateElement
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
        handleElementClick(element.id)
      }}
      onTap={(e) => {
        e.cancelBubble = true
        handleElementClick(element.id)
      }}
      onDragStart={() => handleElementClick(element.id)}
      onDragMove={(e) => {
        const node = e.target
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
        if (containerRef.current) {
          containerRef.current.style.cursor = element.draggable ? 'move' : 'default'
        }
      }}
      onMouseLeave={() => {
        if (containerRef.current) {
          containerRef.current.style.cursor = 'default'
        }
      }}
    />
  )
}

/**
 * ShapeElementComponent - Handles rendering of shape elements
 */
interface ShapeElementComponentProps {
  element: ShapeElement
  elementNodeRefs: React.MutableRefObject<Record<string, Konva.Node | null>>
  containerRef: React.RefObject<HTMLDivElement | null>
  calculateSnapPosition: (node: Konva.Node) => { x: number; y: number; snapLines: SnapLine[] }
  showSnapLines: (lines: SnapLine[]) => void
  hideSnapLines: () => void
  handleElementClick: (id: string) => void
  updateElement: (id: string, props: Partial<CanvasElement>) => void
}

const ShapeElementComponent = ({
  element,
  elementNodeRefs,
  containerRef,
  calculateSnapPosition,
  showSnapLines,
  hideSnapLines,
  handleElementClick,
  updateElement
}: ShapeElementComponentProps) => {
  const shapeDefinition = SHAPE_DEFINITIONS[element.shapeType]

  return (
    <Shape
      ref={(node) => {
        if (node) {
          elementNodeRefs.current[element.id] = node
        } else {
          delete elementNodeRefs.current[element.id]
        }
      }}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      draggable={element.draggable}
      name={element.id}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      sceneFunc={(context, shape) => {
        const width = shape.width()
        const height = shape.height()
        
        // Get the native canvas context
        const ctx = context as unknown as CanvasRenderingContext2D
        
        // Call the shape's draw function
        shapeDefinition.drawFunc(ctx, width, height)
        
        // Important: fill and stroke the shape
        context.fillStrokeShape(shape)
      }}
      onClick={(e) => {
        e.cancelBubble = true
        handleElementClick(element.id)
      }}
      onTap={(e) => {
        e.cancelBubble = true
        handleElementClick(element.id)
      }}
      onDragStart={() => handleElementClick(element.id)}
      onDragMove={(e) => {
        const node = e.target
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
        const snapResult = calculateSnapPosition(node)
        showSnapLines(snapResult.snapLines)
      }}
      onTransformEnd={(e) => {
        const node = e.target as Konva.Shape
        hideSnapLines()
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        
        // Update element with new dimensions
        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
          width: Math.max(10, element.width * scaleX),
          height: Math.max(10, element.height * scaleY),
          rotation: node.rotation(),
          scaleX: 1,
          scaleY: 1,
        })
        
        // Reset scale
        node.scaleX(1)
        node.scaleY(1)
      }}
      onMouseEnter={() => {
        if (containerRef.current) {
          containerRef.current.style.cursor = element.draggable ? 'move' : 'default'
        }
      }}
      onMouseLeave={() => {
        if (containerRef.current) {
          containerRef.current.style.cursor = 'default'
        }
      }}
    />
  )
}

/**
 * Canvas component renders the main Konva Stage that fills the entire container
 * The main frame is centered and auto-zoomed to fit with padding
 * Frame is selectable and will contain all user-added elements
 */
const Canvas = () => {
  const {
    canvasSize,
    frameBgColor,
    frameBgImage,
    selectedId,
    setSelectedId,
    elements,
    updateElement,
    getElementById,
    setStageRef,
  } = useEditor()
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const mainFrameRef = useRef<Konva.Rect>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const elementNodeRefs = useRef<Record<string, Konva.Node | null>>({})
  const [isFrameHovered, setIsFrameHovered] = React.useState(false)
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)

  // Register stage ref with context for export functionality
  useEffect(() => {
    setStageRef(stageRef)
  }, [setStageRef])

  // Load background image when frameBgImage changes
  useEffect(() => {
    if (frameBgImage) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = frameBgImage
      img.onload = () => {
        setBgImage(img)
      }
    } else {
      setBgImage(null)
    }
  }, [frameBgImage])
  
  // Use the zoom hook to manage all zoom-related logic
  const { zoom, position, dimensions, zoomIn, zoomOut, resetZoom } = useZoom({
    containerRef,
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    padding: 50,
  })

  // Use the snapping hook for smart guides
  const { calculateSnapPosition, activeSnapLines, showSnapLines, hideSnapLines } = useSnapping({
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    snapThreshold: 5,
  })

  // Use the text layer edit hook
  const {
    editingTextId,
    textareaRef,
    handleTextDoubleClick,
    handleTextEdit,
    handleTextEditComplete,
    getTextareaStyle,
  } = useTextLayerEdit({
    getElementById,
    updateElement,
    zoom,
    position,
    stageRef,
    elementNodeRefs,
  })

  const isFrameSelected = selectedId === 'main-frame'
  const selectedElement = selectedId ? getElementById(selectedId) : undefined

  const handleElementClick = (id: string) => {
    setSelectedId(id)
  }

  const renderTextElement = (element: TextElement) => {
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
          handleElementClick(element.id)
        }}
        onTap={(e) => {
          e.cancelBubble = true
          handleElementClick(element.id)
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
          if (containerRef.current) {
            containerRef.current.style.cursor = element.draggable ? 'move' : 'default'
          }
        }}
        onMouseLeave={() => {
          if (containerRef.current) {
            containerRef.current.style.cursor = 'default'
          }
        }}
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

  const renderImageElement = (element: ImageElement) => {
    return (
      <ImageElementComponent
        key={element.id}
        element={element}
        elementNodeRefs={elementNodeRefs}
        containerRef={containerRef}
        calculateSnapPosition={calculateSnapPosition}
        showSnapLines={showSnapLines}
        hideSnapLines={hideSnapLines}
        handleElementClick={handleElementClick}
        updateElement={updateElement}
      />
    )
  }

  const renderShapeElement = (element: ShapeElement) => {
    return (
      <ShapeElementComponent
        key={element.id}
        element={element}
        elementNodeRefs={elementNodeRefs}
        containerRef={containerRef}
        calculateSnapPosition={calculateSnapPosition}
        showSnapLines={showSnapLines}
        hideSnapLines={hideSnapLines}
        handleElementClick={handleElementClick}
        updateElement={updateElement}
      />
    )
  }

  const renderIconElement = (element: IconElement) => {
    return (
      <IconElementComponent
        key={element.id}
        element={element}
        elementNodeRefs={elementNodeRefs}
        containerRef={containerRef}
        calculateSnapPosition={calculateSnapPosition}
        showSnapLines={showSnapLines}
        hideSnapLines={hideSnapLines}
        handleElementClick={handleElementClick}
        updateElement={updateElement}
      />
    )
  }

  const renderElement = (element: CanvasElement) => {
    switch (element.type) {
      case 'text':
        return renderTextElement(element)
      case 'image':
        return renderImageElement(element)
      case 'shape':
        return renderShapeElement(element)
      case 'icon':
        return renderIconElement(element)
      default:
        return null
    }
  }

  useEffect(() => {
    const transformer = transformerRef.current
    if (!transformer) {
      return
    }

    const rafId = requestAnimationFrame(() => {
      // Show transformer for selected elements (including when editing text)
      if (selectedId && selectedId !== 'main-frame') {
        const selectedNode = elementNodeRefs.current[selectedId]
        if (selectedNode && selectedNode.getStage()) {
          transformer.nodes([selectedNode as Konva.Node])
          transformer.forceUpdate?.()
          selectedNode.getLayer()?.batchDraw()
          transformer.getLayer()?.batchDraw()
          return
        }
      }

      if (transformer.nodes().length > 0) {
        transformer.nodes([])
        transformer.getLayer()?.batchDraw()
      }
    })

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [selectedId, elements, editingTextId])

  const anchorShapeFunc = useCallback<NonNullable<Konva.TransformerConfig['anchorShapeFunc']>>((ctx: CanvasRenderingContext2D, shape: Konva.Shape) => {
    const transformer = transformerRef.current
    if (!transformer) return

    const anchorName = shape.name?.() ?? ''
    const size = transformer.anchorSize()

    ctx.save()

    if (anchorName === 'rotater') {
      const radius = size * 0.75
      shape.width(radius * 2)
      shape.height(radius * 2)
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#3b82f6'
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.arc(0, 0, radius - 4, Math.PI * 0.25, Math.PI * 1.5, false)
      ctx.stroke()

      ctx.beginPath()
      const arrowAngle = Math.PI * 0.25
      const arrowRadius = radius - 4
      const ax = Math.cos(arrowAngle) * arrowRadius
      const ay = Math.sin(arrowAngle) * arrowRadius
      ctx.moveTo(ax, ay)
      ctx.lineTo(ax - 4, ay)
      ctx.lineTo(ax, ay - 4)
      ctx.closePath()
      ctx.fillStyle = '#3b82f6'
      ctx.fill()
    } else {
      shape.width(size)
      shape.height(size)
      ctx.beginPath()
      ctx.rect(-size / 2, -size / 2, size, size)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#3b82f6'
      ctx.stroke()
    }

    ctx.restore()
  }, [])

  // Handle frame click
  const handleFrameClick = () => {
    setSelectedId('main-frame')
  }

  // Handle frame hover
  const handleFrameMouseEnter = () => {
    setIsFrameHovered(true)
    // Change cursor to pointer on hover
    if (containerRef.current) {
      containerRef.current.style.cursor = 'pointer'
    }
  }

  const handleFrameMouseLeave = () => {
    setIsFrameHovered(false)
    // Reset cursor
    if (containerRef.current) {
      containerRef.current.style.cursor = 'default'
    }
  }

  // Handle stage click (deselect when clicking empty space)
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // If clicking on the stage itself (not the frame), clear selection
    if (e.target === stageRef.current) {
      setSelectedId(null)
    }
  }

  // Determine stroke color and width based on state
  const getStrokeColor = () => {
    if (isFrameSelected) return "#3b82f6" // Blue when selected
    if (isFrameHovered) return "#3b82f6" // Slate when hovered
    return "#e4e4e7" // Default gray
  }

  const getStrokeWidth = () => {
    if (isFrameSelected) return 3 // Thicker when selected
    if (isFrameHovered) return 2 // Medium when hovered
    return 1 // Default
  }

  return (
    <div ref={containerRef} className="flex-1 w-full h-full bg-muted relative overflow-hidden">
      {/* Frame Navigation - always visible */}
      <FrameNavigation />
      
      {/* Frame Toolbar - shown when frame is selected */}
      {isFrameSelected && <FrameToolbar />}
      {selectedElement?.type === 'text' && <TextToolbar />}
      {selectedElement?.type === 'image' && <ImageToolbar />}
      {selectedElement?.type === 'shape' && <ShapeToolbar />}
      {selectedElement?.type === 'icon' && <IconToolbar />}

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
        <Button
          onClick={zoomIn}
          size="icon"
          variant="outline"
          className="bg-background border-border hover:bg-accent shadow-lg"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          onClick={zoomOut}
          size="icon"
          variant="outline"
          className="bg-background border-border hover:bg-accent shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          onClick={resetZoom}
          size="icon"
          variant="outline"
          className="bg-background border-border hover:bg-accent shadow-lg"
          title="Reset Zoom (Fit)"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <div className="bg-background border border-border text-foreground text-xs px-2 py-1 rounded text-center shadow-lg">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Text editing textarea */}
      {editingTextId && (() => {
        const editingElement = getElementById(editingTextId)
        if (editingElement && editingElement.type === 'text') {
          return (
            <textarea
              ref={textareaRef}
              value={editingElement.text}
              onChange={(e) => handleTextEdit(e.target.value)}
              onBlur={handleTextEditComplete}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleTextEditComplete()
                }
              }}
              style={getTextareaStyle(editingElement)}
            />
          )
        }
        return null
      })()}

      {/* Konva Stage fills entire container */}
      <Stage 
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={zoom}
        scaleY={zoom}
        x={position.x}
        y={position.y}
        onClick={handleStageClick}
      >
        {/* Background Layer - contains the persistent main frame */}
        <Layer>
          {/* Main Frame - this is the canvas area where elements will be added */}
          {/* Frame is selectable but cannot be moved or deleted */}
          <Rect
            ref={mainFrameRef}
            x={0}
            y={0}
            width={canvasSize.width}
            height={canvasSize.height}
            fill={bgImage ? undefined : frameBgColor}
            fillPatternImage={bgImage || undefined}
            fillPatternScaleX={bgImage ? (() => {
              // Object-cover: scale to fill canvas while maintaining aspect ratio
              const scaleX = canvasSize.width / bgImage.width
              const scaleY = canvasSize.height / bgImage.height
              return Math.max(scaleX, scaleY) // Use larger scale to cover
            })() : 1}
            fillPatternScaleY={bgImage ? (() => {
              // Object-cover: scale to fill canvas while maintaining aspect ratio
              const scaleX = canvasSize.width / bgImage.width
              const scaleY = canvasSize.height / bgImage.height
              return Math.max(scaleX, scaleY) // Use larger scale to cover
            })() : 1}
            fillPatternOffsetX={bgImage ? (() => {
              // Center the image if it overflows
              const scaleX = canvasSize.width / bgImage.width
              const scaleY = canvasSize.height / bgImage.height
              const scale = Math.max(scaleX, scaleY)
              const scaledWidth = bgImage.width * scale
              return (scaledWidth - canvasSize.width) / (2 * scale)
            })() : 0}
            fillPatternOffsetY={bgImage ? (() => {
              // Center the image if it overflows
              const scaleX = canvasSize.width / bgImage.width
              const scaleY = canvasSize.height / bgImage.height
              const scale = Math.max(scaleX, scaleY)
              const scaledHeight = bgImage.height * scale
              return (scaledHeight - canvasSize.height) / (2 * scale)
            })() : 0}
            stroke={getStrokeColor()}
            strokeWidth={getStrokeWidth()}
            shadowColor="#000000"
            shadowBlur={10}
            shadowOpacity={0.1}
            shadowOffsetX={0}
            shadowOffsetY={2}
            listening={true} // Make it interactive
            onClick={handleFrameClick}
            onMouseEnter={handleFrameMouseEnter}
            onMouseLeave={handleFrameMouseLeave}
            name="main-frame" // Identifier for the main frame
          />
        </Layer>

        {/* Elements Layer - will contain user-added shapes, text, images, etc. */}
        <Layer name="elements-layer">
          {elements.map((element) => renderElement(element))}
          <Transformer
            ref={transformerRef}
            rotateEnabled={!editingTextId}
            enabledAnchors={editingTextId ? [] : ['top-left','top-center','top-right','middle-right','bottom-right','bottom-center','bottom-left','middle-left']}
            anchorStroke="#3b82f6"
            anchorFill="#ffffff"
            anchorStrokeWidth={2}
            anchorCornerRadius={2}
            anchorSize={12}
            borderStroke="#3b82f6"
            borderStrokeWidth={2}
            rotateAnchorOffset={48}
            anchorShapeFunc={anchorShapeFunc}
          />
        </Layer>

        {/* Snap Guide Lines Layer */}
        <Layer name="snap-guides-layer" listening={false}>
          {activeSnapLines.map((line, index) => (
            <Line
              key={`snap-line-${index}`}
              points={
                line.orientation === 'vertical'
                  ? [line.position, 0, line.position, canvasSize.height]
                  : [0, line.position, canvasSize.width, line.position]
              }
              stroke="#ff00ff"
              strokeWidth={1 / zoom}
              dash={[4 / zoom, 4 / zoom]}
              listening={false}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default Canvas
