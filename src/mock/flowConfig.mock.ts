import type { FlowConfig } from '../types';

export const MOCK_FLOW_CONFIG: FlowConfig = {
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  cliente: {
    nombre: 'Juan Carlos',
    apellido_paterno: 'Pérez',
    apellido_materno: 'López',
  },
  empresa: {
    nombre: 'FirmaTest S.A. de C.V.',
    logo_url: 'https://via.placeholder.com/200x48/1A3C6E/FFFFFF?text=FinTech+Corp',
  },
  documento_titulo: 'Contrato de Apertura de Cuenta Digital',
  pasos: [
    { id: 'checks_legales', nombre: 'Términos', orden: 1, habilitado: true },
    { id: 'otp', nombre: 'Verificación', orden: 2, habilitado: true },
    { id: 'biometria', nombre: 'Identidad', orden: 3, habilitado: true },
    { id: 'visor_documentos', nombre: 'Documentos', orden: 4, habilitado: true },
    { id: 'firma', nombre: 'Firma', orden: 5, habilitado: true },
  ],
  checks_legales: [
    {
      id: 'check_terms',
      texto: 'Acepto los Términos y Condiciones del servicio de firma electrónica de FirmaTest S.A. de C.V.',
      requerido: true,
    },
    {
      id: 'check_privacy',
      texto: 'He leído y acepto el Aviso de Privacidad y autorizo el tratamiento de mis datos personales conforme a la legislación aplicable.',
      requerido: true,
    },
    {
      id: 'check_electronic',
      texto: 'Reconozco que la firma electrónica realizada a través de esta plataforma tiene la misma validez legal que una firma autógrafa, conforme al Código de Comercio y la Ley de Firma Electrónica Avanzada.',
      requerido: true,
    },
    {
      id: 'check_marketing',
      texto: 'Acepto recibir comunicaciones comerciales y promocionales de FirmaTest S.A. de C.V. por medios electrónicos.',
      requerido: false,
    },
  ],
  documentos: [
    {
      id: 'doc_contrato',
      nombre: 'Contrato de Apertura de Cuenta Digital',
      descripcion: 'Contrato principal que establece los términos y condiciones de tu cuenta digital.',
      url: '/CARTA.pdf',
      requerido: true,
    },
    {
      id: 'doc_comisiones',
      nombre: 'Tabla de Comisiones y Tarifas',
      descripcion: 'Documento con el detalle de todas las comisiones aplicables a tu cuenta.',
      url: '/CARTA.pdf',
      requerido: true,
    },
  ],
  configuracion: {
    otp_longitud: 6,
    intentos_otp_max: 3,
    telefono_enmascarado: '****-****-5678',
  },
};

export const getMockFlowConfig = (uuid: string): Promise<FlowConfig> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (uuid === MOCK_FLOW_CONFIG.uuid) {
        resolve(MOCK_FLOW_CONFIG);
      } else {
        reject(new Error('Solicitud no encontrada'));
      }
    }, 1200);
  });

export const mockEnviarOtp = (): Promise<{ success: boolean }> =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 800);
  });

export const mockValidarOtp = (codigo: string): Promise<{ valido: boolean }> =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ valido: codigo === '123456' }), 1000);
  });

export const mockCompletar = (): Promise<{ success: boolean; comprobanteUrl: string | null }> =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, comprobanteUrl: null }), 1500);
  });
