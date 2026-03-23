import { useFirmaStore } from '../../store/firmaStore';
import { Button } from '../ui/Button';
import { truncateUuid } from '../../utils/helpers';

export function WelcomeStep() {
  const flowConfig = useFirmaStore((s) => s.flowConfig);
  const comenzarFlujo = useFirmaStore((s) => s.comenzarFlujo);
  const getPasosActivos = useFirmaStore((s) => s.getPasosActivos);

  if (!flowConfig) return null;

  const pasosActivos = getPasosActivos();
  const { cliente, empresa, documento_titulo, uuid } = flowConfig;
  const nombreCompleto = `${cliente.nombre} ${cliente.apellido_paterno} ${cliente.apellido_materno}`;

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="animate-fadeInUp flex justify-center">
        <img
          src={empresa.logo_url}
          alt={`Logo de ${empresa.nombre}`}
          className="max-h-12 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Greeting */}
      <div className="animate-fadeInUp delay-100 text-center space-y-1">
        <p className="text-[var(--color-text-secondary)] text-sm flex items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--color-accent)" className="w-5 h-5" aria-hidden="true">
            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
          </svg>
          Bienvenido/a
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
          {nombreCompleto}
        </h1>
      </div>

      {/* Document card */}
      <div className="animate-fadeInUp delay-200 bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-primary)" className="w-6 h-6" aria-hidden="true">
              <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
              <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] leading-tight">
              {documento_titulo}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              <span className="font-medium">{empresa.nombre}</span> solicita tu firma electrónica
            </p>
          </div>
        </div>
      </div>

      {/* Steps preview */}
      <div className="animate-fadeInUp delay-300 space-y-3">
        <p className="text-sm font-medium text-[var(--color-text-secondary)] text-center">
          Este proceso incluye:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {pasosActivos.map((paso, i) => (
            <span
              key={paso.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-[var(--color-text-secondary)]"
            >
              <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              {paso.nombre}
            </span>
          ))}
        </div>
      </div>

      {/* Security badge */}
      <div className="animate-fadeInUp delay-400 flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
        </svg>
        Tu información está protegida y cifrada
      </div>

      {/* CTA */}
      <div className="animate-fadeInUp delay-500">
        <Button onClick={comenzarFlujo}>
          Comenzar proceso
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2" aria-hidden="true">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>

      {/* Folio */}
      <p className="animate-fadeInUp delay-600 text-center text-xs text-[var(--color-text-muted)]">
        Folio: {truncateUuid(uuid)}
      </p>
    </div>
  );
}
