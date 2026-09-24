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
  GraduationCap,
  Key
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';
import { Delegation, EducationLevel } from '../../types';

export const DelegationsView: React.FC = () => {
  const { delegations, committees, currentUser, togglePresence, addDelegation, updateDelegation, deleteDelegation } = useOsu();
  
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const openNewModal = () => {
    setEditingDelegation(null);
    setName('');
    setLevel('Ensino Médio');
    setRepresentation('');
    setFlagEmoji('🇧🇷');
    setChiefDelegate('');
    setDelegatesInput('');
    setUsername('');
    setPassword('');
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
    setUsername(del.username || '');
    setPassword(del.password || '');
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
        username: username.trim() || undefined,
        password: password.trim() || undefined,
      });
    } else {
      addDelegation({
        name,
        level,
        representation,
        flagEmoji: flagEmoji || '🏛️',
        chiefDelegate,
        delegates: delegatesList,
        username: username.trim() || undefined,
        password: password.trim() || undefined,
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
    <div className="p-8 space-y-6 bg-white min-h-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Salas & Bancadas Escolares
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Credenciamento de presença, chefes de delegação e representação diplomática.
          </p>
        </div>

        {currentUser.role === 'admin' ? (
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Nova Turma / Bancada
          </button>
        ) : (
          <div className="px-3.5 py-2 rounded-2xl bg-slate-100 text-slate-500 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto border border-slate-200">
            <span>Modo Consulta • Bancadas Oficiais</span>
          </div>
        )}
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por turma, país ou aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-orange-500"
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
            className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-orange-500"
          >
            <option value="todos">Todos os Comitês</option>
            {committees.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Cards de Delegações com Estilo Pastel Suave */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDelegations.map((del) => (
          <div 
            key={del.id}
            className="rounded-3xl bg-white border border-slate-100 p-5 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-200 shadow-sm"
          >
            <div>
              {/* Header do Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 shadow-xs">
                    {del.flagEmoji}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base leading-tight">{del.name}</h3>
                    <p className="text-xs font-bold text-orange-500">{del.representation}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-semibold mt-0.5">
                      <GraduationCap className="w-3 h-3 text-slate-400" />
                      {del.level}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => currentUser.role === 'admin' && togglePresence(del.id)}
                  disabled={currentUser.role !== 'admin'}
                  title={
                    currentUser.role === 'admin'
                      ? (del.isPresent ? 'Marcar ausente' : 'Marcar presente')
                      : 'Controle de presença gerido pela Mesa Diretora'
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
                    currentUser.role !== 'admin' ? 'cursor-default opacity-90' : 'cursor-pointer'
                  } ${
                    del.isPresent 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-500 border border-rose-200'
                  }`}
                >
                  {del.isPresent ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{del.isPresent ? 'Presente' : 'Ausente'}</span>
                </button>
              </div>

              {/* Informações da Delegação */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                {del.committeeId && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Comitê:</span>
                    <span className="text-slate-700 flex items-center gap-1 font-semibold mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-500" />
                      {getCommitteeName(del.committeeId)}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Porta-voz Principal:</span>
                  <span className="text-slate-800 font-extrabold">{del.chiefDelegate}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Bancada ({del.delegates.length}):</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {del.delegates.map((student, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 text-[11px] font-medium">
                        {student}
                      </span>
                    ))}
                  </div>
                </div>

                {del.advisorTeacher && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Orientador(a):</span>
                    <span className="text-slate-600 italic font-medium">{del.advisorTeacher}</span>
                  </div>
                )}

                {del.username && (
                  <div className="pt-1 border-t border-slate-100/60 flex items-center gap-1.5">
                    <Key className="w-3 h-3 text-orange-500" />
                    <span className="text-[10px] uppercase font-bold text-slate-400">Usuário:</span>
                    <span className="text-slate-700 font-mono text-[11px] font-bold bg-slate-100 px-1.5 py-0.5 rounded">@{del.username}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ações do Card */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`text-[11px] font-semibold flex items-center gap-1 ${del.isPresent ? 'text-emerald-600' : 'text-slate-400'}`}>
                <UserCheck className="w-3.5 h-3.5" />
                {del.isPresent ? 'Apto a votar' : 'Sem direito a voto'}
              </span>

              {currentUser.role === 'admin' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(del)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
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
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                    title="Excluir delegação"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Modal de Cadastro / Edição */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                {editingDelegation ? 'Editar Bancada' : 'Cadastrar Nova Turma / Bancada'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome da Turma</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 9º Ano C"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Segmento</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Fundamental II">Ensino Fundamental II</option>
                    <option value="Ensino Médio">Ensino Médio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">País ou Causa Representada</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: França ou Sustentabilidade"
                    value={representation}
                    onChange={(e) => setRepresentation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    placeholder="Ex: 🇫🇷"
                    value={flagEmoji}
                    onChange={(e) => setFlagEmoji(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Porta-voz Principal</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do aluno"
                  value={chiefDelegate}
                  onChange={(e) => setChiefDelegate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Integrantes da Bancada (separados por vírgula)</label>
                <textarea
                  rows={2}
                  value={delegatesInput}
                  onChange={(e) => setDelegatesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Usuário</label>
                  <input
                    type="text"
                    placeholder="Ex: bancada_franca"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Senha</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20"
                >
                  {editingDelegation ? 'Salvar Alterações' : 'Cadastrar Bancada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
