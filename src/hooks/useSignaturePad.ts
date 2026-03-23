import { useRef, useState, useEffect, useCallback, type RefObject } from 'react';

interface SignaturePadOptions {
  lineWidth?: number;
  maxWidth?: number;
  strokeColor?: string;
  velocityWeight?: number;
}

interface SignaturePadReturn {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  isEmpty: boolean;
  clear: () => void;
  undo: () => void;
  toDataURL: () => string;
  setColor: (color: string) => void;
}

export function useSignaturePad(options: SignaturePadOptions = {}): SignaturePadReturn {
  const {
    lineWidth = 2,
    maxWidth = 5,
    velocityWeight = 0.7,
  } = options;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastWidthRef = useRef(lineWidth);
  const historyRef = useRef<ImageData[]>([]);
  const strokeColorRef = useRef(options.strokeColor ?? '#1E293B');
  const previousWidthRef = useRef(0);

  const [isEmpty, setIsEmpty] = useState(true);
  const [, setColorTrigger] = useState(0);

  const getContext = useCallback((): CanvasRenderingContext2D | null => {
    return canvasRef.current?.getContext('2d') ?? null;
  }, []);

  const checkEmpty = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const isCanvasEmpty = !pixels.some((channel, i) => i % 4 === 3 && channel !== 0);
    setIsEmpty(isCanvasEmpty);
    return isCanvasEmpty;
  }, []);

  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(imageData);
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const newWidth = rect.width;

    let savedImage: string | null = null;
    if (previousWidthRef.current > 0 && Math.abs(previousWidthRef.current - newWidth) > 10) {
      savedImage = canvas.toDataURL();
    } else if (previousWidthRef.current > 0) {
      return;
    }

    previousWidthRef.current = newWidth;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (savedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        checkEmpty();
      };
      img.src = savedImage;
    }
  }, [checkEmpty]);

  const getCoords = useCallback((e: MouseEvent | TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    const mouseEvent = e as MouseEvent;
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    };
  }, []);

  const startStroke = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const coords = getCoords(e);
    isDrawingRef.current = true;
    lastPointRef.current = { ...coords, time: Date.now() };
    lastWidthRef.current = lineWidth;

    const ctx = getContext();
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColorRef.current;
    ctx.lineWidth = lineWidth;
  }, [getCoords, getContext, lineWidth]);

  const drawStroke = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (!isDrawingRef.current || !lastPointRef.current) return;

    const coords = getCoords(e);
    const ctx = getContext();
    if (!ctx) return;

    // Clamp coords to canvas bounds so strokes don't go outside
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      coords.x = Math.max(0, Math.min(coords.x, rect.width));
      coords.y = Math.max(0, Math.min(coords.y, rect.height));
    }

    const dx = coords.x - lastPointRef.current.x;
    const dy = coords.y - lastPointRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt = Date.now() - lastPointRef.current.time;
    const velocity = dt > 0 ? dist / dt : 0;

    const targetWidth = lineWidth + (maxWidth - lineWidth) / (1 + velocity * velocityWeight);
    const newWidth = lastWidthRef.current + (targetWidth - lastWidthRef.current) * 0.3;
    lastWidthRef.current = newWidth;

    ctx.lineWidth = newWidth;
    ctx.strokeStyle = strokeColorRef.current;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    lastPointRef.current = { ...coords, time: Date.now() };
  }, [getCoords, getContext, lineWidth, maxWidth, velocityWeight]);

  const endStroke = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    saveSnapshot();
    checkEmpty();
  }, [saveSnapshot, checkEmpty]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
    setIsEmpty(true);
  }, []);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    historyRef.current.pop();
    const previous = historyRef.current[historyRef.current.length - 1];
    if (previous) {
      ctx.putImageData(previous, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    checkEmpty();
  }, [checkEmpty]);

  const toDataURL = useCallback((): string => {
    return canvasRef.current?.toDataURL('image/png') ?? '';
  }, []);

  const setColor = useCallback((color: string) => {
    strokeColorRef.current = color;
    setColorTrigger((n) => n + 1);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e: MouseEvent) => startStroke(e);
    const onMouseMove = (e: MouseEvent) => drawStroke(e);
    const onMouseUp = () => endStroke();
    const onTouchStart = (e: TouchEvent) => startStroke(e);
    const onTouchMove = (e: TouchEvent) => drawStroke(e);
    const onTouchEnd = () => endStroke();

    const onMouseLeave = () => endStroke();
    const onTouchCancel = () => endStroke();

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchCancel);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [startStroke, drawStroke, endStroke]);

  useEffect(() => {
    resizeCanvas();

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [resizeCanvas]);

  return {
    canvasRef,
    containerRef,
    isEmpty,
    clear,
    undo,
    toDataURL,
    setColor,
  };
}
