"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Rect, Transformer, Line } from 'react-konva'
import { useEditor } from '@/contexts/EditorContext'
import { useZoom } from '@/hooks/useZoom'
import { useSnapping } from '@/hooks/useSnapping'
import { useTextLayerEdit } from '@/hooks/useTextLayerEdit'
import Konva from 'konva'
import { Button } from '@/components/ui/button'
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import { FrameToolbar } from '../layers-toolbars/frame-toolbar/frame-toolbar'
import { TextToolbar } from '../layers-toolbars/text-toolbar/text-toolbar'
import { ImageToolbar } from '../layers-toolbars/image-toolbar/image-toolbar'
import { ShapeToolbar } from '../layers-toolbars/shape-toolbar/shape-toolbar'
import { IconToolbar } from '../layers-toolbars/icon-toolbar/icon-toolbar'
import { FrameNavigation } from '../frame-navigation/frame-navigation'
import { CanvasContextMenu } from './canvas-context-menu'
import type { CanvasElement, TextElement, ImageElement, ShapeElement, IconElement } from '@/types/editor'
import ImageElementComponent from './components/image-element'
import IconElementComponent from './components/icon-element'
import ShapeElementComponent from './components/shape-element'
import TextElementComponent from './components/text-element'



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
    selectedIds,
    setSelectedIds,
    elements,
    updateElement,
    getElementById,
    setStageRef,
    addElement,
    deleteElement,
    setMainFrameRef,
  } = useEditor()
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const mainFrameRef = useRef<Konva.Rect>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const elementNodeRefs = useRef<Record<string, Konva.Node | null>>({})
  const [isFrameHovered, setIsFrameHovered] = React.useState(false)
  const [hoveredElementId, setHoveredElementId] = React.useState<string | null>(null)
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)
  const [contextMenuElement, setContextMenuElement] = React.useState<string | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = React.useState<{ x: number; y: number } | null>(null)
  
  // Drag selection state
  const [selectionRect, setSelectionRect] = useState<{
    visible: boolean;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>({ visible: false, x1: 0, y1: 0, x2: 0, y2: 0 })
  const isSelecting = useRef(false)


  useEffect(() => {
    setMainFrameRef(mainFrameRef as React.RefObject<Konva.Rect>);
  }, [setMainFrameRef])

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
    elementNodesRef: elementNodeRefs,
    currentElementId: selectedIds[0] ?? undefined,
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

  const isFrameSelected = selectedIds[0] === 'main-frame'
  const selectedElement = selectedIds[0] ? getElementById(selectedIds[0]) : undefined

  const handleElementClick = (id: string, metaKey?: boolean, shiftKey?: boolean) => {
    
    const metaPressed = metaKey || shiftKey;
    const isAlreadySelected = selectedIds.includes(id);
    
    if (!metaPressed && !isAlreadySelected) {
      // If no key pressed and the node is not selected, select just one
      setSelectedIds([id]);
    } else if (metaPressed && isAlreadySelected) {
      // If we pressed keys and node was selected, remove it from selection
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else if (metaPressed && !isAlreadySelected) {
      // Add the node into selection
      setSelectedIds([...selectedIds, id]);
    }
  }
  
  // Handle drag selection start
  const handleSelectionStart = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Only start selection if clicking on stage or main-frame
    if (e.target !== stageRef.current && e.target !== mainFrameRef.current) {
      return;
    }
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    isSelecting.current = true;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    // Convert screen coordinates to canvas coordinates
    const transform = stage.getAbsoluteTransform().copy().invert();
    const canvasPos = transform.point(pos);
    
    setSelectionRect({
      visible: true,
      x1: canvasPos.x,
      y1: canvasPos.y,
      x2: canvasPos.x,
      y2: canvasPos.y,
    });
  };
  
  // Handle drag selection move
  const handleSelectionMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Do nothing if we didn't start selection
    if (!isSelecting.current) {
      return;
    }
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    // Convert screen coordinates to canvas coordinates
    const transform = stage.getAbsoluteTransform().copy().invert();
    const canvasPos = transform.point(pos);
    
    setSelectionRect({
      ...selectionRect,
      x2: canvasPos.x,
      y2: canvasPos.y,
    });
  };
  
  // Handle drag selection end
  const handleSelectionEnd = () => {
    // Do nothing if we didn't start selection
    if (!isSelecting.current) {
      return;
    }

    
    isSelecting.current = false;
    
    // Update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      setSelectionRect({
        ...selectionRect,
        visible: false,
      });
    });
    
    // Calculate selection box
    const x1 = Math.min(selectionRect.x1, selectionRect.x2);
    const y1 = Math.min(selectionRect.y1, selectionRect.y2);
    const x2 = Math.max(selectionRect.x1, selectionRect.x2);
    const y2 = Math.max(selectionRect.y1, selectionRect.y2);
    const width = x2 - x1;
    const height = y2 - y1;
    
    const selectionBox = { x: x1, y: y1, width, height };
    
    // Find all elements that intersect with selection box
    const selected = elements.filter(element => {
      const node = elementNodeRefs.current[element.id];
      if (!node) return false;
      
      const elementBox = node.getClientRect({ relativeTo: node.getParent()! });
      return Konva.Util.haveIntersection(selectionBox, elementBox);
    });
    
    setSelectedIds(selected.map(el => el.id));
  };

  // Handle duplicate element
  const handleDuplicateElement = useCallback(() => {
    if (!contextMenuElement) return;
    
    const element = getElementById(contextMenuElement);
    if (!element) return;

    // Create a duplicate with offset position
    const duplicateProps = {
      ...element,
      x: element.x + 20,
      y: element.y + 20,
    };

    // Remove the id from duplicateProps as addElement will generate a new one
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...propsWithoutId } = duplicateProps;
    
    const newId = addElement(element.type, propsWithoutId);
    setSelectedIds([newId]);
  }, [contextMenuElement, getElementById, addElement, setSelectedIds]);

  // Handle delete element
  const handleDeleteElement = useCallback(() => {
    if (!contextMenuElement) return;
    
    // Delete all selected elements if multiple are selected
    if (selectedIds.length > 1) {
      selectedIds.forEach(id => {
        if (id !== 'main-frame') {
          deleteElement(id);
        }
      });
    } else {
      deleteElement(contextMenuElement);
    }
    setSelectedIds([]);
  }, [contextMenuElement, selectedIds, deleteElement, setSelectedIds]);
  
  // Handle group elements (for now, just keeps them selected together)
  const handleGroupElements = useCallback(() => {
    // For now, grouping just means keeping the current selection
    // In a full implementation, this would create a Konva.Group
    // The elements are already visually grouped through the transformer
  }, []);

  // Handle closing context menu
  const handleCloseContextMenu = useCallback(() => {
    setContextMenuElement(null);
    setContextMenuPosition(null);
  }, []);

  // Handle context menu (right-click) on elements
  const handleElementContextMenu = useCallback((e: Konva.KonvaEventObject<PointerEvent>, elementId: string) => {
    e.evt.preventDefault();
    e.cancelBubble = true;
    
    // Get the mouse position relative to the viewport
    const stage = e.target.getStage();
    if (!stage) return;
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    // Use the pointer position from the event
    setContextMenuPosition({
      x: e.evt.clientX,
      y: e.evt.clientY,
    });
    
    setContextMenuElement(elementId);
    setSelectedIds([elementId]);
  }, [setSelectedIds]);

  const renderTextElement = (element: TextElement) => {
    return (
      <TextElementComponent
        key={element.id}
        element={element}
        elementNodeRefs={elementNodeRefs}
        containerRef={containerRef}
        calculateSnapPosition={calculateSnapPosition}
        showSnapLines={showSnapLines}
        hideSnapLines={hideSnapLines}
        handleElementClick={handleElementClick}
        updateElement={updateElement}
        hoveredElementId={hoveredElementId}
        setHoveredElementId={setHoveredElementId}
        selectedIds={selectedIds}
        onContextMenu={handleElementContextMenu}
        editingTextId={editingTextId}
        handleTextDoubleClick={handleTextDoubleClick}
      />
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
        hoveredElementId={hoveredElementId}
        setHoveredElementId={setHoveredElementId}
        selectedIds={selectedIds}
        onContextMenu={handleElementContextMenu}
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
        hoveredElementId={hoveredElementId}
        setHoveredElementId={setHoveredElementId}
        selectedIds={selectedIds}
        onContextMenu={handleElementContextMenu}
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
        hoveredElementId={hoveredElementId}
        setHoveredElementId={setHoveredElementId}
        selectedIds={selectedIds}
        onContextMenu={handleElementContextMenu}
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

  // Update transformer when selection changes
  useEffect(() => {

    const rafId = requestAnimationFrame(() => {
    if (selectedIds.length && transformerRef.current) {
      // Get the nodes from the refs, excluding main-frame
      const nodes = selectedIds
        .filter(id => id !== 'main-frame')
        .map(id => elementNodeRefs.current[id])
        .filter(node => node);

      
      transformerRef.current.nodes(nodes as Konva.Node[]);

      // nodes.forEach(node => {
      //   if (node) {
      //     node.getLayer()?.batchDraw();
      //   }
      // });
      // transformerRef.current.forceUpdate();

      console.log('we just updated the transformer');
      // transformerRef.current.getStage()?.batchDraw();
    } else if (transformerRef.current) {
      // Clear selection
      transformerRef.current.nodes([] as Konva.Node[]);
      // transformerRef.current.forceUpdate();
      // transformerRef.current.getStage()?.batchDraw();

    }
  })
  return () => {
    cancelAnimationFrame(rafId);
  }
  }, [selectedIds, editingTextId, elements])

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
    if(selectionRect.visible) return;
    setSelectedIds(['main-frame'])
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
    // If we are selecting with rect, do nothing
    if (selectionRect.visible) {
      return;
    }
    
    // If clicking on the stage itself (not the frame), clear selection
    if (e.target === stageRef.current) {
      setSelectedIds([]);
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
    <>
      <CanvasContextMenu
        elementId={contextMenuElement}
        selectedIds={selectedIds}
        position={contextMenuPosition}
        onDuplicate={handleDuplicateElement}
        onDelete={handleDeleteElement}
        onGroup={handleGroupElements}
        onClose={handleCloseContextMenu}
      />
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
        onMouseDown={handleSelectionStart}
        onMouseMove={handleSelectionMove}
        onMouseUp={handleSelectionEnd}
        onTouchStart={handleSelectionStart}
        onTouchMove={handleSelectionMove}
        onTouchEnd={handleSelectionEnd}
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
          
          {/* Hover Indicator - shows bounding box on hover */}
          {hoveredElementId && hoveredElementId !== selectedIds[0] && (() => {
            const node = elementNodeRefs.current[hoveredElementId]
            if (!node) return null
            
            const clientRect = node.getClientRect({ relativeTo: node.getParent()! })
            
            return (
              <Rect
                x={clientRect.x}
                y={clientRect.y}
                width={clientRect.width}
                height={clientRect.height}
                stroke="#3b82f6"
                strokeWidth={3}
                listening={false}
                dash={[]}
              />
            )
          })()}
          
          {/* Drag Selection Rectangle */}
          {selectionRect.visible && (() => {
            const x = Math.min(selectionRect.x1, selectionRect.x2);
            const y = Math.min(selectionRect.y1, selectionRect.y2);
            const width = Math.abs(selectionRect.x2 - selectionRect.x1);
            const height = Math.abs(selectionRect.y2 - selectionRect.y1);
            
            return (
              <Rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="rgba(59, 130, 246, 0.1)"
                stroke="#3b82f6"
                strokeWidth={2 / zoom}
                listening={false}
              />
            );
          })()}
          
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
          {activeSnapLines.map((line, index) => {
            // Different rendering for spacing indicators vs snap lines
            if (line.type === 'spacing' && line.length !== undefined && line.start !== undefined) {
              // Spacing indicator line - shorter line showing the gap between elements
              const lineLength = 80; // Fixed visual length for spacing indicators
              
              if (line.orientation === 'vertical') {
                return (
                  <Line
                    key={`snap-line-${index}`}
                    points={[
                      line.position,
                      line.start,
                      line.position,
                      line.start + lineLength
                    ]}
                    stroke="#ff00ff"
                    strokeWidth={1.5 / zoom}
                    listening={false}
                  />
                );
              } else {
                return (
                  <Line
                    key={`snap-line-${index}`}
                    points={[
                      line.start,
                      line.position,
                      line.start + lineLength,
                      line.position
                    ]}
                    stroke="#ff00ff"
                    strokeWidth={1.5 / zoom}
                    listening={false}
                  />
                );
              }
            }
            
            // Regular snap line - full canvas width/height
            return (
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
            );
          })}
        </Layer>
      </Stage>
    </div>
    </>
  )
}

export default Canvas
