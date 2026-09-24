import express from 'express';
import cors from 'cors';
import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import {
  initDatabase,
  seedAllData,
  getFullState,
  authenticateUser,
  getAllDelegations,
  createDelegation,
  updateDelegation,
  deleteDelegation,
  togglePresence,
  getAllResolutions,
  createResolution,
  updateResolutionStatus,
  deleteResolution,
  getLiveVote,
  startLiveVote,
  castLiveVote,
  finishLiveVote,
  cancelLiveVote,
  getAllChatMessages,
  addChatMessage,
  getAllSchedule,
  addScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  setScheduleItemStatus,
  getAllNotices,
  addNotice,
} from './db/database.js';

// Inicializa banco de dados SQLite
initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Função para transmitir eventos em tempo real para todos os clientes conectados
export function broadcast(type: string, data: any) {
  const message = JSON.stringify({ type, data });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', ws => {
  // Ao conectar, envia o estado completo da simulação imediatamente
  ws.send(JSON.stringify({ type: 'STATE_SYNC', data: getFullState() }));

  ws.on('message', data => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG' }));
      }
    } catch {
      // Ignora mensagens mal formatadas
    }
  });
});

// --- ROTAS DA API ---

// 1. Autenticação
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios.' });
  }

  const result = authenticateUser(username, password);
  if (!result) {
    return res.status(401).json({ success: false, message: 'Usuário ou senha incorretos.' });
  }

  return res.json({ success: true, user: result.user });
});

// 2. Estado Geral
app.get('/api/state', (_req, res) => {
  return res.json(getFullState());
});

// 3. Bancadas / Delegações
app.get('/api/delegations', (_req, res) => {
  return res.json(getAllDelegations());
});

app.post('/api/delegations', (req, res) => {
  const newDel = createDelegation(req.body);
  broadcast('DELEGATIONS_UPDATED', getAllDelegations());
  return res.status(201).json(newDel);
});

app.put('/api/delegations/:id', (req, res) => {
  updateDelegation({ ...req.body, id: req.params.id });
  broadcast('DELEGATIONS_UPDATED', getAllDelegations());
  return res.json({ success: true });
});

app.patch('/api/delegations/:id/presence', (req, res) => {
  const isPresent = togglePresence(req.params.id);
  broadcast('DELEGATIONS_UPDATED', getAllDelegations());
  return res.json({ id: req.params.id, isPresent });
});

app.delete('/api/delegations/:id', (req, res) => {
  deleteDelegation(req.params.id);
  broadcast('DELEGATIONS_UPDATED', getAllDelegations());
  return res.json({ success: true });
});

// 4. Resoluções
app.get('/api/resolutions', (_req, res) => {
  return res.json(getAllResolutions());
});

app.post('/api/resolutions', (req, res) => {
  const newRes = createResolution(req.body);
  broadcast('RESOLUTIONS_UPDATED', getAllResolutions());
  return res.status(201).json(newRes);
});

app.patch('/api/resolutions/:id/status', (req, res) => {
  const { status } = req.body;
  updateResolutionStatus(req.params.id, status);
  broadcast('RESOLUTIONS_UPDATED', getAllResolutions());
  return res.json({ success: true });
});

app.delete('/api/resolutions/:id', (req, res) => {
  deleteResolution(req.params.id);
  broadcast('RESOLUTIONS_UPDATED', getAllResolutions());
  return res.json({ success: true });
});

// 5. Votação em Tempo Real
app.get('/api/voting/live', (_req, res) => {
  return res.json(getLiveVote());
});

app.post('/api/voting/start', (req, res) => {
  const { resolutionId, majorityType } = req.body;
  const live = startLiveVote(resolutionId, majorityType || 'simples');
  broadcast('LIVE_VOTE_UPDATED', live);
  broadcast('RESOLUTIONS_UPDATED', getAllResolutions());
  return res.json(live);
});

app.post('/api/voting/cast', (req, res) => {
  const { delegationId, vote } = req.body;
  const updated = castLiveVote(delegationId, vote);
  if (!updated) {
    return res.status(400).json({ error: 'Nenhuma votação ativa no momento.' });
  }
  broadcast('LIVE_VOTE_UPDATED', updated);
  return res.json(updated);
});

app.post('/api/voting/finish', (_req, res) => {
  const result = finishLiveVote();
  broadcast('LIVE_VOTE_UPDATED', null);
  broadcast('RESOLUTIONS_UPDATED', getAllResolutions());
  return res.json({ success: true, result });
});

app.post('/api/voting/cancel', (_req, res) => {
  cancelLiveVote();
  broadcast('LIVE_VOTE_UPDATED', null);
  broadcast('RESOLUTIONS_UPDATED', getAllResolutions());
  return res.json({ success: true });
});

// 6. Chat Interno do Plenário
app.get('/api/chat', (_req, res) => {
  return res.json(getAllChatMessages());
});

app.post('/api/chat', (req, res) => {
  const { content, senderName, senderRole, isOfficial } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Conteúdo da mensagem não pode ser vazio.' });
  }
  const msg = addChatMessage({
    content,
    senderName: senderName || 'Delegado',
    senderRole: senderRole || 'Bancada',
    isOfficial: Boolean(isOfficial),
  });
  broadcast('CHAT_MESSAGE_ADDED', msg);
  return res.status(201).json(msg);
});

// 7. Cronograma
app.get('/api/schedule', (_req, res) => {
  return res.json(getAllSchedule());
});

app.post('/api/schedule', (req, res) => {
  const item = addScheduleItem(req.body);
  broadcast('SCHEDULE_UPDATED', getAllSchedule());
  return res.status(201).json(item);
});

app.put('/api/schedule/:id', (req, res) => {
  updateScheduleItem({ ...req.body, id: req.params.id });
  broadcast('SCHEDULE_UPDATED', getAllSchedule());
  return res.json({ success: true });
});

app.patch('/api/schedule/:id/status', (req, res) => {
  setScheduleItemStatus(req.params.id, req.body.status);
  broadcast('SCHEDULE_UPDATED', getAllSchedule());
  return res.json({ success: true });
});

app.delete('/api/schedule/:id', (req, res) => {
  deleteScheduleItem(req.params.id);
  broadcast('SCHEDULE_UPDATED', getAllSchedule());
  return res.json({ success: true });
});

// 8. Avisos
app.get('/api/notices', (_req, res) => {
  return res.json(getAllNotices());
});

app.post('/api/notices', (req, res) => {
  const notice = addNotice(req.body);
  broadcast('NOTICES_UPDATED', getAllNotices());
  return res.status(201).json(notice);
});

// 9. Restauração Completa do Banco
app.post('/api/reset', (_req, res) => {
  seedAllData();
  const state = getFullState();
  broadcast('STATE_SYNC', state);
  return res.json({ success: true, state });
});

// Inicia servidor
server.listen(PORT, () => {
  console.log(`[OSU Backend] Servidor rodando na porta ${PORT}`);
  console.log(`[OSU Backend] Banco de dados SQLite persistido em data/osu.sqlite`);
  console.log(`[OSU Backend] WebSockets ativos no caminho /ws`);
});
