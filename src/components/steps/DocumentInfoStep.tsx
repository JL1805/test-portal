import { useFirmaStore } from '../../store/firmaStore';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/helpers';

interface DocumentInfoStepProps {
  onNext: () => void;
}

export function DocumentInfoStep({ onNext }: DocumentInfoStepProps) {
  const flowConfig = useFirmaStore((s) => s.flowConfig);

  if (!flowConfig) return null;

  const { empresa, documento_titulo, documento_descripcion, cliente } = flowConfig;
  const nombreCompleto = `${cliente.nombre} ${cliente.apellido_paterno} ${cliente.apellido_materno}`;

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Logo */}
      <div className="flex justify-center">
        <img
          src={empresa.logo_url}
          alt={`Logo de ${empresa.nombre}`}
          className="max-h-12 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Revisión de documento
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
          Hola, {cliente.nombre}
        </h1>
      </div>

      {/* Document info card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #1A3C6E, #2A5A9E)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-5 h-5 shrink-0" aria-hidden="true">
            <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
          </svg>
          <h3 className="text-sm font-bold text-white">Información del documento</h3>
        </div>

        <div className="px-5 py-4 space-y-3">
          {[
            { icon: '📄', label: 'Documento', value: documento_titulo },
            { icon: '🏢', label: 'Empresa', value: empresa.nombre },
            { icon: '👤', label: 'Destinatario', value: nombreCompleto },
            { icon: '📅', label: 'Fecha', value: formatDate(new Date()) },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <span className="text-base">{item.icon}</span>
                {item.label}
              </span>
              <span className="font-semibold text-sm text-slate-800 text-right max-w-[55%] truncate">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      {documento_descripcion && (
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <div className="flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--color-primary)" className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-slate-600 leading-relaxed">
              {documento_descripcion}
            </p>
          </div>
        </div>
      )}

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
        </svg>
        Documento protegido y verificado
      </div>

      {/* CTA */}
      <Button onClick={onNext}>
        Revisar documento
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2" aria-hidden="true">
          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
        </svg>
      </Button>
    </div>
  );
}
