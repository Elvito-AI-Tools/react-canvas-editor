"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useEditor } from '@/contexts/EditorContext'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Minus,
  PaintBucket,
  Paintbrush,
  Plus,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { ColorPickerPanel } from '../frame-toolbar/color-picker-panel'
import type { TextElement } from '@/types/editor'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LayeringDropdown } from '../layering-dropdown/layering-dropdown'

type ActivePicker = 'text' | 'background' | null

const checkerboardBackground = {
  backgroundImage:
    'linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%), linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 4px 4px',
}

export const TextToolbar = () => {
  const { selectedId, getElementById, updateElement } = useEditor()
  const [activePicker, setActivePicker] = useState<ActivePicker>(null)

  const textElement = useMemo(() => {
    if (!selectedId) return null
    const element = getElementById(selectedId)
    if (!element || element.type !== 'text') return null
    return element as TextElement
  }, [getElementById, selectedId])

  const activeTextStyles = useMemo(() => {
    const styles: string[] = []
    if (textElement?.isBold) styles.push('bold')
    if (textElement?.isItalic) styles.push('italic')
    if (textElement?.isUnderline) styles.push('underline')
    if (textElement?.isStrikethrough) styles.push('strikethrough')
    return styles
  }, [textElement?.isBold, textElement?.isItalic, textElement?.isUnderline, textElement?.isStrikethrough])

  useEffect(() => {
    setActivePicker(null)
  }, [textElement?.id])

  if (!textElement) {
    return null
  }

  const handleFontSizeChange = (delta: number) => {
    const nextSize = Math.max(6, Math.round(textElement.fontSize + delta))
    updateElement(textElement.id, { fontSize: nextSize })
  }

  const handleTextStylesChange = (styles: string[]) => {
    updateElement(textElement.id, {
      isBold: styles.includes('bold'),
      isItalic: styles.includes('italic'),
      isUnderline: styles.includes('underline'),
      isStrikethrough: styles.includes('strikethrough'),
    })
  }

  const handleTextColorChange = (color: string) => {
    updateElement(textElement.id, { fill: color })
  }

  const handleBackgroundColorChange = (color: string) => {
    updateElement(textElement.id, { backgroundColor: color })
  }

  const handleClearBackground = () => {
    updateElement(textElement.id, { backgroundColor: null })
    setActivePicker(null)
  }

  const renderPicker = (color: string, onChange: (color: string) => void, extraContent?: React.ReactNode) => (
    <>
      <div className="fixed inset-0 z-30" onClick={() => setActivePicker(null)} />
      <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-xl p-4 z-40 min-w-[280px]">
        <ColorPickerPanel color={color} onChange={onChange} />
        {extraContent}
      </div>
    </>
  )

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-background border border-border rounded-lg shadow-lg px-3 py-2 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Text:</span>

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 gap-2"
            onClick={() => setActivePicker(prev => (prev === 'text' ? null : 'text'))}
          >
            <div
              className="w-5 h-5 rounded border border-border"
              style={{ backgroundColor: textElement.fill }}
            />
            <Paintbrush className="w-4 h-4" />
          </Button>

          {activePicker === 'text' && renderPicker(textElement.fill, handleTextColorChange)}
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 gap-2"
            onClick={() => setActivePicker(prev => (prev === 'background' ? null : 'background'))}
          >
            <div
              className="w-5 h-5 rounded border border-border"
              style={
                textElement.backgroundColor
                  ? { backgroundColor: textElement.backgroundColor }
                  : checkerboardBackground
              }
            />
            <PaintBucket className="w-4 h-4" />
          </Button>

          {activePicker === 'background' &&
            renderPicker(
              textElement.backgroundColor ?? '#000000',
              handleBackgroundColorChange,
              <div className="mt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                  onClick={handleClearBackground}
                >
                  No background
                </Button>
              </div>,
            )}
        </div>
      </div>

      <div className="flex items-center gap-2 pl-3 ml-3 border-l border-border">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleFontSizeChange(-4)}>
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium text-foreground min-w-[48px] text-center">
          {textElement.fontSize}px
        </span>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleFontSizeChange(4)}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 pl-3 ml-3 border-l border-border">
        <ToggleGroup type="multiple" variant="outline" value={activeTextStyles} onValueChange={handleTextStylesChange}>
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="h-6 w-px bg-border ml-3" />

      {/* Layering */}
      <LayeringDropdown elementId={textElement.id} />
    </div>
  )
}


