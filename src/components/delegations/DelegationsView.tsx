import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit3,
  UserCheck,
  Building2,
  GraduationCap
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';
import { Delegation, EducationLevel } from '../../types';

export const DelegationsView: React.FC = () => {
  const { delegations, committees, togglePresence, addDelegation, updateDelegation, deleteDelegation } = useOsu();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('todos');
  const [filterCommittee, setFilterCommittee] = useState<string>('todos');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDelegation, setEditingDelegation] = useState<Delegation | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [level, setLevel] = useState<EducationLevel>('Ensino Médio');
  const [representation, setRepresentation] = useState('');
  const [flagEmoji, setFlagEmoji] = useState('🇧🇷');
  const [chiefDelegate, setChiefDelegate] = useState('');
  const [delegatesInput, setDelegatesInput] = useState('');
  const [advisorTeacher, setAdvisorTeacher] = useState('');
  const [committeeId, setCommitteeId] = useState(committees[0]?.id || 'csma');

  const openNewModal = () => {
    setEditingDelegation(null);
    setName('');
    setLevel('Ensino Médio');
    setRepresentation('');
    setFlagEmoji('🇧🇷');
    setChiefDelegate('');
    setDelegatesInput('');
    setAdvisorTeacher('');
    setCommitteeId(committees[0]?.id || 'csma');
    setModalOpen(true);
  };

  const openEditModal = (del: Delegation) => {
    setEditingDelegation(del);
    setName(del.name);
    setLevel(del.level);
    setRepresentation(del.representation);
    setFlagEmoji(del.flagEmoji);
    setChiefDelegate(del.chiefDelegate);
    setDelegatesInput(del.delegates.join(', '));
    setAdvisorTeacher(del.advisorTeacher);
    setCommitteeId(del.committeeId);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !chiefDelegate.trim()) return;

    const delegatesList = delegatesInput
      .split(',')
      .map(d => d.trim())
      .filter(d => d.length > 0);

    if (delegatesList.length === 0) {
      delegatesList.push(chiefDelegate);
    }

    if (editingDelegation) {
      updateDelegation({
        ...editingDelegation,
        name,
        level,
        representation,
        flagEmoji: flagEmoji || '🏛️',
        chiefDelegate,
        delegates: delegatesList,
        advisorTeacher,
        committeeId,
      });
    } else {
      addDelegation({
        name,
        level,
        representation,
        flagEmoji: flagEmoji || '🏛️',
        chiefDelegate,
        delegates: delegatesList,
        advisorTeacher,
        committeeId,
        isPresent: true,
      });
    }

    setModalOpen(false);
  };

  const filteredDelegations = delegations.filter((del) => {
    const matchesSearch =
      del.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      del.representation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      del.chiefDelegate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      del.delegates.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLevel = filterLevel === 'todos' || del.level === filterLevel;
    const matchesCommittee = filterCommittee === 'todos' || del.committeeId === filterCommittee;

    return matchesSearch && matchesLevel && matchesCommittee;
  });

  const getCommitteeName = (cId: string) => {
    const found = committees.find(c => c.id === cId);
    return found ? `${found.code} - ${found.name}` : cId;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Salas & Delegações Inscritas
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestão de turmas representantes, credenciamento em plenária e composição discente.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-900/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nova Turma / Delegação
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por turma, país ou aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="todos">Todos os Níveis de Ensino</option>
            <option value="Fundamental II">Ensino Fundamental II</option>
            <option value="Ensino Médio">Ensino Médio</option>
          </select>
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
      </div>

      {/* Grid de Cards de Delegações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDelegations.map((del) => (
          <div 
            key={del.id}
            className="rounded-xl bg-slate-800/70 border border-slate-700/80 p-5 flex flex-col justify-between hover:border-slate-600 transition shadow-lg"
          >
            <div>
              {/* Header do Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl border border-slate-700">
                    {del.flagEmoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{del.name}</h3>
                    <p className="text-xs font-medium text-amber-400">{del.representation}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <GraduationCap className="w-3 h-3" />
                      {del.level}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => togglePresence(del.id)}
                  title={del.isPresent ? 'Marcar ausente' : 'Marcar presente'}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                    del.isPresent 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {del.isPresent ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span className="hidden sm:inline">{del.isPresent ? 'Presente' : 'Ausente'}</span>
                </button>
              </div>

              {/* Informações da Delegação */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Comitê Designado:</span>
                  <span className="text-slate-200 flex items-center gap-1 mt-0.5 font-semibold">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    {getCommitteeName(del.committeeId)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Chefe de Delegação:</span>
                  <span className="text-slate-200 font-semibold">{del.chiefDelegate}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Demais Delegados ({del.delegates.length}):</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {del.delegates.map((student, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300 text-[11px]">
                        {student}
                      </span>
                    ))}
                  </div>
                </div>

                {del.advisorTeacher && (
                  <div>
                    <span className="text-slate-400 block font-medium">Orientador(a):</span>
                    <span className="text-slate-300 italic">{del.advisorTeacher}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ações do Card */}
            <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className={`text-[11px] font-medium flex items-center gap-1 ${del.isPresent ? 'text-emerald-400' : 'text-slate-500'}`}>
                <UserCheck className="w-3.5 h-3.5" />
                {del.isPresent ? 'Apto a votar' : 'Sem direito a voto'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(del)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition"
                  title="Editar delegação"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Deseja remover a delegação ${del.name}?`)) {
                      deleteDelegation(del.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                  title="Excluir delegação"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredDelegations.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">Nenhuma delegação encontrada</h3>
          <p className="text-xs text-slate-500 mt-1">Ajuste os filtros de pesquisa ou cadastre uma nova sala.</p>
        </div>
      )}

      {/* Modal de Cadastro / Edição */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                {editingDelegation ? 'Editar Delegação' : 'Cadastrar Nova Turma / Delegação'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nome da Turma / Sala</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 9º Ano C ou 2º EM C"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Segmento</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Fundamental II">Ensino Fundamental II</option>
                    <option value="Ensino Médio">Ensino Médio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">País ou Causa Representada</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Delegação da França ou Meio Ambiente"
                    value={representation}
                    onChange={(e) => setRepresentation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Emoji / Bandeira</label>
                  <input
                    type="text"
                    placeholder="Ex: 🇫🇷 ou 🌍"
                    value={flagEmoji}
                    onChange={(e) => setFlagEmoji(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Comitê Designado</label>
                <select
                  value={committeeId}
                  onChange={(e) => setCommitteeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {committees.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Chefe de Delegação (Porta-voz)</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do aluno porta-voz principal"
                  value={chiefDelegate}
                  onChange={(e) => setChiefDelegate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Integrantes da Bancada (separados por vírgula)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Clara Meireles, Davi Rocha, Mariana Silva"
                  value={delegatesInput}
                  onChange={(e) => setDelegatesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Professor(a) Orientador(a)</label>
                <input
                  type="text"
                  placeholder="Ex: Profa. Helena Ramos"
                  value={advisorTeacher}
                  onChange={(e) => setAdvisorTeacher(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 shadow"
                >
                  {editingDelegation ? 'Salvar Alterações' : 'Cadastrar Delegação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
