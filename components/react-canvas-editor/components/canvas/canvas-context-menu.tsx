'use client';

import React from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Copy, Trash2, Layers, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from 'lucide-react';

interface CanvasContextMenuProps {
  elementId: string | null;
  position: { x: number; y: number } | null;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  elementId,
  position,
  onDuplicate,
  onDelete,
  onClose,
}) => {
  const { bringForward, sendBackward, bringToFront, sendToBack, elements } = useEditor();
  const [showLayering, setShowLayering] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Check if element is at front or back
  const elementIndex = elementId ? elements.findIndex(el => el.id === elementId) : -1;
  const isAtFront = elementIndex === elements.length - 1;
  const isAtBack = elementIndex === 0;

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (position) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [position, onClose]);

  if (!elementId || !position) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50" 
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 min-w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {/* Duplicate */}
        <div
          onClick={() => {
            onDuplicate();
            onClose();
          }}
          className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
        >
          <Copy className="w-4 h-4" />
          Duplicate
        </div>

        {/* Separator */}
        <div className="h-px bg-border my-1 -mx-1" />

        {/* Layering */}
        <div
          className="relative"
          onMouseEnter={() => setShowLayering(true)}
          onMouseLeave={() => setShowLayering(false)}
        >
          <div className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
            <Layers className="w-4 h-4" />
            Layering
            <svg className="ml-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Layering Submenu */}
          {showLayering && (
            <div
              className="absolute left-full top-0 ml-1 min-w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <div
                onClick={() => {
                  if (!isAtFront && elementId) {
                    bringToFront(elementId);
                    onClose();
                  }
                }}
                className={`relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none ${
                  isAtFront ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <ChevronsUp className="w-4 h-4" />
                To Front
              </div>
              <div
                onClick={() => {
                  if (!isAtFront && elementId) {
                    bringForward(elementId);
                    onClose();
                  }
                }}
                className={`relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none ${
                  isAtFront ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
                Forward
              </div>
              <div
                onClick={() => {
                  if (!isAtBack && elementId) {
                    sendBackward(elementId);
                    onClose();
                  }
                }}
                className={`relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none ${
                  isAtBack ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <ArrowDown className="w-4 h-4" />
                Backward
              </div>
              <div
                onClick={() => {
                  if (!isAtBack && elementId) {
                    sendToBack(elementId);
                    onClose();
                  }
                }}
                className={`relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none ${
                  isAtBack ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <ChevronsDown className="w-4 h-4" />
                To back
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-px bg-border my-1 -mx-1" />

        {/* Remove */}
        <div
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-destructive/10 text-destructive"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </div>
      </div>
    </>
  );
};

