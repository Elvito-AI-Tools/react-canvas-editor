"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useEditor } from '@/contexts/EditorContext'
import { Button } from '@/components/ui/button'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ActivePicker = 'text' | 'background' | null

const FONT_FAMILIES = [
  // Modern Sans-Serif
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Rubik', label: 'Rubik' },
  { value: 'Work Sans', label: 'Work Sans' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Josefin Sans', label: 'Josefin Sans' },
  { value: 'PT Sans', label: 'PT Sans' },
  { value: 'Quicksand', label: 'Quicksand' },
  { value: 'Comfortaa', label: 'Comfortaa' },
  { value: 'Fredoka', label: 'Fredoka' },
  { value: 'Epilogue', label: 'Epilogue' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  
  // Classic System Fonts
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  
  // Serif Fonts
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Crimson Text', label: 'Crimson Text' },
  { value: 'EB Garamond', label: 'EB Garamond' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville' },
  { value: 'Cinzel', label: 'Cinzel' },
  
  // Monospace
  { value: 'Courier New', label: 'Courier New' },
  
  // Display/Bold Fonts
  { value: 'Impact', label: 'Impact' },
  { value: 'Bebas Neue', label: 'Bebas Neue' },
  { value: 'Anton', label: 'Anton' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Righteous', label: 'Righteous' },
  { value: 'Abril Fatface', label: 'Abril Fatface' },
  { value: 'Staatliches', label: 'Staatliches' },
  { value: 'Russo One', label: 'Russo One' },
  { value: 'Bungee', label: 'Bungee' },
  { value: 'Fredericka the Great', label: 'Fredericka the Great' },
  
  // Handwriting/Script Fonts
  { value: 'Dancing Script', label: 'Dancing Script' },
  { value: 'Pacifico', label: 'Pacifico' },
  { value: 'Satisfy', label: 'Satisfy' },
  { value: 'Great Vibes', label: 'Great Vibes' },
  { value: 'Caveat', label: 'Caveat' },
  { value: 'Indie Flower', label: 'Indie Flower' },
  { value: 'Sacramento', label: 'Sacramento' },
  { value: 'Tangerine', label: 'Tangerine' },
  { value: 'Courgette', label: 'Courgette' },
  { value: 'Amatic SC', label: 'Amatic SC' },
  { value: 'Kalam', label: 'Kalam' },
  { value: 'Shadows Into Light', label: 'Shadows Into Light' },
  { value: 'Patrick Hand', label: 'Patrick Hand' },
  { value: 'Architects Daughter', label: 'Architects Daughter' },
  { value: 'Permanent Marker', label: 'Permanent Marker' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  
  // Elegant/Fancy Script
  { value: 'Lobster', label: 'Lobster' },
  { value: 'Cookie', label: 'Cookie' },
  { value: 'Allura', label: 'Allura' },
  { value: 'Alex Brush', label: 'Alex Brush' },
  { value: 'Parisienne', label: 'Parisienne' },
  { value: 'Ballet', label: 'Ballet' },
  { value: 'Kaushan Script', label: 'Kaushan Script' },
  { value: 'Yellowtail', label: 'Yellowtail' },
]

const checkerboardBackground = {
  backgroundImage:
    'linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%), linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 4px 4px',
}

export const TextToolbar = () => {
  const { selectedIds, getElementById, updateElement } = useEditor()
  const [activePicker, setActivePicker] = useState<ActivePicker>(null)

  const textElement = useMemo(() => {
    if (!selectedIds[0]) return null
    const element = getElementById(selectedIds[0])
    if (!element || element.type !== 'text') return null
    return element as TextElement
  }, [getElementById, selectedIds])

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

  const handleFontFamilyChange = (fontFamily: string) => {
    updateElement(textElement.id, { fontFamily })
  }

  const handleAlignmentChange = () => {
    const alignments: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right']
    const currentIndex = alignments.indexOf(textElement.align as 'left' | 'center' | 'right')
    const nextIndex = (currentIndex + 1) % alignments.length
    updateElement(textElement.id, { align: alignments[nextIndex] })
  }

  const getAlignmentIcon = () => {
    switch (textElement.align) {
      case 'center':
        return <AlignCenter className="w-4 h-4" />
      case 'right':
        return <AlignRight className="w-4 h-4" />
      default:
        return <AlignLeft className="w-4 h-4" />
    }
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

        <Select value={textElement.fontFamily} onValueChange={handleFontFamilyChange}>
          <SelectTrigger size="sm" className="h-8 w-[140px]">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 pl-3 ml-3 border-l border-border">
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

      <div className="flex items-center gap-2 pl-3 ml-3 border-l border-border">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleAlignmentChange}
          aria-label="Text alignment"
        >
          {getAlignmentIcon()}
        </Button>
      </div>

      <div className="h-6 w-px bg-border ml-3" />

      {/* Layering */}
      <LayeringDropdown elementId={textElement.id} />
    </div>
  )
}


