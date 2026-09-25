import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { 
  Committee, 
  Delegation, 
  Resolution, 
  Notice, 
  LiveVoteState, 
  ResolutionStatus, 
  ChatMessage, 
  ScheduleItem, 
  CurrentUser, 
  UserRole 
} from '../types';
import { 
  INITIAL_COMMITTEES, 
  INITIAL_DELEGATIONS, 
  INITIAL_RESOLUTIONS, 
  INITIAL_NOTICES, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_SCHEDULE_ITEMS 
} from '../data/mockData';

interface OsuContextType {
  committees: Committee[];
  delegations: Delegation[];
  resolutions: Resolution[];
  notices: Notice[];
  liveVote: LiveVoteState | null;
  chatMessages: ChatMessage[];
  scheduleItems: ScheduleItem[];
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  switchUserRole: (role: UserRole, delegationId?: string) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  togglePresence: (delegationId: string) => void;
  addDelegation: (delegation: Omit<Delegation, 'id'>) => void;
  updateDelegation: (delegation: Delegation) => void;
  deleteDelegation: (id: string) => void;
  addResolution: (resolution: Omit<Resolution, 'id' | 'createdAt'>) => void;
  updateResolutionStatus: (id: string, status: ResolutionStatus) => void;
  deleteResolution: (id: string) => void;
  startLiveVoting: (resolutionId: string, majorityType: 'simples' | 'dois_tercos') => void;
  castVote: (delegationId: string, vote: 'favor' | 'contra' | 'abstencao') => void;
  finishLiveVoting: () => void;
  cancelLiveVoting: () => void;
  addNotice: (notice: Omit<Notice, 'id' | 'timestamp'>) => void;
  sendChatMessage: (content: string, senderName?: string, senderRole?: string, isOfficial?: boolean) => void;
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  updateScheduleItem: (item: ScheduleItem) => void;
  deleteScheduleItem: (id: string) => void;
  setScheduleItemStatus: (id: string, status: 'concluido' | 'em_andamento' | 'proximo') => void;
  resetAllData: () => void;
  isConnected: boolean;
}

const STORAGE_KEYS = {
  DELEGATIONS: 'osu_delegations_v1',
  RESOLUTIONS: 'osu_resolutions_v1',
  NOTICES: 'osu_notices_v1',
  LIVE_VOTE: 'osu_live_vote_v1',
  CHAT_MESSAGES: 'osu_chat_messages_v1',
  SCHEDULE: 'osu_schedule_v1',
  CURRENT_USER: 'osu_current_user_v1',
  IS_AUTHENTICATED: 'osu_is_auth_v1',
};

const DEFAULT_ADMIN_USER: CurrentUser = {
  id: 'usr-admin-1',
  name: 'Juan Menezes',
  role: 'admin',
  title: 'Presidente da Mesa',
};

const OsuContext = createContext<OsuContextType | undefined>(undefined);

export const OsuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [committees] = useState<Committee[]>(INITIAL_COMMITTEES);

  const [delegations, setDelegations] = useState<Delegation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELEGATIONS);
      return saved ? JSON.parse(saved) : INITIAL_DELEGATIONS;
    } catch {
      return INITIAL_DELEGATIONS;
    }
  });

  const [resolutions, setResolutions] = useState<Resolution[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESOLUTIONS);
      return saved ? JSON.parse(saved) : INITIAL_RESOLUTIONS;
    } catch {
      return INITIAL_RESOLUTIONS;
    }
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  const [liveVote, setLiveVote] = useState<LiveVoteState | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIVE_VOTE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_ITEMS;
    } catch {
      return INITIAL_SCHEDULE_ITEMS;
    }
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_USER;
    } catch {
      return DEFAULT_ADMIN_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Sincroniza estado para o localStorage como cache local de contingência
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DELEGATIONS, JSON.stringify(delegations));
  }, [delegations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESOLUTIONS, JSON.stringify(resolutions));
  }, [resolutions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    if (liveVote) {
      localStorage.setItem(STORAGE_KEYS.LIVE_VOTE, JSON.stringify(liveVote));
    } else {
      localStorage.removeItem(STORAGE_KEYS.LIVE_VOTE);
    }
  }, [liveVote]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(scheduleItems));
  }, [scheduleItems]);

  // Função para buscar estado do SQLite via REST
  const fetchInitialState = useCallback(async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        if (data.delegations) setDelegations(data.delegations);
        if (data.resolutions) setResolutions(data.resolutions);
        if (data.notices) setNotices(data.notices);
        if (data.chatMessages) setChatMessages(data.chatMessages);
        if (data.scheduleItems) setScheduleItems(data.scheduleItems);
        setLiveVote(data.liveVote || null);
      }
    } catch {
      // Servidor backend pode estar inicializando; mantém dados locais
    }
  }, []);

  // Conexão WebSocket para sincronização em tempo real entre todos os usuários
  useEffect(() => {
    fetchInitialState();

    let socket: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let isDisposed = false;

    const connectWebSocket = () => {
      try {
        const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${proto}//${window.location.host}/ws`;

        socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (isDisposed) return;
          setIsConnected(true);
        };

        socket.onmessage = (event) => {
          if (isDisposed) return;
          try {
            const { type, data } = JSON.parse(event.data);

            switch (type) {
              case 'STATE_SYNC':
                if (data.delegations) setDelegations(data.delegations);
                if (data.resolutions) setResolutions(data.resolutions);
                if (data.notices) setNotices(data.notices);
                if (data.chatMessages) setChatMessages(data.chatMessages);
                if (data.scheduleItems) setScheduleItems(data.scheduleItems);
                setLiveVote(data.liveVote || null);
                break;
              case 'DELEGATIONS_UPDATED':
                setDelegations(data);
                break;
              case 'RESOLUTIONS_UPDATED':
                setResolutions(data);
                break;
              case 'LIVE_VOTE_UPDATED':
                setLiveVote(data);
                break;
              case 'CHAT_MESSAGE_ADDED':
                setChatMessages(prev => {
                  if (prev.some(m => m.id === data.id)) return prev;
                  return [...prev, data];
                });
                break;
              case 'SCHEDULE_UPDATED':
                setScheduleItems(data);
                break;
              case 'NOTICES_UPDATED':
                setNotices(data);
                break;
            }
          } catch {
            // Ignora falha de parse
          }
        };

        socket.onclose = () => {
          if (isDisposed) return;
          setIsConnected(false);
          reconnectTimeout = setTimeout(connectWebSocket, 2000);
        };

        socket.onerror = () => {
          socket?.close();
        };
      } catch {
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

    return () => {
      isDisposed = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) socket.close();
    };
  }, [fetchInitialState]);

  // Troca de Perfil de Usuário
  const switchUserRole = (role: UserRole, delegationId?: string) => {
    if (role === 'admin') {
      setCurrentUser(DEFAULT_ADMIN_USER);
    } else {
      const targetDel = delegations.find(d => d.id === delegationId) || delegations[0];
      if (targetDel) {
        setCurrentUser({
          id: `usr-student-${targetDel.id}`,
          name: targetDel.chiefDelegate || 'Delegado(a) Estudantil',
          role: 'student',
          title: `Bancada de ${targetDel.representation} (${targetDel.name})`,
          delegationId: targetDel.id,
        });
      }
    }
  };

  // Autenticação com o backend SQLite
  const login = async (usernameInput: string, passwordInput: string): Promise<{ success: boolean; message?: string }> => {
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          return { success: true };
        }
      }
    } catch {
      // Fallback offline caso a chamada ao backend falhe
    }

    // Validação local de contingência para administradores
    const validAdminUsers = ['admin', 'mesa', 'juan'];
    const validAdminPasswords = ['admin', 'admin123', '123456', 'mesa123'];

    if (validAdminUsers.includes(cleanUser) && validAdminPasswords.includes(cleanPass)) {
      setCurrentUser(DEFAULT_ADMIN_USER);
      setIsAuthenticated(true);
      return { success: true };
    }

    // Validação local de contingência para bancadas/alunos cadastrados
    const matchedDel = delegations.find(d => {
      const userMatches = d.username && d.username.toLowerCase() === cleanUser;
      const repMatches = d.representation.toLowerCase() === cleanUser;
      const nameMatches = d.name.toLowerCase() === cleanUser;
      return userMatches || repMatches || nameMatches;
    });

    if (matchedDel && matchedDel.password && matchedDel.password.trim() === cleanPass) {
      setCurrentUser({
        id: `usr-del-${matchedDel.id}`,
        name: matchedDel.chiefDelegate || matchedDel.representation,
        role: 'student',
        title: `Bancada de ${matchedDel.representation} (${matchedDel.name})`,
        delegationId: matchedDel.id,
      });
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, message: 'Usuário ou senha incorretos. Verifique suas credenciais.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Bancadas
  const togglePresence = async (delegationId: string) => {
    // Atualização otimista
    setDelegations(prev =>
      prev.map(del => (del.id === delegationId ? { ...del, isPresent: !del.isPresent } : del))
    );

    try {
      await fetch(`/api/delegations/${delegationId}/presence`, { method: 'PATCH' });
    } catch {
      // Mantém estado otimista
    }
  };

  const addDelegation = async (delegation: Omit<Delegation, 'id'>) => {
    const tempId = `del-${Date.now()}`;
    const newDelegation: Delegation = { ...delegation, id: tempId };
    setDelegations(prev => [newDelegation, ...prev]);

    try {
      const res = await fetch('/api/delegations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(delegation),
      });
      if (res.ok) {
        const saved = await res.json();
        setDelegations(prev => prev.map(d => d.id === tempId ? saved : d));
      }
    } catch {
      // Estado otimista preservado
    }
  };

  const updateDelegation = async (updated: Delegation) => {
    setDelegations(prev => prev.map(del => (del.id === updated.id ? updated : del)));

    try {
      await fetch(`/api/delegations/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // Estado otimista preservado
    }
  };

  const deleteDelegation = async (id: string) => {
    setDelegations(prev => prev.filter(del => del.id !== id));

    try {
      await fetch(`/api/delegations/${id}`, { method: 'DELETE' });
    } catch {
      // Estado otimista preservado
    }
  };

  // Resoluções
  const addResolution = async (res: Omit<Resolution, 'id' | 'createdAt'>) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const tempId = `res-${Date.now()}`;
    const newRes: Resolution = { ...res, id: tempId, createdAt: formattedDate };
    
    setResolutions(prev => [newRes, ...prev]);

    try {
      const response = await fetch('/api/resolutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(res),
      });
      if (response.ok) {
        const saved = await response.json();
        setResolutions(prev => prev.map(r => r.id === tempId ? saved : r));
      }
    } catch {
      // Estado otimista preservado
    }
  };

  const updateResolutionStatus = async (id: string, status: ResolutionStatus) => {
    setResolutions(prev => prev.map(res => (res.id === id ? { ...res, status } : res)));

    try {
      await fetch(`/api/resolutions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Estado otimista preservado
    }
  };

  const deleteResolution = async (id: string) => {
    setResolutions(prev => prev.filter(res => res.id !== id));

    try {
      await fetch(`/api/resolutions/${id}`, { method: 'DELETE' });
    } catch {
      // Estado otimista preservado
    }
  };

  // Votação em Tempo Real
  const startLiveVoting = async (resolutionId: string, majorityType: 'simples' | 'dois_tercos') => {
    const newLive: LiveVoteState = {
      isActive: true,
      resolutionId,
      majorityType,
      votes: {},
      startedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setLiveVote(newLive);
    updateResolutionStatus(resolutionId, 'em_debate');

    try {
      await fetch('/api/voting/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolutionId, majorityType }),
      });
    } catch {
      // Estado otimista preservado
    }
  };

  const castVote = async (delegationId: string, vote: 'favor' | 'contra' | 'abstencao') => {
    if (!liveVote) return;
    setLiveVote(prev => prev ? { ...prev, votes: { ...prev.votes, [delegationId]: vote } } : null);

    try {
      await fetch('/api/voting/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delegationId, vote }),
      });
    } catch {
      // Estado otimista preservado
    }
  };

  const finishLiveVoting = async () => {
    if (!liveVote) return;

    let favorable = 0;
    let opposed = 0;
    let abstained = 0;

    Object.values(liveVote.votes).forEach(vote => {
      if (vote === 'favor') favorable++;
      if (vote === 'contra') opposed++;
      if (vote === 'abstencao') abstained++;
    });

    const activeVoters = favorable + opposed;
    const passed =
      liveVote.majorityType === 'simples'
        ? favorable > opposed
        : favorable >= Math.ceil((activeVoters * 2) / 3);

    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    setResolutions(prev =>
      prev.map(res => {
        if (res.id === liveVote.resolutionId) {
          return {
            ...res,
            status: passed ? 'aprovado' : 'rejeitado',
            votingResult: {
              favorable,
              opposed,
              abstained,
              requiredMajority: liveVote.majorityType,
              passed,
              date: formatted,
            },
          };
        }
        return res;
      })
    );

    setLiveVote(null);

    try {
      await fetch('/api/voting/finish', { method: 'POST' });
    } catch {
      // Estado otimista preservado
    }
  };

  const cancelLiveVoting = async () => {
    if (liveVote && liveVote.resolutionId) {
      updateResolutionStatus(liveVote.resolutionId, 'analise_mesa');
    }
    setLiveVote(null);

    try {
      await fetch('/api/voting/cancel', { method: 'POST' });
    } catch {
      // Estado otimista preservado
    }
  };

  // Avisos
  const addNotice = async (notice: Omit<Notice, 'id' | 'timestamp'>) => {
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    const tempNotice: Notice = { ...notice, id: `not-${Date.now()}`, timestamp: formatted };
    setNotices(prev => [tempNotice, ...prev]);

    try {
      await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
      });
    } catch {
      // Estado otimista preservado
    }
  };

  // Chat do Plenário
  const sendChatMessage = async (
    content: string, 
    senderName = 'Juan Menezes', 
    senderRole = 'Presidente da Mesa', 
    isOfficial = true
  ) => {
    if (!content.trim()) return;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const tempMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName,
      senderRole,
      content,
      timestamp: timeFormatted,
      isOfficial,
    };

    setChatMessages(prev => [...prev, tempMsg]);

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          senderName,
          senderRole,
          isOfficial,
        }),
      });
    } catch {
      // Estado otimista preservado
    }
  };

  // Cronograma
  const addScheduleItem = async (item: Omit<ScheduleItem, 'id'>) => {
    const tempItem: ScheduleItem = { ...item, id: `sch-${Date.now()}` };
    setScheduleItems(prev => [...prev, tempItem]);

    try {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch {
      // Estado otimista preservado
    }
  };

  const updateScheduleItem = async (updated: ScheduleItem) => {
    setScheduleItems(prev => prev.map(item => (item.id === updated.id ? updated : item)));

    try {
      await fetch(`/api/schedule/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // Estado otimista preservado
    }
  };

  const deleteScheduleItem = async (id: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id));

    try {
      await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
    } catch {
      // Estado otimista preservado
    }
  };

  const setScheduleItemStatus = async (id: string, status: 'concluido' | 'em_andamento' | 'proximo') => {
    setScheduleItems(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));

    try {
      await fetch(`/api/schedule/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Estado otimista preservado
    }
  };

  // Restauração Completa
  const resetAllData = async () => {
    localStorage.removeItem(STORAGE_KEYS.DELEGATIONS);
    localStorage.removeItem(STORAGE_KEYS.RESOLUTIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.LIVE_VOTE);
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE);

    setDelegations(INITIAL_DELEGATIONS);
    setResolutions(INITIAL_RESOLUTIONS);
    setNotices(INITIAL_NOTICES);
    setLiveVote(null);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setScheduleItems(INITIAL_SCHEDULE_ITEMS);

    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch {
      // Reset local concluído
    }
  };

  return (
    <OsuContext.Provider
      value={{
        committees,
        delegations,
        resolutions,
        notices,
        liveVote,
        chatMessages,
        scheduleItems,
        currentUser,
        setCurrentUser,
        switchUserRole,
        isAuthenticated,
        login,
        logout,
        togglePresence,
        addDelegation,
        updateDelegation,
        deleteDelegation,
        addResolution,
        updateResolutionStatus,
        deleteResolution,
        startLiveVoting,
        castVote,
        finishLiveVoting,
        cancelLiveVoting,
        addNotice,
        sendChatMessage,
        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,
        setScheduleItemStatus,
        resetAllData,
        isConnected,
      }}
    >
      {children}
    </OsuContext.Provider>
  );
};

export const useOsu = (): OsuContextType => {
  const context = useContext(OsuContext);
  if (!context) {
    throw new Error('useOsu deve ser utilizado dentro de um OsuProvider');
  }
  return context;
};
