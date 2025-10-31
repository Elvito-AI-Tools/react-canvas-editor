'use client';

import React, { createContext, useContext, useState } from 'react';
import { EditorContextType, CANVAS_SIZES, CanvasSize } from '@/types/editor';
import { useCanvasElements } from '@/hooks/useCanvasElements';
import { useSelection } from '@/hooks/useSelection';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(CANVAS_SIZES[0]);
  const [frameBgColor, setFrameBgColor] = useState<string>('#ffffff');

  const {
    elements,
    addElement,
    updateElement,
    deleteElement,
    getElementById,
  } = useCanvasElements();

  const {
    selectedId,
    clearSelection,
    setSelectedId,
  } = useSelection(elements);

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
    elements,
    selectedId,
    canvasSize,
    frameBgColor,
    setCanvasSize,
    setFrameBgColor,
    addElement,
    updateElement,
    deleteElement,
    setSelectedId,
    getElementById,
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

