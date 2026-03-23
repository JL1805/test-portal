import type { AppError } from '../types';
import { FlowLayout } from '../components/layout/FlowLayout';
import { Button } from '../components/ui/Button';

interface ErrorPageProps {
  error: AppError;
}

export function ErrorPage({ error }: ErrorPageProps) {
  return (
    <FlowLayout showStepIndicator={false}>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center space-y-6 animate-fadeInUp">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-warning)" className="w-10 h-10" aria-hidden="true">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {error.titulo}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {error.mensaje}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {error.reintentable && (
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              window.location.href = 'mailto:soporte@firmatest.com';
            }}
          >
            Contactar soporte
          </Button>
        </div>
      </div>
    </FlowLayout>
  );
}
