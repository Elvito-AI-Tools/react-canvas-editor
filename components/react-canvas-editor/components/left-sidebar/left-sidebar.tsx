'use client';

import React, { useMemo, useState } from 'react';
import { Type, Shapes, Sparkles, Image } from 'lucide-react';
import TextLeftSidebar from './components/text-left-sidebar';
import { ImageLeftSidebar } from './components/image-left-sidebar';

type SidebarItemId = 'text' | 'shapes' | 'icons' | 'photos'

const ITEMS: { id: SidebarItemId; label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 'text', label: 'Text', Icon: Type },
  { id: 'shapes', label: 'Shapes', Icon: Shapes },
  { id: 'icons', label: 'Icons', Icon: Sparkles },
  { id: 'photos', label: 'Photos', Icon: Image },
];

const LeftSidebar = () => {
  const [active, setActive] = useState<SidebarItemId | null>(null);

  const activeLabel = useMemo(() => ITEMS.find(i => i.id === active)?.label ?? '', [active]);
  
  return (
    <div className="relative h-full flex">
      {/* Primary narrow rail */}
      <div className="w-16 shrink-0 bg-sidebar border-r border-border flex flex-col items-center py-3 gap-2">
        {ITEMS.map(({ id, label, Icon }) => (
          <div key={id} className="relative group">
            <button
              type="button"
              aria-label={label}
              onClick={() => setActive(prev => (prev === id ? null : id))}
              className={
                'w-12 h-12 rounded-md flex items-center justify-center text-sidebar-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
              }
            >
              <Icon className="w-6 h-6" />
            </button>

            {/* Hover popover */}
            <div className="hidden group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-2 z-20">
              <div className="min-w-56 max-w-72 rounded-md border border-border bg-background text-foreground shadow p-3">
                <div className="font-medium mb-1">{label}</div>
                <div className="text-sm text-muted-foreground">Preview content appears here on hover.</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Collapsible content panel */}
      <div
        className={`transition-[width] duration-200 ease-in-out overflow-hidden border-r border-border bg-background ${
          active ? 'w-80' : 'w-0'
        }`}
      >
        {active && (
          <div className="h-full flex flex-col">
            <div className="h-14 shrink-0 px-4 border-b border-border flex items-center justify-between">
              <div className="font-medium text-foreground">{activeLabel}</div>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setActive(null)}
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {active === 'text' && <TextLeftSidebar />}
              {active === 'photos' && <ImageLeftSidebar />}
              {active !== 'text' && active !== 'photos' && (
                <div className="flex-1 p-4 text-sm text-muted-foreground">
                  Placeholder content for {activeLabel}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;