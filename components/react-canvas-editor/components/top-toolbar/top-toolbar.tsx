import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditor } from '@/contexts/EditorContext';
import { CANVAS_SIZES } from '@/types/editor';
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { ThemeTrigger } from '@/components/ui/theme-trigger'
import { ExportDropdown } from './export-dropdown'
import { useExport, type ExportFormat } from '@/hooks/useExport'
import { Button } from '@/components/ui/button'
import { Undo2, Redo2 } from 'lucide-react'

const TopToolbar = () => {
  const { canvasSize, setCanvasSize, stageRef,mainFrameRef, undo, redo, canUndo, canRedo } = useEditor();
  
  // Initialize export hook
  const { exportAllFrames, isExporting, exportProgress } = useExport(stageRef, mainFrameRef);
  
  // Handle export
  const handleExport = async (format: ExportFormat) => {
    await exportAllFrames({ format, quality: 0.92, pixelRatio: 2 });
  };
  return (
    <div className="h-16 bg-sidebar border-b border-border flex items-center px-6">
    <div className="flex items-center gap-4 flex-1">
      <h1 className="text-foreground text-xl font-bold">Social Media Template Builder</h1>
    </div>
    
    <div className="flex items-center gap-4">
      {/* Undo/Redo buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="h-9 w-9"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
          className="h-9 w-9"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      
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
      
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      
      <ExportDropdown
        onExport={handleExport}
        isExporting={isExporting}
        exportProgress={exportProgress}
      />
      
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