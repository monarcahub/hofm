import { createClient } from '@supabase/supabase-js';

// Public client-side configuration
// CRITICAL: NEVER import or expose SUPABASE_SERVICE_ROLE_KEY or N8N_WEBHOOK_TOKEN in client-side code!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qqzvmwbweuaybkymkldi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder-anon-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type UserRole = 'admin' | 'secretary' | 'doctor' | 'patient';

/**
 * Normalizes role strings from database (supports both Portuguese and English schemas)
 */
export function normalizeRole(roleString?: string | null): UserRole | null {
  if (!roleString) return null;
  const r = roleString.trim().toLowerCase();
  if (r === 'admin' || r === 'administrador') return 'admin';
  if (r === 'secretary' || r === 'secretaria') return 'secretary';
  if (r === 'doctor' || r === 'medico' || r === 'médico') return 'doctor';
  if (r === 'patient' || r === 'paciente') return 'patient';
  return null;
}

export interface UserProfile {
  user_id?: string;
  userId?: string;
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt?: string;
}

export interface Patient {
  id: string;
  userId?: string | null;
  internalId: string;
  fullName: string;
  email?: string | null;
  phone: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Exam {
  id: string;
  patientId: string;
  title: string;
  examDate: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdBy?: string;
  createdAt: string;
  patient?: {
    id: string;
    internalId?: string;
    fullName: string;
    phone: string;
    email?: string;
  };
}

export type NotificationStatus =
  | 'pendente'
  | 'processando'
  | 'enviado'
  | 'entregue'
  | 'lido'
  | 'falha';

export interface NotificationRecord {
  id: string;
  patientId: string;
  examId?: string;
  examSummary?: string;
  channel: 'whatsapp_web' | 'whatsapp_meta_template' | 'email';
  templateName?: string;
  status: NotificationStatus;
  wamid?: string;
  errorMessage?: string;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
  patient?: {
    fullName: string;
    phone: string;
  };
  exam?: {
    title: string;
  };
}
