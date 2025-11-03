'use client';

import React, { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { getAllShapes, getShapesByCategory, type ShapeDefinition } from '@/lib/shapes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ShapeButton = ({ shape, onClick }: { shape: ShapeDefinition; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="group aspect-square w-full rounded-lg border border-border bg-background hover:bg-accent transition-all duration-200 flex items-center justify-center p-3"
      title={shape.name}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      >
        <path
          d={shape.svgPath}
          fill="#B0B0B0"
          className="transition-opacity group-hover:opacity-80"
        />
      </svg>
    </button>
  );
};

const ShapeLeftSidebar = () => {
  const { addElement, setSelectedId } = useEditor();
  const [activeTab, setActiveTab] = useState<'all' | 'basic' | 'geometric' | 'decorative' | 'arrows' | 'organic'>('all');

  const handleAddShape = (shapeType: ShapeDefinition['id']) => {
    const id = addElement('shape', {
      shapeType,
      width: 200,
      height: 200,
      fill: '#B0B0B0',
      stroke: '#808080',
      strokeWidth: 2,
    });
    setSelectedId(id);
  };

  const allShapes = getAllShapes();
  const basicShapes = getShapesByCategory('basic');
  const geometricShapes = getShapesByCategory('geometric');
  const decorativeShapes = getShapesByCategory('decorative');
  const arrowShapes = getShapesByCategory('arrows');
  const organicShapes = getShapesByCategory('organic');

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="organic" className="text-xs">Organic</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="geometric" className="text-xs">Geo</TabsTrigger>
            <TabsTrigger value="decorative" className="text-xs">Deco</TabsTrigger>
            <TabsTrigger value="arrows" className="text-xs">Arrow</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-4 pb-4">
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-4 gap-3">
                {allShapes.map((shape) => (
                  <ShapeButton
                    key={shape.id}
                    shape={shape}
                    onClick={() => handleAddShape(shape.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="basic" className="mt-0">
              <div className="grid grid-cols-4 gap-3">
                {basicShapes.map((shape) => (
                  <ShapeButton
                    key={shape.id}
                    shape={shape}
                    onClick={() => handleAddShape(shape.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="geometric" className="mt-0">
              <div className="grid grid-cols-4 gap-3">
                {geometricShapes.map((shape) => (
                  <ShapeButton
                    key={shape.id}
                    shape={shape}
                    onClick={() => handleAddShape(shape.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="decorative" className="mt-0">
              <div className="grid grid-cols-4 gap-3">
                {decorativeShapes.map((shape) => (
                  <ShapeButton
                    key={shape.id}
                    shape={shape}
                    onClick={() => handleAddShape(shape.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="arrows" className="mt-0">
              <div className="grid grid-cols-4 gap-3">
                {arrowShapes.map((shape) => (
                  <ShapeButton
                    key={shape.id}
                    shape={shape}
                    onClick={() => handleAddShape(shape.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="organic" className="mt-0">
              <div className="grid grid-cols-4 gap-3">
                {organicShapes.map((shape) => (
                  <ShapeButton
                    key={shape.id}
                    shape={shape}
                    onClick={() => handleAddShape(shape.id)}
                  />
                ))}
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ShapeLeftSidebar;

