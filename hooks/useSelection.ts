import { useState, useCallback } from 'react';
import { CanvasElement } from '@/types/editor';

export function useSelection(elements: CanvasElement[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectElement = useCallback((id: string) => {
    setSelectedIds([id]);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    selectedIds,
    selectElement,
    clearSelection,
    setSelectedIds,
  };
}

