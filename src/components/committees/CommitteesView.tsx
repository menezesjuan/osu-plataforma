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
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-500" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-rose-500" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-cyan-500" />;
      default: return <Building2 className="w-5 h-5 text-indigo-500" />;
    }
  };

  const selectedCommittee = committees.find(c => c.id === selectedCommitteeId) || committees[0];
  const committeeDelegations = delegations.filter(d => d.committeeId === selectedCommitteeId);
  const committeeResolutions = resolutions.filter(r => r.committeeId === selectedCommitteeId);

  return (
    <div className="p-8 space-y-6 bg-white min-h-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          Comitês Temáticos da OSU
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Eixos de trabalho onde as bancadas debatem diagnósticos e redigem projetos de resolução.
        </p>
      </div>

      {/* Seletor Rápido de Comitês em Cards Suaves */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {committees.map((com) => {
          const isSelected = com.id === selectedCommitteeId;
          const assignedDels = delegations.filter(d => d.committeeId === com.id).length;
          const assignedRes = resolutions.filter(r => r.committeeId === com.id).length;

          return (
            <button
              key={com.id}
              onClick={() => setSelectedCommitteeId(com.id)}
              className={`p-4 rounded-3xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-orange-50/80 border-orange-300 shadow-[0_8px_20px_rgba(249,115,22,0.1)]'
                  : 'bg-white border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-2xl bg-white shadow-xs border border-slate-100">
                    {getIcon(com.iconName)}
                  </div>
                  <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-orange-600' : 'text-slate-400'}`}>
                    {com.code}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm line-clamp-1">{com.name}</h3>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>{assignedDels} salas</span>
                <span>{assignedRes} minutas</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalhes do Comitê Selecionado */}
      {selectedCommittee && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs">
                    {getIcon(selectedCommittee.iconName)}
                  </div>
                  <div>
                    <span className="text-xs font-black text-orange-500 uppercase tracking-widest">{selectedCommittee.code}</span>
                    <h3 className="text-xl font-black text-slate-800">{selectedCommittee.name}</h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {selectedCommittee.roomLocation}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Tópico de Debate Oficial:</span>
                <p className="text-sm text-slate-800 font-bold">{selectedCommittee.theme}</p>
                <p className="text-xs text-slate-500 pt-1 leading-relaxed">{selectedCommittee.description}</p>
              </div>

              {/* Mesa Diretora do Comitê */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mesa Diretora do Comitê</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Presidente</span>
                    <p className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-orange-500" />
                      {selectedCommittee.chairperson}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Vice-Presidente</span>
                    <p className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-500" />
                      {selectedCommittee.viceChair}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Secretário(a)</span>
                    <p className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-500" />
                      {selectedCommittee.secretary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resoluções do Comitê */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Minutas em Andamento ({committeeResolutions.length})
                  </h4>
                  <button
                    onClick={() => onNavigate('resolutions')}
                    className="text-xs text-orange-600 hover:text-orange-700 font-bold inline-flex items-center gap-1"
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
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold">
                              {res.code}
                            </span>
                            <h5 className="font-extrabold text-slate-800 text-xs sm:text-sm">{res.title}</h5>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Proposta por: <strong className="text-slate-600">{res.mainSponsorName}</strong>
                          </p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                          res.status === 'aprovado' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : res.status === 'em_debate'
                            ? 'bg-orange-50 text-orange-600 border border-orange-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {res.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-xs font-medium">
                    Nenhum projeto de resolução submetido para este comitê até o momento.
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Coluna Lateral: Bancadas no Comitê */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  Salas Integrantes ({committeeDelegations.length})
                </h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Turmas</span>
              </div>

              {committeeDelegations.length > 0 ? (
                <div className="space-y-2.5">
                  {committeeDelegations.map((del) => (
                    <div 
                      key={del.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{del.flagEmoji}</span>
                          <div>
                            <h5 className="font-bold text-slate-800">{del.name}</h5>
                            <p className="text-[10px] text-orange-600 font-semibold">{del.representation}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          del.isPresent ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                        }`}>
                          {del.isPresent ? 'Presente' : 'Ausente'}
                        </span>
                      </div>

                      <div className="pt-1 text-[11px] text-slate-500">
                        Porta-voz: <strong className="text-slate-700">{del.chiefDelegate}</strong>
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
          </div>

        </div>
      )}
    </div>
  );
};
