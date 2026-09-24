import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  CheckCircle2, 
  Bell, 
  Vote, 
  Calendar,
  AlertTriangle,
  Send,
  Plus
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';
import { ActiveTab } from '../layout/Navbar';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { committees, delegations, resolutions, notices, liveVote, addNotice, togglePresence } = useOsu();
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'mesa' | 'cronograma' | 'geral'>('mesa');
  const [noticeContent, setNoticeContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const presentCount = delegations.filter(d => d.isPresent).length;
  const approvedResolutionsCount = resolutions.filter(r => r.status === 'aprovado').length;
  const inDebateCount = resolutions.filter(r => r.status === 'em_debate' || r.status === 'analise_mesa').length;

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    addNotice({
      title: noticeTitle,
      category: noticeCategory,
      content: noticeContent,
      important: isImportant,
    });

    setNoticeTitle('');
    setNoticeContent('');
    setIsImportant(false);
    setShowNoticeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner do Evento */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-slate-700 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5" />
            Assembleia Ordinária de 2026
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Plataforma Oficial da OSU
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Bem-vindos à mesa de deliberações da <strong className="text-amber-400 font-semibold">Organização das Salas Unidas</strong>. 
            Acompanhe o credenciamento das delegações, a redação e votação dos Projetos de Resolução e o andamento dos debates em cada comitê escolar.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('voting')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-900/40 transition"
            >
              <Vote className="w-4 h-4" />
              Painel de Votação
            </button>
            <button
              onClick={() => onNavigate('resolutions')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
            >
              <FileText className="w-4 h-4" />
              Projetos de Resolução ({resolutions.length})
            </button>
            <button
              onClick={() => onNavigate('timer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
            >
              Cronômetro de Oratória
            </button>
          </div>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Alerta de Votação em Andamento */}
      {liveVote && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/80 to-slate-900 border border-rose-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Vote className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Sessão de Votação em Andamento!</h3>
              <p className="text-xs text-rose-200/80">
                A Mesa Diretora abriu o escrutínio para a resolução em pauta. Registre os votos das delegações.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('voting')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg shadow transition whitespace-nowrap"
          >
            Abrir Plenário de Votação &rarr;
          </button>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('delegations')}
          className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Credenciamento</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-white">
            {presentCount} <span className="text-sm font-normal text-slate-400">/ {delegations.length} Salas</span>
          </p>
          <div className="mt-2 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${delegations.length ? (presentCount / delegations.length) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            {Math.round(delegations.length ? (presentCount / delegations.length) * 100 : 0)}% de quórum presente
          </p>
        </div>

        <div 
          onClick={() => onNavigate('committees')}
          className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Comitês Ativos</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-white">{committees.length}</p>
          <p className="mt-3.5 text-[11px] text-slate-400">Eixos temáticos em deliberação</p>
        </div>

        <div 
          onClick={() => onNavigate('resolutions')}
          className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Em Tramitação</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-amber-400">{inDebateCount}</p>
          <p className="mt-3.5 text-[11px] text-slate-400">Propostas em redação e debate</p>
        </div>

        <div 
          onClick={() => onNavigate('resolutions')}
          className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aprovadas</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-400">{approvedResolutionsCount}</p>
          <p className="mt-3.5 text-[11px] text-slate-400">Resoluções promulgadas pela plenária</p>
        </div>
      </div>

      {/* Grid com Mural de Avisos e Credenciamento Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mural de Notícias da Mesa Diretora */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Mural de Avisos & Comunicados</h2>
            </div>
            <button
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Publicar Aviso
            </button>
          </div>

          <div className="space-y-3">
            {notices.map((notice) => (
              <div 
                key={notice.id}
                className={`p-4 rounded-xl border transition ${
                  notice.important 
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' 
                    : 'bg-slate-800/60 border-slate-700/70 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {notice.important && (
                      <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <h3 className="font-semibold text-white text-sm sm:text-base">{notice.title}</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{notice.timestamp}</span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">{notice.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Credenciamento Rápido das Salas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Chamada das Salas</h2>
            <button
              onClick={() => onNavigate('delegations')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Ver Todas &rarr;
            </button>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 divide-y divide-slate-700/50">
            {delegations.slice(0, 6).map((del) => (
              <div key={del.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{del.flagEmoji}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{del.name}</h4>
                    <p className="text-[10px] text-slate-400">{del.representation}</p>
                  </div>
                </div>

                <button
                  onClick={() => togglePresence(del.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    del.isPresent 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-700/60 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {del.isPresent ? 'Presente' : 'Ausente'}
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300">
            💡 <strong>Dica da Mesa:</strong> Alunos ausentes não são computados na contagem do quórum de votação qualificada.
          </div>
        </div>

      </div>

      {/* Modal para criar Aviso */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                Novo Comunicado Oficial
              </h3>
              <button 
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título do Comunicado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Início da sessão do comitê de sustentabilidade"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Categoria</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="mesa">Mesa Diretora</option>
                  <option value="cronograma">Cronograma / Prazos</option>
                  <option value="geral">Aviso Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Conteúdo</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Instruções para os delegados e turmas..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="important-check"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
                />
                <label htmlFor="important-check" className="text-xs text-slate-300 cursor-pointer">
                  Marcar como aviso urgente / de alta prioridade
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
