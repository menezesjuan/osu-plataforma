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
  Printer
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';
import { Resolution, ResolutionStatus } from '../../types';
import { ActiveTab } from '../layout/Navbar';

interface ResolutionsViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const ResolutionsView: React.FC<ResolutionsViewProps> = ({ onNavigate }) => {
  const { resolutions, committees, delegations, currentUser, addResolution, updateResolutionStatus, deleteResolution, startLiveVoting } = useOsu();
  
  const myDelegation = delegations.find(d => d.id === currentUser.delegationId) || delegations[0];

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
  const [mainSponsorId, setMainSponsorId] = useState(currentUser.role === 'student' && myDelegation ? myDelegation.id : (delegations[0]?.id || ''));
  const [coSponsorsInput, setCoSponsorsInput] = useState('');
  const [preambleInput, setPreambleInput] = useState('');
  const [operativeInput, setOperativeInput] = useState('');

  const openCreateModal = () => {
    const selectedCom = committees[0];
    const seq = resolutions.length + 1;
    setCode(`RES-${selectedCom?.code || 'OSU'}/0${seq}`);
    setTitle('');
    setCommitteeId(selectedCom?.id || 'csma');
    setMainSponsorId(currentUser.role === 'student' && myDelegation ? myDelegation.id : (delegations[0]?.id || ''));
    setCoSponsorsInput('');
    setPreambleInput('Considerando a relevância desta pauta para a comunidade escolar;\nReconhecendo o papel ativo dos estudantes na construção de melhorias;');
    setOperativeInput('1. Propõe a realização de campanhas educativas contínuas nas turmas;\n2. Determina a criação de uma comissão mista discente;');
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Aprovado
          </span>
        );
      case 'rejeitado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-500 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Rejeitado
          </span>
        );
      case 'em_debate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200">
            <Vote className="w-3.5 h-3.5" />
            Em Debate
          </span>
        );
      case 'analise_mesa':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Análise da Mesa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
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
    <div className="p-8 space-y-6 bg-white min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Livro de Projetos de Resolução
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Minutas legislativas dos comitês, proposições e deliberação plenária.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Projeto de Resolução
        </button>
      </div>

      {/* Filtros */}
      <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, título ou proponente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <select
            value={filterCommittee}
            onChange={(e) => setFilterCommittee(e.target.value)}
            className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-orange-500"
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
            className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-orange-500"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredResolutions.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
                  {res.code}
                </span>
                {getStatusBadge(res.status)}
              </div>

              <h3 className="mt-3 text-base font-extrabold text-slate-800 leading-snug">{res.title}</h3>

              <div className="mt-2 text-xs text-slate-400 space-y-1">
                <p>
                  Comitê: <strong className="text-slate-700">{getCommitteeCode(res.committeeId)}</strong> • {res.createdAt}
                </p>
                <p>
                  Proponente: <span className="text-orange-600 font-bold">{res.mainSponsorName}</span>
                </p>
              </div>

              {/* Prévia da Cláusula */}
              <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Primeira Ação Operativa:</span>
                <p className="italic line-clamp-2">
                  "{res.operativeClauses[0] || 'Em fase de redação...'}"
                </p>
              </div>

              {res.votingResult && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Resultado Oficial:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">{res.votingResult.favorable} Favor</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-rose-500">{res.votingResult.opposed} Contra</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{res.votingResult.abstained} Abst.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setViewingResolution(res)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                <Eye className="w-3.5 h-3.5" />
                Ler Minuta
              </button>

              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' && res.status !== 'aprovado' && res.status !== 'rejeitado' && (
                  <button
                    onClick={() => handleStartVotingFromResolution(res)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Vote className="w-3.5 h-3.5" />
                    Abrir Voto
                  </button>
                )}

                {currentUser.role === 'admin' && (
                  <select
                    value={res.status}
                    onChange={(e) => updateResolutionStatus(res.id, e.target.value as ResolutionStatus)}
                    className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none"
                    title="Alterar status"
                  >
                    <option value="redacao">Redação</option>
                    <option value="analise_mesa">Análise</option>
                    <option value="em_debate">Em Debate</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="rejeitado">Rejeitado</option>
                  </select>
                )}

                {(currentUser.role === 'admin' || (currentUser.role === 'student' && res.mainSponsorId === myDelegation?.id)) && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Excluir a minuta ${res.code}?`)) {
                        deleteResolution(res.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                    title="Excluir minuta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal de Leitura Completa Oficial */}
      {viewingResolution && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200">
                  {viewingResolution.code}
                </span>
                <span className="text-xs text-slate-400 font-bold">Documento Oficial Plenário</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 border border-slate-200 font-bold"
                  title="Imprimir resolução"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimir</span>
                </button>
                <button
                  onClick={() => setViewingResolution(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Conteúdo com Formato Diplomático */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block">
                  Organização das Salas Unidas • Assembleia 2026
                </span>
                <h3 className="mt-1 text-lg font-black text-slate-800">{viewingResolution.title}</h3>
                <p className="mt-0.5 text-xs text-slate-400 font-medium">
                  Comitê: {getCommitteeCode(viewingResolution.committeeId)} • Data: {viewingResolution.createdAt}
                </p>
              </div>

              {/* Informações de Autoria */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <p>
                  <strong className="text-slate-500">Proponente Principal:</strong>{' '}
                  <span className="text-orange-600 font-bold">{viewingResolution.mainSponsorName}</span>
                </p>
                {viewingResolution.coSponsors.length > 0 && (
                  <p>
                    <strong className="text-slate-500">Co-signatários:</strong>{' '}
                    <span>{viewingResolution.coSponsors.join(', ')}</span>
                  </p>
                )}
              </div>

              {/* Cláusulas Preambulares */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Cláusulas Preambulares (Considerandos)
                </h4>
                <div className="space-y-2 pl-3 border-l-2 border-orange-400 italic text-slate-600 leading-relaxed">
                  {viewingResolution.preamble.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
              </div>

              {/* Cláusulas Operativas */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Cláusulas Operativas (Resoluções)
                </h4>
                <div className="space-y-2 pl-3 border-l-2 border-emerald-500 text-slate-800 font-semibold leading-relaxed">
                  {viewingResolution.operativeClauses.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-[11px] text-slate-400 font-medium">Documento oficial da simulação OSU</span>
              <button
                onClick={() => setViewingResolution(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação de Resolução */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Redigir Novo Projeto de Resolução
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código Oficial</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Comitê Temático</label>
                  <select
                    value={committeeId}
                    onChange={(e) => setCommitteeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    {committees.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Proposta</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Programa de Tutoria e Apoio aos Estudos"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Turma Proponente</label>
                  {currentUser.role === 'admin' ? (
                    <select
                      value={mainSponsorId}
                      onChange={(e) => setMainSponsorId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      {delegations.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.representation})</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 font-bold text-xs flex items-center justify-between">
                      <span>{myDelegation ? `${myDelegation.name} (${myDelegation.representation})` : 'Minha Bancada'}</span>
                      <span>{myDelegation?.flagEmoji}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Co-proponentes</label>
                  <input
                    type="text"
                    placeholder="Ex: 1º EM A, 2º EM B"
                    value={coSponsorsInput}
                    onChange={(e) => setCoSponsorsInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cláusulas Preambulares (Considerandos)</label>
                <textarea
                  rows={3}
                  value={preambleInput}
                  onChange={(e) => setPreambleInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cláusulas Operativas (Ações)</label>
                <textarea
                  rows={4}
                  value={operativeInput}
                  onChange={(e) => setOperativeInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20"
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
