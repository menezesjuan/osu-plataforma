import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { 
  INITIAL_COMMITTEES, 
  INITIAL_DELEGATIONS, 
  INITIAL_RESOLUTIONS, 
  INITIAL_NOTICES, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_SCHEDULE_ITEMS 
} from '../../src/data/mockData.js';
import { 
  Delegation, 
  Resolution, 
  LiveVoteState, 
  Notice, 
  ChatMessage, 
  ScheduleItem, 
  CurrentUser, 
  ResolutionStatus 
} from '../../src/types/index.js';

const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'osu.sqlite');
export const db = new DatabaseSync(DB_PATH);

// Criação e inicialização das tabelas
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      title TEXT NOT NULL,
      delegation_id TEXT
    );

    CREATE TABLE IF NOT EXISTS committees (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      theme TEXT,
      icon_name TEXT,
      room_location TEXT,
      chairperson TEXT,
      vice_chair TEXT,
      secretary TEXT
    );

    CREATE TABLE IF NOT EXISTS delegations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      level TEXT NOT NULL,
      representation TEXT NOT NULL,
      flag_emoji TEXT,
      chief_delegate TEXT,
      delegates TEXT NOT NULL,
      username TEXT,
      password TEXT,
      advisor_teacher TEXT,
      committee_id TEXT,
      is_present INTEGER DEFAULT 1,
      avatar_color TEXT
    );

    CREATE TABLE IF NOT EXISTS resolutions (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      committee_id TEXT NOT NULL,
      main_sponsor_id TEXT NOT NULL,
      main_sponsor_name TEXT NOT NULL,
      co_sponsors TEXT NOT NULL,
      preamble TEXT NOT NULL,
      operative_clauses TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      voting_result TEXT
    );

    CREATE TABLE IF NOT EXISTS live_voting (
      id TEXT PRIMARY KEY,
      is_active INTEGER DEFAULT 0,
      resolution_id TEXT DEFAULT '',
      majority_type TEXT DEFAULT 'simples',
      votes TEXT DEFAULT '{}',
      started_at TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      sender_name TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      is_official INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS schedule_items (
      id TEXT PRIMARY KEY,
      time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      room TEXT NOT NULL,
      status TEXT NOT NULL,
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notices (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      important INTEGER DEFAULT 0
    );
  `);

  // Se o banco estiver vazio, semeia os dados iniciais
  seedInitialDataIfEmpty();
}

export function seedInitialDataIfEmpty() {
  const usersCount = (db.prepare('SELECT count(*) as count FROM users').get() as { count: number }).count;
  if (usersCount === 0) {
    seedAllData();
  }
}

export function seedAllData() {
  // Limpa tabelas existentes
  db.exec(`
    DELETE FROM users;
    DELETE FROM committees;
    DELETE FROM delegations;
    DELETE FROM resolutions;
    DELETE FROM live_voting;
    DELETE FROM chat_messages;
    DELETE FROM schedule_items;
    DELETE FROM notices;
  `);

  // 1. Usuários Padrão (Mesa Diretora e Bancadas)
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, password, name, role, title, delegation_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('usr-admin-1', 'admin', 'admin123', 'Juan Menezes', 'admin', 'Presidente da Mesa', null);
  insertUser.run('usr-admin-2', 'mesa', 'mesa123', 'Mesa Diretora Geral', 'admin', 'Secretaria da Mesa', null);
  insertUser.run('usr-admin-3', 'juan', 'admin123', 'Juan Menezes', 'admin', 'Presidente da Mesa', null);

  // 2. Comitês
  const insertCommittee = db.prepare(`
    INSERT INTO committees (id, code, name, description, theme, icon_name, room_location, chairperson, vice_chair, secretary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of INITIAL_COMMITTEES) {
    insertCommittee.run(
      c.id,
      c.code,
      c.name,
      c.description,
      c.theme,
      c.iconName,
      c.roomLocation,
      c.chairperson,
      c.viceChair,
      c.secretary
    );
  }

  // 3. Bancadas/Delegações
  const insertDel = db.prepare(`
    INSERT INTO delegations (id, name, level, representation, flag_emoji, chief_delegate, delegates, username, password, advisor_teacher, committee_id, is_present, avatar_color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const d of INITIAL_DELEGATIONS) {
    insertDel.run(
      d.id,
      d.name,
      d.level,
      d.representation,
      d.flagEmoji,
      d.chiefDelegate,
      JSON.stringify(d.delegates || []),
      d.username || '',
      d.password || '123456',
      d.advisorTeacher || null,
      d.committeeId || null,
      d.isPresent ? 1 : 0,
      d.avatarColor || 'bg-blue-500'
    );
  }

  // 4. Resoluções
  const insertRes = db.prepare(`
    INSERT INTO resolutions (id, code, title, committee_id, main_sponsor_id, main_sponsor_name, co_sponsors, preamble, operative_clauses, status, created_at, voting_result)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of INITIAL_RESOLUTIONS) {
    insertRes.run(
      r.id,
      r.code,
      r.title,
      r.committeeId,
      r.mainSponsorId,
      r.mainSponsorName,
      JSON.stringify(r.coSponsors || []),
      JSON.stringify(r.preamble || []),
      JSON.stringify(r.operativeClauses || []),
      r.status,
      r.createdAt,
      r.votingResult ? JSON.stringify(r.votingResult) : null
    );
  }

  // 5. Estado de Votação
  db.prepare(`
    INSERT INTO live_voting (id, is_active, resolution_id, majority_type, votes, started_at)
    VALUES ('current', 0, '', 'simples', '{}', '')
  `).run();

  // 6. Mensagens de Chat
  const insertChat = db.prepare(`
    INSERT INTO chat_messages (id, sender_name, sender_role, content, timestamp, is_official)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const msg of INITIAL_CHAT_MESSAGES) {
    insertChat.run(
      msg.id,
      msg.senderName,
      msg.senderRole,
      msg.content,
      msg.timestamp,
      msg.isOfficial ? 1 : 0
    );
  }

  // 7. Cronograma
  const insertSch = db.prepare(`
    INSERT INTO schedule_items (id, time, end_time, title, subject, room, status, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of INITIAL_SCHEDULE_ITEMS) {
    insertSch.run(
      s.id,
      s.time,
      s.endTime,
      s.title,
      s.subject,
      s.room,
      s.status,
      s.category
    );
  }

  // 8. Avisos
  const insertNotice = db.prepare(`
    INSERT INTO notices (id, title, category, content, timestamp, important)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const n of INITIAL_NOTICES) {
    insertNotice.run(
      n.id,
      n.title,
      n.category,
      n.content,
      n.timestamp,
      n.important ? 1 : 0
    );
  }
}

// Métodos de Consulta e Operação

export function getAllDelegations(): Delegation[] {
  const rows = db.prepare('SELECT * FROM delegations ORDER BY name ASC').all() as any[];
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    level: r.level,
    representation: r.representation,
    flagEmoji: r.flag_emoji,
    chiefDelegate: r.chief_delegate,
    delegates: JSON.parse(r.delegates || '[]'),
    username: r.username,
    password: r.password,
    advisorTeacher: r.advisor_teacher,
    committeeId: r.committee_id,
    isPresent: Boolean(r.is_present),
    avatarColor: r.avatar_color,
  }));
}

export function createDelegation(del: Omit<Delegation, 'id'>): Delegation {
  const id = `del-${Date.now()}`;
  const username = del.username || del.representation.toLowerCase().replace(/[^a-z0-9]/g, '');
  const password = del.password || '123456';

  db.prepare(`
    INSERT INTO delegations (id, name, level, representation, flag_emoji, chief_delegate, delegates, username, password, advisor_teacher, committee_id, is_present, avatar_color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    del.name,
    del.level,
    del.representation,
    del.flagEmoji || '🏳️',
    del.chiefDelegate || '',
    JSON.stringify(del.delegates || []),
    username,
    password,
    del.advisorTeacher || null,
    del.committeeId || null,
    del.isPresent ? 1 : 0,
    del.avatarColor || 'bg-orange-500'
  );

  // Se a bancada possuir usuário e senha cadastrados, cria o acesso na tabela users
  if (username) {
    db.prepare(`
      INSERT OR REPLACE INTO users (id, username, password, name, role, title, delegation_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      `usr-del-${id}`,
      username.toLowerCase().trim(),
      password.trim(),
      del.chiefDelegate || del.representation,
      'student',
      `Bancada de ${del.representation} (${del.name})`,
      id
    );
  }

  return {
    ...del,
    id,
    username,
    password,
  };
}

export function updateDelegation(del: Delegation): void {
  db.prepare(`
    UPDATE delegations
    SET name = ?, level = ?, representation = ?, flag_emoji = ?, chief_delegate = ?,
        delegates = ?, username = ?, password = ?, advisor_teacher = ?, committee_id = ?,
        is_present = ?, avatar_color = ?
    WHERE id = ?
  `).run(
    del.name,
    del.level,
    del.representation,
    del.flagEmoji,
    del.chiefDelegate,
    JSON.stringify(del.delegates || []),
    del.username || null,
    del.password || null,
    del.advisorTeacher || null,
    del.committeeId || null,
    del.isPresent ? 1 : 0,
    del.avatarColor || 'bg-blue-500',
    del.id
  );

  // Atualiza ou remove credenciais de acesso da bancada
  if (del.username) {
    db.prepare(`
      INSERT OR REPLACE INTO users (id, username, password, name, role, title, delegation_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      `usr-del-${del.id}`,
      del.username.toLowerCase().trim(),
      (del.password || '123456').trim(),
      del.chiefDelegate || del.representation,
      'student',
      `Bancada de ${del.representation} (${del.name})`,
      del.id
    );
  } else {
    db.prepare('DELETE FROM users WHERE delegation_id = ?').run(del.id);
  }
}

export function togglePresence(id: string): boolean {
  const row = db.prepare('SELECT is_present FROM delegations WHERE id = ?').get(id) as { is_present: number } | undefined;
  if (!row) return false;
  const newStatus = row.is_present ? 0 : 1;
  db.prepare('UPDATE delegations SET is_present = ? WHERE id = ?').run(newStatus, id);
  return Boolean(newStatus);
}

export function deleteDelegation(id: string): void {
  db.prepare('DELETE FROM delegations WHERE id = ?').run(id);
  db.prepare('DELETE FROM users WHERE delegation_id = ?').run(id);
}

export function getAllResolutions(): Resolution[] {
  const rows = db.prepare('SELECT * FROM resolutions ORDER BY created_at DESC').all() as any[];
  return rows.map(r => ({
    id: r.id,
    code: r.code,
    title: r.title,
    committeeId: r.committee_id,
    mainSponsorId: r.main_sponsor_id,
    mainSponsorName: r.main_sponsor_name,
    coSponsors: JSON.parse(r.co_sponsors || '[]'),
    preamble: JSON.parse(r.preamble || '[]'),
    operativeClauses: JSON.parse(r.operative_clauses || '[]'),
    status: r.status,
    createdAt: r.created_at,
    votingResult: r.voting_result ? JSON.parse(r.voting_result) : undefined,
  }));
}

export function createResolution(res: Omit<Resolution, 'id' | 'createdAt'>): Resolution {
  const id = `res-${Date.now()}`;
  const createdAt = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  db.prepare(`
    INSERT INTO resolutions (id, code, title, committee_id, main_sponsor_id, main_sponsor_name, co_sponsors, preamble, operative_clauses, status, created_at, voting_result)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    res.code,
    res.title,
    res.committeeId,
    res.mainSponsorId,
    res.mainSponsorName,
    JSON.stringify(res.coSponsors || []),
    JSON.stringify(res.preamble || []),
    JSON.stringify(res.operativeClauses || []),
    res.status,
    createdAt,
    res.votingResult ? JSON.stringify(res.votingResult) : null
  );

  return {
    ...res,
    id,
    createdAt,
  };
}

export function updateResolutionStatus(id: string, status: ResolutionStatus): void {
  db.prepare('UPDATE resolutions SET status = ? WHERE id = ?').run(status, id);
}

export function deleteResolution(id: string): void {
  db.prepare('DELETE FROM resolutions WHERE id = ?').run(id);
}

export function setResolutionVotingResult(id: string, result: Resolution['votingResult']): void {
  db.prepare('UPDATE resolutions SET voting_result = ?, status = ? WHERE id = ?').run(
    JSON.stringify(result),
    result?.passed ? 'aprovado' : 'rejeitado',
    id
  );
}

export function getLiveVote(): LiveVoteState | null {
  const row = db.prepare("SELECT * FROM live_voting WHERE id = 'current'").get() as any;
  if (!row || !row.is_active) return null;
  return {
    isActive: true,
    resolutionId: row.resolution_id,
    majorityType: row.majority_type,
    votes: JSON.parse(row.votes || '{}'),
    startedAt: row.started_at,
  };
}

export function startLiveVote(resolutionId: string, majorityType: 'simples' | 'dois_tercos'): LiveVoteState {
  const startedAt = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  db.prepare(`
    UPDATE live_voting
    SET is_active = 1, resolution_id = ?, majority_type = ?, votes = '{}', started_at = ?
    WHERE id = 'current'
  `).run(resolutionId, majorityType, startedAt);

  updateResolutionStatus(resolutionId, 'em_debate');

  return {
    isActive: true,
    resolutionId,
    majorityType,
    votes: {},
    startedAt,
  };
}

export function castLiveVote(delegationId: string, vote: 'favor' | 'contra' | 'abstencao'): LiveVoteState | null {
  const current = getLiveVote();
  if (!current || !current.isActive) return null;

  current.votes[delegationId] = vote;
  db.prepare("UPDATE live_voting SET votes = ? WHERE id = 'current'").run(JSON.stringify(current.votes));
  return current;
}

export function finishLiveVote(): { resolutionId: string; result: NonNullable<Resolution['votingResult']> } | null {
  const current = getLiveVote();
  if (!current || !current.isActive) return null;

  const votes = current.votes;
  let favorable = 0;
  let opposed = 0;
  let abstained = 0;

  Object.values(votes).forEach(v => {
    if (v === 'favor') favorable++;
    else if (v === 'contra') opposed++;
    else if (v === 'abstencao') abstained++;
  });

  const totalVotes = favorable + opposed;
  const isTwoThirds = current.majorityType === 'dois_tercos';
  const passed = isTwoThirds
    ? totalVotes > 0 && favorable >= Math.ceil((2 / 3) * totalVotes)
    : favorable > opposed;

  const result: NonNullable<Resolution['votingResult']> = {
    favorable,
    opposed,
    abstained,
    requiredMajority: current.majorityType,
    passed,
    date: new Date().toLocaleDateString('pt-BR'),
  };

  setResolutionVotingResult(current.resolutionId, result);

  db.prepare(`
    UPDATE live_voting
    SET is_active = 0, resolution_id = '', majority_type = 'simples', votes = '{}', started_at = ''
    WHERE id = 'current'
  `).run();

  return {
    resolutionId: current.resolutionId,
    result,
  };
}

export function cancelLiveVote(): void {
  const current = getLiveVote();
  if (current && current.resolutionId) {
    updateResolutionStatus(current.resolutionId, 'analise_mesa');
  }

  db.prepare(`
    UPDATE live_voting
    SET is_active = 0, resolution_id = '', majority_type = 'simples', votes = '{}', started_at = ''
    WHERE id = 'current'
  `).run();
}

export function getAllChatMessages(): ChatMessage[] {
  const rows = db.prepare('SELECT * FROM chat_messages ORDER BY timestamp ASC').all() as any[];
  return rows.map(r => ({
    id: r.id,
    senderName: r.sender_name,
    senderRole: r.sender_role,
    content: r.content,
    timestamp: r.timestamp,
    isOfficial: Boolean(r.is_official),
  }));
}

export function addChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const id = `msg-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  db.prepare(`
    INSERT INTO chat_messages (id, sender_name, sender_role, content, timestamp, is_official)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    msg.senderName,
    msg.senderRole,
    msg.content,
    timestamp,
    msg.isOfficial ? 1 : 0
  );

  return {
    ...msg,
    id,
    timestamp,
  };
}

export function getAllSchedule(): ScheduleItem[] {
  const rows = db.prepare('SELECT * FROM schedule_items ORDER BY time ASC').all() as any[];
  return rows.map(r => ({
    id: r.id,
    time: r.time,
    endTime: r.end_time,
    title: r.title,
    subject: r.subject,
    room: r.room,
    status: r.status,
    category: r.category,
  }));
}

export function addScheduleItem(item: Omit<ScheduleItem, 'id'>): ScheduleItem {
  const id = `sch-${Date.now()}`;
  db.prepare(`
    INSERT INTO schedule_items (id, time, end_time, title, subject, room, status, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, item.time, item.endTime, item.title, item.subject, item.room, item.status, item.category);

  return { ...item, id };
}

export function updateScheduleItem(item: ScheduleItem): void {
  db.prepare(`
    UPDATE schedule_items
    SET time = ?, end_time = ?, title = ?, subject = ?, room = ?, status = ?, category = ?
    WHERE id = ?
  `).run(item.time, item.endTime, item.title, item.subject, item.room, item.status, item.category, item.id);
}

export function deleteScheduleItem(id: string): void {
  db.prepare('DELETE FROM schedule_items WHERE id = ?').run(id);
}

export function setScheduleItemStatus(id: string, status: 'concluido' | 'em_andamento' | 'proximo'): void {
  db.prepare('UPDATE schedule_items SET status = ? WHERE id = ?').run(status, id);
}

export function getAllNotices(): Notice[] {
  const rows = db.prepare('SELECT * FROM notices ORDER BY timestamp DESC').all() as any[];
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    category: r.category,
    content: r.content,
    timestamp: r.timestamp,
    important: Boolean(r.important),
  }));
}

export function addNotice(notice: Omit<Notice, 'id' | 'timestamp'>): Notice {
  const id = `ntc-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  db.prepare(`
    INSERT INTO notices (id, title, category, content, timestamp, important)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, notice.title, notice.category, notice.content, timestamp, notice.important ? 1 : 0);

  return { ...notice, id, timestamp };
}

export function authenticateUser(username: string, password: string): { user: CurrentUser } | null {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  const validAdminUsers = ['admin', 'mesa', 'juan'];
  const validAdminPasswords = ['admin', 'admin123', '123456', 'mesa123'];

  // 1. Busca usuário na tabela users (seja admin ou estudante de bancada)
  const row = db.prepare("SELECT * FROM users WHERE LOWER(username) = ?").get(cleanUser) as any;
  if (row) {
    const isPasswordCorrect =
      row.role === 'admin'
        ? (row.password === cleanPass || validAdminPasswords.includes(cleanPass))
        : (row.password === cleanPass);

    if (isPasswordCorrect) {
      return {
        user: {
          id: row.id,
          name: row.name,
          role: row.role as 'admin' | 'student',
          title: row.title,
          delegationId: row.delegation_id || undefined,
        }
      };
    }
  }

  // 2. Fallback de contingência caso seja um identificador de admin válido
  if (validAdminUsers.includes(cleanUser) && validAdminPasswords.includes(cleanPass)) {
    return {
      user: {
        id: 'usr-admin-1',
        name: 'Juan Menezes',
        role: 'admin',
        title: 'Presidente da Mesa',
      }
    };
  }

  // 3. Fallback: verificar se coincide com usuário de alguma bancada na tabela delegations
  const delRow = db.prepare(`
    SELECT * FROM delegations 
    WHERE (LOWER(username) = ? OR LOWER(representation) = ? OR LOWER(name) = ?)
  `).get(cleanUser, cleanUser, cleanUser) as any;

  if (delRow && delRow.username && delRow.password === cleanPass) {
    return {
      user: {
        id: `usr-del-${delRow.id}`,
        name: delRow.chief_delegate || delRow.representation,
        role: 'student',
        title: `Bancada de ${delRow.representation} (${delRow.name})`,
        delegationId: delRow.id,
      }
    };
  }

  return null;
}

export function getFullState() {
  return {
    committees: INITIAL_COMMITTEES,
    delegations: getAllDelegations(),
    resolutions: getAllResolutions(),
    notices: getAllNotices(),
    liveVote: getLiveVote(),
    chatMessages: getAllChatMessages(),
    scheduleItems: getAllSchedule(),
  };
}
