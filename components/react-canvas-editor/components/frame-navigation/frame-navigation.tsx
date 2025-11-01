"use client"

import React from 'react'
import { useEditor } from '@/contexts/EditorContext'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus, Copy, Trash2 } from 'lucide-react'

/**
 * FrameNavigation component provides controls for managing multiple frames/pages
 * Displayed at the top-right of the canvas frame
 */
export const FrameNavigation = () => {
  const {
    frames,
    currentFrameIndex,
    addFrame,
    duplicateFrame,
    deleteFrame,
    nextFrame,
    previousFrame,
  } = useEditor()

  const canDelete = frames.length > 1
  const canGoPrevious = currentFrameIndex > 0
  const canGoNext = currentFrameIndex < frames.length - 1

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2">
      {/* Previous Frame */}
      <Button
        onClick={previousFrame}
        size="sm"
        variant="ghost"
        disabled={!canGoPrevious}
        className="h-8 px-2"
        title="Previous Frame"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Frame Counter */}
      <div className="px-3 py-1 text-sm font-medium text-foreground bg-muted rounded">
        <span className="text-primary">{currentFrameIndex + 1}</span>
        <span className="text-muted-foreground"> / {frames.length}</span>
      </div>

      {/* Next Frame */}
      <Button
        onClick={nextFrame}
        size="sm"
        variant="ghost"
        disabled={!canGoNext}
        className="h-8 px-2"
        title="Next Frame"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Separator */}
      <div className="w-px h-6 bg-border" />

      {/* Add Frame */}
      <Button
        onClick={addFrame}
        size="sm"
        variant="ghost"
        className="h-8 px-2"
        title="Add New Frame"
      >
        <Plus className="w-4 h-4" />
      </Button>

      {/* Duplicate Frame */}
      <Button
        onClick={() => duplicateFrame(currentFrameIndex)}
        size="sm"
        variant="ghost"
        className="h-8 px-2"
        title="Duplicate Current Frame"
      >
        <Copy className="w-4 h-4" />
      </Button>

      {/* Delete Frame */}
      <Button
        onClick={() => deleteFrame(currentFrameIndex)}
        size="sm"
        variant="ghost"
        disabled={!canDelete}
        className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
        title={canDelete ? "Delete Current Frame" : "Cannot delete the last frame"}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

