import type { FlowConfig, CompletarPayload, FlowType, CallCenterPayload } from '../types';
import axiosInstance from './axiosInstance';
import {
  getMockFlowConfig,
  mockEnviarOtp,
  mockValidarOtp,
  mockCompletar,
  mockAceptarDocumento,
  mockRechazarDocumento,
} from '../mock/flowConfig.mock';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const firmaService = {
  async obtenerConfig(uuid: string, flowType?: FlowType): Promise<FlowConfig> {
    if (useMock) {
      return getMockFlowConfig(uuid, flowType);
    }
    const { data } = await axiosInstance.get<FlowConfig>(`/api/firma/${uuid}`);
    return data;
  },

  async enviarOtp(uuid: string): Promise<{ success: boolean }> {
    if (useMock) {
      return mockEnviarOtp();
    }
    const { data } = await axiosInstance.post<{ success: boolean }>(
      `/api/firma/${uuid}/otp/enviar`
    );
    return data;
  },

  async validarOtp(uuid: string, codigo: string): Promise<{ valido: boolean }> {
    if (useMock) {
      return mockValidarOtp(codigo);
    }
    const { data } = await axiosInstance.post<{ valido: boolean }>(
      `/api/firma/${uuid}/otp/validar`,
      { codigo }
    );
    return data;
  },

  async completar(uuid: string, payload: CompletarPayload): Promise<{ success: boolean; comprobanteUrl: string | null }> {
    if (useMock) {
      return mockCompletar();
    }
    const { data } = await axiosInstance.post<{ success: boolean; comprobanteUrl: string | null }>(
      `/api/firma/${uuid}/completar`,
      payload
    );
    return data;
  },

  async completarCallCenter(uuid: string, payload: CallCenterPayload): Promise<{ success: boolean; comprobanteUrl: string | null }> {
    if (useMock) {
      return mockCompletar();
    }
    const { data } = await axiosInstance.post<{ success: boolean; comprobanteUrl: string | null }>(
      `/api/call-center/${uuid}/completar`,
      payload
    );
    return data;
  },

  async aceptarDocumento(uuid: string): Promise<{ success: boolean }> {
    if (useMock) {
      return mockAceptarDocumento();
    }
    const { data } = await axiosInstance.post<{ success: boolean }>(
      `/api/revisar/${uuid}/aceptar`
    );
    return data;
  },

  async rechazarDocumento(uuid: string): Promise<{ success: boolean }> {
    if (useMock) {
      return mockRechazarDocumento();
    }
    const { data } = await axiosInstance.post<{ success: boolean }>(
      `/api/revisar/${uuid}/rechazar`
    );
    return data;
  },
};
