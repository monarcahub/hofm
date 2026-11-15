import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Exam } from '../../lib/supabase';
import {
  ShieldCheck,
  FileText,
  Download,
  Eye,
  LogOut,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw,
  Phone,
  Mail,
  KeyRound,
  X,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';

interface PatientDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

interface PreviewState {
  exam: Exam;
  url: string;
}

function formatDatePtBr(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const clean = dateStr.split('T')[0];
  const parts = clean.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onLogout,
  onNavigateHome,
}) => {
  const { profile, session } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const loadPatientExams = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const token = session?.access_token || '';

    try {
      const res = await fetch('/api/patient/exams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const normalizedExams = (data.exams || []).map((e: any) => ({
          ...e,
          id: e.id,
          title: e.title || 'Exame Oftalmológico',
          examDate: e.examDate || e.exam_date || '',
          fileSize: Number(e.fileSize ?? e.file_size ?? 0),
          mimeType: e.mimeType || e.mime_type || 'application/pdf',
          isPublished: e.isPublished ?? e.is_published ?? true,
          publishedAt: e.publishedAt || e.published_at || null,
        }));
        setExams(normalizedExams);
        setPatientInfo(data.patient || null);
      } else {
        setErrorMessage(data.error || 'Não foi possível carregar seus exames.');
      }
    } catch (err: any) {
      setErrorMessage('Falha ao conectar ao servidor de exames.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatientExams();
  }, [session]);

  const handleAction = async (exam: Exam, download = false) => {
    const token = session?.access_token || '';
    setErrorMessage('');
    setActionLoadingId(`${exam.id}-${download ? 'dl' : 'view'}`);

    try {
      const res = await fetch(`/api/exams/${exam.id}/signed-url?download=${download}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.signedUrl) {
        if (download) {
          const link = document.createElement('a');
          link.href = data.signedUrl;
          link.setAttribute('download', `${exam.title || 'exame'}`);
          link.setAttribute('rel', 'noopener noreferrer');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          setPreview({ exam, url: data.signedUrl });
        }
      } else {
        setErrorMessage(data.error || 'Não foi possível acessar o arquivo solicitado.');
      }
    } catch (err) {
      setErrorMessage('Erro ao processar solicitação de acesso ao exame.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const patientDisplayName =
    patientInfo?.fullName || patientInfo?.full_name || profile?.fullName || 'Paciente';
  const patientInternalId =
    patientInfo?.internalId || patientInfo?.internal_id || '';
  const patientEmail = patientInfo?.email || '';
  const patientPhone = patientInfo?.phone || '';

  const filteredExams = exams.filter((e) => {
    const term = (searchTerm || '').trim().toLowerCase();
    if (!term) return true;
    const title = (e.title || '').toLowerCase();
    const formattedDate = formatDatePtBr(e.examDate).toLowerCase();
    return title.includes(term) || formattedDate.includes(term);
  });

  const latestExamDate = exams.length > 0 ? formatDatePtBr(exams[0].examDate) : '—';

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-['Jost',sans-serif]">
      {/* Patient Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#004d5a] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-[#004d5a]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#004d5a] block">
                Hospital de Olhos Freitag Munareto
              </span>
              <span className="text-xs text-slate-500">Portal do Paciente · Meus Exames</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadPatientExams}
              disabled={isLoading}
              className="text-xs text-slate-600 hover:text-[#004d5a] py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Atualizar exames"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs text-slate-600 hover:text-[#004d5a] py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Site Principal
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 py-2 px-3 rounded-lg border border-rose-200 hover:bg-rose-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* Personalized Greeting & Patient Identification Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#be7b52]">
                BEM-VINDO(A) AO SEU PORTAL
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#004d5a]">
                Olá, {patientDisplayName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Aqui você consulta, visualiza e baixa seus laudos e exames oftalmológicos anexados e liberados pela equipe médica do Hospital de Olhos Freitag Munareto.
              </p>
            </div>

            {patientInternalId && (
              <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl px-4 py-3 shrink-0 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#be7b52]" />
                  <span>Seu Identificador</span>
                </span>
                <p className="font-mono text-lg font-extrabold tracking-widest text-[#004d5a]">
                  {patientInternalId}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            {patientPhone && (
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
                <Phone className="w-3.5 h-3.5 text-[#004d5a]" />
                <span>{patientPhone}</span>
              </div>
            )}
            {patientEmail && (
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
                <Mail className="w-3.5 h-3.5 text-[#004d5a]" />
                <span>{patientEmail}</span>
              </div>
            )}
            <div className="inline-flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Acesso protegido em conformidade com a LGPD (links temporários de 60s).</span>
            </div>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Exames Disponíveis
            </span>
            <p className="text-2xl font-extrabold text-[#004d5a] mt-1 tabular-nums">
              {exams.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Prontos para visualização</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Exame Mais Recente
            </span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
              {latestExamDate}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Data de realização</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Status do Acesso
            </span>
            <p className="text-lg font-bold text-emerald-700 mt-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5" />
              <span>Verificado</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Dados criptografados</p>
          </div>
        </div>

        {/* Available Exams Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#004d5a]" />
              <h2 className="text-lg font-bold text-slate-800">Seus Exames Disponíveis</h2>
              <span className="text-xs font-medium text-slate-500 ml-1">
                ({filteredExams.length})
              </span>
            </div>

            {exams.length > 0 && (
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar exame por nome ou data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                />
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="text-rose-500 hover:text-rose-700"
                aria-label="Fechar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
              <span className="inline-block w-6 h-6 border-2 border-[#004d5a] border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs">Carregando seus exames com segurança...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#004d5a] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Nenhum exame liberado no momento</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Assim que seus laudos e exames forem anexados e liberados pela equipe do hospital, eles aparecerão automaticamente nesta lista para visualização e download.
              </p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
              Nenhum exame encontrado para &ldquo;{searchTerm}&rdquo;.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExams.map((exam) => {
                const isImage = (exam.mimeType || '').startsWith('image/');
                const fileSizeMb = ((exam.fileSize || 0) / 1024 / 1024).toFixed(2);
                const isViewing = actionLoadingId === `${exam.id}-view`;
                const isDownloading = actionLoadingId === `${exam.id}-dl`;

                return (
                  <div
                    key={exam.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#004d5a] flex items-center justify-center shrink-0 mt-0.5">
                        {isImage ? (
                          <ImageIcon className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-[#be7b52] uppercase">
                            Laudo Oftalmológico
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDatePtBr(exam.examDate)}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {isImage ? 'Imagem' : 'PDF'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{exam.title}</h3>
                        <p className="text-xs text-slate-500">
                          Arquivo protegido · {fileSizeMb} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleAction(exam, false)}
                        disabled={Boolean(actionLoadingId)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#004d5a] text-[#004d5a] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{isViewing ? 'Abrindo...' : 'Visualizar'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(exam, true)}
                        disabled={Boolean(actionLoadingId)}
                        className="px-4 py-2.5 rounded-xl bg-[#004d5a] hover:bg-[#003842] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        <span>{isDownloading ? 'Baixando...' : 'Baixar'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Inline Exam Preview Modal (avoids window.open popup blocking inside iframes) */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#be7b52]">
                  VISUALIZAÇÃO SEGURA (EXPIRA EM 60S)
                </span>
                <h3 className="text-base font-bold text-[#004d5a]">
                  {preview.exam.title} · {formatDatePtBr(preview.exam.examDate)}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-slate-600 hover:text-[#004d5a] py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Nova Aba</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleAction(preview.exam, true)}
                  className="text-xs font-bold bg-[#004d5a] hover:bg-[#003842] text-white py-2 px-3 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                  aria-label="Fechar visualização"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-2 sm:p-4">
              {(preview.exam.mimeType || '').startsWith('image/') ? (
                <img
                  src={preview.url}
                  alt={preview.exam.title}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-md bg-white"
                />
              ) : (
                <iframe
                  src={preview.url}
                  title={preview.exam.title}
                  className="w-full h-full rounded-xl border border-slate-200 bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
