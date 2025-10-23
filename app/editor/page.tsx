'use client';

import React from 'react';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import { Canvas } from '@/components/Canvas';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CANVAS_SIZES } from '@/types/editor';
import ReactCanvasEditor from '@/components/react-canvas-editor/react-canvas-editor';

function EditorContent() {
  const { canvasSize, setCanvasSize } = useEditor();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1a1a1a]">
      {/* Top Toolbar */}
      <div className="h-16 bg-[#262626] border-b border-[#3a3a3a] flex items-center px-6">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-white text-xl font-bold">Social Media Template Builder</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Select
            value={canvasSize.id}
            onValueChange={(value) => {
              const size = CANVAS_SIZES.find(s => s.id === value);
              if (size) setCanvasSize(size);
            }}
          >
            <SelectTrigger className="w-[200px] bg-[#1a1a1a] border-[#3a3a3a] text-white">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent className="bg-[#262626] border-[#3a3a3a]">
              {CANVAS_SIZES.map((size) => (
                <SelectItem key={size.id} value={size.id} className="text-white focus:bg-[#3a3a3a] focus:text-white">
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-gray-400 text-sm">
            {canvasSize.width} × {canvasSize.height}px
          </div>
          <div className="w-8 h-8 rounded border-2 border-white bg-white" title="Background: White" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <LeftSidebar />

        {/* Center Canvas Area */}
        <div className="flex-1 overflow-auto">
          <Canvas />
        </div>

        {/* Right Sidebar - Layers & Assets */}
        <RightSidebar />
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <EditorProvider>
      <ReactCanvasEditor />
    </EditorProvider>
  );
}

