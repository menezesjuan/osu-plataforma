import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useOsu } from '../../context/OsuContext';

interface HeaderProps {
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick, onNotificationsClick }) => {
  const { notices, liveVote, currentUser } = useOsu();
  const unreadCount = notices.length + (liveVote ? 1 : 0);
  const firstName = currentUser.name.split(' ')[0] || 'Delegado';

  return (
    <div className="flex items-center justify-between py-6 px-8 border-b border-slate-100/80 bg-white">
      {/* Saudação amigável */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Olá, <span className="text-orange-500">{firstName}!</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {currentUser.role === 'admin' 
            ? 'Painel de Controle da Mesa • Organização das Salas Unidas'
            : `${currentUser.title} • Organização das Salas Unidas`}
        </p>
      </div>

      {/* Data e Ações Rápidas */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-slate-400 hidden md:block">
          24 Setembro 2026, Quinta-feira
        </span>

        {/* Busca */}
        <button
          onClick={onSearchClick}
          className="w-10 h-10 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 flex items-center justify-center transition"
          title="Pesquisar delegações ou resoluções"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notificações */}
        <button
          onClick={onNotificationsClick}
          className="w-10 h-10 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 relative flex items-center justify-center transition"
          title="Avisos da Mesa"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
