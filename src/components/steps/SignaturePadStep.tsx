import { useState, useCallback } from 'react';
import { useFirmaStore } from '../../store/firmaStore';
import { useSignaturePad } from '../../hooks/useSignaturePad';
import { Button } from '../ui/Button';
import { cn } from '../../utils/helpers';

interface SignaturePadStepProps {
  onNext: () => void;
  onBack?: () => void;
}

const COLORS = [
  { name: 'Negro', value: '#1E293B' },
  { name: 'Azul marino', value: '#1A3C6E' },
];

export function SignaturePadStep({ onNext, onBack }: SignaturePadStepProps) {
  const setFirma = useFirmaStore((s) => s.setFirma);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]!.value);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { canvasRef, containerRef, isEmpty, clear, undo, toDataURL, setColor } = useSignaturePad({
    strokeColor: selectedColor,
  });

  const handleColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
      setColor(color);
    },
    [setColor]
  );

  const handleSign = useCallback(() => {
    if (isEmpty) return;
    const dataUrl = toDataURL();
    setFirma(dataUrl);
    onNext();
  }, [isEmpty, toDataURL, setFirma, onNext]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current?.parentElement;
    if (!container) {
      setIsFullscreen((v) => !v);
      return;
    }

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }

      try {
        (screen.orientation as ScreenOrientation & { lock: (orientation: string) => Promise<void> }).lock('landscape').catch(() => {});
      } catch {
        // Orientation lock not available
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen, containerRef]);

  // Fullscreen modal
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col animate-scaleIn">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Firma aquí
          </h3>
          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            ✓ Listo
          </button>
        </div>
        <div ref={containerRef} className="flex-1 relative bg-slate-50 mx-4 my-2 rounded-xl border-2 border-dashed border-slate-300">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none rounded-xl"
          />
          <div className="absolute bottom-4 left-4 right-4 h-px bg-slate-300" />
        </div>
        <div className="flex items-center justify-center gap-4 px-4 py-3">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => handleColorChange(c.value)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all cursor-pointer',
                selectedColor === c.value ? 'border-[var(--color-primary)] scale-110 ring-2 ring-[var(--color-primary)] ring-offset-2' : 'border-slate-300'
              )}
              style={{ backgroundColor: c.value }}
              aria-label={`Color ${c.name}`}
            />
          ))}
          <button onClick={clear} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-error)] transition-colors cursor-pointer">
            Limpiar
          </button>
          <button onClick={undo} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
            Deshacer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slideInRight">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-5">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Atrás
          </button>
        )}

        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Tu firma</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Firma en el recuadro de abajo</p>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          className="relative w-full h-72 sm:h-80 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none rounded-xl"
          />
          {/* Guide line */}
          <div className="absolute bottom-6 left-6 right-6 h-px bg-slate-300 pointer-events-none" />
          {/* Empty state */}
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-sm text-[var(--color-text-muted)]">Dibuja tu firma aquí</p>
            </div>
          )}
        </div>

        {/* Color selector */}
        <div className="flex items-center gap-3">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => handleColorChange(c.value)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all text-xs font-medium cursor-pointer',
                selectedColor === c.value
                  ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]'
                  : 'border-slate-200 text-[var(--color-text-muted)] hover:border-slate-300'
              )}
            >
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.value }} />
              {c.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={clear}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5z" clipRule="evenodd" />
            </svg>
            Limpiar
          </button>
          <button
            onClick={undo}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z" clipRule="evenodd" />
            </svg>
            Deshacer
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition-all ml-auto cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M13.28 7.78l3.22-3.22v2.69a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.69l-3.22 3.22a.75.75 0 001.06 1.06zM2 17.25v-4.5a.75.75 0 011.5 0v2.69l3.22-3.22a.75.75 0 011.06 1.06L4.56 16.5h2.69a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" />
            </svg>
            Pantalla completa
          </button>
        </div>

        <Button onClick={handleSign} disabled={isEmpty}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2" aria-hidden="true">
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
          </svg>
          Firmar documento
        </Button>
      </div>
    </div>
  );
}
