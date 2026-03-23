import { useState, useEffect, useMemo } from 'react';
import { useFirmaStore } from '../store/firmaStore';
import { formatDate, formatTime, truncateUuid } from '../utils/helpers';

const CONFETTI_COLORS = ['#FF6B35', '#00C896', '#1A3C6E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Pre-generate confetti pieces outside render to satisfy React Compiler purity rules
const CONFETTI_PIECES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
  left: `${(((i * 7 + 13) * 17) % 100)}%`,
  delay: `${((i * 3 + 5) % 20) / 10}s`,
  xOffset: `${((i * 13 + 7) % 200) - 100}px`,
  duration: `${2.5 + ((i * 11 + 3) % 20) / 10}s`,
  size: `${6 + ((i * 9 + 2) % 8)}px`,
  rotation: `${((i * 37 + 11) % 360)}deg`,
}));

function Confetti() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden" aria-hidden="true">
      {CONFETTI_PIECES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            backgroundColor: p.color,
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            rotate: p.rotation,
            ['--confetti-x' as string]: p.xOffset,
            animation: `confettiFall ${p.duration} ease-in ${p.delay} forwards, confettiSpread ${p.duration} ease-in-out ${p.delay} forwards`,
          }}
        />
      ))}
    </div>
  );
}

export function SuccessPage() {
  const flowConfig = useFirmaStore((s) => s.flowConfig);
  const [showContent, setShowContent] = useState(false);

  const resumen = useMemo(() => {
    const now = new Date();
    return {
      documento: flowConfig?.documento_titulo ?? 'Documento firmado',
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

  // Don't reset store on unmount — StrictMode double-mount would clear state

  return (
    <>
      <Confetti />
      <div className="space-y-8" style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease-in' }}>

        {/* Animated check circle */}
        <div className="flex justify-center pt-4">
          <div className="relative">
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" style={{ animationDuration: '2s' }} />
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center shadow-xl relative"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
            >
              <svg viewBox="0 0 52 52" className="w-14 h-14" aria-label="Firma completada">
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
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            ¡Firma completada!
          </h1>
          <p className="text-base text-slate-500 max-w-xs mx-auto leading-relaxed">
            Tu firma electrónica ha sido registrada correctamente y de forma segura.
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Card header */}
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #1A3C6E, #2A5A9E)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-5 h-5 shrink-0" aria-hidden="true">
              <path fillRule="evenodd" d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5V7A2.5 2.5 0 0011 4.5H8.128a2.252 2.252 0 011.884-1.488A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M2 7a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm2 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-bold text-white">Resumen de la firma</h3>
          </div>

          {/* Card body */}
          <div className="px-5 py-4 space-y-3">
            {[
              { icon: '📄', label: 'Documento', value: resumen.documento },
              { icon: '🏢', label: 'Empresa', value: resumen.empresa },
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

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#10B981" className="w-5 h-5" aria-hidden="true">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-slate-500 font-medium">
            Firma protegida con cifrado de extremo a extremo
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            className="w-full py-3.5 px-6 rounded-full font-bold text-white text-sm shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98] cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #1A3C6E, #2A5A9E)' }}
          >
            <span className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
              Descargar comprobante
            </span>
          </button>

          <p className="text-center text-sm text-slate-400 pt-1">
            Ya puedes cerrar esta ventana de forma segura
          </p>
        </div>
      </div>
    </>
  );
}
