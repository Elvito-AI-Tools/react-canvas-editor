import { useCallback, useState } from 'react';
import JSZip from 'jszip';
import { useEditor } from '@/contexts/EditorContext';

export type ExportFormat = 'png' | 'jpeg';

export interface ExportOptions {
  format: ExportFormat;
  quality?: number; // 0-1 for JPEG quality
  pixelRatio?: number; // Scale factor for export (default: 2 for high quality)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KonvaStage = any;

/**
 * Hook to handle exporting frames from the canvas
 * Uses Konva's toDataURL to export frames client-side
 * Packages multiple frames into a ZIP file using JSZip
 * 
 * This approach programmatically switches between frames and captures each one
 */
export const useExport = (stageRef: React.RefObject<KonvaStage> | null) => {
  const { frames, goToFrame, currentFrameIndex } = useEditor();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);

  /**
   * Waits for the next animation frame - useful for letting the canvas re-render
   */
  const waitForRender = useCallback(() => new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  }), []);

  /**
   * Exports the currently visible frame as a data URL
   */
  const exportCurrentVisibleFrame = useCallback(
    async (
      frame: { name: string; id: string },
      frameIndex: number,
      options: ExportOptions
    ): Promise<{ dataUrl: string; filename: string } | null> => {
      if (!stageRef?.current) {
        console.error('Stage reference not available');
        return null;
      }

      const stage = stageRef.current;

      try {
        // Export the stage as data URL
        const mimeType = options.format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const dataUrl = stage.toDataURL({
          mimeType,
          quality: options.quality ?? 0.92,
          pixelRatio: options.pixelRatio ?? 2,
        });

        // Generate filename
        const sanitizedName = frame.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${sanitizedName}_${frameIndex + 1}.${options.format}`;

        return { dataUrl, filename };
      } catch (error) {
        console.error(`Error exporting frame ${frameIndex}:`, error);
        return null;
      }
    },
    [stageRef]
  );

  /**
   * Exports the current frame only
   */
  const exportCurrentFrame = useCallback(
    async (options: ExportOptions): Promise<boolean> => {
      if (!stageRef?.current) {
        console.error('Stage reference not available');
        return false;
      }

      setIsExporting(true);

      try {
        const frame = frames[currentFrameIndex];
        const result = await exportCurrentVisibleFrame(frame, currentFrameIndex, options);
        
        if (!result) {
          setIsExporting(false);
          return false;
        }

        // Convert data URL to blob and trigger download
        const response = await fetch(result.dataUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsExporting(false);
        return true;
      } catch (error) {
        console.error('Error exporting current frame:', error);
        setIsExporting(false);
        return false;
      }
    },
    [stageRef, frames, currentFrameIndex, exportCurrentVisibleFrame]
  );

  /**
   * Exports all frames - creates a ZIP file if multiple frames, downloads directly if single frame
   * Programmatically switches between frames to capture each one
   */
  const exportAllFrames = useCallback(
    async (options: ExportOptions): Promise<boolean> => {
      if (!stageRef?.current) {
        console.error('Stage reference not available');
        return false;
      }

      // If only one frame, download directly without zipping
      if (frames.length === 1) {
        return exportCurrentFrame(options);
      }

      const originalFrameIndex = currentFrameIndex;
      setIsExporting(true);
      setExportProgress({ current: 0, total: frames.length });

      try {
        const zip = new JSZip();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

        // Export each frame by switching to it and capturing
        for (let i = 0; i < frames.length; i++) {
          // Switch to frame
          goToFrame(i);
          
          // Wait for the canvas to re-render with the new frame
          await waitForRender();
          await waitForRender(); // Double wait to ensure images are loaded
          
          const result = await exportCurrentVisibleFrame(frames[i], i, options);
          
          if (result) {
            // Convert data URL to blob
            const response = await fetch(result.dataUrl);
            const blob = await response.blob();
            
            // Add to zip
            zip.file(result.filename, blob);
          }
          
          // Update progress
          setExportProgress({ current: i + 1, total: frames.length });
        }

        // Restore original frame
        goToFrame(originalFrameIndex);

        // Generate ZIP file
        const zipBlob = await zip.generateAsync({ 
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        });

        // Trigger download
        const zipFilename = `canvas_export_${timestamp}.zip`;
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = zipFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsExporting(false);
        setExportProgress(null);
        return true;
      } catch (error) {
        console.error('Error exporting frames:', error);
        // Restore original frame on error
        goToFrame(originalFrameIndex);
        setIsExporting(false);
        setExportProgress(null);
        return false;
      }
    },
    [stageRef, frames, currentFrameIndex, goToFrame, exportCurrentVisibleFrame, waitForRender, exportCurrentFrame]
  );

  return {
    exportAllFrames,
    exportCurrentFrame,
    isExporting,
    exportProgress,
  };
};

