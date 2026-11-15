import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Supabase Configuration from Environment
// Public keys (also shared with frontend via VITE_ prefix):
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qqzvmwbweuaybkymkldi.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// PRIVATE SERVER-ONLY SECRETS (Never expose to client!):
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';
const N8N_WEBHOOK_TOKEN = process.env.N8N_WEBHOOK_TOKEN || '';
const PATIENT_RECOVERY_WEBHOOK_URL =
  process.env.PATIENT_RECOVERY_WEBHOOK_URL || 'https://webhook.monarcahub.com/webhook/recupera-acesso';

// Initialize Admin Supabase Client (Exclusively server-side with service_role key)
const supabaseAdmin = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Initialize Standard Anon Supabase Client (For fallback JWT verification)
const supabasePublic = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Multer Storage Configuration for Exam Uploads (in-memory buffer, max 25MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Apenas PDF, JPEG, PNG e WebP são aceitos.'));
    }
  },
});

export type UserRole = 'admin' | 'secretary' | 'doctor' | 'patient';

function normalizeRole(raw?: string | null): UserRole | null {
  if (!raw) return null;
  const lower = raw.trim().toLowerCase();
  if (lower === 'admin' || lower === 'administrador') return 'admin';
  if (lower === 'secretary' || lower === 'secretaria') return 'secretary';
  if (lower === 'doctor' || lower === 'medico' || lower === 'médico') return 'doctor';
  if (lower === 'patient' || lower === 'paciente') return 'patient';
  return null;
}

/**
 * Generates an 8-character random alphanumeric identifier (letters + numbers)
 * avoiding visually ambiguous characters (0/O, 1/I) for patient ease of use.
 */
function generatePatientInternalId(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '23456789';
  const chars: string[] = [];

  for (let i = 0; i < 4; i++) {
    chars.push(letters[crypto.randomInt(0, letters.length)]);
  }
  for (let i = 0; i < 4; i++) {
    chars.push(digits[crypto.randomInt(0, digits.length)]);
  }
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function normalizePhoneDigits(raw?: string | null): string {
  return (raw || '').replace(/\D/g, '');
}

function phonesMatch(storedPhone: string, inputPhone: string): boolean {
  const a = normalizePhoneDigits(storedPhone);
  const b = normalizePhoneDigits(inputPhone);
  if (a.length < 10 || b.length < 10) return false;
  return a === b || a === `55${b}` || `55${a}` === b;
}

// Middleware to authenticate user from Bearer JWT
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role: UserRole | null;
    fullName: string;
  };
}

async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Sessão inválida ou não informada.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const client = supabaseAdmin || supabasePublic;

    if (!client) {
      res.status(503).json({ error: 'Serviço de autenticação temporariamente indisponível no servidor.' });
      return;
    }

    const { data: { user }, error } = await client.auth.getUser(token);
    if (error || !user) {
      res.status(401).json({ error: 'Sessão expirada. Por favor, autentique-se novamente.' });
      return;
    }

    // Consultar a tabela fm_profiles utilizando 'user_id' como chave primária vinculada ao auth.uid()
    let detectedRole: UserRole | null = null;
    let fullName = user.user_metadata?.full_name || '';

    if (supabaseAdmin) {
      // 1. Chave primária user_id na tabela fm_profiles
      let { data: profile } = await supabaseAdmin
        .from('fm_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fallback em caso de linha com coluna 'id'
      if (!profile) {
        const { data: legacyProfile } = await supabaseAdmin
          .from('fm_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (legacyProfile) profile = legacyProfile;
      }

      if (profile) {
        detectedRole = normalizeRole(profile.role);
        fullName = profile.full_name || fullName;
      }
    } else if (supabasePublic) {
      // Fallback com token do chamador caso service role não esteja injetada
      const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      let { data: profile } = await userClient
        .from('fm_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) {
        const { data: legacyProfile } = await userClient
          .from('fm_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (legacyProfile) profile = legacyProfile;
      }

      if (profile) {
        detectedRole = normalizeRole(profile.role);
        fullName = profile.full_name || fullName;
      }
    }
    // Permissões são estritamente derivadas da tabela fm_profiles (sem conceder permissão administrativa via metadados)

    req.user = {
      id: user.id, // Identidade do usuário obtida do JWT validado pelo Supabase Auth
      email: user.email,
      role: detectedRole,
      fullName,
    };

    next();
  } catch (err: any) {
    res.status(500).json({ error: 'Falha interna na verificação de permissões.' });
  }
}

// Middleware to enforce specific roles (verified on backend)
function requireRoles(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        error: 'Acesso não autorizado: seu perfil não possui permissão para executar esta operação.',
      });
      return;
    }
    next();
  };
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health check & configuration status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasSupabaseUrl: !!SUPABASE_URL,
    hasAnonKey: !!SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY,
    hasN8nWebhook: !!N8N_WEBHOOK_URL,
  });
});

// 2. Identify authenticated user permissions automatically from fm_profiles
app.get('/api/auth/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    // Se o usuário não possuir perfil válido em fm_profiles, bloquear acesso
    if (!role) {
      res.status(403).json({
        error: 'Acesso não autorizado. Seu usuário não possui um perfil ativo no sistema do hospital. Entre em contato com a administração.',
        validProfile: false,
      });
      return;
    }

    let patientData = null;

    if (supabaseAdmin && role === 'patient') {
      const { data: patient } = await supabaseAdmin
        .from('fm_patients')
        .select('id, internal_id, full_name, email, phone')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (patient) {
        patientData = {
          ...patient,
          internalId: patient.internal_id,
          fullName: patient.full_name,
        };
      }
    }

    res.json({
      validProfile: true,
      user: {
        id: req.user!.id,
        email: req.user!.email,
        fullName: req.user!.fullName,
        role,
      },
      patient: patientData,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao verificar perfil do usuário.' });
  }
});

// 2B. Patient Login: Authenticate with (Email OR Phone with DDD) + 8-char Internal Identifier (`internal_id`)
app.post('/api/auth/patient-login', async (req: Request, res: Response) => {
  try {
    if (!supabaseAdmin) {
      res.status(503).json({ error: 'Serviço de autenticação temporariamente indisponível.' });
      return;
    }

    const rawIdentifier = (req.body.identifier || req.body.emailOrPhone || '').toString().trim();
    const rawCode = (req.body.internalId || req.body.accessCode || req.body.password || '').toString().trim();

    if (!rawIdentifier || !rawCode) {
      res.status(400).json({ error: 'Informe seu e-mail ou telefone com DDD e o código identificador.' });
      return;
    }

    const isEmailInput = rawIdentifier.includes('@');
    if (!isEmailInput && normalizePhoneDigits(rawIdentifier).length < 10) {
      res.status(400).json({ error: 'Informe um e-mail válido ou telefone completo com DDD.' });
      return;
    }

    // Search candidate patient records matching internal_id (exact case-insensitive validation in JS to prevent wildcard injection)
    const { data: candidates, error: lookupError } = await supabaseAdmin
      .from('fm_patients')
      .select('id, user_id, internal_id, full_name, email, phone')
      .ilike('internal_id', rawCode.replace(/[%_]/g, ''));

    if (lookupError) {
      res.status(500).json({ error: 'Erro ao consultar registro do paciente.' });
      return;
    }

    const matchedPatient = (candidates || []).find((p: any) => {
      const codeMatches = (p.internal_id || '').trim().toLowerCase() === rawCode.toLowerCase();
      if (!codeMatches) return false;

      if (isEmailInput) {
        return Boolean(p.email && p.email.trim().toLowerCase() === rawIdentifier.toLowerCase());
      }
      return phonesMatch(p.phone || '', rawIdentifier);
    });

    if (!matchedPatient) {
      res.status(401).json({
        error: 'E-mail/telefone ou código identificador inválidos. Verifique os dados fornecidos pela recepção.',
      });
      return;
    }

    let patientUserId: string | null = matchedPatient.user_id || null;
    let authEmail = '';

    // Verify if existing linked user_id is valid and holds patient role
    if (patientUserId) {
      const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(patientUserId);
      if (userRes?.user?.email) {
        const { data: existingProf } = await supabaseAdmin
          .from('fm_profiles')
          .select('role')
          .eq('user_id', patientUserId)
          .maybeSingle();

        if (existingProf && normalizeRole(existingProf.role) !== 'patient') {
          // Do not reuse a staff/admin auth account for patient portal access
          patientUserId = null;
        } else {
          authEmail = userRes.user.email;
        }
      } else {
        patientUserId = null;
      }
    }

    // Provision auth user lazily if not yet linked
    if (!patientUserId) {
      const candidateEmail = matchedPatient.email?.trim().toLowerCase();
      const fallbackInternalEmail = `paciente.${matchedPatient.id}@portal.freitagmunareto.com.br`;
      authEmail = candidateEmail || fallbackInternalEmail;

      const createRes = await supabaseAdmin.auth.admin.createUser({
        email: authEmail,
        password: crypto.randomBytes(16).toString('hex'),
        email_confirm: true,
        user_metadata: {
          full_name: matchedPatient.full_name,
          internal_id: matchedPatient.internal_id,
        },
      });

      if (createRes.error) {
        if (createRes.error.message?.toLowerCase().includes('already')) {
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = listData?.users?.find(
            (u) => u.email?.toLowerCase() === authEmail.toLowerCase()
          );

          if (existingUser) {
            const { data: existingProf } = await supabaseAdmin
              .from('fm_profiles')
              .select('role')
              .eq('user_id', existingUser.id)
              .maybeSingle();

            if (existingProf && normalizeRole(existingProf.role) !== 'patient') {
              // Staff email also registered as test patient: provision isolated patient-scoped auth user
              authEmail = fallbackInternalEmail;
              const fallbackRes = await supabaseAdmin.auth.admin.createUser({
                email: authEmail,
                password: crypto.randomBytes(16).toString('hex'),
                email_confirm: true,
                user_metadata: {
                  full_name: matchedPatient.full_name,
                  internal_id: matchedPatient.internal_id,
                },
              });

              if (fallbackRes.error) {
                const { data: listData2 } = await supabaseAdmin.auth.admin.listUsers();
                const fallbackExisting = listData2?.users?.find(
                  (u) => u.email?.toLowerCase() === authEmail.toLowerCase()
                );
                patientUserId = fallbackExisting?.id || null;
              } else {
                patientUserId = fallbackRes.data.user.id;
              }
            } else {
              patientUserId = existingUser.id;
            }
          }
        } else {
          res.status(500).json({ error: 'Não foi possível preparar a sessão segura do paciente.' });
          return;
        }
      } else {
        patientUserId = createRes.data.user.id;
      }

      if (!patientUserId) {
        res.status(500).json({ error: 'Não foi possível vincular a conta de acesso do paciente.' });
        return;
      }

      await supabaseAdmin.from('fm_profiles').upsert(
        {
          user_id: patientUserId,
          full_name: matchedPatient.full_name,
          role: 'patient',
          created_at: new Date().toISOString(),
        },
        { onConflict: 'user_id', ignoreDuplicates: true }
      );

      await supabaseAdmin
        .from('fm_patients')
        .update({ user_id: patientUserId })
        .eq('id', matchedPatient.id);
    } else {
      // Ensure fm_profiles exists for linked patient
      await supabaseAdmin.from('fm_profiles').upsert(
        {
          user_id: patientUserId,
          full_name: matchedPatient.full_name,
          role: 'patient',
          created_at: new Date().toISOString(),
        },
        { onConflict: 'user_id', ignoreDuplicates: true }
      );
    }

    // Mint a cryptographic Supabase Auth session for this patient via magiclink + verifyOtp
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: authEmail,
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      res.status(500).json({ error: 'Não foi possível gerar o token de acesso do paciente.' });
      return;
    }

    const tempClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: otpData, error: otpError } = await tempClient.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: 'magiclink',
    });

    if (otpError || !otpData?.session) {
      res.status(500).json({ error: 'Falha ao autenticar a sessão segura do paciente.' });
      return;
    }

    // Record login in audit log
    await supabaseAdmin.from('fm_audit_logs').insert({
      user_id: patientUserId,
      action: 'PATIENT_PORTAL_LOGIN',
      entity_type: 'fm_patients',
      entity_id: matchedPatient.id,
      details: { login_method: isEmailInput ? 'email' : 'phone', internal_id: matchedPatient.internal_id },
      ip_address: req.ip || '',
      created_at: new Date().toISOString(),
    });

    res.json({
      success: true,
      session: {
        access_token: otpData.session.access_token,
        refresh_token: otpData.session.refresh_token,
      },
      user: {
        id: patientUserId,
        email: authEmail,
        fullName: matchedPatient.full_name,
        role: 'patient',
      },
      patient: {
        ...matchedPatient,
        internalId: matchedPatient.internal_id,
        fullName: matchedPatient.full_name,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro interno ao processar o login do paciente.' });
  }
});

// 3. Secretary/Admin: Register patient & provision Supabase Auth user securely
app.post(
  '/api/admin/patients',
  requireAuth,
  requireRoles(['admin', 'secretary']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { fullName, email, phone, internalId, createAuthUser, initialPassword } = req.body;

      if (!fullName || !phone) {
        res.status(400).json({ error: 'Nome completo e telefone são obrigatórios.' });
        return;
      }

      if (!supabaseAdmin) {
        res.status(503).json({ error: 'Operação administrativa indisponível (SUPABASE_SERVICE_ROLE_KEY ausente).' });
        return;
      }

      // Generate a unique 8-character random alphanumeric identifier if not manually supplied (NO CPF)
      let cleanInternalId = (internalId || '').toString().trim().toUpperCase();
      if (!cleanInternalId) {
        for (let attempt = 0; attempt < 5; attempt++) {
          const candidate = generatePatientInternalId();
          const { data: existingId } = await supabaseAdmin
            .from('fm_patients')
            .select('id')
            .ilike('internal_id', candidate)
            .maybeSingle();
          if (!existingId) {
            cleanInternalId = candidate;
            break;
          }
        }
        if (!cleanInternalId) {
          cleanInternalId = generatePatientInternalId();
        }
      }

      let createdAuthUserId: string | null = null;
      let isNewAuthUser = false;

      // Provision Auth user if email provided & requested
      if (createAuthUser && email) {
        const cleanEmail = email.trim().toLowerCase();
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: initialPassword || (cleanInternalId.length >= 6 ? cleanInternalId : `${cleanInternalId}HOFM`),
          email_confirm: true,
          user_metadata: {
            full_name: fullName.trim(),
            internal_id: cleanInternalId,
          },
        });

        if (authError) {
          // If already registered, fetch user by email (preserving existing staff/admin roles)
          if (authError.message?.toLowerCase().includes('already')) {
            const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
            const existing = listData?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
            if (existing) {
              const { data: existingProf } = await supabaseAdmin
                .from('fm_profiles')
                .select('role')
                .eq('user_id', existing.id)
                .maybeSingle();

              if (!existingProf || normalizeRole(existingProf.role) === 'patient') {
                createdAuthUserId = existing.id;
                isNewAuthUser = false; // Existing user - do NOT delete on failure
              }
            }
          } else {
            res.status(400).json({ error: `Não foi possível criar a credencial de acesso: ${authError.message}` });
            return;
          }
        } else {
          createdAuthUserId = authData.user.id;
          isNewAuthUser = true; // Newly created in this operation
        }

        // Ensure profile exists in fm_profiles with role 'patient' (never overwrite existing non-patient role)
        // STRICT SCHEMA: public.fm_profiles (user_id UUID PK, full_name text, role text, created_at timestamptz)
        if (createdAuthUserId) {
          await supabaseAdmin.from('fm_profiles').upsert({
            user_id: createdAuthUserId,
            full_name: fullName.trim(),
            role: 'patient',
            created_at: new Date().toISOString(),
          }, { onConflict: 'user_id', ignoreDuplicates: true });
        }
      }

      // Insert patient record into fm_patients
      // Note: Omit updated_at to prevent "invalid input syntax for type time" if column was created as type 'time'
      const { data: patientRecord, error: patientError } = await supabaseAdmin
        .from('fm_patients')
        .insert({
          user_id: createdAuthUserId,
          internal_id: cleanInternalId,
          full_name: fullName.trim(),
          email: email ? email.trim() : null,
          phone: phone.trim(),
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (patientError) {
        // Rollback only newly created auth user to avoid orphan accounts, without touching pre-existing accounts
        if (createdAuthUserId && isNewAuthUser) {
          try {
            await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId);
            await supabaseAdmin.from('fm_profiles').delete().eq('user_id', createdAuthUserId);
          } catch (delErr) {
            console.error('Falha no rollback de usuário recém-criado:', delErr);
          }
        }
        res.status(400).json({ error: `Erro ao cadastrar paciente: ${patientError.message}` });
        return;
      }

      // Record audit log
      await supabaseAdmin.from('fm_audit_logs').insert({
        user_id: req.user!.id,
        action: 'PATIENT_REGISTERED',
        entity_type: 'fm_patients',
        entity_id: patientRecord.id,
        details: { internal_id: cleanInternalId, has_auth_account: !!createdAuthUserId },
        ip_address: req.ip || '',
        created_at: new Date().toISOString(),
      });

      res.status(201).json({
        success: true,
        patient: {
          ...patientRecord,
          id: patientRecord.id,
          internalId: patientRecord.internal_id,
          internal_id: patientRecord.internal_id,
          fullName: patientRecord.full_name,
          full_name: patientRecord.full_name,
          phone: patientRecord.phone,
          email: patientRecord.email,
        },
        authUserCreated: !!createdAuthUserId,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Falha ao cadastrar paciente.' });
    }
  }
);

// 4. Secretary/Admin/Doctor: List patients
app.get(
  '/api/admin/patients',
  requireAuth,
  requireRoles(['admin', 'secretary', 'doctor']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!supabaseAdmin) {
        res.status(503).json({ error: 'Configuração do servidor indisponível.' });
        return;
      }

      const search = (req.query.search as string || '').trim().toLowerCase();

      let query = supabaseAdmin
        .from('fm_patients')
        .select('id, user_id, internal_id, full_name, email, phone, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,internal_id.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data: patients, error } = await query;
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      const normalizedPatients = (patients || []).map((p: any) => ({
        ...p,
        id: p.id,
        userId: p.user_id || p.userId || null,
        user_id: p.user_id || p.userId || null,
        internalId: p.internal_id || p.internalId || p.internal_reference || '',
        internal_id: p.internal_id || p.internal_id || p.internal_reference || '',
        fullName: p.full_name || p.fullName || '',
        full_name: p.full_name || p.fullName || '',
        email: p.email || null,
        phone: p.phone || '',
        createdAt: p.created_at || p.createdAt || '',
        created_at: p.created_at || p.createdAt || '',
        updatedAt: p.updated_at || p.updatedAt || null,
        updated_at: p.updated_at || p.updatedAt || null,
      }));

      res.json({ patients: normalizedPatients });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar lista de pacientes.' });
    }
  }
);

// 5. Secretary/Admin: Upload exam to private bucket `fm-exams`
app.post(
  '/api/admin/exams/upload',
  requireAuth,
  requireRoles(['admin', 'secretary']),
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        return;
      }

      const { patientId, title, examDate } = req.body;
      if (!patientId || !title || !examDate) {
        res.status(400).json({ error: 'Identificador do paciente, título e data do exame são obrigatórios.' });
        return;
      }

      if (!supabaseAdmin) {
        res.status(503).json({ error: 'Serviço de armazenamento não configurado no servidor.' });
        return;
      }

      // Verify patient exists
      const { data: patient, error: patientCheckError } = await supabaseAdmin
        .from('fm_patients')
        .select('id, internal_id, full_name')
        .eq('id', patientId)
        .single();

      if (patientCheckError || !patient) {
        res.status(404).json({ error: 'Paciente não localizado.' });
        return;
      }

      // Generate sanitized, non-revealing storage path (NEVER use CPF)
      const fileExt = path.extname(req.file.originalname).toLowerCase() || '.pdf';
      const cleanSafeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${fileExt}`;
      const storagePath = `patient-${patient.internal_id || patient.id}/${cleanSafeName}`;

      // Upload to private bucket `fm-exams`
      const { error: storageError } = await supabaseAdmin.storage
        .from('fm-exams')
        .upload(storagePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (storageError) {
        res.status(400).json({ error: `Erro no upload para o storage: ${storageError.message}` });
        return;
      }

      // Record metadata in `fm_exams`
      const { data: examRecord, error: examDbError } = await supabaseAdmin
        .from('fm_exams')
        .insert({
          patient_id: patient.id,
          title: title.trim(),
          exam_date: examDate,
          file_path: storagePath,
          file_size: req.file.size,
          mime_type: req.file.mimetype,
          is_published: false,
          created_by: req.user!.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (examDbError) {
        res.status(400).json({ error: `Erro ao registrar metadados do exame: ${examDbError.message}` });
        return;
      }

      // Record audit log
      await supabaseAdmin.from('fm_audit_logs').insert({
        user_id: req.user!.id,
        action: 'EXAM_UPLOADED',
        entity_type: 'fm_exams',
        entity_id: examRecord.id,
        details: { patient_id: patient.id, title, size: req.file.size },
        ip_address: req.ip || '',
        created_at: new Date().toISOString(),
      });

      res.status(201).json({
        success: true,
        exam: examRecord,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Falha ao processar upload do exame.' });
    }
  }
);

// 6. Secretary/Admin: Publish an exam
app.post(
  '/api/admin/exams/:id/publish',
  requireAuth,
  requireRoles(['admin', 'secretary']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const examId = req.params.id;

      if (!supabaseAdmin) {
        res.status(503).json({ error: 'Configuração do servidor indisponível.' });
        return;
      }

      const { data: updatedExam, error } = await supabaseAdmin
        .from('fm_exams')
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', examId)
        .select('*, patient:fm_patients(id, full_name, phone, email)')
        .single();

      if (error || !updatedExam) {
        res.status(400).json({ error: error?.message || 'Exame não encontrado.' });
        return;
      }

      // Audit log
      await supabaseAdmin.from('fm_audit_logs').insert({
        user_id: req.user!.id,
        action: 'EXAM_PUBLISHED',
        entity_type: 'fm_exams',
        entity_id: examId,
        details: { is_published: true },
        ip_address: req.ip || '',
        created_at: new Date().toISOString(),
      });

      res.json({
        success: true,
        exam: updatedExam,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Falha ao publicar exame.' });
    }
  }
);

// 7. List exams for staff (Secretary / Doctor / Admin)
app.get(
  '/api/admin/exams',
  requireAuth,
  requireRoles(['admin', 'secretary', 'doctor']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!supabaseAdmin) {
        res.status(503).json({ error: 'Configuração do servidor indisponível.' });
        return;
      }

      const patientId = req.query.patientId as string;
      let query = supabaseAdmin
        .from('fm_exams')
        .select('*, patient:fm_patients(id, internal_id, full_name, phone, email)')
        .order('exam_date', { ascending: false });

      if (patientId) {
        query = query.eq('patient_id', patientId);
      }

      const { data: exams, error } = await query;
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      const normalizedExams = (exams || []).map((e: any) => ({
        ...e,
        id: e.id,
        patientId: e.patient_id || e.patientId,
        patient_id: e.patient_id || e.patientId,
        title: e.title || '',
        examDate: e.exam_date || e.examDate || '',
        exam_date: e.exam_date || e.examDate || '',
        filePath: e.file_path || e.filePath || '',
        file_path: e.file_path || e.filePath || '',
        fileSize: e.file_size || e.fileSize || 0,
        file_size: e.file_size || e.fileSize || 0,
        mimeType: e.mime_type || e.mimeType || 'application/pdf',
        mime_type: e.mime_type || e.mimeType || 'application/pdf',
        isPublished: e.is_published ?? e.isPublished ?? false,
        is_published: e.is_published ?? e.isPublished ?? false,
        publishedAt: e.published_at || e.publishedAt || null,
        published_at: e.published_at || e.publishedAt || null,
        createdBy: e.created_by || e.createdBy || null,
        created_by: e.created_by || e.createdBy || null,
        createdAt: e.created_at || e.createdAt || '',
        created_at: e.created_at || e.createdAt || '',
        patient: e.patient ? {
          ...e.patient,
          id: e.patient.id,
          fullName: e.patient.full_name || e.patient.fullName || '',
          full_name: e.patient.full_name || e.patient.fullName || '',
          internalId: e.patient.internal_id || e.patient.internalId || '',
          internal_id: e.patient.internal_id || e.patient.internalId || '',
          phone: e.patient.phone || '',
          email: e.patient.email || '',
        } : undefined,
      }));

      res.json({ exams: normalizedExams });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao listar exames.' });
    }
  }
);

// 8. Patient Dashboard: List authenticated patient's published exams only
app.get(
  '/api/patient/exams',
  requireAuth,
  requireRoles(['patient']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!supabaseAdmin) {
        res.status(503).json({ error: 'Configuração do servidor indisponível.' });
        return;
      }

      // Find patient record linked to this authenticated auth user ID
      const { data: patient, error: patientError } = await supabaseAdmin
        .from('fm_patients')
        .select('id, internal_id, full_name, email, phone')
        .eq('user_id', req.user!.id)
        .limit(1)
        .maybeSingle();

      if (patientError || !patient) {
        res.json({ exams: [], patient: null });
        return;
      }

      // Fetch ONLY published exams belonging strictly to this patient
      const { data: exams, error: examsError } = await supabaseAdmin
        .from('fm_exams')
        .select('id, title, exam_date, file_size, mime_type, is_published, published_at')
        .eq('patient_id', patient.id)
        .eq('is_published', true)
        .order('exam_date', { ascending: false });

      if (examsError) {
        res.status(400).json({ error: examsError.message });
        return;
      }

      const normalizedExams = (exams || []).map((e: any) => ({
        ...e,
        id: e.id,
        title: e.title || '',
        examDate: e.exam_date || e.examDate || '',
        exam_date: e.exam_date || e.examDate || '',
        fileSize: e.file_size || e.fileSize || 0,
        file_size: e.file_size || e.fileSize || 0,
        mimeType: e.mime_type || e.mimeType || 'application/pdf',
        mime_type: e.mime_type || e.mimeType || 'application/pdf',
        isPublished: e.is_published ?? e.isPublished ?? true,
        is_published: e.is_published ?? e.isPublished ?? true,
        publishedAt: e.published_at || e.publishedAt || null,
        published_at: e.published_at || e.publishedAt || null,
      }));

      res.json({
        patient: {
          ...patient,
          id: patient.id,
          fullName: (patient as any).full_name || (patient as any).fullName || '',
          full_name: (patient as any).full_name || (patient as any).fullName || '',
          internalId: (patient as any).internal_id || (patient as any).internalId || '',
          internal_id: (patient as any).internal_id || (patient as any).internalId || '',
        },
        exams: normalizedExams,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao carregar exames do paciente.' });
    }
  }
);

// 9. Authorized Download / View: Generate short-lived signed URL
app.get(
  '/api/exams/:id/signed-url',
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const examId = req.params.id;
      const isDownload = req.query.download === 'true';

      if (!supabaseAdmin) {
        res.status(503).json({ error: 'Configuração do servidor indisponível.' });
        return;
      }

      // Retrieve exam details
      const { data: exam, error: examError } = await supabaseAdmin
        .from('fm_exams')
        .select('id, patient_id, file_path, is_published, title')
        .eq('id', examId)
        .single();

      if (examError || !exam) {
        res.status(404).json({ error: 'Exame não encontrado.' });
        return;
      }

      const userRole = req.user!.role;

      // Authorization Check:
      // If patient, must be the owner AND exam must be published
      if (userRole === 'patient') {
        if (!exam.is_published) {
          res.status(403).json({ error: 'Este exame ainda não foi liberado pela equipe médica.' });
          return;
        }

        const { data: patientCheck } = await supabaseAdmin
          .from('fm_patients')
          .select('id')
          .eq('user_id', req.user!.id)
          .eq('id', exam.patient_id)
          .single();

        if (!patientCheck) {
          res.status(403).json({ error: 'Acesso negado: você não tem permissão para acessar este exame.' });
          return;
        }
      }

      // Generate short-lived (60 seconds) signed URL from private bucket
      const { data: signedData, error: signError } = await supabaseAdmin.storage
        .from('fm-exams')
        .createSignedUrl(exam.file_path, 60, {
          download: isDownload ? `${exam.title}.pdf` : undefined,
        });

      if (signError || !signedData?.signedUrl) {
        res.status(400).json({ error: `Erro ao gerar link seguro: ${signError?.message}` });
        return;
      }

      // Audit download/view operation
      await supabaseAdmin.from('fm_audit_logs').insert({
        user_id: req.user!.id,
        action: isDownload ? 'EXAM_DOWNLOADED' : 'EXAM_VIEWED',
        entity_type: 'fm_exams',
        entity_id: exam.id,
        details: { is_download: isDownload },
        ip_address: req.ip || '',
        created_at: new Date().toISOString(),
      });

      res.json({
        signedUrl: signedData.signedUrl,
        expiresIn: 60,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao autorizar visualização do exame.' });
    }
  }
);

// 10. WhatsApp Option A: Log WhatsApp Web click (Without falsely claiming message was sent)
app.post(
  '/api/notifications/log-whatsapp-click',
  requireAuth,
  requireRoles(['admin', 'secretary']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { patientId, examId } = req.body;

      if (supabaseAdmin) {
        await supabaseAdmin.from('fm_notifications').insert({
          patient_id: patientId,
          exam_id: examId,
          channel: 'whatsapp_web',
          template_name: 'manual_web_click',
          status: 'processando', // recorded as opened, not falsely claimed as delivered
          created_at: new Date().toISOString(),
        });
      }

      res.json({ success: true, logged: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao registrar clique.' });
    }
  }
);

// 11. WhatsApp Option B: Trigger authenticated n8n webhook securely with X-Webhook-Token
app.post(
  '/api/notifications/whatsapp-webhook',
  requireAuth,
  requireRoles(['admin', 'secretary']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { patientId, examId, templateName } = req.body;

      // If webhook is not configured, present resource as unavailable to administrative team
      if (!N8N_WEBHOOK_URL) {
        res.status(503).json({
          success: false,
          status: 'indisponivel',
          message: 'Recurso indisponível: o webhook do n8n não está configurado no servidor.',
        });
        return;
      }

      if (!supabaseAdmin) {
        res.status(503).json({ error: 'Configuração do servidor indisponível.' });
        return;
      }

      // Fetch patient and exam data to send to webhook
      const { data: patient } = await supabaseAdmin
        .from('fm_patients')
        .select('id, full_name, phone, email')
        .eq('id', patientId)
        .single();

      const { data: exam } = await supabaseAdmin
        .from('fm_exams')
        .select('id, title, exam_date')
        .eq('id', examId)
        .single();

      if (!patient || !exam) {
        res.status(404).json({ error: 'Dados do paciente ou exame não localizados.' });
        return;
      }

      // 1. Initial State: 'pendente' (Solicitação registrada no banco HOFM)
      const { data: notifRecord, error: notifErr } = await supabaseAdmin
        .from('fm_notifications')
        .insert({
          patient_id: patientId,
          exam_id: examId,
          channel: 'whatsapp_meta_template',
          template_name: templateName || 'exame_disponivel_hof',
          status: 'pendente',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (notifErr || !notifRecord) {
        res.status(500).json({ error: 'Erro ao registrar notificação inicial.' });
        return;
      }

      // 2. Dispatch to secure n8n webhook with X-Webhook-Token header
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(N8N_WEBHOOK_TOKEN ? { 'X-Webhook-Token': N8N_WEBHOOK_TOKEN } : {}),
          },
          body: JSON.stringify({
            notificationId: notifRecord.id,
            patientId: patient.id,
            examId: exam.id,
            templateName: templateName || 'exame_disponivel_hof',
            recipientPhone: patient.phone,
            recipientName: patient.full_name,
            examTitle: exam.title,
            callbackUrl: `${process.env.APP_URL || ''}/api/notifications/status-callback`,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          await supabaseAdmin
            .from('fm_notifications')
            .update({
              status: 'falha',
              error_message: `Webhook retornou HTTP ${response.status}: ${errText.slice(0, 250)}`,
            })
            .eq('id', notifRecord.id);

          res.status(502).json({
            success: false,
            status: 'falha',
            error: `O webhook do n8n retornou erro (${response.status})`,
          });
          return;
        }

        // Response is HTTP 200/201/202 - Differentiate states based on response payload
        let responseData: any = null;
        try {
          responseData = await response.json();
        } catch {
          responseData = null;
        }

        // Check if Meta Cloud API has directly accepted or dispatched the message
        const wamid =
          responseData?.wamid ||
          responseData?.message_id ||
          responseData?.messages?.[0]?.id ||
          null;

        const rawStatus = (responseData?.status || responseData?.meta_status || '').toLowerCase();

        let resolvedStatus: 'processando' | 'enviado' | 'entregue' | 'falha' = 'processando';
        let statusMessage = 'Solicitação aceita pelo webhook; em processamento na fila.';

        if (rawStatus === 'entregue' || rawStatus === 'delivered') {
          resolvedStatus = 'entregue';
          statusMessage = 'Entrega confirmada no dispositivo do paciente.';
        } else if (rawStatus === 'enviado' || rawStatus === 'sent' || rawStatus === 'accepted' || wamid) {
          // Explicit acceptance by Meta
          resolvedStatus = 'enviado';
          statusMessage = 'Aceite confirmado pela Meta (mensagem enviada).';
        } else if (rawStatus === 'falha' || rawStatus === 'failed' || responseData?.success === false) {
          resolvedStatus = 'falha';
          statusMessage = responseData?.error || responseData?.message || 'Falha reportada pelo webhook.';
        } else {
          // The webhook simply acknowledged receiving the job (HTTP 200) without final Meta dispatch
          // Do NOT mark as 'enviado' prematurely; keep as 'processando' until callback confirms Meta delivery
          resolvedStatus = 'processando';
          statusMessage = 'Solicitação recebida pelo n8n; aguardando confirmação de aceite da Meta.';
        }

        const updatePayload: any = {
          status: resolvedStatus,
        };

        if (resolvedStatus === 'enviado') {
          updatePayload.sent_at = new Date().toISOString();
        } else if (resolvedStatus === 'entregue') {
          updatePayload.sent_at = updatePayload.sent_at || new Date().toISOString();
          updatePayload.delivered_at = new Date().toISOString();
        } else if (resolvedStatus === 'falha') {
          updatePayload.error_message = statusMessage;
        }

        await supabaseAdmin
          .from('fm_notifications')
          .update(updatePayload)
          .eq('id', notifRecord.id);

        res.json({
          success: resolvedStatus !== 'falha',
          status: resolvedStatus,
          notificationId: notifRecord.id,
          wamid,
          message: statusMessage,
        });
      } catch (webhookErr: any) {
        await supabaseAdmin
          .from('fm_notifications')
          .update({
            status: 'falha',
            error_message: `Falha na conexão com n8n: ${webhookErr.message}`,
          })
          .eq('id', notifRecord.id);

        res.status(502).json({
          success: false,
          status: 'falha',
          error: `Falha na conexão com o servidor de webhook: ${webhookErr.message}`,
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao processar envio de notificação.' });
    }
  }
);

// 12. Asynchronous status callback from n8n / Meta Webhook (sent, delivered, read, failed)
const handleStatusCallback = async (req: Request, res: Response) => {
  try {
    // Validate webhook token if configured
    if (N8N_WEBHOOK_TOKEN) {
      const headerToken = req.headers['x-webhook-token'];
      const queryToken = req.query.token;
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

      const isAuthorized =
        headerToken === N8N_WEBHOOK_TOKEN ||
        queryToken === N8N_WEBHOOK_TOKEN ||
        bearerToken === N8N_WEBHOOK_TOKEN;

      if (!isAuthorized) {
        res.status(401).json({ error: 'Token de callback não autorizado.' });
        return;
      }
    }

    if (!supabaseAdmin) {
      res.status(503).json({ error: 'Supabase admin não configurado no servidor.' });
      return;
    }

    const {
      notificationId,
      id,
      wamid,
      status,
      metaStatus,
      meta_status,
      errorMessage,
      error,
    } = req.body;

    const targetId = notificationId || id;
    if (!targetId && !wamid) {
      res.status(400).json({ error: 'Informe notificationId ou wamid para atualizar o status da notificação.' });
      return;
    }

    const raw = (status || metaStatus || meta_status || '').toString().toLowerCase();
    let normalizedStatus: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'lido' | 'falha' = 'processando';

    if (raw === 'delivered' || raw === 'entregue') {
      normalizedStatus = 'entregue';
    } else if (raw === 'read' || raw === 'lido' || raw === 'visualizado') {
      normalizedStatus = 'lido';
    } else if (raw === 'sent' || raw === 'enviado' || raw === 'accepted' || raw === 'aceito') {
      normalizedStatus = 'enviado';
    } else if (raw === 'failed' || raw === 'falha' || raw === 'error' || raw === 'rejeitado') {
      normalizedStatus = 'falha';
    } else if (raw === 'processing' || raw === 'processando' || raw === 'queued') {
      normalizedStatus = 'processando';
    } else if (raw === 'pending' || raw === 'pendente') {
      normalizedStatus = 'pendente';
    }

    const updateFields: any = {
      status: normalizedStatus,
    };

    if (normalizedStatus === 'enviado') {
      updateFields.sent_at = new Date().toISOString();
    } else if (normalizedStatus === 'entregue') {
      updateFields.delivered_at = new Date().toISOString();
    } else if (normalizedStatus === 'falha') {
      updateFields.error_message = (errorMessage || error || 'Falha de entrega reportada pela Meta').toString();
    }

    let query = supabaseAdmin.from('fm_notifications').update(updateFields);
    if (targetId) {
      query = query.eq('id', targetId);
    }

    const { data: updated, error: updateErr } = await query.select().maybeSingle();

    if (updateErr) {
      res.status(500).json({ error: `Erro ao atualizar notificação: ${updateErr.message}` });
      return;
    }

    // Record audit log
    await supabaseAdmin.from('fm_audit_logs').insert({
      action: 'NOTIFICATION_STATUS_CALLBACK',
      entity_type: 'fm_notifications',
      entity_id: updated?.id || targetId || '',
      details: {
        raw_status: raw,
        normalized_status: normalizedStatus,
        wamid: wamid || null,
      },
      ip_address: req.ip || '',
      created_at: new Date().toISOString(),
    });

    res.json({
      success: true,
      updated: true,
      notificationId: updated?.id || targetId,
      status: normalizedStatus,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao processar callback de status.' });
  }
};

app.post('/api/notifications/status-callback', handleStatusCallback);
app.post('/api/notifications/callback', handleStatusCallback);

// 13. List notification history
app.get(
  '/api/admin/notifications',
  requireAuth,
  requireRoles(['admin', 'secretary']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!supabaseAdmin) {
        res.status(503).json({ error: 'Configuração do servidor indisponível.' });
        return;
      }

      const { data: notifications, error } = await supabaseAdmin
        .from('fm_notifications')
        .select('*, patient:fm_patients(id, full_name, phone), exam:fm_exams(id, title)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      const normalizedNotifications = (notifications || []).map((n: any) => ({
        ...n,
        id: n.id,
        patientId: n.patient_id || n.patientId,
        patient_id: n.patient_id || n.patientId,
        examId: n.exam_id || n.examId,
        exam_id: n.exam_id || n.examId,
        channel: n.channel,
        templateName: n.template_name || n.templateName,
        template_name: n.template_name || n.templateName,
        status: n.status,
        wamid: n.wamid,
        errorMessage: n.error_message || n.errorMessage,
        error_message: n.error_message || n.errorMessage,
        sentAt: n.sent_at || n.sentAt,
        sent_at: n.sent_at || n.sentAt,
        deliveredAt: n.delivered_at || n.deliveredAt,
        delivered_at: n.delivered_at || n.deliveredAt,
        createdAt: n.created_at || n.createdAt,
        created_at: n.created_at || n.createdAt,
        patient: n.patient ? {
          ...n.patient,
          id: n.patient.id,
          fullName: n.patient.full_name || n.patient.fullName || '',
          full_name: n.patient.full_name || n.patient.fullName || '',
          phone: n.patient.phone || '',
        } : undefined,
        exam: n.exam ? {
          ...n.exam,
          id: n.exam.id,
          title: n.exam.title,
        } : undefined,
      }));

      res.json({ notifications: normalizedNotifications });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao listar histórico de notificações.' });
    }
  }
);

// 14. Password recovery request: uses Supabase Auth reset password without revealing presence
app.post('/api/auth/request-password-reset', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'Informe um endereço de e-mail válido.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (supabaseAdmin) {
      // Record reset attempt in fm_password_resets for audit
      await supabaseAdmin.from('fm_password_resets').insert({
        email: cleanEmail,
        requested_at: new Date().toISOString(),
        status: 'solicitado',
      });

      // Trigger password recovery email from Supabase Auth
      await supabaseAdmin.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${process.env.APP_URL || 'https://freitagmunareto.com.br'}/portal/redefinir-senha`,
      });
    }

    // Always respond with identical non-revealing success message to prevent user enumeration
    res.json({
      success: true,
      message: 'Se este e-mail estiver cadastrado em nosso sistema, as instruções de recuperação foram enviadas.',
    });
  } catch (err: any) {
    // Non-revealing response
    res.json({
      success: true,
      message: 'Se este e-mail estiver cadastrado em nosso sistema, as instruções de recuperação foram enviadas.',
    });
  }
});

// 15. Patient Internal Identifier recovery request via e-mail (triggers webhook)
app.post('/api/auth/request-patient-code', async (req: Request, res: Response) => {
  const genericSuccessMessage =
    'Se este e-mail estiver cadastrado em nosso sistema, seu Código Identificador será enviado em instantes.';

  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Informe um endereço de e-mail válido.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!supabaseAdmin) {
      res.status(503).json({ error: 'Serviço temporariamente indisponível.' });
      return;
    }

    // Lookup patient by exact case-insensitive email match
    const { data: candidates } = await supabaseAdmin
      .from('fm_patients')
      .select('id, internal_id, full_name, email, phone')
      .ilike('email', cleanEmail.replace(/[%_]/g, ''))
      .limit(10);

    const matchedPatient = (candidates || []).find(
      (p: any) => p.email && p.email.trim().toLowerCase() === cleanEmail
    );

    let webhookTriggered = false;
    let webhookStatus = 'nao_encontrado';

    if (matchedPatient) {
      try {
        const webhookResponse = await fetch(PATIENT_RECOVERY_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(N8N_WEBHOOK_TOKEN ? { 'X-Webhook-Token': N8N_WEBHOOK_TOKEN } : {}),
          },
          body: JSON.stringify({
            event: 'patient_code_recovery',
            patientFound: true,
            patientId: matchedPatient.id,
            fullName: matchedPatient.full_name,
            email: matchedPatient.email,
            phone: matchedPatient.phone,
            internalId: matchedPatient.internal_id,
            portalUrl: `${process.env.APP_URL || 'https://freitagmunareto.com.br'}/portal/login`,
            requestedAt: new Date().toISOString(),
          }),
        });

        webhookTriggered = webhookResponse.ok;
        webhookStatus = webhookResponse.ok
          ? 'webhook_enviado'
          : `webhook_erro_${webhookResponse.status}`;
      } catch (webhookErr: any) {
        console.error('Erro ao acionar webhook de recuperação de código do paciente:', webhookErr);
        webhookStatus = 'webhook_falha_rede';
      }
    }

    // Record attempt for security audit
    await supabaseAdmin.from('fm_password_resets').insert({
      email: cleanEmail,
      requested_at: new Date().toISOString(),
      status: webhookStatus,
    });

    await supabaseAdmin.from('fm_audit_logs').insert({
      action: 'PATIENT_CODE_RECOVERY_REQUESTED',
      entity_type: 'fm_patients',
      entity_id: matchedPatient?.id || '',
      details: {
        patient_found: Boolean(matchedPatient),
        webhook_triggered: webhookTriggered,
        status: webhookStatus,
      },
      ip_address: req.ip || '',
      created_at: new Date().toISOString(),
    });

    // Always respond with non-revealing success message to preserve patient privacy
    res.json({
      success: true,
      message: genericSuccessMessage,
    });
  } catch (err: any) {
    res.json({
      success: true,
      message: genericSuccessMessage,
    });
  }
});

// -------------------------------------------------------------
// VITE DEV MIDDLEWARE / STATIC FILE SERVING
// -------------------------------------------------------------
async function setupViteOrStatic() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }
}

// Only start the HTTP listener when running as a standalone node process (AI Studio or local development)
// In serverless environments like Vercel, api/index.ts exports app directly
if (process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  setupViteOrStatic().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  });
}

export default app;
