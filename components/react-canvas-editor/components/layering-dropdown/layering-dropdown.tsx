'use client';

import React, { useMemo } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Layers, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface LayeringDropdownProps {
  elementId: string;
}

export const LayeringDropdown: React.FC<LayeringDropdownProps> = ({ elementId }) => {
  const { bringForward, sendBackward, bringToFront, sendToBack, elements } = useEditor();

  const { isAtFront, isAtBack } = useMemo(() => {
    const elementIndex = elements.findIndex(el => el.id === elementId);
    return {
      isAtFront: elementIndex === elements.length - 1,
      isAtBack: elementIndex === 0,
    };
  }, [elements, elementId]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2"
        >
          <Layers className="w-4 h-4" />
          <span className="text-xs">Position</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => bringForward(elementId)}
            disabled={isAtFront}
            className="h-9 flex flex-row items-center justify-start gap-2 px-3"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-xs font-normal">Forward</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendBackward(elementId)}
            disabled={isAtBack}
            className="h-9 flex flex-row items-center justify-start gap-2 px-3"
          >
            <ArrowDown className="w-4 h-4" />
            <span className="text-xs font-normal">Backward</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => bringToFront(elementId)}
            disabled={isAtFront}
            className="h-9 flex flex-row items-center justify-start gap-2 px-3"
          >
            <ChevronsUp className="w-4 h-4" />
            <span className="text-xs font-normal">To front</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendToBack(elementId)}
            disabled={isAtBack}
            className="h-9 flex flex-row items-center justify-start gap-2 px-3"
          >
            <ChevronsDown className="w-4 h-4" />
            <span className="text-xs font-normal">To back</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

