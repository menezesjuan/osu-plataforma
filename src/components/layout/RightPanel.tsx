import React from 'react';
import { LogOut, RotateCcw } from 'lucide-react';
import { useOsu } from '../../context/OsuContext';

export const RightPanel: React.FC = () => {
  const { delegations, resolutions, resetAllData } = useOsu();

  const presentCount = delegations.filter(d => d.isPresent).length;
  const approvedCount = resolutions.filter(r => r.status === 'aprovado').length;
  const totalCount = delegations.length;
  const quorumPercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const userName = "Juan Menezes";
  const userInitial = userName.trim().charAt(0).toUpperCase();

  return (
    <aside className="w-80 h-full shrink-0 bg-white border-l border-slate-100 p-6 flex flex-col justify-between select-none overflow-y-auto">
      
      {/* Perfil do Usuário com Quadrado e Inicial */}
      <div className="flex flex-col items-center text-center">
        {/* Quadrado com a primeira letra do nome */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 font-black text-3xl border border-orange-400/40">
          {userInitial}
        </div>

        <h3 className="mt-3.5 text-base font-extrabold text-slate-800">{userName}</h3>
        <span className="text-xs font-bold text-orange-500 mt-0.5">Presidente da Mesa</span>
      </div>

      {/* 3 Cards de Indicadores com Métricas */}
      <div className="space-y-3.5 my-6">
        
        {/* Card 1: Presença / Quórum de Salas */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salas Presentes</span>
            <div className="text-xl font-black text-orange-500 mt-0.5">
              {presentCount}<span className="text-xs text-slate-400 font-semibold">/{totalCount}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-xs">
            {presentCount}
          </div>
        </div>

        {/* Card 2: Quórum da Plenária */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quórum Apto</span>
            <div className="text-xl font-black text-blue-600 mt-0.5">{quorumPercentage}%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
            %
          </div>
        </div>

        {/* Card 3: Resoluções Aprovadas */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resoluções Aprovadas</span>
            <div className="text-xl font-black text-rose-500 mt-0.5">{approvedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-black text-xs">
            RES
          </div>
        </div>

      </div>

      {/* Medidor Radial Semi-Circular (Time / Progress Gauge) */}
      <div className="p-4 rounded-3xl bg-slate-50/70 border border-slate-100 flex flex-col items-center justify-center relative">
        <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
          <svg className="w-44 h-44 -rotate-90 origin-center absolute top-0" viewBox="0 0 100 100">
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
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#ff5722"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="125 125"
              strokeDashoffset="35"
            />
          </svg>

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
