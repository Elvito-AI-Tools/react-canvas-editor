import { useState, useCallback } from 'react';
import { CanvasElement } from '@/types/editor';

export function useSelection(elements: CanvasElement[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectElement = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  return {
    selectedId,
    selectElement,
    clearSelection,
    setSelectedId,
  };
}

