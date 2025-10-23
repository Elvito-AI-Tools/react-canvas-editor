"use client"

import React, { useState } from 'react'
import { useEditor } from '@/contexts/EditorContext'
import { Button } from '@/components/ui/button'
import { Paintbrush } from 'lucide-react'

const PRESET_COLORS = [
  '#ffffff', '#000000', '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9',
]

export const FrameToolbar = () => {
  const { frameBgColor, setFrameBgColor } = useEditor()
  const [showColorPicker, setShowColorPicker] = useState(false)

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-background border border-border rounded-lg shadow-lg px-3 py-2 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Frame Background:</span>
        
        {/* Current Color Display */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 gap-2"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <div 
            className="w-5 h-5 rounded border border-border"
            style={{ backgroundColor: frameBgColor }}
          />
          <Paintbrush className="w-4 h-4" />
        </Button>
      </div>

      {/* Color Picker Popover */}
      {showColorPicker && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30"
            onClick={() => setShowColorPicker(false)}
          />
          
          {/* Color Picker Panel */}
          <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-xl p-4 z-40 min-w-[280px]">
            <div className="space-y-3">
              {/* Custom Color Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Custom Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={frameBgColor}
                    onChange={(e) => setFrameBgColor(e.target.value)}
                    className="w-12 h-9 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={frameBgColor}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^#[0-9A-F]{6}$/i.test(value)) {
                        setFrameBgColor(value)
                      }
                    }}
                    className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Preset Colors */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Preset Colors</label>
                <div className="grid grid-cols-8 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFrameBgColor(color)}
                      className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                        frameBgColor === color ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

