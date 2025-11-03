'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ExportFormat } from '@/hooks/useExport';

interface ExportDropdownProps {
  onExport: (format: ExportFormat) => Promise<void>;
  isExporting: boolean;
  exportProgress?: { current: number; total: number } | null;
}

/**
 * ExportDropdown component
 * Provides UI for selecting export format and triggering export
 */
export const ExportDropdown = ({ onExport, isExporting, exportProgress }: ExportDropdownProps) => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async () => {
    await onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Export Button with Dropdown */}
      <div className="flex items-center gap-2">
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            variant="default"
            size="sm"
            disabled={isExporting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {exportProgress ? (
                  <span>Exporting {exportProgress.current}/{exportProgress.total}</span>
                ) : (
                  <span>Exporting...</span>
                )}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center gap-2 bg-background border border-border rounded-md p-2">
            <Select
              value={format}
              onValueChange={(value) => setFormat(value as ExportFormat)}
            >
              <SelectTrigger className="w-[120px] h-8 bg-background border-border text-foreground">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem 
                  value="png" 
                  className="text-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  PNG
                </SelectItem>
                <SelectItem 
                  value="jpeg" 
                  className="text-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  JPEG
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={handleExport}
              size="sm"
              disabled={isExporting}
              className="h-8"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
            
            <Button
              onClick={() => setIsOpen(false)}
              size="sm"
              variant="ghost"
              disabled={isExporting}
              className="h-8"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

