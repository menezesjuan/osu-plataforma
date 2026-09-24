import React, { useState } from 'react';
import { OsuProvider, useOsu } from './context/OsuContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { RightPanel } from './components/layout/RightPanel';
import { ActiveTab } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentDashboardView } from './components/dashboard/StudentDashboardView';
import { DelegationsView } from './components/delegations/DelegationsView';
import { CommitteesView } from './components/committees/CommitteesView';
import { ResolutionsView } from './components/resolutions/ResolutionsView';
import { VotingView } from './components/voting/VotingView';
import { DebateTimerView } from './components/timer/DebateTimerView';
import { RulesView } from './components/rules/RulesView';
import { LoginView } from './components/auth/LoginView';

export const AppContent: React.FC = () => {
  const { currentUser, isAuthenticated } = useOsu();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      {/* Barra Lateral Esquerda com Navegação */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Área Central Principal em Tela Cheia */}
      <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
        <Header 
          onSearchClick={() => setActiveTab('resolutions')} 
          onNotificationsClick={() => setActiveTab('dashboard')} 
        />

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            currentUser.role === 'student' ? (
              <StudentDashboardView onNavigate={setActiveTab} />
            ) : (
              <DashboardView onNavigate={setActiveTab} />
            )
          )}
          {activeTab === 'delegations' && <DelegationsView />}
          {activeTab === 'committees' && <CommitteesView onNavigate={setActiveTab} />}
          {activeTab === 'resolutions' && <ResolutionsView onNavigate={setActiveTab} />}
          {activeTab === 'voting' && <VotingView />}
          {activeTab === 'timer' && <DebateTimerView />}
          {activeTab === 'rules' && <RulesView />}
        </div>
      </div>

      {/* Barra Lateral Direita com Perfil e Indicadores */}
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
