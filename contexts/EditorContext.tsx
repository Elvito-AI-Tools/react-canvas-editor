'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { EditorContextType, CANVAS_SIZES, CanvasSize, Frame, CanvasElement } from '@/types/editor';
import { useSelection } from '@/hooks/useSelection';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Helper function to create a new empty frame
function createEmptyFrame(name: string): Frame {
  return {
    id: `frame-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    elements: [],
    bgColor: '#ffffff',
    bgImage: null,
    name,
  };
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(CANVAS_SIZES[0]);
  const [frames, setFrames] = useState<Frame[]>([createEmptyFrame('Page 1')]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Get current frame
  const currentFrame = useMemo(() => frames[currentFrameIndex], [frames, currentFrameIndex]);

  // Frame navigation
  const goToFrame = useCallback((index: number) => {
    if (index >= 0 && index < frames.length) {
      setCurrentFrameIndex(index);
    }
  }, [frames.length]);

  const nextFrame = useCallback(() => {
    if (currentFrameIndex < frames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
    }
  }, [currentFrameIndex, frames.length]);

  const previousFrame = useCallback(() => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(currentFrameIndex - 1);
    }
  }, [currentFrameIndex]);

  // Frame operations
  const addFrame = useCallback(() => {
    const newFrame = createEmptyFrame(`Page ${frames.length + 1}`);
    setFrames([...frames, newFrame]);
    setCurrentFrameIndex(frames.length); // Go to the new frame
  }, [frames]);

  const duplicateFrame = useCallback((index: number) => {
    if (index >= 0 && index < frames.length) {
      const frameToDuplicate = frames[index];
      const duplicatedFrame: Frame = {
        ...frameToDuplicate,
        id: `frame-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${frameToDuplicate.name} (Copy)`,
        // Deep copy elements with new IDs
        elements: frameToDuplicate.elements.map(el => ({
          ...el,
          id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })),
      };
      const newFrames = [...frames];
      newFrames.splice(index + 1, 0, duplicatedFrame);
      setFrames(newFrames);
      setCurrentFrameIndex(index + 1); // Go to the duplicated frame
    }
  }, [frames]);

  const deleteFrame = useCallback((index: number) => {
    if (frames.length <= 1) {
      // Don't delete if it's the last frame
      return;
    }
    if (index >= 0 && index < frames.length) {
      const newFrames = frames.filter((_, i) => i !== index);
      setFrames(newFrames);
      // Adjust current frame index if needed
      if (currentFrameIndex >= newFrames.length) {
        setCurrentFrameIndex(newFrames.length - 1);
      } else if (currentFrameIndex > index) {
        setCurrentFrameIndex(currentFrameIndex - 1);
      }
    }
  }, [frames, currentFrameIndex]);

  // Element operations (scoped to current frame)
  const addElement = useCallback((type: CanvasElement['type'], initialProps?: Partial<CanvasElement>) => {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    let newElement: CanvasElement;
    const baseProps = {
      id,
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      draggable: true,
    };

    switch (type) {
      case 'text':
        newElement = {
          ...baseProps,
          type: 'text',
          text: 'Double click to edit',
          fontSize: 32,
          fontFamily: 'Inter',
          fill: '#000000',
          align: 'left',
          isBold: false,
          isItalic: false,
          isUnderline: false,
          isStrikethrough: false,
          backgroundColor: null,
          padding: 10,
          width: 400,
          ...initialProps,
        } as CanvasElement;
        break;
      case 'image':
        newElement = {
          ...baseProps,
          type: 'image',
          src: '',
          width: 200,
          height: 200,
          ...initialProps,
        } as CanvasElement;
        break;
      default:
        throw new Error(`Unsupported element type: ${type}`);
    }

    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      newFrames[currentFrameIndex] = {
        ...newFrames[currentFrameIndex],
        elements: [...newFrames[currentFrameIndex].elements, newElement],
      };
      return newFrames;
    });

    return id;
  }, [canvasSize, currentFrameIndex]);

  const updateElement = useCallback((id: string, props: Partial<CanvasElement>) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      const currentElements = newFrames[currentFrameIndex].elements;
      const elementIndex = currentElements.findIndex(el => el.id === id);
      
      if (elementIndex !== -1) {
        newFrames[currentFrameIndex] = {
          ...newFrames[currentFrameIndex],
          elements: currentElements.map((el, i) =>
            i === elementIndex ? { ...el, ...props } as CanvasElement : el
          ),
        };
      }
      
      return newFrames;
    });
  }, [currentFrameIndex]);

  const deleteElement = useCallback((id: string) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      newFrames[currentFrameIndex] = {
        ...newFrames[currentFrameIndex],
        elements: newFrames[currentFrameIndex].elements.filter(el => el.id !== id),
      };
      return newFrames;
    });
  }, [currentFrameIndex]);

  const getElementById = useCallback((id: string) => {
    return currentFrame.elements.find(el => el.id === id);
  }, [currentFrame]);

  // Frame background setters
  const setFrameBgColor = useCallback((color: string) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      newFrames[currentFrameIndex] = {
        ...newFrames[currentFrameIndex],
        bgColor: color,
      };
      return newFrames;
    });
  }, [currentFrameIndex]);

  const setFrameBgImage = useCallback((url: string | null) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      newFrames[currentFrameIndex] = {
        ...newFrames[currentFrameIndex],
        bgImage: url,
      };
      return newFrames;
    });
  }, [currentFrameIndex]);

  const {
    selectedId,
    clearSelection,
    setSelectedId,
  } = useSelection(currentFrame.elements);

  // Handle keyboard shortcuts
  useKeyboardShortcuts({
    selectedId,
    onDelete: () => {
      if (selectedId && selectedId !== 'main-frame') {
        deleteElement(selectedId);
        clearSelection();
      }
    },
    onClearSelection: clearSelection,
  });

  const value: EditorContextType = {
    // Frame management
    frames,
    currentFrameIndex,
    currentFrame,
    addFrame,
    duplicateFrame,
    deleteFrame,
    goToFrame,
    nextFrame,
    previousFrame,
    
    // Element operations
    elements: currentFrame.elements,
    selectedId,
    addElement,
    updateElement,
    deleteElement,
    setSelectedId,
    getElementById,
    
    // Canvas settings
    canvasSize,
    setCanvasSize,
    
    // Frame background
    frameBgColor: currentFrame.bgColor,
    frameBgImage: currentFrame.bgImage,
    setFrameBgColor,
    setFrameBgImage,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}

