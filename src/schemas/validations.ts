import { z } from 'zod';

export const uuidSchema = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  'UUID v4 no válido'
);

export const otpSchema = z.string().min(1, 'Código requerido');

export const pasoConfigSchema = z.object({
  id: z.enum(['checks_legales', 'otp', 'biometria', 'visor_documentos', 'firma']),
  nombre: z.string(),
  orden: z.number(),
  habilitado: z.boolean(),
});

export const checkLegalSchema = z.object({
  id: z.string(),
  texto: z.string(),
  requerido: z.boolean(),
});

export const documentoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string(),
  url: z.string().url(),
  requerido: z.boolean(),
});

export const configuracionSchema = z.object({
  otp_longitud: z.number().int().min(4).max(8),
  intentos_otp_max: z.number().int().min(1),
  telefono_enmascarado: z.string(),
});

export const clienteSchema = z.object({
  nombre: z.string(),
  apellido_paterno: z.string(),
  apellido_materno: z.string(),
});

export const empresaSchema = z.object({
  nombre: z.string(),
  logo_url: z.string().url(),
});

export const flowConfigSchema = z.object({
  uuid: uuidSchema,
  cliente: clienteSchema,
  empresa: empresaSchema,
  documento_titulo: z.string(),
  pasos: z.array(pasoConfigSchema),
  checks_legales: z.array(checkLegalSchema),
  documentos: z.array(documentoSchema),
  configuracion: configuracionSchema,
});

export type FlowConfigSchema = z.infer<typeof flowConfigSchema>;
