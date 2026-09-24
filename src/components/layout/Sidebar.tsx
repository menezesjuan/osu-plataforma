import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Vote, 
  Timer, 
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Hourglass
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
    { id: 'timer' as ActiveTab, label: 'Tribuna de Oratória', icon: Timer },
    { id: 'rules' as ActiveTab, label: 'Regimento', icon: BookOpen },
  ];

  // Estado das abas do cronômetro inferior
  const [timerMode, setTimerMode] = useState<'reuniao' | 'deliberacao'>('reuniao');

  // Cronômetro 1: Tempo Restante de Reunião (Padrão 3h30m = 12600s)
  const [sessionSeconds, setSessionSeconds] = useState<number>(12600);
  const [sessionRunning, setSessionRunning] = useState<boolean>(true);

  // Cronômetro 2: Cronômetro de Deliberação (Padrão 5m = 300s)
  const [delibSeconds, setDelibSeconds] = useState<number>(300);
  const [delibInitial, setDelibInitial] = useState<number>(300);
  const [delibRunning, setDelibRunning] = useState<boolean>(false);

  const sessionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const delibIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Play browser synth beep when deliberation ends
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Ignored
    }
  };

  // Efeito do tempo restante de reunião
  useEffect(() => {
    if (sessionRunning) {
      sessionIntervalRef.current = setInterval(() => {
        setSessionSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    }
    return () => {
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    };
  }, [sessionRunning]);

  // Efeito do cronômetro de deliberação
  useEffect(() => {
    if (delibRunning) {
      delibIntervalRef.current = setInterval(() => {
        setDelibSeconds(prev => {
          if (prev <= 1) {
            setDelibRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (delibIntervalRef.current) clearInterval(delibIntervalRef.current);
    }
    return () => {
      if (delibIntervalRef.current) clearInterval(delibIntervalRef.current);
    };
  }, [delibRunning]);

  const formatHoursMinutesSeconds = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatMinutesSeconds = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSetDelibPreset = (sec: number) => {
    setDelibInitial(sec);
    setDelibSeconds(sec);
    setDelibRunning(false);
  };

  return (
    <aside className="w-64 h-full shrink-0 bg-white border-r border-slate-100 p-5 flex flex-col justify-between select-none overflow-y-auto">
      <div>
        {/* Logo estilo Astrum com constelação de pontos coloridos */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group mb-7 pl-2"
        >
          <div className="relative w-9 h-9 flex items-center justify-center">
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
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-white text-slate-800 shadow-[0_8px_20px_rgba(249,115,22,0.12)] border border-slate-100/80 font-bold'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/80 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30' 
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Widget do Cronômetro no Canto Inferior Esquerdo */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        
        {/* Seletor de Abas: Reunião / Deliberação */}
        <div className="flex p-1 rounded-xl bg-slate-100/80 border border-slate-200/60 mb-2.5 text-[11px] font-bold">
          <button
            onClick={() => setTimerMode('reuniao')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              timerMode === 'reuniao'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock className="w-3 h-3 text-orange-500" />
            <span>Reunião</span>
          </button>

          <button
            onClick={() => setTimerMode('deliberacao')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              timerMode === 'deliberacao'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Hourglass className="w-3 h-3 text-blue-500" />
            <span>Deliberação</span>
          </button>
        </div>

        {/* Card do Cronômetro Ativo */}
        <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 shadow-xs space-y-2.5">
          {timerMode === 'reuniao' ? (
            /* Modo 1: Tempo Restante de Reunião */
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Tempo Restante
                </span>
                <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  sessionRunning ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-200 text-slate-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sessionRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                  {sessionRunning ? 'Em Curso' : 'Pausado'}
                </span>
              </div>

              {/* Dígitos do Cronômetro de Reunião */}
              <div className="text-xl font-mono font-black text-slate-800 tracking-tight my-1 text-center">
                {formatHoursMinutesSeconds(sessionSeconds)}
              </div>

              {/* Controles */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSessionRunning(!sessionRunning)}
                    className={`p-1.5 rounded-lg text-white font-bold transition shadow-2xs ${
                      sessionRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                    title={sessionRunning ? 'Pausar Reunião' : 'Retomar Reunião'}
                  >
                    {sessionRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      setSessionRunning(false);
                      setSessionSeconds(12600); // 3h30m
                    }}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
                    title="Reiniciar para 3h30"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setSessionSeconds(prev => prev + 900)}
                    className="px-1.5 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition"
                    title="Adicionar 15 minutos"
                  >
                    +15m
                  </button>
                  <button
                    onClick={() => setSessionSeconds(prev => prev + 1800)}
                    className="px-1.5 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition"
                    title="Adicionar 30 minutos"
                  >
                    +30m
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Modo 2: Cronômetro de Deliberação */
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Deliberação de Bancada
                </span>
                <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  delibRunning 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : delibSeconds === 0 
                    ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${delibRunning ? 'bg-blue-500 animate-pulse' : delibSeconds === 0 ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
                  {delibSeconds === 0 ? 'Concluído' : delibRunning ? 'Deliberando' : 'Pronto'}
                </span>
              </div>

              {/* Dígitos da Deliberação */}
              <div className={`text-xl font-mono font-black tracking-tight my-1 text-center transition-colors ${
                delibSeconds <= 15 ? 'text-rose-500 animate-pulse' : 'text-slate-800'
              }`}>
                {formatMinutesSeconds(delibSeconds)}
              </div>

              {/* Presets de Tempo */}
              <div className="flex justify-center gap-1.5 pb-1">
                <button
                  onClick={() => handleSetDelibPreset(120)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                    delibInitial === 120 ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  2m
                </button>
                <button
                  onClick={() => handleSetDelibPreset(300)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                    delibInitial === 300 ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  5m
                </button>
                <button
                  onClick={() => handleSetDelibPreset(600)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                    delibInitial === 600 ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  10m
                </button>
              </div>

              {/* Controles da Deliberação */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDelibRunning(!delibRunning)}
                    className={`p-1.5 rounded-lg text-white font-bold transition shadow-2xs ${
                      delibRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    title={delibRunning ? 'Pausar Deliberação' : 'Iniciar Deliberação'}
                  >
                    {delibRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      setDelibRunning(false);
                      setDelibSeconds(delibInitial);
                    }}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
                    title="Reiniciar tempo de deliberação"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-[10px] font-medium text-slate-400">
                  Consulta de bancada
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
};
