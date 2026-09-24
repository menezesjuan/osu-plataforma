import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';
import { ActiveTab } from '../layout/Navbar';

interface StudentDashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    delegations, 
    resolutions, 
    liveVote, 
    scheduleItems, 
    committees, 
    castVote, 
    addResolution, 
    sendChatMessage 
  } = useOsu();

  // Encontra a delegação do aluno atual
  const myDelegation = delegations.find(d => d.id === currentUser.delegationId) || delegations[0];

  // Modal para criar nova minuta de resolução
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resCommitteeId, setResCommitteeId] = useState(myDelegation?.committeeId || committees[0]?.id || 'csma');
  const [coSponsorsInput, setCoSponsorsInput] = useState('');
  const [preambleInput, setPreambleInput] = useState(
    'Considerando a necessidade urgente de melhorias conjuntas no ambiente escolar;\nReconhecendo o papel fundamental dos estudantes na tomada de decisão;'
  );
  const [operativeInput, setOperativeInput] = useState(
    '1. Recomenda a instituição de grupos de trabalho interdisciplinares;\n2. Determina a realização de consultas periódicas a todas as turmas.'
  );

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Minutas criadas pela delegação do aluno
  const myResolutions = resolutions.filter(
    r => r.mainSponsorId === myDelegation?.id || r.mainSponsorName.includes(myDelegation?.name || '')
  );

  // Resolução em votação ativa pela Mesa
  const activeResolution = liveVote ? resolutions.find(r => r.id === liveVote.resolutionId) : null;
  const myVote = myDelegation && liveVote ? liveVote.votes[myDelegation.id] : undefined;

  const handleCastVote = (voteType: 'favor' | 'contra' | 'abstencao') => {
    if (!myDelegation) return;
    castVote(myDelegation.id, voteType);
    showToast(`Voto "${voteType.toUpperCase()}" da sua bancada registrado com sucesso!`);
  };

  const handleOpenCreateModal = () => {
    setResTitle('');
    setResCommitteeId(myDelegation?.committeeId || committees[0]?.id || 'csma');
    setCoSponsorsInput('');
    setCreateModalOpen(true);
  };

  const handleSaveResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !myDelegation) return;

    const selectedCommittee = committees.find(c => c.id === resCommitteeId);
    const committeeCode = selectedCommittee?.code || 'OSU';
    const seq = resolutions.length + 1;
    const generatedCode = `RES-${committeeCode}/0${seq}`;

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
      code: generatedCode,
      title: resTitle.trim(),
      committeeId: resCommitteeId,
      mainSponsorId: myDelegation.id,
      mainSponsorName: `${myDelegation.name} (${myDelegation.representation})`,
      coSponsors,
      preamble,
      operativeClauses,
      status: 'redacao',
    });

    setCreateModalOpen(false);
    showToast(`Minuta ${generatedCode} criada e protocolada em redação!`);
  };

  // Ações regimentais com envio direto para a Mesa
  const handleProceduralMotion = (motionType: 'ordem' | 'esclarecimento' | 'privilegio') => {
    if (!myDelegation) return;

    let content = '';
    let label = '';

    if (motionType === 'ordem') {
      label = 'Ponto de Ordem';
      content = `[PONTO DE ORDEM] A Bancada de ${myDelegation.representation} (${myDelegation.name}) solicita atenção da Mesa para cumprimento regimental.`;
    } else if (motionType === 'esclarecimento') {
      label = 'Ponto de Esclarecimento';
      content = `[ESCLARECIMENTO] A Bancada de ${myDelegation.representation} tem dúvida procedimental sobre a pauta em discussão.`;
    } else {
      label = 'Questão de Privilégio';
      content = `[QUESTÃO DE PRIVILÉGIO] A Bancada de ${myDelegation.representation} relata dificuldade de áudio/comunicação no plenário.`;
    }

    sendChatMessage(content, myDelegation.chiefDelegate, `${myDelegation.name} (${myDelegation.representation})`, false);
    showToast(`${label} enviado imediatamente para a Mesa Diretora no canal interno!`);
  };

  // Item de cronograma em andamento
  const currentSchedule = scheduleItems.find(s => s.status === 'em_andamento') || scheduleItems[0];

  return (
    <div className="p-8 space-y-6 bg-white min-h-full">
      {/* Toast de Notificação Rápida */}
      {feedbackMsg && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Identificação da Bancada & Boas-Vindas */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-white border border-orange-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-orange-200 shadow-sm flex items-center justify-center text-3xl shrink-0">
            {myDelegation?.flagEmoji || '🏛️'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-xs">
                Painel do Delegado
              </span>
              <span className="text-xs text-slate-500 font-bold">
                {myDelegation?.level} • {myDelegation?.name}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              {myDelegation?.representation || 'Bancada Estudantil'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Porta-voz oficial: <strong className="text-slate-700">{myDelegation?.chiefDelegate}</strong>
            </p>
          </div>
        </div>

        {/* Status de Credenciamento e Quórum */}
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xs self-start md:self-auto">
          <div className={`w-3 h-3 rounded-full ${myDelegation?.isPresent ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Status de Quórum:</span>
            <span className={`text-xs font-black ${myDelegation?.isPresent ? 'text-emerald-600' : 'text-rose-500'}`}>
              {myDelegation?.isPresent ? 'Credenciado • Apto a Votar' : 'Aguardando Credenciamento'}
            </span>
          </div>
        </div>
      </div>

      {/* DESTAQUE 1: Votação em Plenário Aberta pela Mesa */}
      {liveVote && activeResolution ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Votação Aberta pela Mesa Diretora
              </span>
            </div>
            <span className="text-xs text-orange-100 font-semibold">
              Quórum: {liveVote.majorityType === 'simples' ? 'Maioria Simples' : 'Dois Terços (2/3)'}
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-black">
              {activeResolution.code}: {activeResolution.title}
            </h3>
            <p className="text-xs text-orange-100 mt-1">
              Proponente: <strong>{activeResolution.mainSponsorName}</strong>
            </p>
          </div>

          {/* Área de Registro do Voto da Bancada */}
          <div className="pt-2 bg-white/10 p-4 rounded-2xl border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-100 block">
                Posicionamento da sua Bancada:
              </span>
              <span className="text-sm font-black text-white">
                {myVote ? (
                  <span className="inline-flex items-center gap-1.5 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    Voto Registrado: <span className="underline uppercase tracking-wide">{myVote}</span>
                  </span>
                ) : (
                  <span className="text-amber-200 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-4 h-4" /> Voto Pendente — Escolha uma das opções abaixo:
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleCastVote('favor')}
                className={`px-4 py-2.5 rounded-xl font-black text-xs transition shadow-sm ${
                  myVote === 'favor'
                    ? 'bg-emerald-600 text-white ring-2 ring-white'
                    : 'bg-white text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                A Favor
              </button>

              <button
                onClick={() => handleCastVote('contra')}
                className={`px-4 py-2.5 rounded-xl font-black text-xs transition shadow-sm ${
                  myVote === 'contra'
                    ? 'bg-rose-600 text-white ring-2 ring-white'
                    : 'bg-white text-rose-700 hover:bg-rose-50'
                }`}
              >
                Contra
              </button>

              <button
                onClick={() => handleCastVote('abstencao')}
                className={`px-4 py-2.5 rounded-xl font-black text-xs transition shadow-sm ${
                  myVote === 'abstencao'
                    ? 'bg-slate-700 text-white ring-2 ring-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Abstenção
              </button>

              <button
                onClick={() => onNavigate('voting')}
                className="px-3.5 py-2.5 rounded-xl bg-orange-700/60 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 transition ml-auto"
                title="Acompanhar plenário ao vivo"
              >
                Plenário <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-700">Plenário em Intervalo de Escrutínio</h4>
              <p className="text-[11px] text-slate-400 font-medium">
                Aguardando a Mesa Diretora abrir a votação de uma resolução. Quando iniciada, o painel de voto aparecerá aqui.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('voting')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition shrink-0"
          >
            Histórico de Votos
          </button>
        </div>
      )}

      {/* Grid Principal: Minutas de Resolução & Protocolos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna 1 & 2: Minutas e Projetos de Resolução da Bancada */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                Minutas & Projetos de Resolução
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Redija cláusulas preambulares (considerandos) e operativas para apreciação da Mesa e do Plenário.
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              Nova Minuta
            </button>
          </div>

          {/* Lista de Minutas da Bancada ou em Destaque */}
          {myResolutions.length > 0 ? (
            <div className="space-y-3">
              {myResolutions.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-3xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 transition space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-lg">
                          {res.code}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          res.status === 'aprovado'
                            ? 'bg-emerald-100 text-emerald-700'
                            : res.status === 'em_debate'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {res.status === 'redacao' ? 'Em Redação' : res.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800 mt-1">
                        {res.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onNavigate('resolutions')}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 transition text-xs font-bold shrink-0"
                      title="Ver minuta completa"
                    >
                      Ver Detalhes
                    </button>
                  </div>

                  {/* Resumo das Cláusulas */}
                  <div className="text-[11px] text-slate-600 space-y-1 bg-white p-3 rounded-2xl border border-slate-100">
                    <p className="line-clamp-1 italic text-slate-500">
                      <strong>Preâmbulo:</strong> {res.preamble[0] || 'Nenhuma cláusula preambular'}
                    </p>
                    <p className="line-clamp-1 font-medium text-slate-700">
                      <strong>Operativa:</strong> {res.operativeClauses[0] || 'Nenhuma cláusula operativa'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-50/60 border border-dashed border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-700">Sua bancada ainda não protocolou minutas</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Reúna-se com os integrantes da sua turma para elaborar cláusulas preambulares e propor resoluções para o comitê.
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-sm"
              >
                Escrever Primeira Minuta
              </button>
            </div>
          )}
        </div>

        {/* Coluna 3: Ações Rápidas de Protocolo & Cronograma da Sessão */}
        <div className="space-y-6">
          
          {/* Caixa de Protocolos Parlamentares */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3.5">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-orange-500" />
                Manifestação Regimental
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Envie sinalizações diretas à Mesa durante os debates plenários:
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleProceduralMotion('ordem')}
                className="w-full text-left p-3 rounded-2xl bg-white hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-300 transition group flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600 block">
                    🙋‍♂️ Ponto de Ordem
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Infração de regras procedimentais
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500" />
              </button>

              <button
                onClick={() => handleProceduralMotion('esclarecimento')}
                className="w-full text-left p-3 rounded-2xl bg-white hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-300 transition group flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600 block">
                    ❓ Ponto de Esclarecimento
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Dúvida regimental ou de pauta
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500" />
              </button>

              <button
                onClick={() => handleProceduralMotion('privilegio')}
                className="w-full text-left p-3 rounded-2xl bg-white hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-300 transition group flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600 block">
                    🛡️ Questão de Privilégio
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Áudio, visibilidade ou conforto
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500" />
              </button>
            </div>
          </div>

          {/* Bloco do Cronograma Atual (Somente Leitura) */}
          <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                Sessão em Andamento
              </span>
              <span className="text-[10px] font-extrabold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full">
                Horário Oficial
              </span>
            </div>

            {currentSchedule ? (
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs font-mono font-bold text-orange-600">
                  {currentSchedule.time} - {currentSchedule.endTime}
                </span>
                <h4 className="text-xs font-black text-slate-800">
                  {currentSchedule.title}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {currentSchedule.subject} • Local: <strong>{currentSchedule.room}</strong>
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Nenhum evento registrado no cronograma.</p>
            )}
          </div>

        </div>

      </div>

      {/* Modal de Registro de Nova Minuta de Resolução */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Protocolar Minuta de Resolução
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proposta oficial elaborada pela Bancada de <strong>{myDelegation?.representation}</strong>
                </p>
              </div>
              <button 
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResolution} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Título da Minuta</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Diretrizes para redução do uso de plástico"
                    value={resTitle}
                    onChange={(e) => setResTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Comitê Temático</label>
                  <select
                    value={resCommitteeId}
                    onChange={(e) => setResCommitteeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    {committees.map((com) => (
                      <option key={com.id} value={com.id}>
                        {com.code} - {com.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Bancadas Co-patrocinadoras (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Delegação do Canadá, Delegação do Japão"
                  value={coSponsorsInput}
                  onChange={(e) => setCoSponsorsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Cláusulas Preambulares (Considerandos) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-800">
                    Cláusulas Preambulares (Considerandos)
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Uma cláusula por linha, iniciadas por "Considerando", "Reconhecendo"...
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={preambleInput}
                  onChange={(e) => setPreambleInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                />
              </div>

              {/* Cláusulas Operativas (Resoluções) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-800">
                    Cláusulas Operativas (Resoluções e Ações)
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Numeradas (1., 2., 3.), iniciadas por verbos como "Determina", "Recomenda"...
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={operativeInput}
                  onChange={(e) => setOperativeInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 font-mono text-[11px]"
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
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20"
                >
                  Protocolar Minuta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
