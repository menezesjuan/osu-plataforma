import React from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  Vote, 
  Timer, 
  BookOpen, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';

export type ActiveTab = 'dashboard' | 'delegations' | 'committees' | 'resolutions' | 'voting' | 'timer' | 'rules';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { delegations, liveVote, resetAllData } = useOsu();

  const presentCount = delegations.filter(d => d.isPresent).length;
  const totalCount = delegations.length;

  const handleReset = () => {
    if (window.confirm('Deseja restaurar os dados de demonstração da simulação OSU?')) {
      resetAllData();
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Painel Geral', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'delegations', label: 'Salas & Delegações', icon: <Users className="w-4 h-4" /> },
    { id: 'committees', label: 'Comitês', icon: <Building2 className="w-4 h-4" /> },
    { id: 'resolutions', label: 'Resoluções', icon: <FileText className="w-4 h-4" /> },
    { id: 'voting', label: 'Plenário & Votação', icon: <Vote className="w-4 h-4" /> },
    { id: 'timer', label: 'Cronômetro da Mesa', icon: <Timer className="w-4 h-4" /> },
    { id: 'rules', label: 'Regimento', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Marca do Evento */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-blue-900/30 text-white font-black text-xl tracking-wider">
              OSU
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                  Organização das Salas Unidas
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Edição Escolar
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Simulação Diplomática e Cidadania Estudantil
              </p>
            </div>
          </div>

          {/* Quórum Status & Reset */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-400">Quórum Plenário:</span>
              <span className="font-semibold text-slate-200">{presentCount}/{totalCount} Presentes</span>
            </div>

            {liveVote && (
              <button
                onClick={() => setActiveTab('voting')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600/20 border border-rose-500/50 text-rose-300 text-xs font-semibold hover:bg-rose-600/30 transition animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Votação Ativa!
              </button>
            )}

            <button
              onClick={handleReset}
              title="Restaurar dados de teste"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition text-xs flex items-center gap-1 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>
          </div>
        </div>

        {/* Navegação por Abas */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
