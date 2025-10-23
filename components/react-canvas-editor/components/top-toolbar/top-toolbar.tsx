import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditor } from '@/contexts/EditorContext';
import { CANVAS_SIZES } from '@/types/editor';
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { ThemeTrigger } from '@/components/ui/theme-trigger'

const TopToolbar = () => {
  const { canvasSize, setCanvasSize } = useEditor();
  return (
    <div className="h-16 bg-sidebar border-b border-border flex items-center px-6">
    <div className="flex items-center gap-4 flex-1">
      <h1 className="text-foreground text-xl font-bold">Social Media Template Builder</h1>
    </div>
    
    <div className="flex items-center gap-4">
      <Select
        value={canvasSize.id}
        onValueChange={(value) => {
          const size = CANVAS_SIZES.find(s => s.id === value);
          if (size) setCanvasSize(size);
        }}
      >
        <SelectTrigger className="w-[200px] bg-background border-border text-foreground">
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          {CANVAS_SIZES.map((size) => (
            <SelectItem key={size.id} value={size.id} className="text-foreground focus:bg-accent focus:text-accent-foreground">
              {size.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="text-muted-foreground text-sm">
        {canvasSize.width} × {canvasSize.height}px
      </div>
      {/* <div className="w-8 h-8 rounded border-2 border-border bg-background" title="Background: White" /> */}
      <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />      
          <ThemeTrigger />
    </div>
  </div>
  )
}

export default TopToolbar