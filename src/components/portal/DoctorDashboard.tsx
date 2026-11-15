import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Exam, Patient } from '../../lib/supabase';
import { Stethoscope, FileText, Search, Eye, Download, LogOut, ShieldCheck, Users, Calendar, CheckCircle } from 'lucide-react';

interface DoctorDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onLogout,
  onNavigateHome,
}) => {
  const { profile, session } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadDoctorData = async () => {
    setIsLoading(true);
    const token = session?.access_token || '';

    try {
      const eRes = await fetch('/api/admin/exams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (eRes.ok) {
        const eData = await eRes.json();
        setExams(eData.exams || []);
      }

      const pRes = await fetch('/api/admin/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        setPatients(pData.patients || []);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados do painel médico:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, [session]);

  const handleAction = async (examId: string, download = false) => {
    const token = session?.access_token || '';
    try {
      const res = await fetch(`/api/exams/${examId}/signed-url?download=${download}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.signedUrl) {
        window.open(data.signedUrl, '_blank');
      } else {
        alert(data.error || 'Acesso não autorizado aos registros deste paciente.');
      }
    } catch (err) {
      alert('Erro ao processar solicitação.');
    }
  };

  const filteredExams = exams.filter((e) => {
    const term = (searchTerm || '').toLowerCase();
    const title = (e.title || '').toLowerCase();
    const patientName = (e.patient?.fullName || (e.patient as any)?.full_name || '').toLowerCase();
    const patientId = (e.patient?.internalId || (e.patient as any)?.internal_id || '').toLowerCase();
    return title.includes(term) || patientName.includes(term) || patientId.includes(term);
  });

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Doctor Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#004d5a] flex items-center justify-center font-bold">
              <Stethoscope className="w-6 h-6 text-[#004d5a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#004d5a]">
                  Hospital de Olhos Freitag Munareto
                </span>
                <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Corpo Clínico
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Médico(a): {profile?.fullName || 'Especialista em Oftalmologia'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-600 hover:text-[#004d5a] py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Site
            </button>
            <button
              onClick={onLogout}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 py-2 px-3 rounded-lg border border-rose-200 hover:bg-rose-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#be7b52]">
            PAINEL DO MÉDICO OFTALMOLOGISTA
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#004d5a]">
            {profile?.fullName ? `Dr(a). ${profile.fullName}` : 'Corpo Clínico HOFM'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
            Acesso aos laudos, imagens diagnósticas e exames dos pacientes sob seus cuidados nas unidades de Timbó e Pomerode.
          </p>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 w-fit">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#004d5a]" />
            <span>Estrutura de controle de acesso preparada para regras estritas de vínculo profissional.</span>
          </div>
        </div>

        {/* Exams Table with search */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#004d5a]" />
                <span>Exames e Prontuários Diagnósticos</span>
              </h2>
              <p className="text-xs text-slate-500">
                Visualização de laudos com geração de URL assinada restrita
              </p>
            </div>

            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por paciente ou tipo de exame..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Paciente</th>
                    <th className="py-3 px-4">Identificador</th>
                    <th className="py-3 px-4">Exame</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        Carregando prontuários...
                      </td>
                    </tr>
                  ) : filteredExams.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        Nenhum exame localizado.
                      </td>
                    </tr>
                  ) : (
                    filteredExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {exam.patient?.fullName || 'Paciente'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#004d5a]">
                          {exam.patient?.internalId || 'HOFM'}
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium">
                          {exam.title}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{exam.examDate}</td>
                        <td className="py-3 px-4">
                          {exam.isPublished ? (
                            <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              Liberado
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              Em Revisão
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleAction(exam.id, false)}
                            className="text-xs font-bold text-[#004d5a] hover:underline"
                          >
                            Visualizar
                          </button>
                          <button
                            onClick={() => handleAction(exam.id, true)}
                            className="text-xs text-slate-600 hover:text-[#004d5a]"
                          >
                            Baixar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
