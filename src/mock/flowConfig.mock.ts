import type { FlowConfig, FlowType } from '../types';

const MOCK_UUID_SIGN_ALL = '550e8400-e29b-41d4-a716-446655440000';
const MOCK_UUID_CALL_CENTER = '660e8400-e29b-41d4-a716-446655440001';
const MOCK_UUID_REVISAR = '770e8400-e29b-41d4-a716-446655440002';

export const MOCK_SIGN_ALL_CONFIG: FlowConfig = {
  uuid: MOCK_UUID_SIGN_ALL,
  flowType: 'sign-all',
  cliente: {
    nombre: 'Juan Carlos',
    apellido_paterno: 'Pérez',
    apellido_materno: 'López',
  },
  empresa: {
    nombre: 'FirmaTest S.A. de C.V.',
    logo_url: 'https://main.firmenti.net/developer/Portal/pictures/logo_hed.gif',
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
      texto: 'Acepto los Términos y Condiciones del servicio de firma electrónica de FirmaTest S.A. de C.V. Al aceptar estos términos, usted reconoce y acepta que ha leído, comprendido y está de acuerdo con todas las disposiciones contenidas en el presente documento. Este servicio de firma electrónica se rige por las leyes y regulaciones aplicables en los Estados Unidos Mexicanos, incluyendo pero no limitándose al Código de Comercio, la Ley de Firma Electrónica Avanzada y las disposiciones emitidas por la Secretaría de Economía.\n\nEl uso de esta plataforma implica la aceptación irrevocable de que cualquier documento firmado electrónicamente a través de este medio tendrá plena validez jurídica y será vinculante para todas las partes involucradas. FirmaTest S.A. de C.V. se reserva el derecho de modificar estos términos en cualquier momento, notificando al usuario con al menos 30 días naturales de anticipación.\n\nAsimismo, el usuario se compromete a utilizar la plataforma de manera responsable, proporcionando información veraz y actualizada en todo momento. Cualquier uso indebido o fraudulento de la plataforma podrá resultar en la cancelación inmediata del servicio y las acciones legales correspondientes.',
      requerido: true,
    },
    {
      id: 'check_privacy',
      texto: 'He leído y acepto el Aviso de Privacidad Integral de FirmaTest S.A. de C.V. y autorizo expresamente el tratamiento de mis datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su Reglamento. Los datos personales recabados serán utilizados para las siguientes finalidades: (i) identificación y verificación de identidad del titular, (ii) gestión y administración del servicio de firma electrónica, (iii) cumplimiento de obligaciones legales y regulatorias, (iv) comunicación relacionada con el estado de los documentos firmados.\n\nSus datos personales podrán ser transferidos a terceros nacionales o internacionales que participen en la prestación del servicio, incluyendo proveedores de servicios de almacenamiento en la nube, entidades gubernamentales cuando sea requerido por ley, y socios comerciales autorizados. En todos los casos, se garantiza que dichos terceros cumplan con los estándares de seguridad y confidencialidad establecidos por la legislación aplicable.\n\nUsted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales (derechos ARCO), así como a revocar su consentimiento para el tratamiento de los mismos, dirigiendo su solicitud al correo electrónico privacidad@firmatest.com.mx o presentándola directamente en nuestras oficinas ubicadas en Av. Reforma 505, Col. Cuauhtémoc, Ciudad de México.',
      requerido: true,
    },
    {
      id: 'check_electronic',
      texto: 'Reconozco que la firma electrónica realizada a través de esta plataforma tiene la misma validez legal que una firma autógrafa, conforme al Código de Comercio y la Ley de Firma Electrónica Avanzada. Declaro bajo protesta de decir verdad que la información biométrica y los datos proporcionados durante el proceso de firma son verídicos y corresponden a mi persona.\n\nEntiendo que el proceso de firma electrónica incluye mecanismos de autenticación multifactor que garantizan la integridad, autenticidad y no repudio de los documentos firmados. Estos mecanismos incluyen, entre otros: verificación mediante código OTP enviado a mi dispositivo móvil registrado, captura de datos biométricos faciales para verificación de identidad, registro de geolocalización al momento de la firma, y sellado de tiempo digital certificado.\n\nAcepto que cualquier controversia que surja en relación con la validez, interpretación o cumplimiento de los documentos firmados electrónicamente será sometida a los tribunales competentes de la Ciudad de México, renunciando expresamente a cualquier otro fuero que pudiera corresponderme por razón de mi domicilio presente o futuro.',
      requerido: true,
    },
    {
      id: 'check_marketing',
      texto: 'Acepto recibir comunicaciones comerciales y promocionales de FirmaTest S.A. de C.V. por medios electrónicos, incluyendo correo electrónico, mensajes SMS, notificaciones push y llamadas telefónicas. Entiendo que puedo revocar este consentimiento en cualquier momento contactando al departamento de atención al cliente o utilizando el enlace de cancelación incluido en cada comunicación.',
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

export const MOCK_CALL_CENTER_CONFIG: FlowConfig = {
  uuid: MOCK_UUID_CALL_CENTER,
  flowType: 'call-center',
  cliente: {
    nombre: 'María Elena',
    apellido_paterno: 'García',
    apellido_materno: 'Rodríguez',
  },
  empresa: {
    nombre: 'FirmaTest S.A. de C.V.',
    logo_url: 'https://main.firmenti.net/developer/Portal/pictures/logo_hed.gif',
  },
  documento_titulo: 'Contrato de Crédito Personal',
  pasos: [
    { id: 'otp', nombre: 'Verificación', orden: 1, habilitado: true },
    { id: 'checks_legales', nombre: 'Términos', orden: 2, habilitado: true },
    { id: 'biometria', nombre: 'Identidad', orden: 3, habilitado: true },
    { id: 'firma', nombre: 'Firma', orden: 4, habilitado: true },
  ],
  checks_legales: [
    {
      id: 'check_terms_cc',
      texto: 'Acepto los Términos y Condiciones del servicio de firma electrónica de FirmaTest S.A. de C.V.',
      requerido: true,
    },
    {
      id: 'check_privacy_cc',
      texto: 'He leído y acepto el Aviso de Privacidad y autorizo el tratamiento de mis datos personales conforme a la legislación aplicable.',
      requerido: true,
    },
    {
      id: 'check_electronic_cc',
      texto: 'Reconozco que la firma electrónica realizada a través de esta plataforma tiene la misma validez legal que una firma autógrafa.',
      requerido: true,
    },
  ],
  documentos: [],
  configuracion: {
    otp_longitud: 6,
    intentos_otp_max: 3,
    telefono_enmascarado: '****-****-1234',
  },
};

export const MOCK_REVISAR_CONFIG: FlowConfig = {
  uuid: MOCK_UUID_REVISAR,
  flowType: 'revisar',
  cliente: {
    nombre: 'Roberto',
    apellido_paterno: 'Hernández',
    apellido_materno: 'Martínez',
  },
  empresa: {
    nombre: 'FirmaTest S.A. de C.V.',
    logo_url: 'https://main.firmenti.net/developer/Portal/pictures/logo_hed.gif',
  },
  documento_titulo: 'Acuerdo de Confidencialidad',
  documento_descripcion: 'Este documento establece las obligaciones de confidencialidad entre las partes involucradas. Por favor revísalo cuidadosamente antes de tomar una decisión.',
  pasos: [
    { id: 'info_documento', nombre: 'Información', orden: 1, habilitado: true },
    { id: 'visor_documentos', nombre: 'Documento', orden: 2, habilitado: true },
    { id: 'decision', nombre: 'Decisión', orden: 3, habilitado: true },
  ],
  checks_legales: [],
  documentos: [
    {
      id: 'doc_confidencialidad',
      nombre: 'Acuerdo de Confidencialidad',
      descripcion: 'Acuerdo que regula el manejo de información confidencial entre las partes.',
      url: '/CARTA.pdf',
      requerido: true,
    },
  ],
  configuracion: {
    otp_longitud: 6,
    intentos_otp_max: 3,
    telefono_enmascarado: '',
  },
};

// Backward compat: keep MOCK_FLOW_CONFIG pointing to sign-all
export const MOCK_FLOW_CONFIG = MOCK_SIGN_ALL_CONFIG;

const MOCK_CONFIGS: Record<string, FlowConfig> = {
  [MOCK_UUID_SIGN_ALL]: MOCK_SIGN_ALL_CONFIG,
  [MOCK_UUID_CALL_CENTER]: MOCK_CALL_CENTER_CONFIG,
  [MOCK_UUID_REVISAR]: MOCK_REVISAR_CONFIG,
};

export const getMockFlowConfig = (uuid: string, flowType?: FlowType): Promise<FlowConfig> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // Try by UUID first
      const byUuid = MOCK_CONFIGS[uuid];
      if (byUuid) {
        resolve(byUuid);
        return;
      }

      // If not found by UUID, resolve by flowType and assign the given uuid
      if (flowType) {
        const configs: Record<FlowType, FlowConfig> = {
          'sign-all': MOCK_SIGN_ALL_CONFIG,
          'call-center': MOCK_CALL_CENTER_CONFIG,
          'revisar': MOCK_REVISAR_CONFIG,
        };
        const config = configs[flowType];
        if (config) {
          resolve({ ...config, uuid });
          return;
        }
      }

      reject(new Error('Solicitud no encontrada'));
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

export const mockAceptarDocumento = (): Promise<{ success: boolean }> =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1000);
  });

export const mockRechazarDocumento = (): Promise<{ success: boolean }> =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1000);
  });
