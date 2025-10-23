"use client"

import React, { useRef } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import { useEditor } from '@/contexts/EditorContext'
import { useZoom } from '@/hooks/useZoom'
import type Konva from 'konva'
import { Button } from '@/components/ui/button'
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react'

/**
 * Canvas component renders the main Konva Stage that fills the entire container
 * The main frame is centered and auto-zoomed to fit with padding
 * Frame is non-deletable and will contain all user-added elements
 */
const Canvas = () => {
  const { canvasSize } = useEditor()
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const mainFrameRef = useRef<Konva.Rect>(null)
  
  // Use the zoom hook to manage all zoom-related logic
  const { zoom, position, dimensions, zoomIn, zoomOut, resetZoom } = useZoom({
    containerRef,
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    padding: 50,
  })

  return (
    <div ref={containerRef} className="flex-1 w-full h-full bg-muted relative overflow-hidden">
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
      >
        {/* Background Layer - contains the persistent main frame */}
        <Layer>
          {/* Main Frame - this is the canvas area where elements will be added */}
          {/* This frame cannot be selected, moved, or deleted */}
          <Rect
            ref={mainFrameRef}
            x={0}
            y={0}
            width={canvasSize.width}
            height={canvasSize.height}
            fill="#ffffff"
            stroke="#e4e4e7"
            strokeWidth={1}
            shadowColor="#000000"
            shadowBlur={10}
            shadowOpacity={0.1}
            shadowOffsetX={0}
            shadowOffsetY={2}
            listening={false} // Make it non-interactive
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
