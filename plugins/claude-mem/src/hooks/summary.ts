import { SessionStore } from '../services/sqlite/SessionStore.js';
import { createHookResponse } from './hook-response.js';
import { logger } from '../utils/logger.js';
import { ensureWorkerRunning } from '../shared/worker-utils.js';

export interface StopInput {
  session_id: string;
  cwd: string;
  [key: string]: any;
}

/**
 * Summary Hook - Stop
 * Sends SUMMARIZE message to worker via HTTP POST (not finalize - keeps SDK agent running)
 */
export async function summaryHook(input?: StopInput): Promise<void> {
  if (!input) {
    throw new Error('summaryHook requires input');
  }

  const { session_id } = input;

  // Ensure worker is running first (runs cleanup if restarting)
  const workerReady = await ensureWorkerRunning();
  if (!workerReady) {
    throw new Error('Worker service failed to start or become healthy');
  }

  const db = new SessionStore();

  // Get or create session - no validation, just use the session_id from hook
  const sessionDbId = db.createSDKSession(session_id, '', '');
  const promptNumber = db.getPromptCounter(sessionDbId);
  db.close();

  // Use fixed worker port - no session.worker_port validation needed
  const FIXED_PORT = parseInt(process.env.CLAUDE_MEM_WORKER_PORT || '37777', 10);

  logger.dataIn('HOOK', 'Stop: Requesting summary', {
    sessionId: sessionDbId,
    workerPort: FIXED_PORT,
    promptNumber
  });

  const response = await fetch(`http://127.0.0.1:${FIXED_PORT}/sessions/${sessionDbId}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt_number: promptNumber }),
    signal: AbortSignal.timeout(2000)
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.failure('HOOK', 'Failed to generate summary', {
      sessionId: sessionDbId,
      status: response.status
    }, errorText);
    throw new Error(`Failed to request summary from worker: ${response.status} ${errorText}`);
  }

  // Get session stats for user feedback
  const db2 = new SessionStore();
  const stats = db2.db.prepare(`
    SELECT COUNT(*) as observation_count
    FROM observations
    WHERE sdk_session_id = (SELECT sdk_session_id FROM sdk_sessions WHERE id = ?)
  `).get(sessionDbId) as { observation_count: number };
  db2.close();

  logger.debug('HOOK', 'Summary request sent successfully', { sessionId: sessionDbId, observations: stats.observation_count });

  // Create context message with stats
  const statsMessage = stats.observation_count > 0
    ? `📝 claude-mem: Session summarized | ${stats.observation_count} observations captured`
    : `📝 claude-mem: Session summarized`;

  console.log(createHookResponse('Stop', true, { context: statsMessage }));
}
