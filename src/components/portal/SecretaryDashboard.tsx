import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Patient, Exam, NotificationRecord } from '../../lib/supabase';
import {
  Users, FileText, Upload, Send, Search, Plus, CheckCircle,
  Clock, AlertTriangle, Eye, Download, LogOut, Check, X,
  MessageCircle, ExternalLink, ShieldCheck, KeyRound, RefreshCw,
  FolderOpen, Calendar, Phone, Mail, UserPlus, Copy
} from 'lucide-react';

interface SecretaryDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const SecretaryDashboard: React.FC<SecretaryDashboardProps> = ({
  onLogout,
  onNavigateHome,
}) => {
  const { profile, session } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'indicadores' | 'pacientes' | 'exames' | 'upload' | 'notificacoes'>('indicadores');

  // State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // New Patient Form
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    phone: '',
    email: '',
    internalId: '',
    createAuthUser: true,
  });
  const [registeringPatient, setRegisteringPatient] = useState(false);
  const [patientFeedback, setPatientFeedback] = useState<{ type: 'success' | 'error'; message: string; generatedId?: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId((prev) => (prev === code ? null : prev)), 2000);
  };

  // Upload Form
  const [uploadSelectedPatientId, setUploadSelectedPatientId] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Publish / Notify Modal
  const [publishingExam, setPublishingExam] = useState<Exam | null>(null);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  // Recovery Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  // Load Initial Data
  const loadData = async () => {
    setIsLoading(true);
    const token = session?.access_token || '';

    try {
      // 1. Fetch Patients
      const pRes = await fetch('/api/admin/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        const mappedPatients = (pData.patients || []).map((p: any) => ({
          ...p,
          id: p.id,
          userId: p.userId || p.user_id || null,
          internalId: p.internalId || p.internal_id || p.internal_reference || '',
          fullName: p.fullName || p.full_name || 'Paciente',
          phone: p.phone || '',
          email: p.email || '',
          createdAt: p.createdAt || p.created_at || '',
          updatedAt: p.updatedAt || p.updated_at || '',
        }));
        setPatients(mappedPatients);
      }

      // 2. Fetch Exams
      const eRes = await fetch('/api/admin/exams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (eRes.ok) {
        const eData = await eRes.json();
        setExams(eData.exams || []);
      }

      // 3. Fetch Notifications
      const nRes = await fetch('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (nRes.ok) {
        const nData = await nRes.json();
        setNotifications(nData.notifications || []);
      }
    } catch (err) {
      console.warn('Carregamento inicial via API local:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [session]);

  // Handle Patient Registration
  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisteringPatient(true);
    setPatientFeedback(null);

    const token = session?.access_token || '';
    try {
      const res = await fetch('/api/admin/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: newPatient.fullName,
          phone: newPatient.phone,
          email: newPatient.email,
          internalId: newPatient.internalId.trim() || undefined,
          createAuthUser: newPatient.createAuthUser,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const generatedCode = data.patient?.internal_id || data.patient?.internalId || '';
        setPatientFeedback({
          type: 'success',
          message: `Paciente ${newPatient.fullName} cadastrado com sucesso! Código de acesso do paciente:`,
          generatedId: generatedCode,
        });
        setNewPatient({ fullName: '', phone: '', email: '', internalId: '', createAuthUser: true });
        loadData();
      } else {
        setPatientFeedback({
          type: 'error',
          message: data.error || 'Não foi possível cadastrar o paciente.',
        });
      }
    } catch (err: any) {
      setPatientFeedback({ type: 'error', message: err.message || 'Erro ao conectar ao servidor.' });
    } finally {
      setRegisteringPatient(false);
    }
  };

  // Handle Exam Upload to private bucket `fm-exams`
  const handleUploadExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadFeedback({ type: 'error', message: 'Selecione um arquivo de exame (PDF, PNG, JPEG ou WebP).' });
      return;
    }

    if (uploadFile.size > 25 * 1024 * 1024) {
      setUploadFeedback({ type: 'error', message: 'O arquivo excede o limite máximo permitido de 25 MB.' });
      return;
    }

    setUploading(true);
    setUploadFeedback(null);

    const token = session?.access_token || '';
    const formData = new FormData();
    formData.append('patientId', uploadSelectedPatientId);
    formData.append('title', uploadTitle);
    formData.append('examDate', uploadDate);
    formData.append('file', uploadFile);

    try {
      const res = await fetch('/api/admin/exams/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadFeedback({
          type: 'success',
          message: `Exame "${uploadTitle}" salvo com sucesso em ambiente protegido! Pronto para publicação.`,
        });
        setUploadTitle('');
        setUploadFile(null);
        loadData();
      } else {
        setUploadFeedback({
          type: 'error',
          message: data.error || 'Erro ao realizar upload do exame.',
        });
      }
    } catch (err: any) {
      setUploadFeedback({ type: 'error', message: err.message || 'Falha de comunicação com o servidor.' });
    } finally {
      setUploading(false);
    }
  };

  // Handle Exam Publish
  const handlePublishExam = async (exam: Exam) => {
    const token = session?.access_token || '';
    try {
      const res = await fetch(`/api/admin/exams/${exam.id}/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setPublishingExam(exam); // Open notification modal
        loadData();
      }
    } catch (err) {
      console.error('Erro ao publicar exame:', err);
    }
  };

  // WhatsApp Option A: Manual WhatsApp Web Click
  const handleWhatsAppWeb = async (exam: Exam) => {
    const patientName = exam.patient?.fullName || 'Paciente';
    const firstName = patientName.split(' ')[0];
    const phone = exam.patient?.phone?.replace(/\D/g, '') || '';

    const text = `Olá, ${firstName}! O Hospital de Olhos Freitag Munareto informa que seu exame já está disponível no Portal do Paciente. Acesse https://freitagmunareto.com.br/portal/login para consultar.`;
    const url = `https://wa.me/${phone.startsWith('55') ? phone : `55${phone}`}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');

    // Register that WhatsApp Web was clicked
    const token = session?.access_token || '';
    await fetch('/api/notifications/log-whatsapp-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        patientId: exam.patientId || exam.patient?.id,
        examId: exam.id,
      }),
    });

    setPublishStatus('WhatsApp Web aberto para envio manual.');
    loadData();
  };

  // WhatsApp Option B: Automated Meta Template via server dispatch
  const handleWhatsAppMetaWebhook = async (exam: Exam) => {
    setPublishStatus('Disparando notificação automática oficial...');
    const token = session?.access_token || '';

    try {
      const res = await fetch('/api/notifications/whatsapp-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: exam.patientId || exam.patient?.id,
          examId: exam.id,
          templateName: 'exame_disponivel_hof',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPublishStatus('Notificação automática enviada com sucesso para o paciente!');
      } else {
        setPublishStatus(data.message || data.error || 'Serviço de envio automático indisponível no momento.');
      }
      loadData();
    } catch (err: any) {
      setPublishStatus(`Falha no envio: ${err.message}`);
    }
  };

  // Handle Exam Download / View with authorized signed URL
  const handleViewExam = async (examId: string, download = false) => {
    const token = session?.access_token || '';
    try {
      const res = await fetch(`/api/exams/${examId}/signed-url?download=${download}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.signedUrl) {
        window.open(data.signedUrl, '_blank');
      } else {
        alert(data.error || 'Acesso não autorizado.');
      }
    } catch (err) {
      alert('Erro ao solicitar visualização do exame.');
    }
  };

  // Password Recovery Request
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = session?.access_token || '';
    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      setResetFeedback(data.message);
    } catch (err) {
      setResetFeedback('Solicitação de recuperação registrada.');
    }
  };

  // Filtered Patients (null-safe against undefined or snake_case fields)
  const filteredPatients = patients.filter((p) => {
    const term = (searchTerm || '').toLowerCase();
    const name = (p.fullName || (p as any).full_name || '').toLowerCase();
    const id = (p.internalId || (p as any).internal_id || (p as any).internal_reference || '').toLowerCase();
    const phone = (p.phone || '').toLowerCase();
    return name.includes(term) || id.includes(term) || phone.includes(term);
  });

  // Indicators
  const totalPatients = patients.length;
  const publishedExams = exams.filter((e) => e.isPublished).length;
  const pendingExams = exams.filter((e) => !e.isPublished).length;
  const notificationsSent = notifications.filter((n) => n.status === 'enviado' || n.status === 'entregue' || n.status === 'lido').length;

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Top Bar of Secretary Portal */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#004d5a] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-[#004d5a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#004d5a]">
                  Hospital de Olhos Freitag Munareto
                </span>
                <span className="bg-teal-50 text-[#004d5a] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Secretaria
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Operador: {profile?.fullName || 'Recepção e Equipe Médica'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowResetModal(true)}
              className="text-xs text-slate-600 hover:text-[#004d5a] py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              title="Solicitar recuperação de acesso"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Recuperar Acesso</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-600 hover:text-[#004d5a] py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Site
            </button>

            <button
              onClick={onLogout}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 py-2 px-3 rounded-lg border border-rose-200 hover:bg-rose-50 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-2 border-t border-slate-100">
          {[
            { id: 'indicadores', label: 'Dashboard & Indicadores', icon: Clock },
            { id: 'pacientes', label: 'Pacientes & Cadastro', icon: Users },
            { id: 'exames', label: 'Gestão de Exames', icon: FileText },
            { id: 'upload', label: 'Novo Upload de Exame', icon: Upload },
            { id: 'notificacoes', label: 'Histórico de Notificações', icon: Send },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#004d5a] text-[#004d5a]'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* TAB 1: INDICADORES */}
        {activeTab === 'indicadores' && (
          <div className="space-y-8 animate-in fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pacientes Cadastrados
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#004d5a] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 tabular-nums">{totalPatients}</p>
                <p className="text-[11px] text-slate-500 mt-1">Registros no sistema HOFM</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Exames Publicados
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 tabular-nums">{publishedExams}</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">Liberados para consulta</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Exames Pendentes
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 tabular-nums">{pendingExams}</p>
                <p className="text-[11px] text-amber-600 font-medium mt-1">Aguardando liberação</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Notificações Enviadas
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#004d5a] flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 tabular-nums">{notificationsSent}</p>
                <p className="text-[11px] text-slate-500 mt-1">Avisos via WhatsApp</p>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#004d5a] uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#be7b52]" />
                  <span>Ações Rápidas de Atendimento</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Cadastre novos pacientes ou envie exames recebidos dos aparelhos diagnósticos com armazenamento confidencial e criptografado.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('pacientes');
                      setShowPatientModal(true);
                    }}
                    className="bg-[#004d5a] hover:bg-[#003842] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Paciente</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="border border-[#be7b52] text-[#be7b52] hover:bg-[#be7b52] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload de Exame</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#004d5a] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#be7b52]" />
                  <span>Segurança e Conformidade Médica</span>
                </h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tratamento de dados clínicos em conformidade com a LGPD (Lei nº 13.709/2018).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Nenhum CPF é utilizado como identificador público ou nome de arquivo.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Downloads protegidos por links temporários e criptografados (60s).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Toda publicação e acesso a exame é registrado no histórico de auditoria.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PACIENTES & CADASTRO */}
        {activeTab === 'pacientes' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#004d5a]">Gestão de Pacientes</h2>
                <p className="text-xs text-slate-500">
                  Localize cadastros ou adicione novos pacientes com criação de credenciais pelo servidor.
                </p>
              </div>

              <button
                onClick={() => setShowPatientModal(true)}
                className="bg-[#004d5a] hover:bg-[#003842] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Paciente</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por nome, identificador HOFM ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
              />
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Identificador</th>
                      <th className="py-3 px-4">Nome Completo</th>
                      <th className="py-3 px-4">Telefone (DDD)</th>
                      <th className="py-3 px-4">E-mail</th>
                      <th className="py-3 px-4">Conta Portal</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          {isLoading ? 'Carregando pacientes...' : 'Nenhum paciente localizado.'}
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#004d5a]">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="bg-teal-50/80 px-2 py-0.5 rounded border border-teal-100 tracking-wider">
                                {p.internalId}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(p.internalId)}
                                title="Copiar código identificador"
                                className="text-slate-400 hover:text-[#004d5a] p-1 rounded transition-colors cursor-pointer"
                              >
                                {copiedId === p.internalId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {p.fullName}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{p.phone}</td>
                          <td className="py-3 px-4 text-slate-600">{p.email || '—'}</td>
                          <td className="py-3 px-4">
                            {p.userId ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                <Check className="w-3 h-3" />
                                <span>Ativa</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#004d5a] bg-teal-50 px-2 py-0.5 rounded">
                                <KeyRound className="w-3 h-3" />
                                <span>Acesso por Código</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setUploadSelectedPatientId(p.id);
                                setActiveTab('upload');
                              }}
                              className="text-xs font-semibold text-[#004d5a] hover:underline"
                            >
                              Anexar Exame
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Registration Modal */}
            {showPatientModal && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in">
                  <button
                    onClick={() => setShowPatientModal(false)}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="mb-6 space-y-1">
                    <span className="text-xs font-bold uppercase text-[#be7b52]">CADASTRO DE PACIENTE</span>
                    <h3 className="text-xl font-bold text-[#004d5a]">Novo Paciente HOFM</h3>
                    <p className="text-xs text-slate-500">
                      Cadastre os dados básicos. As credenciais seguras de acesso serão geradas automaticamente pelo sistema.
                    </p>
                  </div>

                  {patientFeedback && (
                    <div
                      className={`p-3.5 rounded-xl mb-4 text-xs font-medium space-y-2 ${
                        patientFeedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      <p>{patientFeedback.message}</p>
                      {patientFeedback.generatedId && (
                        <div className="flex items-center justify-between gap-2 bg-white border border-emerald-200 rounded-lg px-3 py-2">
                          <span className="font-mono font-bold text-sm tracking-widest text-[#004d5a]">
                            {patientFeedback.generatedId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(patientFeedback.generatedId!)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004d5a] hover:text-[#003842] cursor-pointer"
                          >
                            {copiedId === patientFeedback.generatedId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar Código</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleRegisterPatient} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nome completo do paciente"
                        value={newPatient.fullName}
                        onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Telefone com DDD *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="(47) 99999-9999"
                          value={newPatient.phone}
                          onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Identificador de Acesso (8 dígitos)
                        </label>
                        <input
                          type="text"
                          placeholder="Gerado automaticamente (letras e números)"
                          value={newPatient.internalId}
                          onChange={(e) => setNewPatient({ ...newPatient, internalId: e.target.value.toUpperCase() })}
                          className="w-full px-3.5 py-2.5 text-xs font-mono tracking-wider rounded-xl border border-slate-200 placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        E-mail do Paciente
                      </label>
                      <input
                        type="email"
                        placeholder="paciente@exemplo.com"
                        value={newPatient.email}
                        onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Opcional. O paciente poderá acessar usando este e-mail ou o telefone com DDD + o código identificador.
                      </p>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={newPatient.createAuthUser}
                          onChange={(e) => setNewPatient({ ...newPatient, createAuthUser: e.target.checked })}
                          className="rounded text-[#004d5a] focus:ring-[#004d5a]"
                        />
                        <span>Criar credencial de acesso seguro ao Portal do Paciente</span>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPatientModal(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={registeringPatient}
                        className="bg-[#004d5a] hover:bg-[#003842] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs disabled:opacity-50"
                      >
                        {registeringPatient ? 'Salvando...' : 'Cadastrar Paciente'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GESTÃO DE EXAMES */}
        {activeTab === 'exames' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#004d5a]">Exames Cadastrados</h2>
                <p className="text-xs text-slate-500">
                  Gerencie a liberação de exames e acione notificações de prontidão por WhatsApp.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('upload')}
                className="bg-[#004d5a] hover:bg-[#003842] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Upload className="w-4 h-4" />
                <span>Novo Upload</span>
              </button>
            </div>

            {/* Exams Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Paciente</th>
                      <th className="py-3 px-4">Título do Exame</th>
                      <th className="py-3 px-4">Data do Exame</th>
                      <th className="py-3 px-4">Tamanho</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {exams.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          Nenhum exame cadastrado no momento.
                        </td>
                      </tr>
                    ) : (
                      exams.map((exam) => (
                        <tr key={exam.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {exam.patient?.fullName || 'Paciente'}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {exam.title}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{exam.examDate}</td>
                          <td className="py-3 px-4 text-slate-500 tabular-nums">
                            {(exam.fileSize / 1024 / 1024).toFixed(2)} MB
                          </td>
                          <td className="py-3 px-4">
                            {exam.isPublished ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                <CheckCircle className="w-3 h-3" />
                                <span>Publicado</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3" />
                                <span>Rascunho</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleViewExam(exam.id, false)}
                              className="text-xs text-slate-600 hover:text-[#004d5a] font-medium"
                              title="Visualizar com link seguro"
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => handleViewExam(exam.id, true)}
                              className="text-xs text-slate-600 hover:text-[#004d5a] font-medium"
                              title="Baixar exame com link seguro"
                            >
                              Baixar
                            </button>
                            {!exam.isPublished ? (
                              <button
                                onClick={() => handlePublishExam(exam)}
                                className="bg-[#be7b52] hover:bg-[#aa6840] text-white px-2.5 py-1 rounded text-[11px] font-bold transition-colors"
                              >
                                Publicar
                              </button>
                            ) : (
                              <button
                                onClick={() => setPublishingExam(exam)}
                                className="text-[#004d5a] hover:underline font-bold text-[11px]"
                              >
                                Notificar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notification / Publish Modal */}
            {publishingExam && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in space-y-5">
                  <button
                    onClick={() => {
                      setPublishingExam(null);
                      setPublishStatus(null);
                    }}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-[#be7b52]">NOTIFICAR PACIENTE</span>
                    <h3 className="text-lg font-bold text-[#004d5a]">
                      Exame Liberado no Portal
                    </h3>
                    <p className="text-xs text-slate-600">
                      Paciente: <strong>{publishingExam.patient?.fullName}</strong> ({publishingExam.patient?.phone})
                    </p>
                  </div>

                  {publishStatus && (
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-[#004d5a] font-medium">
                      {publishStatus}
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    {/* Option A: WhatsApp Web */}
                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 transition-colors bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          <span>Opção A: WhatsApp Web Manual</span>
                        </span>
                        <span className="text-[10px] text-slate-500">Pronto</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Abre o WhatsApp com mensagem pré-preenchida segura (sem expor laudo nem dados clínicos).
                      </p>
                      <button
                        onClick={() => handleWhatsAppWeb(publishingExam)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir no WhatsApp Web</span>
                      </button>
                    </div>

                    {/* Option B: Meta Template via automated server integration */}
                    <div className="p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition-colors bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Send className="w-4 h-4 text-[#004d5a]" />
                          <span>Opção B: Template Oficial WhatsApp</span>
                        </span>
                        <span className="text-[10px] text-slate-500">Disparo Automático</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Envia notificação corporativa pré-formatada diretamente ao telefone cadastrado do paciente.
                      </p>
                      <button
                        onClick={() => handleWhatsAppMetaWebhook(publishingExam)}
                        className="w-full bg-[#004d5a] hover:bg-[#003842] text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Disparar Notificação Oficial</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setPublishingExam(null);
                        setPublishStatus(null);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NOVO UPLOAD */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#be7b52]">UPLOAD SEGURO</span>
              <h2 className="text-xl font-bold text-[#004d5a]">Enviar Exame de Paciente</h2>
              <p className="text-xs text-slate-500">
                Armazenamento privado e criptografado. Aceita PDF, JPEG, PNG e WebP até 25 MB.
              </p>
            </div>

            {uploadFeedback && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium ${
                  uploadFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {uploadFeedback.message}
              </div>
            )}

            <form onSubmit={handleUploadExam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Selecione o Paciente *
                </label>
                <select
                  required
                  value={uploadSelectedPatientId}
                  onChange={(e) => setUploadSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                >
                  <option value="">Selecione na lista de pacientes cadastrados...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.internalId}) - {p.phone}
                    </option>
                  ))}
                </select>
                {patients.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    Nenhum paciente cadastrado ainda. Cadastre o paciente primeiro na aba Pacientes.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Título do Exame *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Topografia Corneana / Biometria / Mapeamento de Retina"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Data de Realização do Exame *
                </label>
                <input
                  type="date"
                  required
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  4. Arquivo do Laudo / Imagem (PDF, JPEG, PNG, WebP até 25MB) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-[#004d5a] hover:file:bg-teal-100 cursor-pointer border border-slate-200 rounded-xl p-1"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('exames')}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadSelectedPatientId}
                  className="bg-[#004d5a] hover:bg-[#003842] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Enviando...' : 'Salvar'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: HISTÓRICO DE NOTIFICAÇÕES */}
        {activeTab === 'notificacoes' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#004d5a]">Histórico de Notificações</h2>
              <p className="text-xs text-slate-500">
                Acompanhe o registro de comunicações pelo WhatsApp Web e templates oficiais automatizados.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Data / Hora</th>
                      <th className="py-3 px-4">Paciente</th>
                      <th className="py-3 px-4">Exame</th>
                      <th className="py-3 px-4">Canal</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400">
                          Nenhuma notificação registrada ainda.
                        </td>
                      </tr>
                    ) : (
                      notifications.map((n) => (
                        <tr key={n.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 text-slate-500">
                            {new Date(n.createdAt).toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {n.patient?.fullName || 'Paciente'}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {n.exam?.title || 'Exame'}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            {n.channel === 'whatsapp_web' ? 'WhatsApp Web' : 'Template Oficial (Meta)'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                n.status === 'entregue' || n.status === 'lido'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : n.status === 'enviado'
                                  ? 'bg-blue-50 text-blue-700'
                                  : n.status === 'processando'
                                  ? 'bg-amber-50 text-amber-700'
                                  : n.status === 'falha'
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {n.status === 'enviado'
                                ? 'Aceito (Meta)'
                                : n.status === 'entregue'
                                ? 'Entregue'
                                : n.status === 'lido'
                                ? 'Lido'
                                : n.status === 'processando'
                                ? 'Processando'
                                : n.status === 'falha'
                                ? 'Falha'
                                : 'Pendente'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Password Recovery Request Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in space-y-4">
            <button
              onClick={() => {
                setShowResetModal(false);
                setResetFeedback(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#be7b52]">SEGURANÇA DA CONTA</span>
              <h3 className="text-lg font-bold text-[#004d5a]">Recuperação de Acesso</h3>
              <p className="text-xs text-slate-500">
                Dispare um link de redefinição de credenciais de forma segura. O sistema não revela publicamente se o e-mail está cadastrado.
              </p>
            </div>

            {resetFeedback && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-[#004d5a] font-medium">
                {resetFeedback}
              </div>
            )}

            <form onSubmit={handleRequestPasswordReset} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail do Usuário ou Paciente
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@exemplo.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="bg-[#004d5a] text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Enviar Instruções
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
