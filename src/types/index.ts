// src/types/index.ts — Tipos centralizados del proyecto firmatest

export type StepId = 'checks_legales' | 'otp' | 'biometria' | 'visor_documentos' | 'firma';

export interface PasoConfig {
  id: StepId;
  nombre: string;
  orden: number;
  habilitado: boolean;
}

export interface CheckLegal {
  id: string;
  texto: string;
  requerido: boolean;
}

export interface Documento {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  requerido: boolean;
}

export interface Configuracion {
  otp_longitud: number;
  intentos_otp_max: number;
  telefono_enmascarado: string;
}

export interface Cliente {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}

export interface Empresa {
  nombre: string;
  logo_url: string;
}

export interface FlowConfig {
  uuid: string;
  cliente: Cliente;
  empresa: Empresa;
  documento_titulo: string;
  pasos: PasoConfig[];
  checks_legales: CheckLegal[];
  documentos: Documento[];
  configuracion: Configuracion;
}

export interface GeolocalizacionData {
  latitud: number;
  longitud: number;
  precision: number;
  timestamp: number;
}

export interface CompletarPayload {
  checksAceptados: string[];
  codigoOtp: string;
  selfieBase64: string | null;
  firmaBase64: string;
  documentosLeidos: string[];
  geolocalizacion: GeolocalizacionData | null;
}

export type ErrorType =
  | 'uuid_invalido'
  | 'no_encontrado'
  | 'ya_firmado'
  | 'sin_conexion'
  | 'timeout'
  | 'desconocido';

export interface AppError {
  tipo: ErrorType;
  titulo: string;
  mensaje: string;
  reintentable: boolean;
}

export interface FirmaState {
  flowConfig: FlowConfig | null;
  pasoActual: number;
  mostrarBienvenida: boolean;
  checksAceptados: string[];
  otpVerificado: boolean;
  codigoOtp: string;
  selfieBase64: string | null;
  firmaBase64: string | null;
  documentosLeidos: string[];
  geolocalizacion: GeolocalizacionData | null;
  cargando: boolean;
  error: AppError | null;
  completado: boolean;

  setFlowConfig: (config: FlowConfig) => void;
  comenzarFlujo: () => void;
  avanzarPaso: () => void;
  retrocederPaso: () => void;
  irAPaso: (paso: number) => void;
  toggleCheck: (id: string) => void;
  aceptarTodosChecks: () => void;
  setOtpVerificado: (v: boolean) => void;
  setCodigoOtp: (codigo: string) => void;
  setSelfie: (base64: string) => void;
  setFirma: (base64: string) => void;
  marcarDocumentoLeido: (id: string) => void;
  setGeolocalizacion: (geo: GeolocalizacionData | null) => void;
  setCargando: (c: boolean) => void;
  setError: (e: AppError | null) => void;
  setCompletado: () => void;
  resetStore: () => void;
  getPasosActivos: () => PasoConfig[];
}
