import React, { useState } from 'react';
import { OsuProvider } from './context/OsuContext';
import { Navbar, ActiveTab } from './components/layout/Navbar';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
        {activeTab === 'delegations' && <DelegationsView />}
        {activeTab === 'committees' && <CommitteesView onNavigate={setActiveTab} />}
        {activeTab === 'resolutions' && <ResolutionsView onNavigate={setActiveTab} />}
        {activeTab === 'voting' && <VotingView />}
        {activeTab === 'timer' && <DebateTimerView />}
        {activeTab === 'rules' && <RulesView />}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 <strong>Organização das Salas Unidas (OSU)</strong>. Todos os direitos reservados.
          </p>
          <p className="text-slate-400">
            Plataforma Aberta de Simulação e Cidadania Estudantil
          </p>
        </div>
      </footer>
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
