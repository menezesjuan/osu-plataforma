import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Committee, Delegation, Resolution, Notice, LiveVoteState, ResolutionStatus } from '../types';
import { INITIAL_COMMITTEES, INITIAL_DELEGATIONS, INITIAL_RESOLUTIONS, INITIAL_NOTICES } from '../data/mockData';

interface OsuContextType {
  committees: Committee[];
  delegations: Delegation[];
  resolutions: Resolution[];
  notices: Notice[];
  liveVote: LiveVoteState | null;
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
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  DELEGATIONS: 'osu_delegations_v1',
  RESOLUTIONS: 'osu_resolutions_v1',
  NOTICES: 'osu_notices_v1',
  LIVE_VOTE: 'osu_live_vote_v1',
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

  const togglePresence = (delegationId: string) => {
    setDelegations(prev =>
      prev.map(del => (del.id === delegationId ? { ...del, isPresent: !del.isPresent } : del))
    );
  };

  const addDelegation = (delegation: Omit<Delegation, 'id'>) => {
    const newDelegation: Delegation = {
      ...delegation,
      id: `del-${Date.now()}`,
    };
    setDelegations(prev => [newDelegation, ...prev]);
  };

  const updateDelegation = (updated: Delegation) => {
    setDelegations(prev => prev.map(del => (del.id === updated.id ? updated : del)));
  };

  const deleteDelegation = (id: string) => {
    setDelegations(prev => prev.filter(del => del.id !== id));
  };

  const addResolution = (res: Omit<Resolution, 'id' | 'createdAt'>) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const newRes: Resolution = {
      ...res,
      id: `res-${Date.now()}`,
      createdAt: formattedDate,
    };
    setResolutions(prev => [newRes, ...prev]);
  };

  const updateResolutionStatus = (id: string, status: ResolutionStatus) => {
    setResolutions(prev =>
      prev.map(res => (res.id === id ? { ...res, status } : res))
    );
  };

  const deleteResolution = (id: string) => {
    setResolutions(prev => prev.filter(res => res.id !== id));
  };

  const startLiveVoting = (resolutionId: string, majorityType: 'simples' | 'dois_tercos') => {
    setLiveVote({
      isActive: true,
      resolutionId,
      majorityType,
      votes: {},
      startedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const castVote = (delegationId: string, vote: 'favor' | 'contra' | 'abstencao') => {
    if (!liveVote) return;
    setLiveVote(prev => {
      if (!prev) return null;
      return {
        ...prev,
        votes: {
          ...prev.votes,
          [delegationId]: vote,
        },
      };
    });
  };

  const finishLiveVoting = () => {
    if (!liveVote) return;

    let favorable = 0;
    let opposed = 0;
    let abstained = 0;

    Object.values(liveVote.votes).forEach(vote => {
      if (vote === 'favor') favorable++;
      if (vote === 'contra') opposed++;
      if (vote === 'abstencao') abstained++;
    });

    const activeVoters = favorable + opposed; // Abstenções não contam para cálculo da maioria simples na prática parlamentar
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
  };

  const cancelLiveVoting = () => {
    setLiveVote(null);
  };

  const addNotice = (notice: Omit<Notice, 'id' | 'timestamp'>) => {
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
      timestamp: formatted,
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.DELEGATIONS);
    localStorage.removeItem(STORAGE_KEYS.RESOLUTIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.LIVE_VOTE);
    setDelegations(INITIAL_DELEGATIONS);
    setResolutions(INITIAL_RESOLUTIONS);
    setNotices(INITIAL_NOTICES);
    setLiveVote(null);
  };

  return (
    <OsuContext.Provider
      value={{
        committees,
        delegations,
        resolutions,
        notices,
        liveVote,
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
        resetAllData,
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
