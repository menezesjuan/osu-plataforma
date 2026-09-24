import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Atom, 
  FlaskConical, 
  Trophy, 
  Calculator, 
  Vote,
  Plus,
  SlidersHorizontal,
  Trash2,
  Play,
  ArrowRight
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';
import { ActiveTab } from '../layout/Navbar';
import { ScheduleItem } from '../../types';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    liveVote, 
    resolutions, 
    scheduleItems, 
    addScheduleItem, 
    updateScheduleItem, 
    deleteScheduleItem, 
    startLiveVoting
  } = useOsu();

  // Estados para modal de gerenciamento do cronograma
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Form states
  const [formTime, setFormTime] = useState('08:00');
  const [formEndTime, setFormEndTime] = useState('08:45');
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formRoom, setFormRoom] = useState('');
  const [formStatus, setFormStatus] = useState<'concluido' | 'em_andamento' | 'proximo'>('proximo');
  const [formCategory, setFormCategory] = useState<'plenaria' | 'comite' | 'redacao' | 'intervalo' | 'mesa'>('comite');

  const openNewScheduleModal = () => {
    setEditingItem(null);
    setFormTime('10:00');
    setFormEndTime('10:45');
    setFormTitle('');
    setFormSubject('');
    setFormRoom('Sala 101');
    setFormStatus('proximo');
    setFormCategory('comite');
    setShowScheduleModal(true);
  };

  const openEditScheduleModal = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormTime(item.time);
    setFormEndTime(item.endTime);
    setFormTitle(item.title);
    setFormSubject(item.subject);
    setFormRoom(item.room);
    setFormStatus(item.status);
    setFormCategory(item.category);
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formTime.trim()) return;

    if (editingItem) {
      updateScheduleItem({
        ...editingItem,
        time: formTime,
        endTime: formEndTime,
        title: formTitle,
        subject: formSubject,
        room: formRoom,
        status: formStatus,
        category: formCategory,
      });
    } else {
      addScheduleItem({
        time: formTime,
        endTime: formEndTime,
        title: formTitle,
        subject: formSubject,
        room: formRoom,
        status: formStatus,
        category: formCategory,
      });
    }

    setShowScheduleModal(false);
  };

  // Cores dinâmicas para as categorias do cronograma
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'comite':
        return {
          bg: 'bg-[#ffe4e6] text-[#be123c] border-[#fecdd3]',
          badgeColor: 'text-[#e11d48]',
          icon: Atom,
        };
      case 'redacao':
        return {
          bg: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]',
          badgeColor: 'text-[#16a34a]',
          icon: FlaskConical,
        };
      case 'intervalo':
        return {
          bg: 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a]',
          badgeColor: 'text-[#ca8a04]',
          icon: Trophy,
        };
      case 'mesa':
        return {
          bg: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]',
          badgeColor: 'text-[#0284c7]',
          icon: Calculator,
        };
      default:
        return {
          bg: 'bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe]',
          badgeColor: 'text-[#7c3aed]',
          icon: Globe,
        };
    }
  };

  // Calendário de Atividades & Prazos (Setembro 2026)
  const calendarDays = [
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: false },
    { day: 1, currentMonth: true },
    { day: 2, currentMonth: true },
    { day: 3, currentMonth: true },
    { day: 4, currentMonth: true },
    { day: 5, currentMonth: true },
    { day: 6, currentMonth: true },
    { day: 7, currentMonth: true },
    { day: 8, currentMonth: true },
    { day: 9, currentMonth: true },
    { day: 10, currentMonth: true },
    { day: 11, currentMonth: true },
    { day: 12, currentMonth: true },
    { day: 13, currentMonth: true },
    { day: 14, currentMonth: true },
    { day: 15, currentMonth: true },
    { day: 16, currentMonth: true },
    { day: 17, currentMonth: true },
    { day: 18, currentMonth: true, hasOrangeDot: true },
    { day: 19, currentMonth: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true },
    { day: 24, currentMonth: true, isSelected: true },
    { day: 25, currentMonth: true },
    { day: 26, currentMonth: true },
    { day: 27, currentMonth: true },
    { day: 28, currentMonth: true },
    { day: 29, currentMonth: true },
    { day: 30, currentMonth: true, hasGreenDot: true },
    { day: 1, currentMonth: false },
    { day: 2, currentMonth: false },
  ];

  return (
    <div className="p-8 space-y-8 bg-white min-h-full">
      
      {/* Banner de Votação em Aberto */}
      {liveVote && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-50 via-rose-50 to-white border border-orange-200/80 flex items-center justify-between shadow-xs animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800">Sessão de Votação em Aberto no Plenário!</h4>
              <p className="text-xs text-slate-500">A Mesa Diretora está colhendo os votos nominais das bancadas.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('voting')}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition"
          >
            Acessar Plenário &rarr;
          </button>
        </div>
      )}

      {/* Grid Principal: 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Coluna 1: Cronograma da Sessão (Gerenciável) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-800">Cronograma da Sessão</h2>
              <p className="text-xs text-slate-400 font-medium">Quinta-feira, 24 de Setembro de 2026</p>
            </div>

            {/* Ações do Cronograma: Data & Botão de Gerenciamento */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-600">
                <span>24-09-2026</span>
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Botão de Gerenciamento do Cronograma */}
              <button
                onClick={openNewScheduleModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition"
                title="Adicionar ou editar horários da sessão"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Horário</span>
              </button>
            </div>
          </div>

          {/* Lista com Horários e Cards Coloridos Suaves */}
          <div className="space-y-3.5">
            {scheduleItems.map((item) => {
              const { bg, badgeColor, icon: Icon } = getCategoryStyles(item.category);

              return (
                <div key={item.id} className="flex items-center gap-4 group">
                  <span className="w-12 text-xs font-semibold text-slate-400 shrink-0 text-right">
                    {item.time}
                  </span>

                  <div 
                    className={`flex-1 p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between hover:shadow-md hover:scale-[1.01] ${bg}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/80 shadow-2xs flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 ${badgeColor}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-extrabold leading-tight truncate">{item.title}</h4>
                          {item.status === 'em_andamento' && (
                            <span className="px-1.5 py-0.2 rounded-full bg-white/90 text-rose-600 text-[9px] font-black uppercase tracking-wider animate-pulse">
                              Agora
                            </span>
                          )}
                          {item.status === 'concluido' && (
                            <span className="text-[10px] font-bold opacity-60">✓</span>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold opacity-80 mt-0.5 block truncate">{item.subject}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pl-2">
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black tracking-tight block">{item.room}</span>
                        <span className="text-[10px] font-medium opacity-70 block">{item.time} - {item.endTime}</span>
                      </div>

                      {/* Botão de Edição Rápida */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditScheduleModal(item);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 shadow-2xs transition"
                        title="Editar horário"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna 2: Cards de Tópicos em Deliberação & Calendário */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Seção Solicitada: Cards de Tópicos em Deliberação (Pautas Ativas & Próximas) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Tópicos em Deliberação</h3>
                <span className="text-[11px] font-semibold text-slate-400">Pautas Ativas e Próximas Resoluções</span>
              </div>
              <button 
                onClick={() => onNavigate('resolutions')}
                className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
              >
                Ver Todas
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lista de Cards de Tópicos / Pautas */}
            <div className="space-y-3">
              {resolutions.map((res, index) => {
                const isUnderVoteNow = liveVote?.resolutionId === res.id;
                const isDebating = res.status === 'em_debate';
                const isApproved = res.status === 'aprovado';

                return (
                  <div
                    key={res.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                      isUnderVoteNow
                        ? 'bg-gradient-to-r from-orange-50/90 to-rose-50/80 border-orange-300 shadow-xs'
                        : isDebating
                        ? 'bg-orange-50/40 border-orange-200/80'
                        : isApproved
                        ? 'bg-emerald-50/40 border-emerald-100'
                        : 'bg-slate-50/70 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {res.code}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Pauta #{index + 1}</span>
                      </div>

                      {/* Badge de Status da Deliberação */}
                      {isUnderVoteNow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          Em Votação Agora
                        </span>
                      ) : isDebating ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 text-[9px] font-black uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                          Em Debate
                        </span>
                      ) : isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider">
                          ✓ Aprovada
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-600 text-[9px] font-bold uppercase tracking-wider">
                          Próxima Pauta
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                        {res.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Proposta por: <strong className="text-slate-700">{res.mainSponsorName}</strong>
                      </p>
                    </div>

                    {/* Ação do Card */}
                    <div className="pt-1.5 flex items-center justify-between border-t border-slate-200/40">
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {res.status === 'aprovado' ? 'Promulgada pela assembleia' : 'Submetida à apreciação da Mesa'}
                      </span>

                      {res.status !== 'aprovado' && res.status !== 'rejeitado' && (
                        <button
                          onClick={() => {
                            startLiveVoting(res.id, 'simples');
                            onNavigate('voting');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold shadow-2xs transition"
                        >
                          <Play className="w-3 h-3" />
                          Abrir Plenário
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendário de Atividades & Prazos */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Atividades & Prazos</h3>
                <span className="text-[11px] font-semibold text-slate-400">Setembro 2026</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-1 hover:text-slate-700">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:text-slate-700">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabela do Calendário */}
            <div>
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              <div className="grid grid-cols-7 text-center gap-y-2 text-xs font-bold text-slate-700">
                {calendarDays.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center h-8 relative">
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full transition ${
                        item.isSelected
                          ? 'bg-slate-900 text-white shadow-xs font-black'
                          : !item.currentMonth
                          ? 'text-slate-300 font-normal'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.day}
                    </span>

                    {item.hasOrangeDot && (
                      <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    )}
                    {item.hasGreenDot && (
                      <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Legenda de Cores */}
            <div className="flex items-center justify-center gap-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                Assembleia Hoje
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Prazos Minutas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Promulgação
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Modal de Gerenciamento do Cronograma */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-orange-500" />
                {editingItem ? 'Editar Horário da Sessão' : 'Adicionar Novo Horário ao Cronograma'}
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horário Início</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 10:00"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horário Término</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 10:45"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Atividade</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Debate do Comitê de Educação"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtítulo / Descrição da Pauta</label>
                <input
                  type="text"
                  placeholder="Ex: Inovação Pedagógica e Grupos de Estudo"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sala / Local</label>
                  <input
                    type="text"
                    placeholder="Ex: Auditório ou Sala 102"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria Visual</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-orange-500 font-semibold"
                  >
                    <option value="plenaria">Plenária Geral (Roxo)</option>
                    <option value="comite">Comitê Temático (Rosa)</option>
                    <option value="redacao">Redação & Minutas (Verde)</option>
                    <option value="intervalo">Intervalo & Articulação (Amarelo)</option>
                    <option value="mesa">Mesa & Análise (Azul)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status da Atividade</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormStatus('proximo')}
                    className={`py-2 rounded-xl border text-xs font-bold transition ${
                      formStatus === 'proximo' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Próximo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus('em_andamento')}
                    className={`py-2 rounded-xl border text-xs font-bold transition ${
                      formStatus === 'em_andamento' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Em Andamento
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus('concluido')}
                    className={`py-2 rounded-xl border text-xs font-bold transition ${
                      formStatus === 'concluido' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Concluído
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {editingItem ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Excluir este horário do cronograma?')) {
                        deleteScheduleItem(editingItem.id);
                        setShowScheduleModal(false);
                      }
                    }}
                    className="px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20"
                  >
                    Salvar Horário
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
