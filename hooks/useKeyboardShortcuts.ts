import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  selectedId: string | null;
  onDelete: () => void;
  onClearSelection: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useKeyboardShortcuts({
  selectedId,
  onDelete,
  onClearSelection,
  onUndo,
  onRedo,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts when user is typing in input fields
      const target = e.target as HTMLElement;
      const isInputField = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
      
      if (isInputField) {
        return; // Don't process shortcuts when typing in input fields
      }

      // Undo with Ctrl+Z (or Cmd+Z on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && onUndo) {
        e.preventDefault();
        onUndo();
        return;
      }
      
      // Redo with Ctrl+Shift+Z or Ctrl+Y (or Cmd+Shift+Z / Cmd+Y on Mac)
      if ((e.ctrlKey || e.metaKey) && onRedo) {
        if ((e.shiftKey && e.key === 'z') || e.key === 'y') {
          e.preventDefault();
          onRedo();
          return;
        }
      }

      // Delete selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        onDelete();
      }
      // Clear selection with Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        onClearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, onDelete, onClearSelection, onUndo, onRedo]);
}

