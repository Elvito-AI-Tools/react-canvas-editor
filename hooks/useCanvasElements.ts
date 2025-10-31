import { useState, useCallback } from 'react';
import {
  BaseElement,
  CanvasElement,
  ImageElement,
  RectangleElement,
  TextElement,
} from '@/types/editor';

export function useCanvasElements() {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const addElement = useCallback(
    (type: CanvasElement['type'], initialProps: Partial<CanvasElement> = {}) => {
      const id = `${type}-${Date.now()}`;

      const baseProps: Omit<BaseElement, 'type'> = {
        id,
        x: (initialProps.x as number) ?? 100,
        y: (initialProps.y as number) ?? 100,
        rotation: (initialProps.rotation as number) ?? 0,
        scaleX: (initialProps.scaleX as number) ?? 1,
        scaleY: (initialProps.scaleY as number) ?? 1,
        draggable: initialProps.draggable ?? true,
      };

      let newElement: CanvasElement;

      switch (type) {
        case 'text': {
          const textProps = initialProps as Partial<TextElement>;
          newElement = {
            ...baseProps,
            type: 'text',
            text: textProps.text ?? 'Add your text',
            fontSize: textProps.fontSize ?? 48,
            fontFamily: textProps.fontFamily ?? 'Inter',
            fill: textProps.fill ?? '#18181b',
            align: textProps.align ?? 'center',
            isBold: textProps.isBold ?? false,
            isItalic: textProps.isItalic ?? false,
            isUnderline: textProps.isUnderline ?? false,
            isStrikethrough: textProps.isStrikethrough ?? false,
            backgroundColor: textProps.backgroundColor ?? null,
            padding: textProps.padding ?? 12,
          } satisfies TextElement;
          break;
        }
        case 'rectangle': {
          const rectangleProps = initialProps as Partial<RectangleElement>;
          newElement = {
            ...baseProps,
            type: 'rectangle',
            width: rectangleProps.width ?? 200,
            height: rectangleProps.height ?? 100,
            fill: rectangleProps.fill ?? '#e5e7eb',
            stroke: rectangleProps.stroke,
            strokeWidth: rectangleProps.strokeWidth ?? 0,
          } satisfies RectangleElement;
          break;
        }
        case 'image': {
          const imageProps = initialProps as Partial<ImageElement>;
          newElement = {
            ...baseProps,
            type: 'image',
            src: imageProps.src ?? '',
            width: imageProps.width ?? 200,
            height: imageProps.height ?? 200,
          } satisfies ImageElement;
          break;
        }
        default: {
          throw new Error(`Unsupported element type: ${type}`);
        }
      }

      setElements(prev => [...prev, newElement]);
      return id;
    },
    [],
  );

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

