import React, { useState } from 'react';
import { OsuProvider } from './context/OsuContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { RightPanel } from './components/layout/RightPanel';
import { ActiveTab } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { DelegationsView } from './components/delegations/DelegationsView';
import { CommitteesView } from './components/committees/CommitteesView';
import { ResolutionsView } from './components/resolutions/ResolutionsView';
import { VotingView } from './components/voting/VotingView';
import { DebateTimerView } from './components/timer/DebateTimerView';
import { RulesView } from './components/rules/RulesView';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  return (
    <div className="w-full max-w-[1480px] bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_60px_rgba(30,41,59,0.06)] border border-slate-200/60 flex flex-col lg:flex-row overflow-hidden min-h-[900px] my-auto">
      
      {/* Barra Lateral Esquerda com Menu e Ilustração */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Área Central Principal */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <Header 
          onSearchClick={() => setActiveTab('resolutions')} 
          onNotificationsClick={() => setActiveTab('dashboard')} 
        />

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'delegations' && <DelegationsView />}
          {activeTab === 'committees' && <CommitteesView onNavigate={setActiveTab} />}
          {activeTab === 'resolutions' && <ResolutionsView onNavigate={setActiveTab} />}
          {activeTab === 'voting' && <VotingView />}
          {activeTab === 'timer' && <DebateTimerView />}
          {activeTab === 'rules' && <RulesView />}
        </div>
      </div>

      {/* Barra Lateral Direita com Perfil e Métricas */}
      <RightPanel />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <OsuProvider>
      <AppContent />
    </OsuProvider>
  );
};

export default App;
