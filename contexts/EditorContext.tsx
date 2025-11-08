'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { EditorContextType, CANVAS_SIZES, CanvasSize, Frame, CanvasElement } from '@/types/editor';
import { useSelection } from '@/hooks/useSelection';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import Konva from 'konva';

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
  const initialFrameRef = React.useRef<Frame | null>(null);
  if (!initialFrameRef.current) {
    initialFrameRef.current = createEmptyFrame('Page 1');
  }

  const initialHistorySnapshot = JSON.stringify([initialFrameRef.current!]);

  const [canvasSize, setCanvasSize] = useState<CanvasSize>(CANVAS_SIZES[0]);
  const [frames, setFrames] = useState<Frame[]>([initialFrameRef.current!]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stageRef, setStageRef] = useState<React.RefObject<any> | null>(null);
  const [mainFrameRef, setMainFrameRef] = useState<React.RefObject<Konva.Rect> | null>(null);

  // History management for undo/redo
  const history = React.useRef<Frame[][]>([
    JSON.parse(initialHistorySnapshot) as Frame[],
  ]);
  const historyStep = React.useRef(0);
  const historySerialized = React.useRef<string[]>([initialHistorySnapshot]);

  // Get current frame
  const currentFrame = useMemo(() => frames[currentFrameIndex], [frames, currentFrameIndex]);

  // Save state to history (called after any state-changing operation)
  const saveToHistory = useCallback((newFrames: Frame[]) => {
    // Remove any future history if we're not at the latest step
    history.current = history.current.slice(0, historyStep.current + 1);
    historySerialized.current = historySerialized.current.slice(0, historyStep.current + 1);

    const serializedState = JSON.stringify(newFrames);
    const lastSerializedState = historySerialized.current[historySerialized.current.length - 1];

    // Skip saving if nothing changed compared to the latest history state
    if (lastSerializedState === serializedState) {
      return;
    }

    history.current.push(JSON.parse(serializedState) as Frame[]);
    historySerialized.current.push(serializedState);
    historyStep.current += 1;

    // Limit history to 50 steps to prevent memory issues
    if (history.current.length > 50) {
      history.current.shift();
      historySerialized.current.shift();
      if (historyStep.current > 0) {
        historyStep.current -= 1;
      }
    }
  }, []);

  // Undo/Redo operations
  const undo = useCallback(() => {
    if (historyStep.current === 0) {
      return; // Nothing to undo
    }
    historyStep.current -= 1;
    const previousStateSerialized = historySerialized.current[historyStep.current];
    if (!previousStateSerialized) {
      return;
    }
    setFrames(JSON.parse(previousStateSerialized) as Frame[]);
  }, []);

  const redo = useCallback(() => {
    if (historyStep.current === historySerialized.current.length - 1) {
      return; // Nothing to redo
    }
    historyStep.current += 1;
    const nextStateSerialized = historySerialized.current[historyStep.current];
    if (!nextStateSerialized) {
      return;
    }
    setFrames(JSON.parse(nextStateSerialized) as Frame[]);
  }, []);

  const canUndo = historyStep.current > 0;
  const canRedo = historyStep.current < historySerialized.current.length - 1;

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
      case 'shape':
        newElement = {
          ...baseProps,
          type: 'shape',
          shapeType: 'rectangle',
          width: 200,
          height: 200,
          fill: '#B0B0B0',
          stroke: '#808080',
          strokeWidth: 0,
          ...initialProps,
        } as CanvasElement;
        break;
      case 'icon':
        newElement = {
          ...baseProps,
          type: 'icon',
          iconName: 'Heart',
          iconComponent: 'FaHeart',
          size: 80,
          color: '#000000',
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
      saveToHistory(newFrames);
      return newFrames;
    });

    return id;
  }, [canvasSize, currentFrameIndex, saveToHistory]);

  const updateElement = useCallback((id: string, props: Partial<CanvasElement>, options?: { skipHistory?: boolean }) => {
    setFrames(prevFrames => {
      const frame = prevFrames[currentFrameIndex];
      if (!frame) {
        return prevFrames;
      }

      const elementIndex = frame.elements.findIndex(el => el.id === id);
      if (elementIndex === -1) {
        return prevFrames;
      }

      const currentElement = frame.elements[elementIndex] as CanvasElement;
      const hasChanges = (Object.entries(props) as Array<[keyof CanvasElement, unknown]>).some(
        ([key, value]) => currentElement[key] !== value,
      );

      if (!hasChanges) {
        return prevFrames;
      }

      const updatedElements = frame.elements.map((el, i) =>
        i === elementIndex ? ({ ...el, ...props } as CanvasElement) : el
      );

      const newFrames = [...prevFrames];
      newFrames[currentFrameIndex] = {
        ...frame,
        elements: updatedElements,
      };

      if (!options?.skipHistory) {
        saveToHistory(newFrames);
      }

      return newFrames;
    });
  }, [currentFrameIndex, saveToHistory]);

  const deleteElement = useCallback((id: string) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      newFrames[currentFrameIndex] = {
        ...newFrames[currentFrameIndex],
        elements: newFrames[currentFrameIndex].elements.filter(el => el.id !== id),
      };
      saveToHistory(newFrames);
      return newFrames;
    });
  }, [currentFrameIndex, saveToHistory]);

  const getElementById = useCallback((id: string) => {
    return currentFrame.elements.find(el => el.id === id);
  }, [currentFrame]);

  // Layering operations
  const bringForward = useCallback((id: string) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      const elements = [...newFrames[currentFrameIndex].elements];
      const currentIndex = elements.findIndex(el => el.id === id);
      
      if (currentIndex !== -1 && currentIndex < elements.length - 1) {
        // Swap with the element above (higher z-index)
        [elements[currentIndex], elements[currentIndex + 1]] = 
        [elements[currentIndex + 1], elements[currentIndex]];
        
        newFrames[currentFrameIndex] = {
          ...newFrames[currentFrameIndex],
          elements,
        };
      }
      
      saveToHistory(newFrames);
      return newFrames;
    });
  }, [currentFrameIndex, saveToHistory]);

  const sendBackward = useCallback((id: string) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      const elements = [...newFrames[currentFrameIndex].elements];
      const currentIndex = elements.findIndex(el => el.id === id);
      
      if (currentIndex > 0) {
        // Swap with the element below (lower z-index)
        [elements[currentIndex], elements[currentIndex - 1]] = 
        [elements[currentIndex - 1], elements[currentIndex]];
        
        newFrames[currentFrameIndex] = {
          ...newFrames[currentFrameIndex],
          elements,
        };
      }
      
      saveToHistory(newFrames);
      return newFrames;
    });
  }, [currentFrameIndex, saveToHistory]);

  const bringToFront = useCallback((id: string) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      const elements = [...newFrames[currentFrameIndex].elements];
      const currentIndex = elements.findIndex(el => el.id === id);
      
      if (currentIndex !== -1 && currentIndex < elements.length - 1) {
        const element = elements.splice(currentIndex, 1)[0];
        elements.push(element);
        
        newFrames[currentFrameIndex] = {
          ...newFrames[currentFrameIndex],
          elements,
        };
      }
      
      saveToHistory(newFrames);
      return newFrames;
    });
  }, [currentFrameIndex, saveToHistory]);

  const sendToBack = useCallback((id: string) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      const elements = [...newFrames[currentFrameIndex].elements];
      const currentIndex = elements.findIndex(el => el.id === id);
      
      if (currentIndex > 0) {
        const element = elements.splice(currentIndex, 1)[0];
        elements.unshift(element);
        
        newFrames[currentFrameIndex] = {
          ...newFrames[currentFrameIndex],
          elements,
        };
      }
      
      saveToHistory(newFrames);
      return newFrames;
    });
  }, [currentFrameIndex, saveToHistory]);

  const reorderElements = useCallback((fromIndex: number, toIndex: number) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      const elements = [...newFrames[currentFrameIndex].elements];
      
      const [movedElement] = elements.splice(fromIndex, 1);
      elements.splice(toIndex, 0, movedElement);
      
      newFrames[currentFrameIndex] = {
        ...newFrames[currentFrameIndex],
        elements,
      };
      
      saveToHistory(newFrames);
      return newFrames;
    });
  }, [currentFrameIndex, saveToHistory]);

  // Frame background setters
  const setFrameBgColor = useCallback((color: string) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      newFrames[currentFrameIndex] = {
        ...newFrames[currentFrameIndex],
        bgColor: color,
      };
      saveToHistory(newFrames);
      return newFrames;
    });
  }, [currentFrameIndex, saveToHistory]);

  const setFrameBgImage = useCallback((url: string | null) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      newFrames[currentFrameIndex] = {
        ...newFrames[currentFrameIndex],
        bgImage: url,
      };
      saveToHistory(newFrames);
      return newFrames;
    });
  }, [currentFrameIndex, saveToHistory]);

  const {
    selectedIds,
    setSelectedIds,
    clearSelection,
  } = useSelection(currentFrame.elements);    
  const selectedId = selectedIds.length > 0 ? selectedIds[0] : null;

  // Handle keyboard shortcuts
  useKeyboardShortcuts({
    selectedId,
    onDelete: () => {
      if (selectedIds.length > 0 && !selectedIds.includes('main-frame')) {
        // Delete all selected elements
        selectedIds.forEach(id => {
          if (id !== 'main-frame') {
            deleteElement(id);
          }
        });
        clearSelection();
      }
    },
    onClearSelection: clearSelection,
    onUndo: undo,
    onRedo: redo,
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
    selectedIds,
    addElement,
    updateElement,
    deleteElement,
    setSelectedIds,
    getElementById,
    
    // Layering operations
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    reorderElements,
    
    // Canvas settings
    canvasSize,
    setCanvasSize,
    
    // Frame background
    frameBgColor: currentFrame.bgColor,
    frameBgImage: currentFrame.bgImage,
    setFrameBgColor,
    setFrameBgImage,
    
    // Stage ref
    stageRef,
    setStageRef,

    // Main frame ref
    mainFrameRef,
    setMainFrameRef,
    
    // Undo/Redo
    undo,
    redo,
    canUndo,
    canRedo,
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

