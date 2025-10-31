import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';
import React from 'react'
const TEXT_TEMPLATES = [
    {
      id: 'heading',
      label: 'Create header',
      text: 'Create header',
      fontSize: 72,
      isBold: true,
      align: 'center' as const,
    },
    {
      id: 'subheading',
      label: 'Create sub header',
      text: 'Create sub header',
      fontSize: 48,
      isBold: true,
      align: 'center' as const,
    },
    {
      id: 'body',
      label: 'Create body text',
      text: 'Create body text',
      fontSize: 24,
      isBold: false,
      align: 'left' as const,
    },
  ];

const TextLeftSidebar = () => {

    const { addElement, setSelectedId, canvasSize } = useEditor();

  const handleAddText = (template: (typeof TEXT_TEMPLATES)[number]) => {
    const id = addElement('text', {
      text: template.text,
      fontSize: template.fontSize,
      isBold: template.isBold,
      align: template.align,
      x: Math.max(40, canvasSize.width / 2 - 160),
      y: Math.max(40, canvasSize.height / 2 - 80),
    });
    setSelectedId(id);
  };
  return (
    <Tabs defaultValue="library" className="h-full flex flex-col">
    <div className="p-4 pb-2">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="library">Text</TabsTrigger>
        <TabsTrigger value="my-fonts">My fonts</TabsTrigger>
      </TabsList>
    </div>
    <TabsContent value="library" className="flex-1 px-4 pb-4">
      <ScrollArea className="h-full pr-2">
        <div className="space-y-3">
          {TEXT_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleAddText(template)}
              className={cn(
                'w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-left transition-colors hover:bg-muted',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
            >
              <div
                className="text-foreground"
                style={{
                  fontSize: template.fontSize / 2,
                  fontWeight: template.isBold ? 700 : 500,
                  lineHeight: 1.1,
                }}
              >
                {template.label}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </TabsContent>
    <TabsContent value="my-fonts" className="px-4 pb-4 flex-1">
      <div className="h-full rounded-lg border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">
        Save your favorite font combos soon.
      </div>
    </TabsContent>
  </Tabs>
  )
}

export default TextLeftSidebar
