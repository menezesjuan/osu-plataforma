import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  UserCheck, 
  Volume2, 
  Clock, 
  ChevronRight,
  ListOrdered
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';

export const DebateTimerView: React.FC = () => {
  const { delegations } = useOsu();

  const [initialSeconds, setInitialSeconds] = useState<number>(90); // 1m30s default
  const [secondsLeft, setSecondsLeft] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speakerName, setSpeakerName] = useState<string>('');
  const [speakerType, setSpeakerType] = useState<'geral' | 'favor' | 'contra'>('geral');
  
  // Speakers Queue
  const [queue, setQueue] = useState<{ id: string; name: string; type: string }[]>([]);
  const [selectedQueueDel, setSelectedQueueDel] = useState<string>(delegations[0]?.name || '');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play browser synth sound
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext might be blocked until user interacts
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playAlertSound();
            return 0;
          }
          if (prev === 11 || prev === 31) {
            playAlertSound();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = (newSec?: number) => {
    setIsRunning(false);
    const target = newSec !== undefined ? newSec : initialSeconds;
    setSecondsLeft(target);
  };

  const handleSetPreset = (sec: number) => {
    setInitialSeconds(sec);
    handleReset(sec);
  };

  const handleAddToQueue = () => {
    if (!selectedQueueDel) return;
    const newEntry = {
      id: `queue-${Date.now()}`,
      name: selectedQueueDel,
      type: speakerType,
    };
    setQueue(prev => [...prev, newEntry]);
  };

  const handleCallNextSpeaker = () => {
    if (queue.length === 0) return;
    const [next, ...rest] = queue;
    setSpeakerName(next.name);
    setSpeakerType(next.type as any);
    setQueue(rest);
    handleReset();
  };

  const formatTime = (totalSec: number) => {
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (secondsLeft === 0) return 'text-rose-500 border-rose-500 animate-pulse';
    if (secondsLeft <= 10) return 'text-rose-400 border-rose-500/80';
    if (secondsLeft <= 30) return 'text-amber-400 border-amber-500/80';
    return 'text-emerald-400 border-emerald-500/80';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Timer className="w-6 h-6 text-blue-400" />
          Cronômetro da Mesa Diretora & Oratória
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Controle regimental de tempo de fala para oradores na tribuna e debates moderados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel Central do Relógio */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-2xl flex flex-col items-center justify-between text-center space-y-6">
          
          {/* Orador Atual */}
          <div className="w-full">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Na Tribuna de Oratória:</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {speakerName || 'Nenhum orador em discurso'}
            </h2>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${speakerType === 'favor' ? 'bg-emerald-400' : speakerType === 'contra' ? 'bg-rose-400' : 'bg-blue-400'}`}></span>
              Discurso: {speakerType === 'favor' ? 'A Favor da Moção' : speakerType === 'contra' ? 'Contra a Moção' : 'Pronunciamento Geral'}
            </div>
          </div>

          {/* Relógio Digital Gigante */}
          <div className={`w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 flex flex-col items-center justify-center bg-slate-950/70 transition-all duration-300 ${getTimerColor()}`}>
            <span className="text-6xl sm:text-7xl font-mono font-black tracking-tighter">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase mt-2 tracking-widest">
              {secondsLeft === 0 ? 'Tempo Esgotado!' : isRunning ? 'Tempo Correndo' : 'Pausado'}
            </span>
          </div>

          {/* Controles do Cronômetro */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleStartPause}
                className={`px-8 py-3.5 rounded-xl text-white text-base font-bold shadow-lg flex items-center gap-2 transition ${
                  isRunning 
                    ? 'bg-amber-600 hover:bg-amber-500' 
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isRunning ? 'Pausar Discurso' : 'Iniciar Tempo'}
              </button>

              <button
                onClick={() => handleReset()}
                className="px-5 py-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-base font-bold flex items-center gap-2 transition"
                title="Reiniciar tempo"
              >
                <RotateCcw className="w-5 h-5" />
                Zerar
              </button>
            </div>

            {/* Presets de Tempo */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Tempo Padrão:
              </span>
              <button
                onClick={() => handleSetPreset(60)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${initialSeconds === 60 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-700'}`}
              >
                1 min
              </button>
              <button
                onClick={() => handleSetPreset(90)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${initialSeconds === 90 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-700'}`}
              >
                1m 30s
              </button>
              <button
                onClick={() => handleSetPreset(120)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${initialSeconds === 120 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-700'}`}
              >
                2 min
              </button>
              <button
                onClick={() => handleSetPreset(180)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${initialSeconds === 180 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-700'}`}
              >
                3 min
              </button>
            </div>
          </div>

        </div>

        {/* Fila de Oradores e Inscrições */}
        <div className="space-y-4">
          
          {/* Adicionar à Fila */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              Inscrição na Lista de Oradores
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Delegação / Sala</label>
                <select
                  value={selectedQueueDel}
                  onChange={(e) => setSelectedQueueDel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {delegations.map(d => (
                    <option key={d.id} value={`${d.name} (${d.representation})`}>
                      {d.flagEmoji} {d.name} ({d.representation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Posicionamento da Fala</label>
                <select
                  value={speakerType}
                  onChange={(e) => setSpeakerType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="geral">Pronunciamento Geral</option>
                  <option value="favor">Discurso a Favor</option>
                  <option value="contra">Discurso Contra</option>
                </select>
              </div>

              <button
                onClick={handleAddToQueue}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Inserir na Fila de Discurso
              </button>
            </div>
          </div>

          {/* Lista de Espera */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-blue-400" />
                Fila de Inscrição ({queue.length})
              </h3>
              {queue.length > 0 && (
                <button
                  onClick={handleCallNextSpeaker}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  Chamar Próximo
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {queue.length > 0 ? (
              <div className="space-y-2">
                {queue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <h5 className="font-bold text-white">{item.name}</h5>
                        <span className={`text-[10px] ${item.type === 'favor' ? 'text-emerald-400' : item.type === 'contra' ? 'text-rose-400' : 'text-slate-400'}`}>
                          {item.type === 'favor' ? 'A Favor' : item.type === 'contra' ? 'Contra' : 'Geral'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setQueue(queue.filter(q => q.id !== item.id))}
                      className="text-slate-500 hover:text-rose-400 text-xs px-1"
                      title="Remover da fila"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">
                Nenhuma delegação aguardando na fila de oradores.
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-400 space-y-1.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
              Sinal Sonoro da Mesa:
            </span>
            <p className="text-[11px] leading-relaxed">
              O cronômetro emite avisos com 30s e 10s restantes e um alerta final ao esgotar o tempo do orador.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
