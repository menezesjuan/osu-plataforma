import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Users, 
  Leaf, 
  HeartHandshake, 
  GraduationCap, 
  Trophy, 
  Laptop,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';
import { ActiveTab } from '../layout/Navbar';

interface CommitteesViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const CommitteesView: React.FC<CommitteesViewProps> = ({ onNavigate }) => {
  const { committees, delegations, resolutions } = useOsu();
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>(committees[0]?.id || 'csma');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-rose-400" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-blue-400" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-cyan-400" />;
      default: return <Building2 className="w-5 h-5 text-indigo-400" />;
    }
  };

  const selectedCommittee = committees.find(c => c.id === selectedCommitteeId) || committees[0];
  const committeeDelegations = delegations.filter(d => d.committeeId === selectedCommitteeId);
  const committeeResolutions = resolutions.filter(r => r.committeeId === selectedCommitteeId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-400" />
          Comitês Temáticos da OSU
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Espaços de discussão setorial onde as delegações debatem propostas específicas e redigem os projetos de resolução.
        </p>
      </div>

      {/* Lista de Seleção Rápida de Comitês */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {committees.map((com) => {
          const isSelected = com.id === selectedCommitteeId;
          const assignedDels = delegations.filter(d => d.committeeId === com.id).length;
          const assignedRes = resolutions.filter(r => r.committeeId === com.id).length;

          return (
            <button
              key={com.id}
              onClick={() => setSelectedCommitteeId(com.id)}
              className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-900/40 border-blue-500 shadow-md shadow-blue-950/50'
                  : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    {getIcon(com.iconName)}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{com.code}</span>
                </div>
                <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1">{com.name}</h3>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                <span>{assignedDels} salas</span>
                <span>{assignedRes} resoluções</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalhes do Comitê Selecionado */}
      {selectedCommittee && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna 1: Informações Gerais & Mesa Diretora */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-5 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                    {getIcon(selectedCommittee.iconName)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{selectedCommittee.code}</span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">{selectedCommittee.name}</h2>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {selectedCommittee.roomLocation}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Tópico de Debate Oficial:</span>
                <p className="text-sm text-slate-200 font-medium">{selectedCommittee.theme}</p>
                <p className="text-xs text-slate-400 pt-1 leading-relaxed">{selectedCommittee.description}</p>
              </div>

              {/* Mesa Diretora do Comitê */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mesa Diretora do Comitê</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Presidente</span>
                    <p className="font-semibold text-white mt-0.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-blue-400" />
                      {selectedCommittee.chairperson}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Vice-Presidente</span>
                    <p className="font-semibold text-white mt-0.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-400" />
                      {selectedCommittee.viceChair}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Secretário(a)</span>
                    <p className="font-semibold text-white mt-0.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-400" />
                      {selectedCommittee.secretary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resoluções Vinculadas */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Projetos de Resolução em Andamento ({committeeResolutions.length})
                  </h3>
                  <button
                    onClick={() => onNavigate('resolutions')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                  >
                    Ver todas as resoluções
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {committeeResolutions.length > 0 ? (
                  <div className="space-y-2.5">
                    {committeeResolutions.map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {res.code}
                            </span>
                            <h4 className="font-bold text-white text-xs sm:text-sm">{res.title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Proposta por: <span className="text-slate-300">{res.mainSponsorName}</span>
                          </p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${
                          res.status === 'aprovado' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : res.status === 'em_debate'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {res.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                    Nenhum projeto de resolução submetido para este comitê até o momento.
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Coluna 2: Salas Designadas para o Comitê */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Salas Integrantes ({committeeDelegations.length})
                </h3>
                <span className="text-xs text-slate-400">Turmas na bancada</span>
              </div>

              {committeeDelegations.length > 0 ? (
                <div className="space-y-3">
                  {committeeDelegations.map((del) => (
                    <div 
                      key={del.id}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{del.flagEmoji}</span>
                          <div>
                            <h4 className="font-bold text-white">{del.name}</h4>
                            <p className="text-[10px] text-amber-400">{del.representation}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          del.isPresent ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                        }`}>
                          {del.isPresent ? 'Presente' : 'Ausente'}
                        </span>
                      </div>

                      <div className="pt-1 text-[11px] text-slate-400">
                        Porta-voz: <strong className="text-slate-200">{del.chiefDelegate}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  Nenhuma delegação atribuída a este comitê ainda.
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-300 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Procedimentos de Trabalho
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Cada comitê debate suas propostas durante a manhã e submete as minutas finais até às 14:00 para inclusão na pauta da Assembleia Geral Plenária.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
