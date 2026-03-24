import { create } from 'zustand';
import type { FirmaState, FlowConfig, FlowType, GeolocalizacionData, AppError, PasoConfig, DecisionType } from '../types';

const initialState = {
  flowConfig: null as FlowConfig | null,
  flowType: null as FlowType | null,
  pasoActual: -1,
  mostrarBienvenida: true,
  checksAceptados: [] as string[],
  otpVerificado: false,
  codigoOtp: '',
  selfieBase64: null as string | null,
  firmaBase64: null as string | null,
  documentosLeidos: [] as string[],
  geolocalizacion: null as GeolocalizacionData | null,
  decision: null as DecisionType,
  cargando: false,
  error: null as AppError | null,
  completado: false,
};

export const useFirmaStore = create<FirmaState>((set, get) => ({
  ...initialState,

  setFlowConfig: (config: FlowConfig) => set({ flowConfig: config, cargando: false }),

  setFlowType: (type: FlowType) => set({ flowType: type }),

  comenzarFlujo: () => set({ mostrarBienvenida: false, pasoActual: 0 }),

  avanzarPaso: () => {
    const { pasoActual, flowConfig } = get();
    if (!flowConfig) return;
    const pasosActivos = flowConfig.pasos
      .filter((p) => p.habilitado)
      .sort((a, b) => a.orden - b.orden);
    if (pasoActual < pasosActivos.length - 1) {
      set({ pasoActual: pasoActual + 1 });
    }
  },

  retrocederPaso: () => {
    const { pasoActual } = get();
    if (pasoActual > 0) {
      set({ pasoActual: pasoActual - 1 });
    }
  },

  irAPaso: (paso: number) => set({ pasoActual: paso }),

  toggleCheck: (id: string) => {
    const { checksAceptados } = get();
    if (checksAceptados.includes(id)) {
      set({ checksAceptados: checksAceptados.filter((c) => c !== id) });
    } else {
      set({ checksAceptados: [...checksAceptados, id] });
    }
  },

  aceptarTodosChecks: () => {
    const { flowConfig } = get();
    if (!flowConfig) return;
    set({ checksAceptados: flowConfig.checks_legales.map((c) => c.id) });
  },

  setOtpVerificado: (v: boolean) => set({ otpVerificado: v }),
  setCodigoOtp: (codigo: string) => set({ codigoOtp: codigo }),
  setSelfie: (base64: string) => set({ selfieBase64: base64 }),
  setFirma: (base64: string) => set({ firmaBase64: base64 }),

  marcarDocumentoLeido: (id: string) => {
    const { documentosLeidos } = get();
    if (!documentosLeidos.includes(id)) {
      set({ documentosLeidos: [...documentosLeidos, id] });
    }
  },

  setGeolocalizacion: (geo: GeolocalizacionData | null) => set({ geolocalizacion: geo }),
  setDecision: (d: DecisionType) => set({ decision: d }),
  setCargando: (c: boolean) => set({ cargando: c }),
  setError: (e: AppError | null) => set({ error: e }),
  setCompletado: () => set({ completado: true }),
  resetStore: () => set(initialState),

  getPasosActivos: (): PasoConfig[] => {
    const { flowConfig } = get();
    if (!flowConfig) return [];
    return flowConfig.pasos
      .filter((p) => p.habilitado)
      .sort((a, b) => a.orden - b.orden);
  },
}));
