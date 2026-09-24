import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, LogOut, RotateCcw, ShieldCheck } from 'lucide-react';
import { useOsu } from '../../context/OsuContext';

export const RightPanel: React.FC = () => {
  const { chatMessages, sendChatMessage, resetAllData, currentUser, switchUserRole, delegations, logout } = useOsu();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const userName = currentUser.name;
  const userInitial = userName.trim().charAt(0).toUpperCase() || 'U';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(
      inputText, 
      currentUser.name, 
      currentUser.title, 
      currentUser.role === 'admin'
    );
    setInputText('');
  };

  return (
    <aside className="w-80 h-full shrink-0 bg-white border-l border-slate-100 flex flex-col justify-between select-none">
      
      {/* Topo: Identificador do Usuário */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/40 space-y-2.5">
        <div className="flex items-center gap-3">
          {/* Quadrado com a primeira letra do nome */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-xs font-black text-lg border border-orange-400/40 shrink-0">
            {userInitial}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-extrabold text-slate-800 truncate">{currentUser.name}</h3>
            <span className="text-[11px] font-bold text-orange-500 block truncate">{currentUser.title}</span>
          </div>
        </div>

        {/* Seletor de Perfil Ativo para Demonstração */}
        <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Perfil:</span>
          <select
            value={currentUser.role === 'admin' ? 'admin' : (currentUser.delegationId || delegations[0]?.id)}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'admin') {
                switchUserRole('admin');
              } else {
                switchUserRole('student', val);
              }
            }}
            className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-orange-500 max-w-[190px] truncate"
          >
            <option value="admin">👑 Mesa Diretora (Admin)</option>
            <optgroup label="Bancadas / Alunos">
              {delegations.map(del => (
                <option key={del.id} value={del.id}>
                  🎓 {del.flagEmoji} {del.name} ({del.representation})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Seção Central: Chat de Comunicação Interna */}
      <div className="flex-1 flex flex-col min-h-0 bg-white">
        
        {/* Cabeçalho do Chat */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-500" />
            <h4 className="text-xs font-extrabold text-slate-800">Comunicação Interna</h4>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Plenária Online
          </span>
        </div>

        {/* Lista de Mensagens com Rolagem */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-2xl text-xs space-y-1 transition-all ${
                msg.isOfficial
                  ? 'bg-orange-50/80 border border-orange-200/70 text-slate-800 ml-2'
                  : 'bg-slate-50 border border-slate-100 text-slate-700 mr-2'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-extrabold text-[11px] text-slate-800 truncate">
                    {msg.senderName}
                  </span>
                  {msg.isOfficial && (
                    <span className="shrink-0 p-0.5 rounded bg-orange-500 text-white text-[9px] font-black" title="Mensagem Oficial da Mesa">
                      <ShieldCheck className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                  {msg.timestamp}
                </span>
              </div>

              <span className="text-[10px] text-orange-600 font-bold block">
                {msg.senderRole}
              </span>

              <p className="text-xs text-slate-700 font-medium leading-relaxed pt-0.5">
                {msg.content}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Campo de Envio de Mensagem */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Mensagem à bancada..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:border-orange-500 shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 text-white flex items-center justify-center transition shadow-xs shrink-0"
              title="Enviar mensagem"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[9px] text-slate-400 font-medium mt-1 block pl-1">
            Pressione Enter para enviar para o plenário
          </span>
        </form>

      </div>

      {/* Rodapé: Ações e Restauração */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold bg-white">
        <button
          onClick={() => {
            if (window.confirm('Restaurar dados originais da simulação?')) {
              resetAllData();
            }
          }}
          className="flex items-center gap-1.5 hover:text-slate-700 transition"
          title="Restaurar dados padrão"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar</span>
        </button>

        <button 
          onClick={logout}
          className="flex items-center gap-1.5 hover:text-rose-600 transition"
        >
          <span>Sair</span>
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

    </aside>
  );
};
