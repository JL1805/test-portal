import type { PasoConfig } from '../../types';
import { cn } from '../../utils/helpers';

interface StepIndicatorProps {
  pasos: PasoConfig[];
  pasoActualIndex: number;
  pasosCompletados: number[];
}

const stepIcons: Record<string, React.ReactNode> = {
  checks_legales: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  ),
  otp: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
      <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" />
    </svg>
  ),
  biometria: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
    </svg>
  ),
  visor_documentos: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
      <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
    </svg>
  ),
  firma: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
    </svg>
  ),
};

export function StepIndicator({ pasos, pasoActualIndex, pasosCompletados }: StepIndicatorProps) {
  const totalPasos = pasos.length;
  const progressPercent = pasoActualIndex < 0
    ? 0
    : Math.round(((pasoActualIndex) / totalPasos) * 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-slate-200">
      {/* Thin progress bar at the very top */}
      <div className="h-1.5 bg-slate-200 w-full">
        <div
          className="h-full rounded-r-full transition-all duration-700 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: 'linear-gradient(to right, #1A3C6E, #00C896)',
          }}
        />
      </div>

      {/* Step labels */}
      <div className="max-w-lg mx-auto px-3 py-3">
        <div className="flex items-center justify-between gap-0.5">
          {pasos.map((paso, index) => {
            const isCompleted = pasosCompletados.includes(index);
            const isActive = index === pasoActualIndex;

            return (
              <div key={paso.id} className="flex items-center flex-1 last:flex-none">
                {/* Step dot + label */}
                <div className="flex flex-col items-center gap-1 min-w-0">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 border-2',
                      isCompleted && 'bg-emerald-500 border-emerald-500 text-white',
                      isActive && 'bg-blue-900 border-blue-900 text-white ring-4 ring-blue-900/20 scale-110',
                      !isCompleted && !isActive && 'bg-white border-slate-300 text-slate-400'
                    )}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      stepIcons[paso.id]
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] sm:text-xs font-medium transition-colors duration-300 whitespace-nowrap',
                      isCompleted && 'text-emerald-600 font-semibold',
                      isActive && 'text-blue-900 font-bold',
                      !isCompleted && !isActive && 'text-slate-400'
                    )}
                  >
                    {paso.nombre}
                  </span>
                </div>

                {/* Connector line */}
                {index < pasos.length - 1 && (
                  <div className="flex-1 mx-1 h-0.5 rounded-full bg-slate-200 overflow-hidden self-start mt-4">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current step label (mobile friendly) */}
        {pasoActualIndex >= 0 && pasos[pasoActualIndex] && (
          <p className="text-center text-xs text-slate-500 mt-2 font-medium">
            Paso {pasoActualIndex + 1} de {totalPasos} — {pasos[pasoActualIndex].nombre}
          </p>
        )}
      </div>
    </div>
  );
}
