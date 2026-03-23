import { StepIndicator } from '../ui/StepIndicator';
import { useFirmaStore } from '../../store/firmaStore';

interface FlowLayoutProps {
  children: React.ReactNode;
  showStepIndicator?: boolean;
  maxWidth?: 'md' | 'lg' | 'xl';
}

export function FlowLayout({ children, showStepIndicator = true, maxWidth = 'md' }: FlowLayoutProps) {
  const pasoActual = useFirmaStore((s) => s.pasoActual);
  const flowConfig = useFirmaStore((s) => s.flowConfig);

  const pasosActivos = flowConfig
    ? flowConfig.pasos.filter((p) => p.habilitado).sort((a, b) => a.orden - b.orden)
    : [];

  const pasosCompletados = Array.from(
    { length: Math.max(pasoActual, 0) },
    (_, i) => i
  );

  const showBar = showStepIndicator && pasosActivos.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
      {showBar && (
        <StepIndicator
          pasos={pasosActivos}
          pasoActualIndex={pasoActual}
          pasosCompletados={pasosCompletados}
        />
      )}
      <main
        className="flex-1 flex items-start sm:items-center justify-center p-4 sm:p-6 pb-safe"
        style={showBar ? { paddingTop: '6.5rem' } : undefined}
      >
        <div className={`w-full ${
          maxWidth === 'xl' ? 'max-w-2xl' : maxWidth === 'lg' ? 'max-w-lg' : 'max-w-md'
        }`}>
          {children}
        </div>
      </main>
    </div>
  );
}
