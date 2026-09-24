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
  Vote
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';
import { ActiveTab } from '../layout/Navbar';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { liveVote, resolutions } = useOsu();

  const [activeDateIndex, setActiveDateIndex] = useState(0);

  // Horários do Cronograma Oficial da OSU adaptado ao estilo do mockup
  const timetableItems = [
    {
      time: '08:00',
      endTime: '08:45',
      title: 'Abertura & Credenciamento',
      subject: 'Plenária Geral',
      room: 'Auditório',
      bg: 'bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe]',
      badgeColor: 'text-[#7c3aed]',
      icon: Globe,
    },
    {
      time: '09:00',
      endTime: '09:50',
      title: 'Debate no Comitê de Sustentabilidade',
      subject: 'CSMA - Recursos & Horta',
      room: 'Sala 102',
      bg: 'bg-[#ffe4e6] text-[#be123c] border-[#fecdd3]',
      badgeColor: 'text-[#e11d48]',
      icon: Atom,
    },
    {
      time: '10:00',
      endTime: '10:45',
      title: 'Comitê de Direitos & Convivência',
      subject: 'CDEC - Combate ao Bullying',
      room: 'Sala 104',
      bg: 'bg-[#ffe4e6] text-[#be123c] border-[#fecdd3]',
      badgeColor: 'text-[#e11d48]',
      icon: Atom,
    },
    {
      time: '11:00',
      endTime: '11:45',
      title: 'Redação de Projetos de Resolução',
      subject: 'Elaboração das Cláusulas',
      room: 'Lab 10',
      bg: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]',
      badgeColor: 'text-[#16a34a]',
      icon: FlaskConical,
    },
    {
      time: '12:00',
      endTime: '12:45',
      title: 'Intervalo & Articulação de Bancadas',
      subject: 'Coleta de Co-assinaturas',
      room: 'Pátio',
      bg: 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a]',
      badgeColor: 'text-[#ca8a04]',
      icon: Trophy,
    },
    {
      time: '13:00',
      endTime: '13:45',
      title: 'Mesa de Análise & Quórum',
      subject: 'Verificação Regimental',
      room: 'Sala 204',
      bg: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]',
      badgeColor: 'text-[#0284c7]',
      icon: Calculator,
    },
    {
      time: '14:00',
      endTime: '15:30',
      title: 'Grande Plenária de Votação',
      subject: 'Escrutínio Nominal de Resoluções',
      room: 'Plenário',
      bg: 'bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe]',
      badgeColor: 'text-[#7c3aed]',
      icon: Globe,
    },
  ];

  // Dados do Carrossel de Votações / Indicadores
  const voteHighlights = [
    { number: 5, label: 'RES-CSMA/01', detail: 'Escola Circular', active: true },
    { number: '+3', label: 'Em Análise', detail: 'Comitê Direitos', active: false },
    { number: 4, label: 'RES-CDEC/02', detail: 'Acolhimento', active: false },
    { number: 6, label: 'RES-CEIP/03', detail: 'Lab Maker', active: false },
  ];

  // Matriz de Dias do Calendário Escolar da OSU (Setembro 2026)
  const calendarDays = [
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: false },
    { day: 1, currentMonth: true },
    { day: 2, currentMonth: true },
    { day: 3, currentMonth: true },
    { day: 4, currentMonth: true },
    { day: 5, currentMonth: true },
    { day: 6, currentMonth: true },
    { day: 7, currentMonth: true, isSelected: false },
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
    { day: 18, currentMonth: true, hasOrangeDot: true }, // Prazo de emendas
    { day: 19, currentMonth: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true },
    { day: 24, currentMonth: true, isSelected: true }, // Hoje (Dia da Assembleia)
    { day: 25, currentMonth: true },
    { day: 26, currentMonth: true },
    { day: 27, currentMonth: true },
    { day: 28, currentMonth: true },
    { day: 29, currentMonth: true },
    { day: 30, currentMonth: true, hasGreenDot: true }, // Promulgação
    { day: 1, currentMonth: false },
    { day: 2, currentMonth: false },
  ];

  return (
    <div className="p-8 space-y-8 bg-white min-h-full">
      
      {/* Banner de Votação em Aberto (se houver escrutínio ativo) */}
      {liveVote && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-50 via-rose-50 to-white border border-orange-200/80 flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800">Sessão de Votação em Aberto!</h4>
              <p className="text-xs text-slate-500">A Mesa está colhendo os votos nominais das bancadas escolares.</p>
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

      {/* Grid Principal: 2 Colunas (Timetable à esquerda, Votações + Calendário à direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Coluna 1: Timetable (Cronograma da Sessão Escolar) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-800">Cronograma da Sessão</h2>
              <p className="text-xs text-slate-400 font-medium">Quinta-feira, 24 de Setembro de 2026</p>
            </div>

            {/* Seletor de Data tipo Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-600">
              <span>24-09-2026</span>
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Lista com Marcadores de Hora e Cards Coloridos Suaves */}
          <div className="space-y-4">
            {timetableItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4 group">
                  {/* Horário à esquerda */}
                  <span className="w-12 text-xs font-semibold text-slate-400 shrink-0 text-right">
                    {item.time}
                  </span>

                  {/* Card Retangular com Cantos Arredondados estilo Astrum */}
                  <div 
                    onClick={() => {
                      if (item.title.includes('Votação')) onNavigate('voting');
                      else if (item.title.includes('Comitê')) onNavigate('committees');
                      else if (item.title.includes('Resolução')) onNavigate('resolutions');
                    }}
                    className={`flex-1 p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer hover:shadow-md hover:scale-[1.01] ${item.bg}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white/80 shadow-xs flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 ${item.badgeColor}`} />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold leading-tight">{item.title}</h4>
                        <span className="text-[11px] font-semibold opacity-75 mt-0.5 block">{item.subject}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs sm:text-sm font-black tracking-tight">{item.room}</span>
                      <span className="text-[10px] font-medium opacity-70 block">{item.time} - {item.endTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna 2: Destaques das Votações & Calendário */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Card 1: Destaques de Votação (Círculo Laranja com Slider) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Deliberações Recentes</h3>
                <span className="text-[11px] font-semibold text-slate-400">Plenária OSU • Sessão Oficial</span>
              </div>
              <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">
                {resolutions.length} em pauta
              </span>
            </div>

            {/* Slider de Círculos com Destaque Central Laranja */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button 
                onClick={() => setActiveDateIndex(prev => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {voteHighlights.map((vh, i) => {
                const isItemActive = i === activeDateIndex;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <button
                      onClick={() => setActiveDateIndex(i)}
                      className={`flex items-center justify-center font-black transition-all ${
                        isItemActive
                          ? 'w-16 h-16 rounded-full bg-[#ff5722] text-white text-2xl shadow-lg shadow-orange-500/30 scale-105'
                          : 'w-10 h-10 rounded-full bg-slate-100 text-slate-500 text-xs font-bold hover:bg-slate-200'
                      }`}
                    >
                      {vh.number}
                    </button>
                  </div>
                );
              })}

              <button 
                onClick={() => setActiveDateIndex(prev => Math.min(voteHighlights.length - 1, prev + 1))}
                className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Detalhes da Resolução selecionada no slider */}
            <div className="text-center pt-2">
              <span className="text-xs font-extrabold text-slate-800 block">Sustentabilidade Escolar</span>
              <span className="text-[11px] text-slate-400 font-medium">RES-CSMA/01 • Aprovada por 7 votos favoráveis</span>
            </div>
          </div>

          {/* Card 2: Calendário de Atividades & Prazos (Homeworks & Tests) */}
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
              {/* Dias da Semana */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              {/* Grid de Dias */}
              <div className="grid grid-cols-7 text-center gap-y-2 text-xs font-bold text-slate-700">
                {calendarDays.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center h-8 relative">
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full transition ${
                        item.isSelected
                          ? 'bg-slate-900 text-white shadow-sm font-black'
                          : !item.currentMonth
                          ? 'text-slate-300 font-normal'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.day}
                    </span>

                    {/* Pontinhos de Notificação Coloridos */}
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

    </div>
  );
};
