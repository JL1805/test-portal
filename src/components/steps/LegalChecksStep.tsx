import { useState } from 'react';
import { useFirmaStore } from '../../store/firmaStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { cn } from '../../utils/helpers';
import type { CheckLegal } from '../../types';

interface LegalChecksStepProps {
  onNext: () => void;
  onBack?: () => void;
}

/** Genera un título corto a partir del texto completo del check */
function getTitulo(texto: string): string {
  // Tomar las primeras ~6 palabras como título
  const palabras = texto.split(/\s+/);
  const titulo = palabras.slice(0, 6).join(' ');
  return palabras.length > 6 ? titulo + '…' : titulo;
}

export function LegalChecksStep({ onNext, onBack }: LegalChecksStepProps) {
  const flowConfig = useFirmaStore((s) => s.flowConfig);
  const checksAceptados = useFirmaStore((s) => s.checksAceptados);
  const toggleCheck = useFirmaStore((s) => s.toggleCheck);
  const aceptarTodosChecks = useFirmaStore((s) => s.aceptarTodosChecks);
  const [selectedCheck, setSelectedCheck] = useState<CheckLegal | null>(null);

  if (!flowConfig) return null;

  const { checks_legales } = flowConfig;
  const checksRequeridos = checks_legales.filter((c) => c.requerido);
  const todosRequeridosAceptados = checksRequeridos.every((c) =>
    checksAceptados.includes(c.id)
  );
  const todosAceptados = checks_legales.every((c) => checksAceptados.includes(c.id));
  const aceptadosCount = checks_legales.filter((c) => checksAceptados.includes(c.id)).length;

  return (
    <div className="animate-slideInRight">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-6 space-y-4">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            aria-label="Volver al paso anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Atrás
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-primary)" className="w-7 h-7" aria-hidden="true">
              <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516 11.209 11.209 0 01-7.877-3.08zm3.19 8.477a.75.75 0 00-1.06-1.06l-3.896 3.895-1.596-1.596a.75.75 0 00-1.06 1.06l2.125 2.126a.75.75 0 001.06 0l4.426-4.425z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
            Términos y condiciones
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Toca cada término para leer el contenido completo.
          </p>
        </div>

        {/* Contador */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-[var(--color-text-muted)]">
            {aceptadosCount} de {checks_legales.length} aceptados
          </span>
          {!todosAceptados && (
            <button
              onClick={aceptarTodosChecks}
              className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
            >
              Aceptar todos
            </button>
          )}
        </div>

        {/* Lista de checks */}
        <div className="space-y-2">
          {checks_legales.map((check) => {
            const isChecked = checksAceptados.includes(check.id);
            return (
              <div
                key={check.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200',
                  isChecked
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-slate-200 bg-white'
                )}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => toggleCheck(check.id)}
                  className="shrink-0 cursor-pointer"
                  aria-label={`Aceptar: ${getTitulo(check.texto)}`}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                      isChecked
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-300 bg-white'
                    )}
                  >
                    {isChecked && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3.5 h-3.5" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Título + badge — clic abre modal */}
                <button
                  type="button"
                  onClick={() => setSelectedCheck(check)}
                  className="flex-1 min-w-0 text-left cursor-pointer"
                >
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {getTitulo(check.texto)}
                  </p>
                  {check.requerido && (
                    <span className="text-[10px] font-semibold text-rose-500 uppercase">
                      Obligatorio
                    </span>
                  )}
                </button>

                {/* Icono para ver detalle */}
                <button
                  type="button"
                  onClick={() => setSelectedCheck(check)}
                  className="shrink-0 text-slate-400 hover:text-blue-900 transition-colors cursor-pointer"
                  aria-label={`Ver detalle de ${getTitulo(check.texto)}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Confirmar */}
        <Button
          onClick={onNext}
          disabled={!todosRequeridosAceptados}
        >
          Confirmar
        </Button>
        <Button variant="danger" onClick={onBack ?? (() => {})} fullWidth>
          Cancelar
        </Button>
      </div>

      {/* Modal de detalle de check */}
      <Modal
        isOpen={selectedCheck !== null}
        onClose={() => setSelectedCheck(null)}
        title="Detalle del término"
      >
        {selectedCheck && (
          <>
            <div className="px-5 py-4 space-y-4">
              {/* Badge obligatorio */}
              {selectedCheck.requerido && (
                <span className="inline-block text-[10px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase">
                  Obligatorio
                </span>
              )}

              {/* Texto completo */}
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedCheck.texto}
              </p>
            </div>

            {/* Footer del modal */}
            <div className="border-t border-slate-100 px-5 py-4 space-y-2">
              {checksAceptados.includes(selectedCheck.id) ? (
                <div className="flex items-center gap-2 justify-center text-emerald-600 text-sm font-medium py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Aceptado
                </div>
              ) : (
                <Button
                  onClick={() => {
                    toggleCheck(selectedCheck.id);
                    setSelectedCheck(null);
                  }}
                >
                  Aceptar término
                </Button>
              )}
              <button
                type="button"
                onClick={() => setSelectedCheck(null)}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-2 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
