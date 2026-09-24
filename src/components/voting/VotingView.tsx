import React, { useState } from 'react';
import { 
  Vote, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  AlertCircle, 
  Play, 
  Square, 
  X,
  History,
  Scale
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';

export const VotingView: React.FC = () => {
  const { 
    delegations, 
    resolutions, 
    liveVote, 
    startLiveVoting, 
    castVote, 
    finishLiveVoting, 
    cancelLiveVoting 
  } = useOsu();

  const [selectedResolutionId, setSelectedResolutionId] = useState<string>(
    resolutions.find(r => r.status !== 'aprovado' && r.status !== 'rejeitado')?.id || resolutions[0]?.id || ''
  );
  const [majorityType, setMajorityType] = useState<'simples' | 'dois_tercos'>('simples');

  // Delegations that are present in the plenary
  const presentDelegations = delegations.filter(d => d.isPresent);
  const currentResolution = resolutions.find(r => r.id === (liveVote ? liveVote.resolutionId : selectedResolutionId));

  // Count votes in current live session
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Vote className="w-6 h-6 text-blue-400" />
          Plenário de Votações da Mesa
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Sistema oficial de escrutínio nominal e cômputo de quórum para as deliberações da OSU.
        </p>
      </div>

      {/* Seção Principal: Sessão de Votação Ativa ou Painel de Abertura */}
      {liveVote && currentResolution ? (
        <div className="space-y-6">
          {/* Card de Sessão Ativa */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-2 border-blue-500 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Escrutínio Aberto
                  </span>
                  <span className="text-xs text-slate-400">Iniciado às {liveVote.startedAt}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {currentResolution.code}: {currentResolution.title}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Proposição de: <strong className="text-amber-400">{currentResolution.mainSponsorName}</strong> • Quórum requerido: <strong className="text-blue-300">{liveVote.majorityType === 'simples' ? 'Maioria Simples' : 'Dois Terços (2/3)'}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={cancelLiveVoting}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <X className="w-4 h-4 text-rose-400" />
                  Cancelar
                </button>
                <button
                  onClick={finishLiveVoting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition"
                >
                  <Square className="w-4 h-4" />
                  Proclamar Resultado Oficial
                </button>
              </div>
            </div>

            {/* Placar em Tempo Real */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                <span className="text-3xl font-black text-emerald-400">{favorCount}</span>
                <span className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mt-1">A Favor</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center">
                <span className="text-3xl font-black text-rose-400">{againstCount}</span>
                <span className="block text-xs font-bold text-rose-300 uppercase tracking-wider mt-1">Contra</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
                <span className="text-3xl font-black text-slate-300">{abstainCount}</span>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Abstenções</span>
              </div>
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-center">
                <span className="text-3xl font-black text-blue-400">{pendingCount}</span>
                <span className="block text-xs font-bold text-blue-300 uppercase tracking-wider mt-1">Pendentes</span>
              </div>
            </div>

            {/* Barra Visual de Proporção */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                <span>Tendência do Plenário: {isPassing ? '✅ Aprovando' : '❌ Rejeitando'}</span>
                <span>{votedTotal} de {presentDelegations.length} delegações votaram</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-emerald-500 transition-all duration-300"
                  style={{ width: `${presentDelegations.length ? (favorCount / presentDelegations.length) * 100 : 0}%` }}
                />
                <div
                  className="bg-rose-500 transition-all duration-300"
                  style={{ width: `${presentDelegations.length ? (againstCount / presentDelegations.length) * 100 : 0}%` }}
                />
                <div
                  className="bg-slate-500 transition-all duration-300"
                  style={{ width: `${presentDelegations.length ? (abstainCount / presentDelegations.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Ações em lote da Mesa */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Atalhos da Mesa:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickAll('favor')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold"
                >
                  Marcar Todos a Favor
                </button>
                <button
                  onClick={() => handleQuickAll('abstencao')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Marcar Todos Abstenção
                </button>
              </div>
            </div>
          </div>

          {/* Cédula Nominal das Delegações */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-400" />
              Chamada Nominal de Votos ({presentDelegations.length} Presentes)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presentDelegations.map((del) => {
                const currentVote = votes[del.id];

                return (
                  <div
                    key={del.id}
                    className={`p-4 rounded-xl border transition flex items-center justify-between gap-3 ${
                      currentVote === 'favor'
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : currentVote === 'contra'
                        ? 'bg-rose-950/30 border-rose-500/50'
                        : currentVote === 'abstencao'
                        ? 'bg-slate-800/80 border-slate-600'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{del.flagEmoji}</span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{del.name}</h4>
                        <p className="text-xs text-amber-400 font-medium">{del.representation}</p>
                        <p className="text-[11px] text-slate-400">Delegado: {del.chiefDelegate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => castVote(del.id, 'favor')}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          currentVote === 'favor'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-800 text-emerald-400 hover:bg-emerald-950/40 border border-slate-700'
                        }`}
                        title="Votar a Favor"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Favor</span>
                      </button>

                      <button
                        onClick={() => castVote(del.id, 'contra')}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          currentVote === 'contra'
                            ? 'bg-rose-600 text-white shadow'
                            : 'bg-slate-800 text-rose-400 hover:bg-rose-950/40 border border-slate-700'
                        }`}
                        title="Votar Contra"
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Contra</span>
                      </button>

                      <button
                        onClick={() => castVote(del.id, 'abstencao')}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          currentVote === 'abstencao'
                            ? 'bg-slate-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                        }`}
                        title="Abstenção"
                      >
                        <MinusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Abst.</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Painel para Iniciar Nova Votação */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-400" />
              Abrir Nova Sessão de Votação
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Selecione o projeto de resolução em pauta e o critério de maioria exigido pelo regimento para iniciar a votação nominal dos delegados.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Selecione a Resolução a ser Deliberada:
                </label>
                <select
                  value={selectedResolutionId}
                  onChange={(e) => setSelectedResolutionId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  {resolutions.map(res => (
                    <option key={res.id} value={res.id}>
                      [{res.code}] {res.title} ({res.status.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Critério de Quórum Regimental:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMajorityType('simples')}
                    className={`p-3 rounded-xl border text-left transition ${
                      majorityType === 'simples'
                        ? 'bg-blue-900/40 border-blue-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold text-sm block">Maioria Simples (50% + 1)</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Aplicável para emendas, moções procedimentais e resoluções ordinárias.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMajorityType('dois_tercos')}
                    className={`p-3 rounded-xl border text-left transition ${
                      majorityType === 'dois_tercos'
                        ? 'bg-blue-900/40 border-blue-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold text-sm block">Dois Terços (2/3)</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Para reformas estatutárias ou resoluções de impacto escolar estrutural.
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="block font-semibold text-white">Quórum Apto para Votar:</span>
                  <span className="text-slate-400">{presentDelegations.length} delegações presentes no plenário.</span>
                </div>
                {presentDelegations.length === 0 && (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Nenhuma delegação credenciada
                  </span>
                )}
              </div>

              <button
                onClick={handleStart}
                disabled={!selectedResolutionId || presentDelegations.length === 0}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold shadow-lg transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Iniciar Votação Nominal em Plenária
              </button>
            </div>
          </div>

          {/* Card Lateral: Informações da Mesa */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-xl space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-400" />
                Regras de Escrutínio
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>O voto é nominal e cada delegação/turma tem direito a um voto.</li>
                <li>As abstenções não diminuem o quórum de aprovação na maioria simples.</li>
                <li>Em caso de empate, cabe à Mesa Diretora convocar rodada de debate conciliatório.</li>
                <li>A proclamação do resultado atualiza automaticamente o status no Livro de Resoluções.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Histórico de Votações Anteriores */}
      {pastVotedResolutions.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Atas de Votações Promulgadas ({pastVotedResolutions.length})
          </h3>

          <div className="space-y-3">
            {pastVotedResolutions.map(res => (
              <div 
                key={res.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {res.code}
                    </span>
                    <h4 className="font-bold text-white text-sm">{res.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Proposta por: {res.mainSponsorName} • Sessão de: {res.votingResult?.date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="text-emerald-400 font-bold">{res.votingResult?.favorable} Favor</span>
                    <span className="text-slate-500 mx-1">|</span>
                    <span className="text-rose-400 font-bold">{res.votingResult?.opposed} Contra</span>
                    <span className="text-slate-500 mx-1">|</span>
                    <span className="text-slate-400 font-bold">{res.votingResult?.abstained} Abst.</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    res.votingResult?.passed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
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
