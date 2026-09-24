import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  AlertCircle, 
  Play, 
  Square, 
  X,
  History,
  Scale,
  Clock
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';

export const VotingView: React.FC = () => {
  const { 
    delegations, 
    resolutions, 
    liveVote, 
    currentUser,
    startLiveVoting, 
    castVote, 
    finishLiveVoting, 
    cancelLiveVoting 
  } = useOsu();

  const myDelegation = delegations.find(d => d.id === currentUser.delegationId) || delegations[0];

  const [selectedResolutionId, setSelectedResolutionId] = useState<string>(
    resolutions.find(r => r.status !== 'aprovado' && r.status !== 'rejeitado')?.id || resolutions[0]?.id || ''
  );
  const [majorityType, setMajorityType] = useState<'simples' | 'dois_tercos'>('simples');

  const presentDelegations = delegations.filter(d => d.isPresent);
  const currentResolution = resolutions.find(r => r.id === (liveVote ? liveVote.resolutionId : selectedResolutionId));

  const votes = liveVote ? liveVote.votes : {};
  let favorCount = 0;
  let againstCount = 0;
  let abstainCount = 0;

  Object.values(votes).forEach(v => {
    if (v === 'favor') favorCount++;
    if (v === 'contra') againstCount++;
    if (v === 'abstencao') abstainCount++;
  });

  const votedTotal = Object.keys(votes).length;
  const pendingCount = Math.max(0, presentDelegations.length - votedTotal);
  const activeVotes = favorCount + againstCount;
  
  const isPassing = 
    liveVote?.majorityType === 'dois_tercos'
      ? activeVotes > 0 && favorCount >= Math.ceil((activeVotes * 2) / 3)
      : favorCount > againstCount;

  const handleStart = () => {
    if (!selectedResolutionId) return;
    startLiveVoting(selectedResolutionId, majorityType);
  };

  const handleQuickAll = (voteValue: 'favor' | 'contra' | 'abstencao') => {
    presentDelegations.forEach(del => {
      castVote(del.id, voteValue);
    });
  };

  const pastVotedResolutions = resolutions.filter(r => r.votingResult);

  return (
    <div className="p-8 space-y-6 bg-white min-h-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          Plenário de Votações da Mesa
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Painel de escrutínio nominal e cômputo de quórum para as deliberações oficiais da OSU.
        </p>
      </div>

      {liveVote && currentResolution ? (
        <div className="space-y-6">
          {/* Card de Sessão Ativa */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-50 via-rose-50 to-white border-2 border-orange-400 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200/60 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    Escrutínio Aberto
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Iniciado às {liveVote.startedAt}</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mt-1">
                  {currentResolution.code}: {currentResolution.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Proposta de: <strong className="text-orange-600">{currentResolution.mainSponsorName}</strong> • Quórum: <strong className="text-slate-800">{liveVote.majorityType === 'simples' ? 'Maioria Simples' : 'Dois Terços'}</strong>
                </p>
              </div>

              {currentUser.role === 'admin' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelLiveVoting}
                    className="px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <X className="w-4 h-4 text-rose-500" />
                    Cancelar
                  </button>
                  <button
                    onClick={finishLiveVoting}
                    className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
                  >
                    <Square className="w-4 h-4" />
                    Proclamar Resultado Oficial
                  </button>
                </div>
              )}
            </div>

            {/* Placar em Tempo Real */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-center shadow-xs">
                <span className="text-3xl font-black text-emerald-600">{favorCount}</span>
                <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">A Favor</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-rose-200 text-center shadow-xs">
                <span className="text-3xl font-black text-rose-500">{againstCount}</span>
                <span className="block text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-0.5">Contra</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <span className="text-3xl font-black text-slate-600">{abstainCount}</span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Abstenções</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-orange-200 text-center shadow-xs">
                <span className="text-3xl font-black text-orange-500">{pendingCount}</span>
                <span className="block text-[10px] font-bold text-orange-500 uppercase tracking-wider mt-0.5">Pendentes</span>
              </div>
            </div>

            {/* Barra Visual de Proporção */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                <span>Resultado Parcial: {isPassing ? '✅ Aprovando' : '❌ Rejeitando'}</span>
                <span>{votedTotal} de {presentDelegations.length} votantes</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                <div
                  className="bg-emerald-500 transition-all duration-300"
                  style={{ width: `${presentDelegations.length ? (favorCount / presentDelegations.length) * 100 : 0}%` }}
                />
                <div
                  className="bg-rose-500 transition-all duration-300"
                  style={{ width: `${presentDelegations.length ? (againstCount / presentDelegations.length) * 100 : 0}%` }}
                />
                <div
                  className="bg-slate-400 transition-all duration-300"
                  style={{ width: `${presentDelegations.length ? (abstainCount / presentDelegations.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Cédula Direta de Votação para Aluno */}
            {currentUser.role === 'student' && myDelegation && (
              <div className="p-4 rounded-2xl bg-white border-2 border-orange-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Cédula Oficial da Bancada:
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl">{myDelegation.flagEmoji}</span>
                    <span className="text-sm font-black text-slate-800">
                      {myDelegation.name} ({myDelegation.representation})
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {votes[myDelegation.id] ? (
                      <span className="text-emerald-600 font-bold">Voto Registrado: {votes[myDelegation.id].toUpperCase()}</span>
                    ) : (
                      <span className="text-orange-600 font-bold">Aguardando seu voto nesta resolução</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => castVote(myDelegation.id, 'favor')}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                      votes[myDelegation.id] === 'favor'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    Votar A Favor
                  </button>
                  <button
                    onClick={() => castVote(myDelegation.id, 'contra')}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                      votes[myDelegation.id] === 'contra'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    Votar Contra
                  </button>
                  <button
                    onClick={() => castVote(myDelegation.id, 'abstencao')}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                      votes[myDelegation.id] === 'abstencao'
                        ? 'bg-slate-700 text-white shadow-md shadow-slate-700/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Abstenção
                  </button>
                </div>
              </div>
            )}

            {/* Ações em lote da Mesa */}
            {currentUser.role === 'admin' && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-orange-200/50 text-xs">
                <span className="text-slate-500 font-bold">Atalhos da Mesa:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickAll('favor')}
                    className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-emerald-600 text-xs font-bold hover:bg-emerald-50"
                  >
                    Marcar Todos a Favor
                  </button>
                  <button
                    onClick={() => handleQuickAll('abstencao')}
                    className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                  >
                    Marcar Todos Abstenção
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cédula Nominal das Delegações */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Scale className="w-5 h-5 text-orange-500" />
              Chamada Nominal de Votos ({presentDelegations.length} Presentes)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presentDelegations.map((del) => {
                const currentVote = votes[del.id];

                return (
                  <div
                    key={del.id}
                    className={`p-4 rounded-3xl border transition flex items-center justify-between gap-3 shadow-xs ${
                      currentVote === 'favor'
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : currentVote === 'contra'
                        ? 'bg-rose-50/70 border-rose-300'
                        : currentVote === 'abstencao'
                        ? 'bg-slate-100/70 border-slate-300'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{del.flagEmoji}</span>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">{del.name}</h4>
                        <p className="text-[11px] text-orange-600 font-bold">{del.representation}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Delegado: {del.chiefDelegate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(currentUser.role === 'admin' || del.id === myDelegation?.id) ? (
                        <>
                          <button
                            onClick={() => castVote(del.id, 'favor')}
                            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                              currentVote === 'favor'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-50 text-emerald-600 hover:bg-emerald-50 border border-slate-200'
                            }`}
                            title="Votar a Favor"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Favor</span>
                          </button>

                          <button
                            onClick={() => castVote(del.id, 'contra')}
                            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                              currentVote === 'contra'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-50 text-rose-500 hover:bg-rose-50 border border-slate-200'
                            }`}
                            title="Votar Contra"
                          >
                            <XCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Contra</span>
                          </button>

                          <button
                            onClick={() => castVote(del.id, 'abstencao')}
                            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                              currentVote === 'abstencao'
                                ? 'bg-slate-600 text-white shadow-xs'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                            }`}
                            title="Abstenção"
                          >
                            <MinusCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Abst.</span>
                          </button>
                        </>
                      ) : (
                        <div className="px-2.5 py-1 rounded-xl text-xs font-bold">
                          {currentVote === 'favor' && (
                            <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">A Favor</span>
                          )}
                          {currentVote === 'contra' && (
                            <span className="text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">Contra</span>
                          )}
                          {currentVote === 'abstencao' && (
                            <span className="text-slate-700 bg-slate-200 px-2.5 py-1 rounded-lg">Abstenção</span>
                          )}
                          {!currentVote && (
                            <span className="text-slate-400 italic text-[11px]">Pendente</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : currentUser.role === 'student' ? (
        <div className="p-10 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-4 max-w-xl mx-auto my-6">
          <div className="w-16 h-16 rounded-3xl bg-orange-100/80 text-orange-600 border border-orange-200 flex items-center justify-center mx-auto shadow-xs">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-slate-800">Aguardando Abertura de Escrutínio pela Mesa</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              O Presidente da Mesa selecionará o projeto de resolução em debate e abrirá a votação em plenário. Assim que for aberta, esta tela exibirá automaticamente a cédula oficial para o voto da sua bancada.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
            <span className="text-base">{myDelegation?.flagEmoji}</span>
            <span>Bancada: <strong>{myDelegation?.representation}</strong> ({myDelegation?.name})</span>
            <span className="text-slate-300">•</span>
            <span className={myDelegation?.isPresent ? 'text-emerald-600 font-extrabold' : 'text-rose-500 font-extrabold'}>
              {myDelegation?.isPresent ? 'Apto a Votar' : 'Sem Quórum'}
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-5">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Play className="w-5 h-5 text-orange-500" />
              Abrir Nova Sessão de Escrutínio
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Selecione o projeto de resolução em debate para iniciar a votação nominal dos delegados no plenário.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resolução em Pauta:
                </label>
                <select
                  value={selectedResolutionId}
                  onChange={(e) => setSelectedResolutionId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 font-semibold"
                >
                  {resolutions.map(res => (
                    <option key={res.id} value={res.id}>
                      [{res.code}] {res.title} ({res.status.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Critério de Quórum Regimental:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMajorityType('simples')}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      majorityType === 'simples'
                        ? 'bg-orange-50 border-orange-400 text-orange-800 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-bold block">Maioria Simples (50% + 1)</span>
                    <span className="text-[10px] text-slate-400 font-normal mt-0.5 block">
                      Aplicável para emendas e resoluções ordinárias.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMajorityType('dois_tercos')}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      majorityType === 'dois_tercos'
                        ? 'bg-orange-50 border-orange-400 text-orange-800 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-bold block">Dois Terços (2/3)</span>
                    <span className="text-[10px] text-slate-400 font-normal mt-0.5 block">
                      Para reformas estatutárias estruturais.
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-slate-800">Quórum Presente:</span>
                  <span className="text-slate-400 font-medium">{presentDelegations.length} turmas presentes e aptas.</span>
                </div>
                {presentDelegations.length === 0 && (
                  <span className="text-rose-500 font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Sem delegações presentes
                  </span>
                )}
              </div>

              <button
                onClick={handleStart}
                disabled={!selectedResolutionId || presentDelegations.length === 0}
                className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-black shadow-md shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Iniciar Votação Nominal em Plenária
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-3">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-orange-500" />
              Diretrizes da Mesa
            </h4>
            <ul className="text-xs text-slate-500 font-medium space-y-2 list-disc list-inside">
              <li>Cada bancada tem direito a um voto nominal e irrevogável.</li>
              <li>As abstenções não diminuem a maioria simples na contagem.</li>
              <li>A proclamação registra a ata oficial no Livro de Resoluções.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Histórico de Votações Anteriores */}
      {pastVotedResolutions.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-orange-500" />
            Atas de Votações Promulgadas ({pastVotedResolutions.length})
          </h3>

          <div className="space-y-2.5">
            {pastVotedResolutions.map(res => (
              <div 
                key={res.id}
                className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      {res.code}
                    </span>
                    <h5 className="font-extrabold text-slate-800 text-xs sm:text-sm">{res.title}</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Proposta por: {res.mainSponsorName} • Sessão de {res.votingResult?.date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs font-bold">
                    <span className="text-emerald-600">{res.votingResult?.favorable} Favor</span>
                    <span className="text-slate-300 mx-1">|</span>
                    <span className="text-rose-500">{res.votingResult?.opposed} Contra</span>
                    <span className="text-slate-300 mx-1">|</span>
                    <span className="text-slate-400">{res.votingResult?.abstained} Abst.</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    res.votingResult?.passed
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-rose-50 text-rose-500 border border-rose-200'
                  }`}>
                    {res.votingResult?.passed ? 'Aprovada' : 'Rejeitada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
