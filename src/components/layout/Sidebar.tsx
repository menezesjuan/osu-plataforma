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
  isOpen?: boolean;
  onClose?: () => void;
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
    <aside className="w-64 shrink-0 bg-white border-r border-slate-100 p-6 flex flex-col justify-between select-none">
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

      {/* Ilustração estilo Estudante lendo sobre os livros */}
      <div className="relative mt-8 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-rose-50/70 to-orange-50/60 p-4 border border-rose-100/50 flex flex-col items-center text-center overflow-hidden">
          {/* Gráfico SVG ilustrado */}
          <div className="w-28 h-28 relative flex items-center justify-center">
            {/* Folhas/Raminho decorativo */}
            <svg className="absolute -left-2 bottom-4 w-10 h-16 text-rose-300 opacity-60" viewBox="0 0 40 70" fill="currentColor">
              <path d="M20,65 Q10,40 25,10 Q22,25 30,35 Q15,45 20,65 Z" />
              <circle cx="15" cy="20" r="3" />
              <circle cx="28" cy="30" r="3" />
              <circle cx="12" cy="45" r="3" />
            </svg>

            {/* Livros empilhados ilustrados */}
            <div className="absolute bottom-2 flex flex-col items-center">
              <div className="w-20 h-4 bg-orange-600 rounded-sm shadow-sm transform -rotate-1"></div>
              <div className="w-22 h-3.5 bg-blue-900 rounded-sm shadow-sm -mt-0.5"></div>
              <div className="w-24 h-4 bg-orange-500 rounded-sm shadow-sm -mt-0.5"></div>
            </div>

            {/* Personagem estudante sentado */}
            <div className="absolute bottom-10 flex flex-col items-center">
              {/* Cabeça & Cabelo */}
              <div className="w-7 h-7 rounded-full bg-slate-800 relative">
                <div className="w-5 h-5 rounded-full bg-amber-200 mx-auto mt-2"></div>
              </div>
              {/* Corpo */}
              <div className="w-8 h-8 rounded-t-lg bg-orange-500 -mt-1 flex items-center justify-center">
                {/* Livrinho nas mãos */}
                <div className="w-5 h-4 bg-white rounded-xs border border-slate-300 -mb-2"></div>
              </div>
              {/* Pernas cruzadas */}
              <div className="w-12 h-3 bg-slate-800 rounded-full -mt-0.5"></div>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-700 mt-2">OSU Assembleia 2026</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Simulação Escolar Ativa</span>
        </div>
      </div>
    </aside>
  );
};
