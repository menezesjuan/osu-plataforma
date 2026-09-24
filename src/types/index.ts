export type EducationLevel = 'Fundamental II' | 'Ensino Médio';

export interface Delegation {
  id: string;
  name: string; // Ex: "9º Ano A", "2º Ano B"
  level: EducationLevel;
  representation: string; // País ou Causa representada (ex: "Brasil", "África do Sul", "Delegação da Sustentabilidade")
  flagEmoji: string;
  chiefDelegate: string;
  delegates: string[];
  advisorTeacher: string;
  committeeId: string;
  isPresent: boolean;
  avatarColor?: string;
}

export interface Committee {
  id: string;
  code: string;
  name: string;
  description: string;
  theme: string;
  iconName: string;
  roomLocation: string;
  chairperson: string;
  viceChair: string;
  secretary: string;
}

export type ResolutionStatus = 'redacao' | 'analise_mesa' | 'em_debate' | 'aprovado' | 'rejeitado';

export interface Resolution {
  id: string;
  code: string;
  title: string;
  committeeId: string;
  mainSponsorId: string;
  mainSponsorName: string;
  coSponsors: string[];
  preamble: string[]; // Cláusulas preambulares ("Considerando...", "Reconhecendo...")
  operativeClauses: string[]; // Cláusulas operativas ("1. Recomenda que...", "2. Determina a criação...")
  status: ResolutionStatus;
  createdAt: string;
  votingResult?: {
    favorable: number;
    opposed: number;
    abstained: number;
    requiredMajority: 'simples' | 'dois_tercos';
    passed: boolean;
    date: string;
  };
}

export interface LiveVoteState {
  isActive: boolean;
  resolutionId: string;
  majorityType: 'simples' | 'dois_tercos';
  votes: Record<string, 'favor' | 'contra' | 'abstencao'>;
  startedAt: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'mesa' | 'cronograma' | 'geral';
  content: string;
  timestamp: string;
  important: boolean;
}

export interface ProceduralRule {
  id: string;
  title: string;
  description: string;
  usage: string;
  priorityOrder: number;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isOfficial?: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  endTime: string;
  title: string;
  subject: string;
  room: string;
  status: 'concluido' | 'em_andamento' | 'proximo';
  category: 'plenaria' | 'comite' | 'redacao' | 'intervalo' | 'mesa';
}


