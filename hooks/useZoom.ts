import { useState, useCallback, useEffect, RefObject, useRef } from 'react';

interface UseZoomProps {
  containerRef: RefObject<HTMLDivElement | null>;
  canvasWidth: number;
  canvasHeight: number;
  padding?: number;
}

interface UseZoomReturn {
  zoom: number;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const DEFAULT_PADDING = 50;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 1.2;
const WHEEL_ZOOM_SPEED = 0.01; // Smooth wheel zoom
const PINCH_ZOOM_SPEED = 0.01; // Smooth pinch zoom

export function useZoom({
  containerRef,
  canvasWidth,
  canvasHeight,
  padding = DEFAULT_PADDING,
}: UseZoomProps): UseZoomReturn {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Track pinch gesture state
  const lastPinchDistanceRef = useRef<number | null>(null);

  // Calculate centered position for a given zoom level
  const calculateCenteredPosition = useCallback(
    (zoomLevel: number, containerWidth: number, containerHeight: number) => {
      const x = (containerWidth - canvasWidth * zoomLevel) / 2;
      const y = (containerHeight - canvasHeight * zoomLevel) / 2;
      return { x, y };
    },
    [canvasWidth, canvasHeight]
  );

  // Calculate optimal zoom and position to fit frame with padding
  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Calculate zoom to fit frame with padding
    const scaleX = (containerWidth - padding * 2) / canvasWidth;
    const scaleY = (containerHeight - padding * 2) / canvasHeight;
    const newZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%

    // Center the frame
    const newPosition = calculateCenteredPosition(
      newZoom,
      containerWidth,
      containerHeight
    );

    setZoom(newZoom);
    setPosition(newPosition);
  }, [containerRef, canvasWidth, canvasHeight, padding, calculateCenteredPosition]);

  // Update stage dimensions on container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    fitToScreen();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [containerRef, fitToScreen]);

  // Re-fit when canvas size changes
  useEffect(() => {
    fitToScreen();
  }, [canvasWidth, canvasHeight, fitToScreen]);

  // Zoom in while keeping centered
  const zoomIn = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const newZoom = Math.min(zoom * ZOOM_STEP, MAX_ZOOM);
    const newPosition = calculateCenteredPosition(
      newZoom,
      containerWidth,
      containerHeight
    );

    setZoom(newZoom);
    setPosition(newPosition);
  }, [zoom, containerRef, calculateCenteredPosition]);

  // Zoom out while keeping centered
  const zoomOut = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const newZoom = Math.max(zoom / ZOOM_STEP, MIN_ZOOM);
    const newPosition = calculateCenteredPosition(
      newZoom,
      containerWidth,
      containerHeight
    );

    setZoom(newZoom);
    setPosition(newPosition);
  }, [zoom, containerRef, calculateCenteredPosition]);

  // Reset zoom to fit
  const resetZoom = useCallback(() => {
    fitToScreen();
  }, [fitToScreen]);

  // Handle wheel zoom (trackpad or mouse wheel)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if it's a pinch gesture (ctrlKey is set for pinch on trackpad)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Calculate new zoom based on wheel delta
        const delta = -e.deltaY * WHEEL_ZOOM_SPEED;
        const newZoom = Math.min(Math.max(zoom * (1 + delta), MIN_ZOOM), MAX_ZOOM);

        // Center the canvas at the new zoom level
        const newPosition = calculateCenteredPosition(
          newZoom,
          containerWidth,
          containerHeight
        );

        setZoom(newZoom);
        setPosition(newPosition);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [containerRef, zoom, calculateCenteredPosition]);

  // Handle touch pinch zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        lastPinchDistanceRef.current = distance;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastPinchDistanceRef.current) {
        e.preventDefault();

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Calculate zoom delta
        const delta = (distance - lastPinchDistanceRef.current) * PINCH_ZOOM_SPEED;
        const newZoom = Math.min(Math.max(zoom * (1 + delta), MIN_ZOOM), MAX_ZOOM);

        // Center the canvas at the new zoom level
        const newPosition = calculateCenteredPosition(
          newZoom,
          containerWidth,
          containerHeight
        );

        setZoom(newZoom);
        setPosition(newPosition);
        lastPinchDistanceRef.current = distance;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        lastPinchDistanceRef.current = null;
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [containerRef, zoom, calculateCenteredPosition]);

  return {
    zoom,
    position,
    dimensions,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}

