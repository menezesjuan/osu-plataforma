import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Vote, 
  Timer, 
  BookOpen,
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'delegations' as ActiveTab, label: 'Salas & Turmas', icon: Users },
    { id: 'committees' as ActiveTab, label: 'Comitês', icon: Building2 },
    { id: 'resolutions' as ActiveTab, label: 'Resoluções', icon: FileText },
    { id: 'voting' as ActiveTab, label: 'Votações & Plenário', icon: Vote },
    { id: 'timer' as ActiveTab, label: 'Cronômetro', icon: Timer },
    { id: 'rules' as ActiveTab, label: 'Regimento', icon: BookOpen },
  ];

  return (
    <aside className="w-64 h-full shrink-0 bg-white border-r border-slate-100 p-6 flex flex-col justify-between select-none">
      <div>
        {/* Logo estilo Astrum com constelação de pontos coloridos */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group mb-10 pl-2"
        >
          <div className="relative w-9 h-9 flex items-center justify-center">
            {/* Círculos pontilhados coloridos */}
            <div className="grid grid-cols-3 gap-1 w-6 h-6 items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span className="w-2 h-2 rounded-full bg-orange-600 scale-125"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-slate-800 font-sans">
              osu<span className="text-orange-500 text-3xl leading-none">.</span>
            </span>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-white text-slate-800 shadow-[0_8px_20px_rgba(249,115,22,0.12)] border border-slate-100/80 font-bold'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/80 font-medium'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30' 
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Rodapé Limpo da Barra Lateral */}
      <div className="pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400 text-center">
        <span>OSU • Assembleia 2026</span>
      </div>
    </aside>
  );
};
