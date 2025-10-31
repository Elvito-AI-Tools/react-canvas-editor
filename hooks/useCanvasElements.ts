import { useState, useCallback } from 'react';
import { CanvasElement } from '@/types/editor';

export function useCanvasElements() {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const addElement = useCallback((type: CanvasElement['type'], initialProps?: Partial<CanvasElement>) => {
    const id = `${type}-${Date.now()}`;
    const newElement: CanvasElement = {
      id,
      type,
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      rotation: 0,
      ...initialProps,
    } as CanvasElement;
    setElements(prev => [...prev, newElement]);
  }, []);

  const updateElement = useCallback((id: string, props: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...props } as CanvasElement : el));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
  }, []);

  const getElementById = useCallback((id: string) => {
    return elements.find(el => el.id === id);
  }, [elements]);

  return {
    elements,
    addElement,
    updateElement,
    deleteElement,
    getElementById,
  };
}

