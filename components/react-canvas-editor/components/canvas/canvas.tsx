"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import { useEditor } from '@/contexts/EditorContext'
import { useZoom } from '@/hooks/useZoom'
import type Konva from 'konva'
import { Button } from '@/components/ui/button'
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import { FrameToolbar } from '../frame-toolbar/frame-toolbar'

/**
 * Canvas component renders the main Konva Stage that fills the entire container
 * The main frame is centered and auto-zoomed to fit with padding
 * Frame is selectable and will contain all user-added elements
 */
const Canvas = () => {
  const { canvasSize, frameBgColor, frameBgImage, selectedId, setSelectedId } = useEditor()
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const mainFrameRef = useRef<Konva.Rect>(null)
  const [isFrameHovered, setIsFrameHovered] = React.useState(false)
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)

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

  const isFrameSelected = selectedId === 'main-frame'

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
      {/* Frame Toolbar - shown when frame is selected */}
      {isFrameSelected && <FrameToolbar />}

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
            fillPatternScaleX={bgImage ? canvasSize.width / bgImage.width : 1}
            fillPatternScaleY={bgImage ? canvasSize.height / bgImage.height : 1}
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
          {/* Dynamic elements will be rendered here later */}
        </Layer>
      </Stage>
    </div>
  )
}

export default Canvas
