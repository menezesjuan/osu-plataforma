import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Vote, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Eye, 
  Printer,
  Sparkles
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';
import { Resolution, ResolutionStatus } from '../../types';
import { ActiveTab } from '../layout/Navbar';

interface ResolutionsViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const ResolutionsView: React.FC<ResolutionsViewProps> = ({ onNavigate }) => {
  const { resolutions, committees, delegations, addResolution, updateResolutionStatus, deleteResolution, startLiveVoting } = useOsu();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCommittee, setFilterCommittee] = useState('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  // Modals
  const [viewingResolution, setViewingResolution] = useState<Resolution | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states for new resolution
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [committeeId, setCommitteeId] = useState(committees[0]?.id || 'csma');
  const [mainSponsorId, setMainSponsorId] = useState(delegations[0]?.id || '');
  const [coSponsorsInput, setCoSponsorsInput] = useState('');
  const [preambleInput, setPreambleInput] = useState('');
  const [operativeInput, setOperativeInput] = useState('');

  const openCreateModal = () => {
    const selectedCom = committees[0];
    const seq = resolutions.length + 1;
    setCode(`RES-${selectedCom?.code || 'OSU'}/0${seq}`);
    setTitle('');
    setCommitteeId(selectedCom?.id || 'csma');
    setMainSponsorId(delegations[0]?.id || '');
    setCoSponsorsInput('');
    setPreambleInput('Considerando a relevância desta pauta para o bem-estar escolar;\nReconhecendo o papel ativo dos estudantes na construção de soluções;');
    setOperativeInput('1. Propõe a realização de campanhas educativas permanentes no colégio;\n2. Determina a criação de uma comissão mista com alunos e professores;');
    setCreateModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const sponsor = delegations.find(d => d.id === mainSponsorId);
    const mainSponsorName = sponsor ? `${sponsor.name} (${sponsor.representation})` : 'Delegação Estudantil';

    const coSponsors = coSponsorsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const preamble = preambleInput
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const operativeClauses = operativeInput
      .split('\n')
      .map(o => o.trim())
      .filter(o => o.length > 0);

    addResolution({
      code,
      title,
      committeeId,
      mainSponsorId,
      mainSponsorName,
      coSponsors,
      preamble,
      operativeClauses,
      status: 'redacao',
    });

    setCreateModalOpen(false);
  };

  const handleStartVotingFromResolution = (res: Resolution) => {
    startLiveVoting(res.id, 'simples');
    onNavigate('voting');
  };

  const filteredResolutions = resolutions.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.mainSponsorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCommittee = filterCommittee === 'todos' || res.committeeId === filterCommittee;
    const matchesStatus = filterStatus === 'todos' || res.status === filterStatus;

    return matchesSearch && matchesCommittee && matchesStatus;
  });

  const getStatusBadge = (status: ResolutionStatus) => {
    switch (status) {
      case 'aprovado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5" />
            Aprovado
          </span>
        );
      case 'rejeitado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Rejeitado
          </span>
        );
      case 'em_debate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Vote className="w-3.5 h-3.5" />
            Em Debate
          </span>
        );
      case 'analise_mesa':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock className="w-3.5 h-3.5" />
            Análise da Mesa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-700 text-slate-300">
            <FileText className="w-3.5 h-3.5" />
            Em Redação
          </span>
        );
    }
  };

  const getCommitteeCode = (cId: string) => {
    const c = committees.find(item => item.id === cId);
    return c ? c.code : cId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Livro de Projetos de Resolução
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Redação coletiva de proposições, análise regimental da mesa e deliberação plenária.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-900/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Projeto de Resolução
        </button>
      </div>

      {/* Filtros */}
      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, título ou proponente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <select
            value={filterCommittee}
            onChange={(e) => setFilterCommittee(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="todos">Todos os Comitês</option>
            {committees.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="redacao">Em Redação</option>
            <option value="analise_mesa">Em Análise da Mesa</option>
            <option value="em_debate">Em Debate Plenário</option>
            <option value="aprovado">Aprovado</option>
            <option value="rejeitado">Rejeitado</option>
          </select>
        </div>
      </div>

      {/* Grid de Resoluções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResolutions.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {res.code}
                </span>
                {getStatusBadge(res.status)}
              </div>

              <h3 className="mt-3 text-base font-bold text-white leading-snug">{res.title}</h3>

              <div className="mt-2 text-xs text-slate-400 space-y-1">
                <p>
                  Comitê: <strong className="text-slate-300">{getCommitteeCode(res.committeeId)}</strong> • Submetido em: {res.createdAt}
                </p>
                <p>
                  Proponente Principal: <span className="text-amber-400 font-semibold">{res.mainSponsorName}</span>
                </p>
                {res.coSponsors.length > 0 && (
                  <p className="line-clamp-1">
                    Co-proponentes: <span className="text-slate-300">{res.coSponsors.join(', ')}</span>
                  </p>
                )}
              </div>

              {/* Prévia das Cláusulas */}
              <div className="mt-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Cláusula Operativa Principal:</span>
                <p className="italic line-clamp-2 text-slate-300">
                  "{res.operativeClauses[0] || 'Em fase de redação...'}"
                </p>
              </div>

              {res.votingResult && (
                <div className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Resultado Oficial:</span>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-emerald-400">{res.votingResult.favorable} A Favor</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-rose-400">{res.votingResult.opposed} Contra</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{res.votingResult.abstained} Abst.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
              <button
                onClick={() => setViewingResolution(res)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
              >
                <Eye className="w-3.5 h-3.5" />
                Ler Documento
              </button>

              <div className="flex items-center gap-2">
                {res.status !== 'aprovado' && res.status !== 'rejeitado' && (
                  <button
                    onClick={() => handleStartVotingFromResolution(res)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                  >
                    <Vote className="w-3.5 h-3.5" />
                    Abrir Votação
                  </button>
                )}

                <select
                  value={res.status}
                  onChange={(e) => updateResolutionStatus(res.id, e.target.value as ResolutionStatus)}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                  title="Alterar status na Mesa"
                >
                  <option value="redacao">Redação</option>
                  <option value="analise_mesa">Análise</option>
                  <option value="em_debate">Em Debate</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="rejeitado">Rejeitado</option>
                </select>

                <button
                  onClick={() => {
                    if (window.confirm(`Excluir a minuta ${res.code}?`)) {
                      deleteResolution(res.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredResolutions.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">Nenhuma resolução encontrada</h3>
          <p className="text-xs text-slate-500 mt-1">Crie um novo projeto de resolução ou modifique seus filtros.</p>
        </div>
      )}

      {/* Modal de Leitura Completa Oficial */}
      {viewingResolution && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {viewingResolution.code}
                </span>
                <span className="text-xs text-slate-400">Documento Oficial Plenário</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                  title="Imprimir resolução"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimir</span>
                </button>
                <button
                  onClick={() => setViewingResolution(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Conteúdo com Formato Diplomático */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-200">
              <div className="text-center pb-4 border-b border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">
                  Organização das Salas Unidas • Simulação Oficial
                </h4>
                <h2 className="mt-2 text-xl font-black text-white">{viewingResolution.title}</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Comitê: {getCommitteeCode(viewingResolution.committeeId)} • Data: {viewingResolution.createdAt}
                </p>
              </div>

              {/* Informações de Autoria */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs space-y-1">
                <p>
                  <strong className="text-slate-300">Proponente Principal:</strong>{' '}
                  <span className="text-amber-400 font-semibold">{viewingResolution.mainSponsorName}</span>
                </p>
                {viewingResolution.coSponsors.length > 0 && (
                  <p>
                    <strong className="text-slate-300">Co-signatários:</strong>{' '}
                    <span>{viewingResolution.coSponsors.join(', ')}</span>
                  </p>
                )}
                <p>
                  <strong className="text-slate-300">Situação Atual:</strong>{' '}
                  <span className="capitalize">{viewingResolution.status.replace('_', ' ')}</span>
                </p>
              </div>

              {/* Cláusulas Preambulares */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cláusulas Preambulares (Considerandos)
                </h3>
                <div className="space-y-2 pl-3 border-l-2 border-blue-500/50 italic text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {viewingResolution.preamble.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
              </div>

              {/* Cláusulas Operativas */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cláusulas Operativas (Resoluções)
                </h3>
                <div className="space-y-2 pl-3 border-l-2 border-emerald-500/50 text-white leading-relaxed text-xs sm:text-sm font-medium">
                  {viewingResolution.operativeClauses.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
              </div>

              {/* Se foi votada */}
              {viewingResolution.votingResult && (
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Vote className="w-4 h-4 text-blue-400" />
                    Ata de Votação Registrada em Plenária
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="p-2 rounded bg-slate-900">
                      <span className="block text-emerald-400 font-black text-lg">{viewingResolution.votingResult.favorable}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">A Favor</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900">
                      <span className="block text-rose-400 font-black text-lg">{viewingResolution.votingResult.opposed}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Contra</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900">
                      <span className="block text-slate-300 font-black text-lg">{viewingResolution.votingResult.abstained}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Abstenções</span>
                    </div>
                  </div>
                  <p className="text-center text-[11px] text-slate-400 pt-1">
                    Deliberação realizada em {viewingResolution.votingResult.date} • Quórum exigido: {viewingResolution.votingResult.requiredMajority === 'simples' ? 'Maioria Simples' : 'Dois Terços (2/3)'}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-950/60">
              <span className="text-[11px] text-slate-500">Documento gerado pela plataforma OSU</span>
              <button
                onClick={() => setViewingResolution(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação de Resolução */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Redigir Novo Projeto de Resolução
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Código Oficial</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Comitê Temático</label>
                  <select
                    value={committeeId}
                    onChange={(e) => {
                      setCommitteeId(e.target.value);
                      const com = committees.find(c => c.id === e.target.value);
                      if (com) {
                        setCode(`RES-${com.code}/0${resolutions.length + 1}`);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    {committees.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título da Resolução</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Criação da Semana de Conscientização Digital nas Turmas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Turma / Proponente Principal</label>
                  <select
                    value={mainSponsorId}
                    onChange={(e) => setMainSponsorId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    {delegations.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.representation})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Co-proponentes (separados por vírgula)</label>
                  <input
                    type="text"
                    placeholder="Ex: 1º EM A, 2º EM B"
                    value={coSponsorsInput}
                    onChange={(e) => setCoSponsorsInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cláusulas Preambulares (Uma por linha, ex: "Considerando...", "Tendo em vista...")
                </label>
                <textarea
                  rows={3}
                  value={preambleInput}
                  onChange={(e) => setPreambleInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cláusulas Operativas (Uma por linha, ex: "1. Estabelece que...", "2. Recomenda à direção...")
                </label>
                <textarea
                  rows={4}
                  value={operativeInput}
                  onChange={(e) => setOperativeInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 shadow"
                >
                  Submeter Minuta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
