"use client"

import React, { useState } from 'react'
import { useEditor } from '@/contexts/EditorContext'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Paintbrush, ImageIcon } from 'lucide-react'
import { ColorPickerPanel } from './color-picker-panel'
import { ImageSearchPanel } from './image-search-panel'

export const FrameToolbar = () => {
  const { frameBgColor, frameBgImage, setFrameBgColor, setFrameBgImage } = useEditor()
  const [showPicker, setShowPicker] = useState(false)

  const handleColorChange = (color: string) => {
    setFrameBgColor(color)
    setFrameBgImage(null) // Clear image when setting color
  }

  const handleImageSelect = (imageUrl: string) => {
    setFrameBgImage(imageUrl)
    setShowPicker(false)
  }

  // Determine what to show in the button
  const hasImage = !!frameBgImage

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-background border border-border rounded-lg shadow-lg px-3 py-2 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Frame Background:</span>
        
        {/* Current Background Display */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 gap-2"
          onClick={() => setShowPicker(!showPicker)}
        >
          <div 
            className="w-5 h-5 rounded border border-border overflow-hidden"
            style={{ 
              backgroundColor: hasImage ? 'transparent' : frameBgColor,
              backgroundImage: hasImage ? `url(${frameBgImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {hasImage ? <ImageIcon className="w-4 h-4" /> : <Paintbrush className="w-4 h-4" />}
        </Button>
      </div>

      {/* Background Picker Popover */}
      {showPicker && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30"
            onClick={() => setShowPicker(false)}
          />
          
          {/* Picker Panel */}
          <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-xl p-4 z-40 min-w-[320px]">
            <Tabs defaultValue="color" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="color">
                  <Paintbrush className="w-4 h-4 mr-2" />
                  Color
                </TabsTrigger>
                <TabsTrigger value="image">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="color">
                <ColorPickerPanel color={frameBgColor} onChange={handleColorChange} />
              </TabsContent>
              
              <TabsContent value="image">
                <ImageSearchPanel onImageSelect={handleImageSelect} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  )
}

