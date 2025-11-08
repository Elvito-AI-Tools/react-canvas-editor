"use client"

import React, { useMemo } from 'react'
import { useEditor } from '@/contexts/EditorContext'
import { Button } from '@/components/ui/button'
import { Maximize2 } from 'lucide-react'
import type { ImageElement } from '@/types/editor'
import { LayeringDropdown } from '../layering-dropdown/layering-dropdown'

export const ImageToolbar = () => {
  const { selectedIds, getElementById, updateElement, canvasSize } = useEditor()

  const imageElement = useMemo(() => {
    if (!selectedIds[0]) return null
    const element = getElementById(selectedIds[0])
    if (!element || element.type !== 'image') return null
    return element as ImageElement
  }, [getElementById, selectedIds])

  if (!imageElement) return null

  const handleFitToFrame = () => {
    // Update the image to fit the entire canvas
    updateElement(imageElement.id, {
      x: 0,
      y: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    })
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-background border border-border rounded-lg shadow-lg px-3 py-2">
      <div className="flex items-center gap-1">
        <Button
          onClick={handleFitToFrame}
          size="sm"
          variant="ghost"
          className="h-8 px-3 text-xs font-medium"
          title="Fit to Frame"
        >
          <Maximize2 className="w-4 h-4 mr-1.5" />
          Fit to Frame
        </Button>
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-border" />

      {/* Image info */}
      <div className="text-xs text-muted-foreground">
        {Math.round(imageElement.width)} × {Math.round(imageElement.height)} px
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-border" />

      {/* Layering */}
      <LayeringDropdown elementId={imageElement.id} />
    </div>
  )
}

