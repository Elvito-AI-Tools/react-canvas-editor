import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  selectedId: string | null;
  onDelete: () => void;
  onClearSelection: () => void;
}

export function useKeyboardShortcuts({
  selectedId,
  onDelete,
  onClearSelection,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [selectedId, onDelete, onClearSelection]);
}

