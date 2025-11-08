import { useCallback, useState } from 'react';
import JSZip from 'jszip';
import { useEditor } from '../contexts/EditorContext';
import type Konva from 'konva';

export type ExportFormat = 'png' | 'jpeg';

export interface ExportOptions {
  format: ExportFormat;
  quality?: number; // 0-1 for JPEG quality
  pixelRatio?: number; // Scale factor for export (default: 2 for high quality)
}

type KonvaStage = Konva.Stage;

type KonvaRect = Konva.Rect;

/**
 * Hook to handle exporting frames from the canvas
 * Uses Konva's toDataURL to export frames client-side
 * Packages multiple frames into a ZIP file using JSZip
 * 
 * This approach programmatically switches between frames and captures each one
 */
export const useExport = (stageRef: React.RefObject<KonvaStage> | null, mainFrameRef: React.RefObject<KonvaRect> | null) => {
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
      if (!stageRef?.current || !mainFrameRef?.current) {
        console.error('Stage reference not available');
        return null;
      }

      const stage = stageRef.current;

      try {
        // Export the stage as data URL
        const mimeType = options.format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const stage = stageRef.current;
        const mainFrame = mainFrameRef.current;

        // Save current stage transforms
        const originalScale = stage.scaleX();
        const originalX = stage.x();
        const originalY = stage.y();

        // Temporarily reset stage transforms to get clean export
        stage.scale({ x: 1, y: 1 });
        stage.position({ x: 0, y: 0 });

        // Get the mainFrame's position and dimensions in untransformed coordinates
        const frameX = mainFrame.x();
        const frameY = mainFrame.y();
        const frameWidth = mainFrame.width();
        const frameHeight = mainFrame.height();

        // Export only the canvas frame area at full scale
        const dataUrl = stage.toDataURL({
          mimeType: mimeType,
          quality: options.quality ?? 0.9,
          pixelRatio: options.pixelRatio ?? 2,
          x: frameX,
          y: frameY,
          width: frameWidth,
          height: frameHeight,
        });


        // Restore stage transforms
        stage.scale({ x: originalScale, y: originalScale });
        stage.position({ x: originalX, y: originalY });
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

  /**
   * Generates a thumbnail from the first frame without downloading
   * Returns the data URL for saving to backend
   * Only captures the actual canvas frame, not the surrounding stage area
   * Exports at full scale regardless of current zoom level
   */
  const generateThumbnail = useCallback(
    async (options: Partial<ExportOptions> = {}): Promise<string | null> => {
      if (!stageRef?.current || !mainFrameRef?.current || frames.length === 0) {
        return null;
      }

      const originalFrameIndex = currentFrameIndex;
      
      try {
        // Switch to first frame if not already there
        if (currentFrameIndex !== 0) {
          goToFrame(0);
          await waitForRender();
          await waitForRender();
        }

        const stage = stageRef.current;
        const mainFrame = mainFrameRef.current;

        // Save current stage transforms
        const originalScale = stage.scaleX();
        const originalX = stage.x();
        const originalY = stage.y();

        // Temporarily reset stage transforms to get clean export
        stage.scale({ x: 1, y: 1 });
        stage.position({ x: 0, y: 0 });

        // Get the mainFrame's position and dimensions in untransformed coordinates
        const frameX = mainFrame.x();
        const frameY = mainFrame.y();
        const frameWidth = mainFrame.width();
        const frameHeight = mainFrame.height();

        // Export only the canvas frame area at full scale
        const dataUrl = stage.toDataURL({
          mimeType: 'image/png',
          quality: options.quality ?? 0.9,
          pixelRatio: options.pixelRatio ?? 2,
          x: frameX,
          y: frameY,
          width: frameWidth,
          height: frameHeight,
        });

        // Restore stage transforms
        stage.scale({ x: originalScale, y: originalScale });
        stage.position({ x: originalX, y: originalY });

        // Restore original frame if needed
        if (originalFrameIndex !== 0) {
          goToFrame(originalFrameIndex);
        }

        return dataUrl;
      } catch (error) {
        console.error('Error generating thumbnail:', error);
        // Restore original frame on error
        if (originalFrameIndex !== 0) {
          goToFrame(originalFrameIndex);
        }
        return null;
      }
    },
    [stageRef, mainFrameRef, frames, currentFrameIndex, goToFrame, waitForRender]
  );

  return {
    exportAllFrames,
    exportCurrentFrame,
    generateThumbnail,
    isExporting,
    exportProgress,
  };
};

