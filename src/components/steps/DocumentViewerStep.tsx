import { useState, useEffect, useRef, useCallback } from 'react';
import { useFirmaStore } from '../../store/firmaStore';
import { Button } from '../ui/Button';
import { cn } from '../../utils/helpers';

interface DocumentViewerStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export function DocumentViewerStep({ onNext, onBack }: DocumentViewerStepProps) {
  const flowConfig = useFirmaStore((s) => s.flowConfig);
  const documentosLeidos = useFirmaStore((s) => s.documentosLeidos);
  const marcarDocumentoLeido = useFirmaStore((s) => s.marcarDocumentoLeido);
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const [viewingDocIndex, setViewingDocIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const iframeFailed = useRef(false);
  const [showFallback, setShowFallback] = useState(false);

  const documentos = flowConfig?.documentos ?? [];
  const viewingDoc = documentos.find((d) => d.id === viewingDocId);

  const documentosRequeridos = documentos.filter((d) => d.requerido);
  const todosRequeridosLeidos = documentosRequeridos.every((d) =>
    documentosLeidos.includes(d.id)
  );

  const openViewer = useCallback((docId: string) => {
    const idx = documentos.findIndex((d) => d.id === docId);
    setViewingDocId(docId);
    setViewingDocIndex(idx);
    setProgress(0);
    setShowFallback(false);
    iframeFailed.current = false;
  }, [documentos]);

  const closeViewer = useCallback(() => {
    if (viewingDocId && progress >= 100) {
      marcarDocumentoLeido(viewingDocId);
    }
    setViewingDocId(null);
    setProgress(0);
    clearInterval(progressTimer.current);
  }, [viewingDocId, progress, marcarDocumentoLeido]);

  // Progress timer (1 second to 100%)
  useEffect(() => {
    if (!viewingDocId) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / 10); // 1 second = 10 intervals at 100ms
      });
    }, 100);

    progressTimer.current = interval;

    // Iframe fallback check
    const fallbackTimeout = setTimeout(() => {
      if (iframeFailed.current) {
        setShowFallback(true);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimeout);
    };
  }, [viewingDocId]);

  const navigateDoc = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? viewingDocIndex - 1 : viewingDocIndex + 1;
    const doc = documentos[newIndex];
    if (doc) {
      if (viewingDocId && progress >= 100) {
        marcarDocumentoLeido(viewingDocId);
      }
      openViewer(doc.id);
    }
  };

  // Fullscreen viewer
  if (viewingDoc) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col animate-scaleIn">
        {/* Viewer header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
          <button
            onClick={closeViewer}
            className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Cerrar
          </button>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] truncate max-w-[50%]">
            {viewingDoc.nombre}
          </h3>
          <a
            href={viewingDoc.url}
            download
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
            aria-label="Descargar documento"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
          </a>
        </div>

        {/* Progress bar */}
        <div className="shrink-0 px-4 py-2 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-[var(--color-text-muted)] shrink-0">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
        </div>

        {/* PDF viewer */}
        <div className="flex-1 overflow-hidden relative">
          {!showFallback ? (
            <iframe
              src={viewingDoc.url}
              className="w-full h-full border-0"
              title={viewingDoc.nombre}
              onError={() => {
                iframeFailed.current = true;
                setShowFallback(true);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-primary)" className="w-16 h-16" aria-hidden="true">
                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-[var(--color-text-secondary)]">
                No se pudo mostrar el documento aquí.
              </p>
              <Button
                variant="secondary"
                fullWidth={false}
                onClick={() => window.open(viewingDoc.url, '_blank')}
              >
                Abrir documento en nueva pestaña
              </Button>
              {progress >= 100 && (
                <Button
                  variant="primary"
                  fullWidth={false}
                  onClick={() => {
                    marcarDocumentoLeido(viewingDoc.id);
                    closeViewer();
                  }}
                >
                  Marcar como leído
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        {documentos.length > 1 && (
          <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
            <button
              onClick={() => navigateDoc('prev')}
              disabled={viewingDocIndex === 0}
              className="text-sm text-[var(--color-primary)] disabled:text-slate-300 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
              Anterior
            </button>
            <span className="text-xs text-[var(--color-text-muted)]">
              {viewingDocIndex + 1} de {documentos.length}
            </span>
            <button
              onClick={() => navigateDoc('next')}
              disabled={viewingDocIndex === documentos.length - 1}
              className="text-sm text-[var(--color-primary)] disabled:text-slate-300 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              Siguiente
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Document list
  return (
    <div className="animate-slideInRight">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-6">
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
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-primary)" className="w-8 h-8" aria-hidden="true">
              <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
              <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Documentos a revisar
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Lee cada documento antes de firmar. Toca un documento para abrirlo.
          </p>
        </div>

        {/* Document list */}
        <div className="space-y-3">
          {documentos.map((doc) => {
            const isRead = documentosLeidos.includes(doc.id);
            return (
              <button
                key={doc.id}
                onClick={() => openViewer(doc.id)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer',
                  isRead
                    ? 'border-[var(--color-success)] bg-green-50'
                    : 'border-slate-200 hover:border-[var(--color-primary)] hover:bg-blue-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 shrink-0 rounded-lg flex items-center justify-center',
                    isRead ? 'bg-[var(--color-success)]' : 'bg-red-100'
                  )}>
                    {isRead ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-5 h-5" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#EF4444" className="w-5 h-5" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {doc.nombre}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {doc.descripcion}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-[10px] font-bold uppercase px-2 py-1 rounded-full',
                      isRead
                        ? 'bg-[var(--color-success)] text-white'
                        : 'bg-slate-200 text-slate-500'
                    )}
                  >
                    {isRead ? '✓ Leído' : 'Pendiente'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <Button onClick={onNext} disabled={!todosRequeridosLeidos}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
