'use client';

import React, { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Palette } from 'lucide-react';
import type { ShapeElement } from '@/types/editor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LayeringDropdown } from '../layering-dropdown/layering-dropdown';

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

export const ShapeToolbar = () => {
  const { selectedId, getElementById, updateElement } = useEditor();
  const element = selectedId ? getElementById(selectedId) : undefined;
  const shapeElement = element?.type === 'shape' ? (element as ShapeElement) : null;
  const [customColor, setCustomColor] = useState(shapeElement?.fill || '#3b82f6');

  if (!shapeElement) return null;

  const handleFillChange = (color: string) => {
    updateElement(shapeElement.id, { fill: color });
    setCustomColor(color);
  };

  const handleStrokeChange = (color: string) => {
    updateElement(shapeElement.id, { stroke: color });
  };

  const handleStrokeWidthChange = (width: number) => {
    updateElement(shapeElement.id, { strokeWidth: width });
  };

  const handleRemoveStroke = () => {
    updateElement(shapeElement.id, { stroke: undefined, strokeWidth: 0 });
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-background border border-border rounded-lg px-4 py-2 shadow-lg">
      {/* Fill Color Picker */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Fill</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2"
            >
              <div
                className="w-4 h-4 rounded border border-border"
                style={{ backgroundColor: shapeElement.fill }}
              />
              <Palette className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Preset Colors</Label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleFillChange(color)}
                      className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Custom Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleFillChange(e.target.value)}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => handleFillChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 h-10 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Stroke Color Picker */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Stroke</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2"
            >
              <div
                className="w-4 h-4 rounded border border-border"
                style={{ backgroundColor: shapeElement.stroke || 'transparent' }}
              />
              <Palette className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Preset Colors</Label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleStrokeChange(color)}
                      className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <Separator />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveStroke}
                className="w-full"
              >
                Remove Stroke
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Stroke Width */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Width</span>
        <div className="flex gap-1">
          {[0, 1, 2, 4, 6, 8].map((width) => (
            <Button
              key={width}
              variant={shapeElement.strokeWidth === width ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStrokeWidthChange(width)}
              className="h-8 w-10 text-xs"
            >
              {width}
            </Button>
          ))}
        </div>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Layering */}
      <LayeringDropdown elementId={shapeElement.id} />
    </div>
  );
};


