'use client';

import React, { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Unlock, Trash2, GripVertical, Type, Image, Shapes, Sparkles } from 'lucide-react';
import type { CanvasElement } from '@/types/editor';

const getElementIcon = (type: CanvasElement['type']) => {
  switch (type) {
    case 'text':
      return Type;
    case 'image':
      return Image;
    case 'shape':
      return Shapes;
    case 'icon':
      return Sparkles;
    default:
      return Shapes;
  }
};

const getElementLabel = (element: CanvasElement) => {
  switch (element.type) {
    case 'text':
      return element.text.length > 20 ? element.text.substring(0, 20) + '...' : element.text;
    case 'image':
      return 'Image';
    case 'shape':
      return element.shapeType.charAt(0).toUpperCase() + element.shapeType.slice(1);
    case 'icon':
      return element.iconName;
    default:
      return 'Element';
  }
};

interface LayerItemProps {
  element: CanvasElement;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  element,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [isVisible] = useState(true);
  const [isLocked] = useState(false);
  const Icon = getElementIcon(element.type);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onClick={onSelect}
      className={`
        group flex items-center gap-2 px-3 py-2.5 rounded-md cursor-pointer transition-colors
        ${isSelected ? 'bg-accent border border-accent-foreground/20' : 'hover:bg-accent/50 border border-transparent'}
      `}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
      
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm truncate flex-1">{getElementLabel(element)}</span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={(e) => {
            e.stopPropagation();
            // Toggle visibility functionality can be added later
          }}
        >
          {isVisible ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={(e) => {
            e.stopPropagation();
            // Toggle lock functionality can be added later
          }}
        >
          {isLocked ? (
            <Lock className="w-3.5 h-3.5" />
          ) : (
            <Unlock className="w-3.5 h-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

const LayersLeftSidebar = () => {
  const { elements, selectedIds, setSelectedIds, deleteElement, reorderElements } = useEditor();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Reverse the elements array to show frontmost elements at the top
  const reversedElements = [...elements].reverse();

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Convert reversed indices back to original array indices
    const fromIndex = elements.length - 1 - draggedIndex;
    const toIndex = elements.length - 1 - dropIndex;

    reorderElements(fromIndex, toIndex);
    setDraggedIndex(null);
  };

  const handleSelect = (element: CanvasElement) => {
    setSelectedIds([element.id]);
  };

  const handleDelete = (elementId: string) => {
    deleteElement(elementId);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-3 border-b border-border">
        <div className="text-xs text-muted-foreground">
          {elements.length} {elements.length === 1 ? 'layer' : 'layers'}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {reversedElements.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No layers yet. Add elements to see them here.
            </div>
          ) : (
            reversedElements.map((element, index) => (
              <LayerItem
                key={element.id}
                element={element}
                index={index}
                isSelected={selectedIds[0] === element.id}
                onSelect={() => handleSelect(element)}
                onDelete={() => handleDelete(element.id)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LayersLeftSidebar;

