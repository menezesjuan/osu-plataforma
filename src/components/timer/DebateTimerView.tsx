import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  UserCheck, 
  Clock, 
  ChevronRight,
  ListOrdered
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';

export const DebateTimerView: React.FC = () => {
  const { delegations } = useOsu();

  const [initialSeconds, setInitialSeconds] = useState<number>(90);
  const [secondsLeft, setSecondsLeft] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speakerName, setSpeakerName] = useState<string>('');
  const [speakerType, setSpeakerType] = useState<'geral' | 'favor' | 'contra'>('geral');
  
  const [queue, setQueue] = useState<{ id: string; name: string; type: string }[]>([]);
  const [selectedQueueDel, setSelectedQueueDel] = useState<string>(delegations[0]?.name || '');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // Ignored
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

  const getTimerBorder = () => {
    if (secondsLeft === 0) return 'text-rose-500 border-rose-500 animate-pulse';
    if (secondsLeft <= 10) return 'text-rose-500 border-rose-400';
    if (secondsLeft <= 30) return 'text-amber-500 border-amber-400';
    return 'text-orange-500 border-orange-400';
  };

  return (
    <div className="p-8 space-y-6 bg-white min-h-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          Cronômetro da Mesa Diretora & Oratória
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Controle de tempo de tribuna para discursos de bancadas e debates moderados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel Central do Relógio */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between text-center space-y-6">
          
          {/* Orador Atual */}
          <div className="w-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Na Tribuna de Oratória:</span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {speakerName || 'Nenhum orador em discurso'}
            </h3>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 border border-slate-200 text-slate-600">
              <span className={`w-2 h-2 rounded-full ${speakerType === 'favor' ? 'bg-emerald-500' : speakerType === 'contra' ? 'bg-rose-500' : 'bg-orange-500'}`}></span>
              Discurso: {speakerType === 'favor' ? 'A Favor da Moção' : speakerType === 'contra' ? 'Contra a Moção' : 'Pronunciamento Geral'}
            </div>
          </div>

          {/* Relógio Redondo Gigante com Cantos Arredondados */}
          <div className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 flex flex-col items-center justify-center bg-slate-50/50 shadow-inner transition-all duration-300 ${getTimerBorder()}`}>
            <span className="text-6xl font-mono font-black tracking-tight">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">
              {secondsLeft === 0 ? 'Tempo Esgotado!' : isRunning ? 'Em Discurso' : 'Pausado'}
            </span>
          </div>

          {/* Controles do Cronômetro */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleStartPause}
                className={`px-8 py-3.5 rounded-2xl text-white text-xs font-black shadow-md flex items-center gap-2 transition ${
                  isRunning 
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' 
                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Pausar Discurso' : 'Iniciar Tempo'}
              </button>

              <button
                onClick={() => handleReset()}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-2 transition"
                title="Reiniciar tempo"
              >
                <RotateCcw className="w-4 h-4" />
                Zerar
              </button>
            </div>

            {/* Presets de Tempo */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs text-slate-400 mr-2 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                Padrão:
              </span>
              <button
                onClick={() => handleSetPreset(60)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${initialSeconds === 60 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                1 min
              </button>
              <button
                onClick={() => handleSetPreset(90)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${initialSeconds === 90 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                1m 30s
              </button>
              <button
                onClick={() => handleSetPreset(120)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${initialSeconds === 120 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                2 min
              </button>
              <button
                onClick={() => handleSetPreset(180)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${initialSeconds === 180 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                3 min
              </button>
            </div>
          </div>

        </div>

        {/* Fila de Oradores e Inscrições */}
        <div className="space-y-4">
          
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-orange-500" />
              Inscrição de Bancadas
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Turma / Delegado</label>
                <select
                  value={selectedQueueDel}
                  onChange={(e) => setSelectedQueueDel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-orange-500"
                >
                  {delegations.map(d => (
                    <option key={d.id} value={`${d.name} (${d.representation})`}>
                      {d.flagEmoji} {d.name} ({d.representation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Posicionamento</label>
                <select
                  value={speakerType}
                  onChange={(e) => setSpeakerType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-orange-500"
                >
                  <option value="geral">Pronunciamento Geral</option>
                  <option value="favor">Discurso a Favor</option>
                  <option value="contra">Discurso Contra</option>
                </select>
              </div>

              <button
                onClick={handleAddToQueue}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                Inserir na Fila de Discurso
              </button>
            </div>
          </div>

          {/* Fila */}
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-orange-500" />
                Fila de Inscrição ({queue.length})
              </h4>
              {queue.length > 0 && (
                <button
                  onClick={handleCallNextSpeaker}
                  className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                >
                  Chamar
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {queue.length > 0 ? (
              <div className="space-y-2">
                {queue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs border border-slate-200 text-slate-700 font-black flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <h5 className="font-extrabold text-slate-800">{item.name}</h5>
                        <span className={`text-[10px] font-bold ${item.type === 'favor' ? 'text-emerald-600' : item.type === 'contra' ? 'text-rose-500' : 'text-slate-400'}`}>
                          {item.type === 'favor' ? 'A Favor' : item.type === 'contra' ? 'Contra' : 'Geral'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setQueue(queue.filter(q => q.id !== item.id))}
                      className="text-slate-400 hover:text-rose-500 text-xs px-1 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4 font-medium">
                Nenhuma bancada aguardando na fila.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
