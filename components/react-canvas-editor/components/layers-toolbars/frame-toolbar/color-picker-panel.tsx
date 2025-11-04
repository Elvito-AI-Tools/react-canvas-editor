"use client"

import React from 'react'

const PRESET_COLORS = [
  '#ffffff', '#000000', '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9',
]

interface ColorPickerPanelProps {
  color: string
  onChange: (color: string) => void
}

export const ColorPickerPanel = ({ color, onChange }: ColorPickerPanelProps) => {
  return (
    <div className="space-y-3">
      {/* Custom Color Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Custom Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-9 rounded border border-border cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => {
              const value = e.target.value
              if (/^#[0-9A-F]{6}$/i.test(value)) {
                onChange(value)
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
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              onClick={() => onChange(presetColor)}
              className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                color === presetColor ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
              }`}
              style={{ backgroundColor: presetColor }}
              title={presetColor}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

