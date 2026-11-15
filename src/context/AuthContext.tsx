import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured, UserProfile, UserRole, normalizeRole } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  loginPatient: (identifier: string, internalId: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Consultar automaticamente o servidor /api/auth/me para validar a permissão em fm_profiles
  const fetchProfile = useCallback(async (token: string, currentUser: User): Promise<UserProfile | null> => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const normalized = normalizeRole(data.user?.role);
        if (!normalized) {
          return null;
        }

        const profileObj: UserProfile = {
          id: currentUser.id,
          email: currentUser.email || '',
          fullName: data.user?.fullName || currentUser.user_metadata?.full_name || 'Usuário',
          role: normalized,
        };
        setProfile(profileObj);
        return profileObj;
      } else if (res.status === 403) {
        // Usuário não possui perfil ativo em fm_profiles
        return null;
      }
    } catch (err) {
      console.warn('Erro ao verificar perfil no servidor:', err);
    }

    return null;
  }, []);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (!isSupabaseConfigured) {
          if (mounted) setIsLoading(false);
          return;
        }

        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (initialSession?.user) {
          const verified = await fetchProfile(initialSession.access_token, initialSession.user);
          if (verified) {
            setSession(initialSession);
            setUser(initialSession.user);
          } else {
            // Se não possuir perfil válido em fm_profiles, desconectar
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        }
      } catch (err) {
        console.error('Erro na inicialização da autenticação:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      if (currentSession?.user) {
        const verified = await fetchProfile(currentSession.access_token, currentSession.user);
        if (verified) {
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return {
          success: false,
          error: 'Serviço de autenticação do hospital não configurado. Por favor, contate o suporte.',
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user || !data.session) {
        setIsLoading(false);
        return {
          success: false,
          error: 'E-mail ou senha incorretos. Verifique suas credenciais.',
        };
      }

      // Validar perfil e permissão na tabela fm_profiles através do backend
      const loadedProfile = await fetchProfile(data.session.access_token, data.user);

      if (!loadedProfile) {
        // Bloquear acesso se não possuir perfil válido em fm_profiles
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return {
          success: false,
          error: 'Acesso não autorizado. Seu usuário não possui um perfil ativo no sistema do hospital. Entre em contato com a administração.',
        };
      }

      setSession(data.session);
      setUser(data.user);
      setIsLoading(false);

      return {
        success: true,
        role: loadedProfile.role,
      };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Ocorreu um erro ao processar o acesso. Tente novamente em instantes.' };
    }
  };

  const loginPatient = async (
    identifier: string,
    internalId: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/patient-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          internalId: internalId.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.session?.access_token) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || 'E-mail/telefone ou código identificador inválidos.',
        };
      }

      if (isSupabaseConfigured) {
        const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        if (sessionErr || !sessionData.session || !sessionData.user) {
          setIsLoading(false);
          return {
            success: false,
            error: 'Não foi possível validar a sessão segura do paciente.',
          };
        }

        const verified = await fetchProfile(sessionData.session.access_token, sessionData.user);
        if (!verified) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return {
            success: false,
            error: 'Perfil do paciente não localizado no sistema.',
          };
        }

        setSession(sessionData.session);
        setUser(sessionData.user);
        setIsLoading(false);

        return {
          success: true,
          role: verified.role,
        };
      }

      setIsLoading(false);
      return {
        success: false,
        error: 'Serviço de autenticação não configurado.',
      };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Erro ao conectar ao servidor. Tente novamente em instantes.',
      };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Erro ao encerrar sessão:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return {
        success: data.success ?? true,
        message: data.message || 'Se este e-mail estiver cadastrado em nosso sistema, as instruções de recuperação foram enviadas.',
      };
    } catch (err: any) {
      return {
        success: true,
        message: 'Se este e-mail estiver cadastrado em nosso sistema, as instruções de recuperação foram enviadas.',
      };
    }
  };

  const refreshProfile = async () => {
    if (session?.access_token && user) {
      await fetchProfile(session.access_token, user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role: profile?.role || null,
        isLoading,
        isConfigured: isSupabaseConfigured,
        login,
        loginPatient,
        logout,
        requestPasswordReset,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
