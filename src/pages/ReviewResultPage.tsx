import { useState, useEffect, useMemo } from 'react';
import { useFirmaStore } from '../store/firmaStore';
import { formatDate, formatTime, truncateUuid } from '../utils/helpers';

export function ReviewResultPage() {
  const flowConfig = useFirmaStore((s) => s.flowConfig);
  const decision = useFirmaStore((s) => s.decision);
  const [showContent, setShowContent] = useState(false);

  const esAceptado = decision === 'aceptado';

  const resumen = useMemo(() => {
    const now = new Date();
    return {
      documento: flowConfig?.documento_titulo ?? 'Documento',
      empresa: flowConfig?.empresa.nombre ?? '',
      fecha: formatDate(now),
      hora: formatTime(now),
      folio: flowConfig?.uuid ? truncateUuid(flowConfig.uuid) : '',
    };
  }, [flowConfig]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8" style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease-in' }}>

      {/* Animated icon */}
      <div className="flex justify-center pt-4">
        <div className="relative">
          {esAceptado && (
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" style={{ animationDuration: '2s' }} />
          )}
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center shadow-xl relative"
            style={{
              background: esAceptado
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'linear-gradient(135deg, #F59E0B, #D97706)',
            }}
          >
            {esAceptado ? (
              <svg viewBox="0 0 52 52" className="w-14 h-14" aria-label="Documento autorizado">
                <polyline
                  points="14,27 22,35 38,17"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                  className="animate-checkDraw"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-14 h-14" aria-label="Firma cancelada">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          {esAceptado ? 'Documento autorizado' : 'Firma cancelada'}
        </h1>
        <p className="text-base text-slate-500 max-w-xs mx-auto leading-relaxed">
          {esAceptado
            ? 'Se ha notificado a todos los involucrados que el documento ha sido autorizado.'
            : 'Se enviaron las notificaciones correspondientes a los involucrados de que la firma fue cancelada.'
          }
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{
            background: esAceptado
              ? 'linear-gradient(135deg, #059669, #10B981)'
              : 'linear-gradient(135deg, #D97706, #F59E0B)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-5 h-5 shrink-0" aria-hidden="true">
            <path fillRule="evenodd" d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5V7A2.5 2.5 0 0011 4.5H8.128a2.252 2.252 0 011.884-1.488A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M2 7a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm2 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
          <h3 className="text-sm font-bold text-white">
            {esAceptado ? 'Resumen de autorización' : 'Resumen de rechazo'}
          </h3>
        </div>

        <div className="px-5 py-4 space-y-3">
          {[
            { icon: '📄', label: 'Documento', value: resumen.documento },
            { icon: '🏢', label: 'Empresa', value: resumen.empresa },
            { icon: esAceptado ? '✅' : '❌', label: 'Estado', value: esAceptado ? 'Autorizado' : 'Rechazado' },
            { icon: '📅', label: 'Fecha', value: resumen.fecha },
            { icon: '🕐', label: 'Hora', value: resumen.hora },
            { icon: '🔖', label: 'Folio', value: resumen.folio },
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

      {/* Notification badge */}
      <div className="flex items-center justify-center gap-2 py-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={esAceptado ? '#10B981' : '#F59E0B'} className="w-5 h-5" aria-hidden="true">
          <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508.75.75 0 00.277-.043A6.001 6.001 0 0010 18c1.26 0 2.466-.387 3.468-1.06a.75.75 0 00-.211-1.33 32.91 32.91 0 01-3.257-.508.75.75 0 01-.515-1.076A11.448 11.448 0 0010.743 8a.75.75 0 00-1.486 0c0 1.887-.454 3.665-1.257 5.234z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-slate-500 font-medium">
          Notificaciones enviadas a los involucrados
        </span>
      </div>

      {/* Close message */}
      <p className="text-center text-sm text-slate-400 pt-1">
        Ya puedes cerrar esta ventana de forma segura
      </p>
    </div>
  );
}
