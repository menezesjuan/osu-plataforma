import React from 'react';
import { LogOut, RotateCcw } from 'lucide-react';
import { useOsu } from '../../context/OsuContext';

export const RightPanel: React.FC = () => {
  const { delegations, resolutions, resetAllData } = useOsu();

  const presentCount = delegations.filter(d => d.isPresent).length;
  const approvedCount = resolutions.filter(r => r.status === 'aprovado').length;
  const totalCount = delegations.length;
  const quorumPercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <aside className="w-80 shrink-0 bg-white border-l border-slate-100 p-6 flex flex-col justify-between select-none">
      
      {/* Perfil do Usuário / Delegado */}
      <div className="flex flex-col items-center text-center">
        {/* Avatar Ilustrado em Caixa Coral Suave */}
        <div className="w-24 h-24 rounded-3xl bg-[#ffe6df] flex items-center justify-center p-2 shadow-sm border border-orange-100 relative overflow-hidden group">
          <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
            {/* Cabelo e Rosto Estilizados */}
            <circle cx="50" cy="40" r="18" fill="#ffcdb2" />
            <path d="M30 40 C30 20, 70 20, 70 40 C70 48, 65 52, 60 52 C55 52, 50 48, 45 52 C40 52, 30 48, 30 40 Z" fill="#292524" />
            <circle cx="44" cy="42" r="2" fill="#292524" />
            <circle cx="56" cy="42" r="2" fill="#292524" />
            <path d="M47 48 Q50 51 53 48" stroke="#e76f51" strokeWidth="1.5" strokeLinecap="round" />
            {/* Roupa Laranja */}
            <path d="M25 80 C25 60, 75 60, 75 80 Z" fill="#ff5722" />
          </svg>
        </div>

        <h3 className="mt-4 text-base font-extrabold text-slate-800">Juan Menezes</h3>
        <span className="text-xs font-bold text-orange-500 mt-0.5">Presidente da Mesa</span>
      </div>

      {/* 3 Cards de Indicadores com Ilustrações Micro-Artísticas */}
      <div className="space-y-3.5 my-6">
        
        {/* Card 1: Presença / Quórum de Salas */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salas Presentes</span>
            <div className="text-xl font-black text-orange-500 mt-0.5">
              {presentCount}<span className="text-xs text-slate-400 font-semibold">/{totalCount}</span>
            </div>
          </div>
          {/* Ilustração estudante comemorando */}
          <div className="w-12 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="currentColor">
              <circle cx="20" cy="14" r="5" fill="#f97316" />
              <path d="M10 32 C10 24 30 24 30 32 Z" fill="#fb923c" />
              <circle cx="12" cy="18" r="2" fill="#ea580c" />
              <circle cx="28" cy="18" r="2" fill="#ea580c" />
            </svg>
          </div>
        </div>

        {/* Card 2: Quórum da Plenária */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quórum Apto</span>
            <div className="text-xl font-black text-blue-600 mt-0.5">{quorumPercentage}%</div>
          </div>
          {/* Ilustração troféu / vitória */}
          <div className="w-12 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="currentColor">
              <path d="M15 12 H25 V20 C25 24 22 26 20 26 C18 26 15 24 15 20 Z" fill="#2563eb" />
              <path d="M12 14 H15 V18 H12 Z" fill="#60a5fa" />
              <path d="M25 14 H28 V18 H25 Z" fill="#60a5fa" />
              <rect x="18" y="26" width="4" height="6" fill="#1d4ed8" />
              <rect x="14" y="32" width="12" height="3" rx="1.5" fill="#1e40af" />
            </svg>
          </div>
        </div>

        {/* Card 3: Resoluções Aprovadas */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resoluções Aprovadas</span>
            <div className="text-xl font-black text-rose-500 mt-0.5">{approvedCount}</div>
          </div>
          {/* Ilustração celebração / estrela */}
          <div className="w-12 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="currentColor">
              <circle cx="20" cy="15" r="4" fill="#f43f5e" />
              <path d="M12 34 C12 26 28 26 28 34 Z" fill="#fb7185" />
              <path d="M8 20 L14 26 L12 18 Z" fill="#fda4af" />
              <path d="M32 20 L26 26 L28 18 Z" fill="#fda4af" />
            </svg>
          </div>
        </div>

      </div>

      {/* Medidor Radial Semi-Circular (Time / Progress Gauge) */}
      <div className="p-4 rounded-3xl bg-slate-50/70 border border-slate-100 flex flex-col items-center justify-center relative">
        <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
          {/* Arco de fundo e indicador SVG */}
          <svg className="w-44 h-44 -rotate-90 origin-center absolute top-0" viewBox="0 0 100 100">
            {/* Trilha cinza pontilhada / suave */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="6"
              strokeDasharray="125 125"
              strokeDashoffset="0"
            />
            {/* Arco laranja ativo */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#ff5722"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="125 125"
              strokeDashoffset="35" // ~70% de preenchimento
            />
          </svg>

          {/* Marcadores 0, 25, 50, 75, 100 */}
          <div className="absolute inset-0 flex items-center justify-between px-2 pt-14 text-[9px] text-slate-400 font-bold">
            <span>0</span>
            <span>100</span>
          </div>

          <div className="text-center pb-1 z-10">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
              Jornada OSU
            </span>
            <span className="text-base font-extrabold text-slate-800">4h restantes</span>
          </div>
        </div>
      </div>

      {/* Rodapé: Restaurar & Sair */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
        <button
          onClick={() => {
            if (window.confirm('Restaurar dados originais da simulação?')) {
              resetAllData();
            }
          }}
          className="flex items-center gap-1.5 hover:text-slate-700 transition"
          title="Restaurar dados padrão"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar</span>
        </button>

        <button 
          onClick={() => alert('Sessão ativa mantida.')}
          className="flex items-center gap-1.5 hover:text-rose-600 transition"
        >
          <span>Sair</span>
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

    </aside>
  );
};
