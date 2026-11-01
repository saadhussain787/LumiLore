#!/usr/bin/env node
/**
 * LumiLore Technologies // Mission Control Local Web Engine
 * Sprint 35: Agency Mission Control GUI & Fleet Activity Audit Log
 * 
 * Lightweight, zero-dependency Node.js HTTP/SSE server providing:
 *   - Local visual cockpit on http://localhost:3030 (auto-port discovery)
 *   - REST endpoints: status, run-agent, logs, deliverables
 *   - Real-time Server-Sent Events (SSE) stream for live execution monitoring
 *   - Inbound Lead Trigger Bridge for website intake and telephony voice concierges
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ContractEngine } from '../core/contract-engine.js';
import { OmniRouter } from '../core/omni-router.js';
import { FleetAuditLogger } from '../core/fleet-audit-logger.js';
import {
  verifyPasskey,
  verifySessionToken,
  extractSessionToken,
  buildSessionCookie,
  buildLogoutCookie
} from '../../../backend/src/services/authGuard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

export class MissionControlServer {
  /**
   * @param {Object} [options]
   * @param {number} [options.port=3030]
   * @param {string} [options.host='127.0.0.1']
   * @param {FleetAuditLogger} [options.auditLogger]
   * @param {OmniRouter} [options.router]
   * @param {ContractEngine} [options.engine]
   */
  constructor(options = {}) {
    this.preferredPort = parseInt(options.port || process.env.PORT || '3030', 10);
    this.host = options.host || '127.0.0.1';
    this.router = options.router || new OmniRouter(options.routerOptions || {});
    this.engine = options.engine || new ContractEngine({ router: this.router });
    this.auditLogger = options.auditLogger || new FleetAuditLogger({ rootDir });
    this.htmlPath = path.join(__dirname, 'index.html');
    this.memoryDir = path.join(rootDir, '.ai/memory');
    this.clientsDir = path.join(this.memoryDir, 'clients');
    this.clientRegistryPath = path.join(this.clientsDir, 'registry.json');

    this.server = null;
    this.activePort = null;
    this.sseClients = new Set();
    this.agentStates = new Map(); // agentId -> { status, lastRun, latencyMs, lastError }

    this._ensureClientRegistry();
    this._initAgentStates();
  }

  /**
   * Ensure client registry file and folder exist
   * @private
   */
  _ensureClientRegistry() {
    if (!fs.existsSync(this.clientsDir)) {
      fs.mkdirSync(this.clientsDir, { recursive: true });
    }
    if (!fs.existsSync(this.clientRegistryPath)) {
      const initial = {
        version: "1.0.0",
        activeClientSlug: "lumilore",
        clients: [
          {
            id: "lumilore",
            slug: "lumilore",
            name: "LumiLore Technologies Inc.",
            companyName: "LumiLore Technologies Inc.",
            domain: "lumilore.ca",
            websiteUrl: "https://www.lumilore.ca/",
            phone: "+1-437-786-5864",
            industry: "Autonomous AI Systems & Serverless Cloud Architecture",
            lens: "corporate",
            tier: "enterprise",
            notes: "Flagship Mother Platform. 19-operative autonomous agency swarm, sub-150ms Jamstack, 68% AWS cloud waste reduction, 100/100 PageSpeed.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "my-choice-auto",
            slug: "my-choice-auto",
            name: "My Choice Auto Service",
            companyName: "My Choice Auto Service",
            domain: "mychoiceautoservices.com",
            websiteUrl: "https://www.mychoiceautoservices.com/",
            phone: "+1-416-556-2424",
            address: "112 Select Ave Unit# 5, Scarborough, ON M1V 4A7",
            email: "Mychoiceautoservice@gmail.com",
            leadContact: "Shafiq Patel",
            industry: "Automotive Mechanical Repair, Safety Inspection & Fleet Services",
            lens: "trades",
            tier: "growth",
            notes: "Scarborough automotive repair & maintenance facility led by Shafiq Patel. Located at 112 Select Ave Unit# 5. Specialized in mechanical diagnostics, brake repairs, oil services, and fleet maintenance.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "fiscalx",
            slug: "fiscalx",
            name: "FiscalX Professional Corporation",
            companyName: "FiscalX Professional Corporation",
            domain: "fiscalx.ca",
            websiteUrl: "https://www.fiscalx.ca/",
            phone: "+1-647-450-9235",
            address: "255 Duncan Mill Rd, Suite 205, North York, ON M3B 3H9",
            leadContact: "Wasim Kadri, CPA",
            businessHours: "Monday - Friday: 11:00 AM - 6:00 PM",
            industry: "Corporate Tax Advisory, Professional Accounting & Fractional CFO Services",
            lens: "corporate",
            tier: "scale",
            notes: "North York corporate tax & accounting firm led by Wasim Kadri, CPA. Located at 255 Duncan Mill Rd, Suite 205. Specializes in corporate tax advisory, year-end financial reporting, and fractional CFO services.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      };
      fs.writeFileSync(this.clientRegistryPath, JSON.stringify(initial, null, 2), 'utf8');
    }
  }

  /**
   * Read client registry from disk
   * @private
   */
  _readClientRegistry() {
    this._ensureClientRegistry();
    try {
      const raw = fs.readFileSync(this.clientRegistryPath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return { version: "1.0.0", activeClientSlug: "lumilore", clients: [] };
    }
  }

  /**
   * Save client registry to disk
   * @private
   */
  _saveClientRegistry(data) {
    this._ensureClientRegistry();
    fs.writeFileSync(this.clientRegistryPath, JSON.stringify(data, null, 2), 'utf8');
  }

  /**
   * Get specific client by slug
   * @param {string} slug 
   */
  getClient(slug) {
    const reg = this._readClientRegistry();
    return reg.clients?.find(c => c.slug === slug) || null;
  }

  /**
   * Get active client
   */
  getActiveClient() {
    const reg = this._readClientRegistry();
    const active = reg.clients?.find(c => c.slug === reg.activeClientSlug);
    return active || reg.clients?.[0] || null;
  }

  /**
   * Ensure and return client output directory
   * @param {string} slug 
   */
  _getClientOutputDir(slug) {
    const dir = path.join(this.clientsDir, slug);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
   * Initialize in-memory status for all 19 agents
   * @private
   */
  _initAgentStates() {
    const agents = this.engine.listAgents();
    for (const a of agents) {
      this.agentStates.set(a.id, {
        id: a.id,
        number: a.number,
        name: a.name,
        division: a.division,
        status: 'IDLE',
        lastRun: null,
        latencyMs: 0,
        lastError: null,
        lastSummary: null
      });
    }
  }

  /**
   * Broadcast Server-Sent Event (SSE) to all connected UI clients
   * @param {string} eventName 
   * @param {Object} payload 
   */
  broadcastSSE(eventName, payload = {}) {
    const data = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
    for (const client of this.sseClients) {
      try {
        client.write(data);
      } catch {
        this.sseClients.delete(client);
      }
    }
  }

  /**
   * Read full request body as string
   * @private
   */
  async _readBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 5 * 1024 * 1024) { // 5MB guard
          req.destroy();
          reject(new Error('Payload too large'));
        }
      });
      req.on('end', () => resolve(body));
      req.on('error', reject);
    });
  }

  /**
   * Send JSON response
   * @private
   */
  _sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Founder-Token',
      'Cache-Control': 'no-cache',
      'X-Robots-Tag': 'noindex, nofollow, noarchive'
    });
    res.end(JSON.stringify(data, null, 2));
  }

  /**
   * Master HTTP Request Router
   */
  async handleRequest(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Founder-Token'
      });
      res.end();
      return;
    }

    try {
      // 0. Founder Security Shield Auth Endpoints
      if (method === 'POST' && pathname === '/api/auth/verify-passkey') {
        const rawBody = await this._readBody(req);
        let payload = {};
        try { payload = JSON.parse(rawBody || '{}'); } catch {}
        const clientIp = req.socket?.remoteAddress || req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || '127.0.0.1';
        const result = verifyPasskey(payload.passkey || payload.password, clientIp);
        if (!result.success) {
          res.writeHead(result.locked ? 429 : 401, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'X-Robots-Tag': 'noindex, nofollow, noarchive'
          });
          res.end(JSON.stringify(result));
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Set-Cookie': result.cookie,
          'X-Robots-Tag': 'noindex, nofollow, noarchive'
        });
        res.end(JSON.stringify({
          success: true,
          token: result.token,
          expiresAt: result.expiresAt,
          founder: result.founder,
          role: result.role,
          message: 'Passkey verified. Founder session active.'
        }));
        return;
      }

      if (method === 'GET' && pathname === '/api/auth/session') {
        const token = extractSessionToken(req);
        const result = verifySessionToken(token);
        if (!result.valid) {
          this._sendJson(res, 401, { success: false, authenticated: false, error: result.error || 'UNAUTHORIZED' });
          return;
        }
        this._sendJson(res, 200, {
          success: true,
          authenticated: true,
          founder: result.payload?.founder || 'Saad Sayed',
          role: result.payload?.role || 'founder_admin',
          expiresAt: new Date(result.payload?.exp || Date.now()).toISOString()
        });
        return;
      }

      if (method === 'POST' && pathname === '/api/auth/logout') {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Set-Cookie': buildLogoutCookie(),
          'X-Robots-Tag': 'noindex, nofollow, noarchive'
        });
        res.end(JSON.stringify({ success: true, message: 'Founder session terminated.' }));
        return;
      }

      // 1. Dashboard UI (Local & Cloud /dashboard route alias)
      if (method === 'GET' && (pathname === '/' || pathname === '/index.html' || pathname === '/dashboard' || pathname === '/dashboard/' || pathname === '/mission-control' || pathname === '/mission-control/')) {
        if (!fs.existsSync(this.htmlPath)) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Mission Control UI (index.html) not found.');
          return;
        }
        const html = fs.readFileSync(this.htmlPath, 'utf8');
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Robots-Tag': 'noindex, nofollow, noarchive'
        });
        res.end(html);
        return;
      }

      // 2. Real-Time Server-Sent Events (SSE) Stream
      if (method === 'GET' && pathname === '/api/fleet/events') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*'
        });

        res.write(`event: connected\ndata: ${JSON.stringify({
          status: 'CONNECTED',
          timestamp: new Date().toISOString(),
          activePort: this.activePort
        })}\n\n`);

        this.sseClients.add(res);

        req.on('close', () => {
          this.sseClients.delete(res);
        });
        return;
      }

      // 3. Fleet Status Probe
      if (method === 'GET' && pathname === '/api/fleet/status') {
        const divisions = this.engine.listDivisions();
        const agents = this.engine.listAgents().map(a => {
          const state = this.agentStates.get(a.id) || {};
          return {
            ...a,
            liveState: {
              status: state.status || 'IDLE',
              lastRun: state.lastRun,
              latencyMs: state.latencyMs,
              lastError: state.lastError,
              lastSummary: state.lastSummary
            }
          };
        });

        const routerStatus = this.router.getStatus();
        const metrics = this.auditLogger.getMetricsSummary();

        this._sendJson(res, 200, {
          success: true,
          timestamp: new Date().toISOString(),
          server: {
            port: this.activePort,
            uptimeSeconds: Math.round(process.uptime()),
            nodeVersion: process.version,
            memoryMb: Math.round(process.memoryUsage().rss / (1024 * 1024))
          },
          fleet: {
            divisionCount: divisions.length,
            agentCount: agents.length,
            divisions,
            agents
          },
          router: routerStatus,
          auditMetrics: metrics
        });
        return;
      }

      // 4. Run Agent On-Demand
      if (method === 'POST' && pathname === '/api/fleet/run-agent') {
        const rawBody = await this._readBody(req);
        let payload = {};
        try {
          payload = JSON.parse(rawBody || '{}');
        } catch {
          this._sendJson(res, 400, { success: false, error: 'Malformed JSON payload' });
          return;
        }

        const agentIdentifier = payload.agentId || payload.agent;
        if (!agentIdentifier) {
          this._sendJson(res, 400, { success: false, error: 'Missing agentId or agent parameter' });
          return;
        }

        let agentObj = null;
        try {
          agentObj = this.engine.getAgent(agentIdentifier);
        } catch (err) {
          this._sendJson(res, 404, { success: false, error: err.message });
          return;
        }

        const taskInput = payload.taskInput || payload.input || {};
        const isDryRun = payload.dryRun !== undefined ? !!payload.dryRun : false;
        const triggerSource = payload.triggerSource || 'GUI';
        const preferredProvider = payload.preferredProvider;

        // Update in-memory state: RUNNING
        const currentState = this.agentStates.get(agentObj.id) || {};
        currentState.status = 'RUNNING';
        this.agentStates.set(agentObj.id, currentState);

        this.broadcastSSE('agent_update', {
          agentId: agentObj.id,
          status: 'RUNNING',
          timestamp: new Date().toISOString()
        });

        const startTime = Date.now();
        let execResult = null;
        let execError = null;

        try {
          execResult = await this.engine.executeAgent(agentObj.id, taskInput, {
            dryRun: isDryRun,
            preferredProvider
          });
        } catch (err) {
          execError = err;
        }

        const durationMs = Date.now() - startTime;
        const isSuccess = !!(execResult && execResult.success && !execError);

        // Update in-memory state: SUCCESS or ERROR
        currentState.status = isSuccess ? 'SUCCESS' : 'ERROR';
        currentState.lastRun = new Date().toISOString();
        currentState.latencyMs = durationMs;
        currentState.lastError = execError ? execError.message : (!isSuccess ? (execResult?.verification?.errors?.[0] || 'Verification failed') : null);
        currentState.lastSummary = isSuccess 
          ? `Executed successfully (${durationMs}ms)`
          : `Failed: ${currentState.lastError}`;
        this.agentStates.set(agentObj.id, currentState);

        const clientSlug = payload.clientSlug || (payload.client ? payload.client.slug : null) || this.getActiveClient()?.slug;
        let deliverableRelPath = agentObj.deliverables?.[0] ? `.ai/memory/${agentObj.id}.json` : null;

        if (clientSlug) {
          const clientDir = this._getClientOutputDir(clientSlug);
          deliverableRelPath = `.ai/memory/clients/${clientSlug}/${agentObj.id}.json`;
          const clientDeliverableAbs = path.join(clientDir, `${agentObj.id}.json`);
          if (execResult?.output) {
            fs.writeFileSync(clientDeliverableAbs, typeof execResult.output === 'string' ? execResult.output : JSON.stringify(execResult.output, null, 2), 'utf8');
          }
        }

        // Record persistent audit log entry
        const loggedEvent = this.auditLogger.logEvent({
          divisionId: agentObj.division,
          agentId: agentObj.id,
          agentNumber: agentObj.number,
          agentName: agentObj.name,
          triggerSource,
          executionTimeMs: durationMs,
          status: isSuccess ? 'SUCCESS' : 'ERROR',
          provider: execResult?.provider || (isDryRun ? 'offline_resilience' : 'error'),
          model: execResult?.model || 'unknown',
          tokenEfficiency: execResult?.compressed || {
            promptTokensSaved: 0,
            systemTokensSaved: 0,
            totalTokensSaved: 0,
            ratioSaved: '0%'
          },
          deliverablePath: deliverableRelPath,
          deliverableTitle: agentObj.deliverables?.[0] || 'Fleet Deliverable',
          deliverableSummary: currentState.lastSummary,
          verificationPassed: isSuccess,
          metadata: {
            dryRun: isDryRun,
            clientSlug: clientSlug || null,
            taskInput,
            error: execError ? execError.message : null
          }
        });

        // Broadcast completion across SSE
        this.broadcastSSE('agent_update', {
          agentId: agentObj.id,
          status: currentState.status,
          latencyMs: durationMs,
          lastError: currentState.lastError,
          lastSummary: currentState.lastSummary,
          timestamp: currentState.lastRun,
          event: loggedEvent
        });

        if (execError) {
          this._sendJson(res, 500, {
            success: false,
            error: execError.message,
            durationMs,
            loggedEvent
          });
          return;
        }

        this._sendJson(res, 200, {
          success: isSuccess,
          agent: agentObj,
          execution: execResult,
          loggedEvent
        });
        return;
      }

      // 4.1. Global Multi-Project & Client Context Endpoints
      if (pathname === '/api/fleet/clients') {
        if (method === 'GET') {
          const reg = this._readClientRegistry();
          const active = reg.clients?.find(c => c.slug === reg.activeClientSlug) || reg.clients?.[0] || null;
          this._sendJson(res, 200, {
            success: true,
            activeClientSlug: reg.activeClientSlug || active?.slug || null,
            activeClient: active,
            clients: reg.clients || []
          });
          return;
        }

        if (method === 'POST') {
          const rawBody = await this._readBody(req);
          let payload = {};
          try {
            payload = JSON.parse(rawBody || '{}');
          } catch {
            this._sendJson(res, 400, { success: false, error: 'Malformed JSON payload' });
            return;
          }

          const reg = this._readClientRegistry();

          if (payload.action === 'select') {
            const targetSlug = payload.slug;
            const found = reg.clients?.find(c => c.slug === targetSlug);
            if (!found) {
              this._sendJson(res, 404, { success: false, error: `Client with slug "${targetSlug}" not found.` });
              return;
            }
            reg.activeClientSlug = targetSlug;
            this._saveClientRegistry(reg);
            this.broadcastSSE('client_update', {
              action: 'select',
              activeClientSlug: targetSlug,
              activeClient: found
            });
            this._sendJson(res, 200, {
              success: true,
              activeClientSlug: targetSlug,
              activeClient: found,
              clients: reg.clients
            });
            return;
          }

          if (payload.action === 'create' || payload.client) {
            const clientData = payload.client || payload;
            const name = clientData.name || clientData.companyName;
            if (!name) {
              this._sendJson(res, 400, { success: false, error: 'Client name is required.' });
              return;
            }

            const slug = clientData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const existingIdx = reg.clients.findIndex(c => c.slug === slug);

            const clientRecord = {
              id: slug,
              slug,
              name,
              domain: clientData.domain || clientData.url || clientData.targetUrl || '',
              phone: clientData.phone || '',
              industry: clientData.industry || clientData.businessType || 'General Business',
              lens: clientData.lens || 'trades',
              tier: clientData.tier || 'growth',
              notes: clientData.notes || '',
              createdAt: existingIdx >= 0 ? reg.clients[existingIdx].createdAt : new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            this._getClientOutputDir(slug);

            if (existingIdx >= 0) {
              reg.clients[existingIdx] = clientRecord;
            } else {
              reg.clients.push(clientRecord);
            }

            reg.activeClientSlug = slug;
            this._saveClientRegistry(reg);

            this.broadcastSSE('client_update', {
              action: 'create',
              activeClientSlug: slug,
              activeClient: clientRecord
            });

            this._sendJson(res, 200, {
              success: true,
              activeClientSlug: slug,
              activeClient: clientRecord,
              clients: reg.clients
            });
            return;
          }

          this._sendJson(res, 400, { success: false, error: 'Invalid action. Supported actions: "select", "create".' });
          return;
        }
      }

      // 4.2. Chained Multi-Agent Sequences
      if (method === 'POST' && pathname === '/api/fleet/run-sequence') {
        const rawBody = await this._readBody(req);
        let payload = {};
        try {
          payload = JSON.parse(rawBody || '{}');
        } catch {
          this._sendJson(res, 400, { success: false, error: 'Malformed JSON payload' });
          return;
        }

        const sequenceId = payload.sequenceId || payload.sequence || 'pitch-to-close';
        const clientSlug = payload.clientSlug || this.getActiveClient()?.slug || 'lumilore';
        const client = this.getClient(clientSlug) || this.getActiveClient() || {
          name: 'LumiLore Technologies Inc.',
          domain: 'lumilore.ca',
          phone: '+1-437-786-5864',
          industry: 'Autonomous AI Systems & Serverless Cloud Architecture',
          lens: 'corporate',
          tier: 'enterprise'
        };

        const isDryRun = payload.dryRun !== undefined ? !!payload.dryRun : true;
        const preferredProvider = payload.preferredProvider;
        const clientDir = this._getClientOutputDir(clientSlug);

        this.broadcastSSE('sequence_start', {
          sequenceId,
          clientSlug,
          clientName: client.name,
          timestamp: new Date().toISOString()
        });

        const stepResults = [];
        const loggedEvents = [];

        if (sequenceId === 'pitch-to-close') {
          const triggerSource = 'SEQUENCE_PITCH_TO_CLOSE';

          // Step 1: Agent 06 (360° Website Inspector & PM)
          const agent06 = this.engine.getAgent('agent-06-website-inspector-pm');
          this.broadcastSSE('sequence_step', { sequenceId, step: 1, totalSteps: 3, agentId: agent06.id, status: 'RUNNING' });
          const t06 = Date.now();
          const res06 = await this.engine.executeAgent(agent06.id, {
            targetUrl: client.domain || 'lumilore.ca',
            businessType: client.industry,
            auditDepth: payload.auditDepth || 'full'
          }, { dryRun: isDryRun, preferredProvider });
          const dur06 = Date.now() - t06;

          const file06Rel = `.ai/memory/clients/${clientSlug}/${agent06.id}.json`;
          fs.writeFileSync(path.join(clientDir, `${agent06.id}.json`), typeof res06.output === 'string' ? res06.output : JSON.stringify(res06.output, null, 2), 'utf8');

          const event06 = this.auditLogger.logEvent({
            divisionId: agent06.division,
            divisionNumber: agent06.number,
            agentId: agent06.id,
            agentNumber: agent06.number,
            agentName: agent06.name,
            triggerSource,
            executionTimeMs: dur06,
            status: res06.success ? 'SUCCESS' : 'ERROR',
            provider: res06.provider,
            model: res06.model,
            tokenEfficiency: res06.compressed,
            deliverablePath: file06Rel,
            deliverableTitle: '6-Layer Website Teardown Audit',
            deliverableSummary: `Pitch-to-Close [1/3]: Audited ${client.domain || client.name}`,
            verificationPassed: res06.success,
            metadata: { sequenceId, step: 1, clientSlug, dryRun: isDryRun }
          });
          loggedEvents.push(event06);
          stepResults.push({ step: 1, agentId: agent06.id, result: res06, deliverablePath: file06Rel });

          // Step 2: Agent 07 (Dynamic SOW Closer)
          const agent07 = this.engine.getAgent('agent-07-sow-closer');
          this.broadcastSSE('sequence_step', { sequenceId, step: 2, totalSteps: 3, agentId: agent07.id, status: 'RUNNING' });
          const t07 = Date.now();
          const res07 = await this.engine.executeAgent(agent07.id, {
            clientName: client.name,
            auditFindings: res06.output,
            tier: client.tier || 'growth'
          }, { dryRun: isDryRun, preferredProvider });
          const dur07 = Date.now() - t07;

          const file07Rel = `.ai/memory/clients/${clientSlug}/${agent07.id}.json`;
          fs.writeFileSync(path.join(clientDir, `${agent07.id}.json`), typeof res07.output === 'string' ? res07.output : JSON.stringify(res07.output, null, 2), 'utf8');

          const event07 = this.auditLogger.logEvent({
            divisionId: agent07.division,
            divisionNumber: agent07.number,
            agentId: agent07.id,
            agentNumber: agent07.number,
            agentName: agent07.name,
            triggerSource,
            executionTimeMs: dur07,
            status: res07.success ? 'SUCCESS' : 'ERROR',
            provider: res07.provider,
            model: res07.model,
            tokenEfficiency: res07.compressed,
            deliverablePath: file07Rel,
            deliverableTitle: '3-Tier Commercial SOW Document',
            deliverableSummary: `Pitch-to-Close [2/3]: Generated SOW Proposal for ${client.name}`,
            verificationPassed: res07.success,
            metadata: { sequenceId, step: 2, clientSlug, dryRun: isDryRun }
          });
          loggedEvents.push(event07);
          stepResults.push({ step: 2, agentId: agent07.id, result: res07, deliverablePath: file07Rel });

          // Step 3: Agent 04 (Video Ad Studio)
          const agent04 = this.engine.getAgent('agent-04-video-ad-studio');
          this.broadcastSSE('sequence_step', { sequenceId, step: 3, totalSteps: 3, agentId: agent04.id, status: 'RUNNING' });
          const t04 = Date.now();
          const res04 = await this.engine.executeAgent(agent04.id, {
            clientName: client.name,
            domain: client.domain,
            targetAudience: client.industry,
            template: payload.template || '9:16 Kinetic Short'
          }, { dryRun: isDryRun, preferredProvider });
          const dur04 = Date.now() - t04;

          const file04Rel = `.ai/memory/clients/${clientSlug}/${agent04.id}.json`;
          fs.writeFileSync(path.join(clientDir, `${agent04.id}.json`), typeof res04.output === 'string' ? res04.output : JSON.stringify(res04.output, null, 2), 'utf8');

          const event04 = this.auditLogger.logEvent({
            divisionId: agent04.division,
            divisionNumber: agent04.number,
            agentId: agent04.id,
            agentNumber: agent04.number,
            agentName: agent04.name,
            triggerSource,
            executionTimeMs: dur04,
            status: res04.success ? 'SUCCESS' : 'ERROR',
            provider: res04.provider,
            model: res04.model,
            tokenEfficiency: res04.compressed,
            deliverablePath: file04Rel,
            deliverableTitle: 'Video Ad Production Package',
            deliverableSummary: `Pitch-to-Close [3/3]: Generated 60s Video Teaser for ${client.name}`,
            verificationPassed: res04.success,
            metadata: { sequenceId, step: 3, clientSlug, dryRun: isDryRun }
          });
          loggedEvents.push(event04);
          stepResults.push({ step: 3, agentId: agent04.id, result: res04, deliverablePath: file04Rel });

          // Write consolidated bundle deliverable for the sequence
          const bundleFileName = `pitch_to_close_bundle_${Date.now()}.json`;
          const bundleRelPath = `.ai/memory/clients/${clientSlug}/${bundleFileName}`;
          fs.writeFileSync(path.join(clientDir, bundleFileName), JSON.stringify({
            sequence: 'pitch-to-close',
            client,
            steps: stepResults,
            createdAt: new Date().toISOString()
          }, null, 2), 'utf8');

          const summaryEvent = this.auditLogger.logEvent({
            divisionId: 'division-02',
            agentId: 'sequence-pitch-to-close',
            agentName: 'Pitch-to-Close Pipeline',
            triggerSource: 'SEQUENCE_PITCH_TO_CLOSE',
            executionTimeMs: dur06 + dur07 + dur04,
            status: 'SUCCESS',
            deliverablePath: bundleRelPath,
            deliverableTitle: 'Pitch-to-Close Deliverable Bundle',
            deliverableSummary: `Pitch-to-Close Pipeline completed for ${client.name}`,
            metadata: { sequence: 'pitch-to-close', sequenceId, clientSlug, steps: stepResults }
          });
          loggedEvents.push(summaryEvent);

          this.broadcastSSE('sequence_complete', {
            sequenceId,
            clientSlug,
            status: 'SUCCESS',
            stepCount: 3,
            timestamp: new Date().toISOString()
          });

          this._sendJson(res, 200, {
            success: true,
            sequenceId,
            client,
            steps: stepResults,
            stepResults,
            bundlePath: bundleRelPath,
            loggedEvents
          });
          return;

        } else if (sequenceId === 'growth-storm') {
          const triggerSource = 'SEQUENCE_GROWTH_STORM';

          // Step 1: Agent 01 (SEO Dominator)
          const agent01 = this.engine.getAgent('agent-01-seo-dominator');
          this.broadcastSSE('sequence_step', { sequenceId, step: 1, totalSteps: 3, agentId: agent01.id, status: 'RUNNING' });
          const t01 = Date.now();
          const res01 = await this.engine.executeAgent(agent01.id, {
            domain: client.domain || 'lumilore.ca',
            industry: client.industry
          }, { dryRun: isDryRun, preferredProvider });
          const dur01 = Date.now() - t01;

          const file01Rel = `.ai/memory/clients/${clientSlug}/${agent01.id}.json`;
          fs.writeFileSync(path.join(clientDir, `${agent01.id}.json`), typeof res01.output === 'string' ? res01.output : JSON.stringify(res01.output, null, 2), 'utf8');

          const event01 = this.auditLogger.logEvent({
            divisionId: agent01.division,
            divisionNumber: agent01.number,
            agentId: agent01.id,
            agentNumber: agent01.number,
            agentName: agent01.name,
            triggerSource,
            executionTimeMs: dur01,
            status: res01.success ? 'SUCCESS' : 'ERROR',
            provider: res01.provider,
            model: res01.model,
            tokenEfficiency: res01.compressed,
            deliverablePath: file01Rel,
            deliverableTitle: 'Keyword Displacement Matrix',
            deliverableSummary: `Growth Storm [1/3]: Keyword displacement analysis for ${client.domain || client.name}`,
            verificationPassed: res01.success,
            metadata: { sequenceId, step: 1, clientSlug, dryRun: isDryRun }
          });
          loggedEvents.push(event01);
          stepResults.push({ step: 1, agentId: agent01.id, result: res01, deliverablePath: file01Rel });

          // Step 2: Agent 02 (Weekly Publisher)
          const agent02 = this.engine.getAgent('agent-02-weekly-publisher');
          this.broadcastSSE('sequence_step', { sequenceId, step: 2, totalSteps: 3, agentId: agent02.id, status: 'RUNNING' });
          const t02 = Date.now();
          const res02 = await this.engine.executeAgent(agent02.id, {
            topic: `${client.name} Cloud Modernization and AI Automation`,
            clientName: client.name
          }, { dryRun: isDryRun, preferredProvider });
          const dur02 = Date.now() - t02;

          const file02Rel = `.ai/memory/clients/${clientSlug}/${agent02.id}.json`;
          fs.writeFileSync(path.join(clientDir, `${agent02.id}.json`), typeof res02.output === 'string' ? res02.output : JSON.stringify(res02.output, null, 2), 'utf8');

          const event02 = this.auditLogger.logEvent({
            divisionId: agent02.division,
            divisionNumber: agent02.number,
            agentId: agent02.id,
            agentNumber: agent02.number,
            agentName: agent02.name,
            triggerSource,
            executionTimeMs: dur02,
            status: res02.success ? 'SUCCESS' : 'ERROR',
            provider: res02.provider,
            model: res02.model,
            tokenEfficiency: res02.compressed,
            deliverablePath: file02Rel,
            deliverableTitle: 'Saad Persona LinkedIn Queue',
            deliverableSummary: `Growth Storm [2/3]: Authored LinkedIn queue for ${client.name}`,
            verificationPassed: res02.success,
            metadata: { sequenceId, step: 2, clientSlug, dryRun: isDryRun }
          });
          loggedEvents.push(event02);
          stepResults.push({ step: 2, agentId: agent02.id, result: res02, deliverablePath: file02Rel });

          // Step 3: Agent 03 (AgentReach Buyer Scout)
          const agent03 = this.engine.getAgent('agent-03-agent-reach-scout');
          this.broadcastSSE('sequence_step', { sequenceId, step: 3, totalSteps: 3, agentId: agent03.id, status: 'RUNNING' });
          const t03 = Date.now();
          const res03 = await this.engine.executeAgent(agent03.id, {
            industry: client.industry,
            keywords: [client.domain || 'hvac', 'cloud automation', 'sub-150ms']
          }, { dryRun: isDryRun, preferredProvider });
          const dur03 = Date.now() - t03;

          const file03Rel = `.ai/memory/clients/${clientSlug}/${agent03.id}.json`;
          fs.writeFileSync(path.join(clientDir, `${agent03.id}.json`), typeof res03.output === 'string' ? res03.output : JSON.stringify(res03.output, null, 2), 'utf8');

          const event03 = this.auditLogger.logEvent({
            divisionId: agent03.division,
            divisionNumber: agent03.number,
            agentId: agent03.id,
            agentNumber: agent03.number,
            agentName: agent03.name,
            triggerSource,
            executionTimeMs: dur03,
            status: res03.success ? 'SUCCESS' : 'ERROR',
            provider: res03.provider,
            model: res03.model,
            tokenEfficiency: res03.compressed,
            deliverablePath: file03Rel,
            deliverableTitle: 'High-Intent Community Distress Leads',
            deliverableSummary: `Growth Storm [3/3]: Scouted buyer leads for ${client.name}`,
            verificationPassed: res03.success,
            metadata: { sequenceId, step: 3, clientSlug, dryRun: isDryRun }
          });
          loggedEvents.push(event03);
          stepResults.push({ step: 3, agentId: agent03.id, result: res03, deliverablePath: file03Rel });

          // Write consolidated bundle deliverable for the sequence
          const bundleFileName = `growth_storm_bundle_${Date.now()}.json`;
          const bundleRelPath = `.ai/memory/clients/${clientSlug}/${bundleFileName}`;
          fs.writeFileSync(path.join(clientDir, bundleFileName), JSON.stringify({
            sequence: 'growth-storm',
            client,
            steps: stepResults,
            createdAt: new Date().toISOString()
          }, null, 2), 'utf8');

          const summaryEvent = this.auditLogger.logEvent({
            divisionId: 'division-01',
            agentId: 'sequence-growth-storm',
            agentName: 'Weekly Growth Storm',
            triggerSource: 'SEQUENCE_GROWTH_STORM',
            executionTimeMs: dur01 + dur02 + dur03,
            status: 'SUCCESS',
            deliverablePath: bundleRelPath,
            deliverableTitle: 'Weekly Growth Storm Deliverable Bundle',
            deliverableSummary: `Weekly Growth Storm completed for ${client.name}`,
            metadata: { sequence: 'growth-storm', sequenceId, clientSlug, steps: stepResults }
          });
          loggedEvents.push(summaryEvent);

          this.broadcastSSE('sequence_complete', {
            sequenceId,
            clientSlug,
            status: 'SUCCESS',
            stepCount: 3,
            timestamp: new Date().toISOString()
          });

          this._sendJson(res, 200, {
            success: true,
            sequenceId,
            client,
            steps: stepResults,
            stepResults,
            bundlePath: bundleRelPath,
            loggedEvents
          });
          return;
        }

        this._sendJson(res, 400, { success: false, error: `Unknown sequenceId "${sequenceId}". Supported: "pitch-to-close", "growth-storm".` });
        return;
      }

      // 5. Query Audit Logs
      if (method === 'GET' && pathname === '/api/fleet/logs') {
        const query = {
          limit: parsedUrl.searchParams.get('limit') ? parseInt(parsedUrl.searchParams.get('limit'), 10) : 50,
          offset: parsedUrl.searchParams.get('offset') ? parseInt(parsedUrl.searchParams.get('offset'), 10) : 0,
          divisionId: parsedUrl.searchParams.get('divisionId') || parsedUrl.searchParams.get('division'),
          agentId: parsedUrl.searchParams.get('agentId') || parsedUrl.searchParams.get('agent'),
          status: parsedUrl.searchParams.get('status'),
          triggerSource: parsedUrl.searchParams.get('triggerSource') || parsedUrl.searchParams.get('trigger'),
          search: parsedUrl.searchParams.get('search'),
          startDate: parsedUrl.searchParams.get('startDate'),
          endDate: parsedUrl.searchParams.get('endDate')
        };

        const exportFormat = parsedUrl.searchParams.get('export');
        const results = this.auditLogger.getEvents(query);

        if (exportFormat === 'csv') {
          const csv = this.auditLogger.exportAsCsv(results.events);
          res.writeHead(200, {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="fleet_activity_log.csv"',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(csv);
          return;
        }

        if (exportFormat === 'json') {
          const jsonStr = this.auditLogger.exportAsJson(results.events);
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Disposition': 'attachment; filename="fleet_activity_log.json"',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(jsonStr);
          return;
        }

        this._sendJson(res, 200, {
          success: true,
          ...results
        });
        return;
      }

      // 6. Deliverables Explorer
      if (method === 'GET' && pathname === '/api/fleet/deliverables') {
        const targetFile = parsedUrl.searchParams.get('file');

        if (targetFile) {
          // Path traversal prevention: enforce strictly within .ai/memory
          const resolvedPath = path.resolve(this.memoryDir, targetFile);
          if (!resolvedPath.startsWith(path.resolve(this.memoryDir))) {
            this._sendJson(res, 403, { success: false, error: 'Access denied: Path traversal detected.' });
            return;
          }

          if (!fs.existsSync(resolvedPath)) {
            this._sendJson(res, 404, { success: false, error: `File not found: ${targetFile}` });
            return;
          }

          const stats = fs.statSync(resolvedPath);
          if (stats.isDirectory()) {
            this._sendJson(res, 400, { success: false, error: 'Target path is a directory.' });
            return;
          }

          const content = fs.readFileSync(resolvedPath, 'utf8');
          const ext = path.extname(resolvedPath).toLowerCase();
          const mimeType = ext === '.json' ? 'application/json' : (ext === '.md' ? 'text/markdown' : 'text/plain');

          this._sendJson(res, 200, {
            success: true,
            fileName: path.basename(resolvedPath),
            relativePath: path.relative(rootDir, resolvedPath).replace(/\\/g, '/'),
            sizeBytes: stats.size,
            modifiedAt: stats.mtime.toISOString(),
            mimeType,
            content
          });
          return;
        }

        // List deliverables recursively
        const discoverFiles = (dir, relPrefix = '') => {
          let list = [];
          if (!fs.existsSync(dir)) return list;
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            const full = path.join(dir, entry.name);
            const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
            if (entry.isDirectory()) {
              list = list.concat(discoverFiles(full, rel));
            } else if (entry.isFile()) {
              const stats = fs.statSync(full);
              list.push({
                name: entry.name,
                relativePath: rel,
                sizeBytes: stats.size,
                modifiedAt: stats.mtime.toISOString(),
                isJson: entry.name.endsWith('.json'),
                isMarkdown: entry.name.endsWith('.md')
              });
            }
          }
          return list;
        };

        const files = discoverFiles(this.memoryDir);
        files.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

        this._sendJson(res, 200, {
          success: true,
          totalFiles: files.length,
          files
        });
        return;
      }

      // 6.5. Plain-English User Guide Endpoint
      if (method === 'GET' && (pathname === '/api/guide' || pathname === '/api/fleet/guide')) {
        const guidePath = path.join(rootDir, 'docs/USER_GUIDE.md');
        if (!fs.existsSync(guidePath)) {
          this._sendJson(res, 404, { success: false, error: 'User guide file not found in docs/USER_GUIDE.md' });
          return;
        }
        const guideContent = fs.readFileSync(guidePath, 'utf8');
        this._sendJson(res, 200, {
          success: true,
          title: 'LumiLore Agency Mission Control — User Guide & Playbook',
          fileName: 'USER_GUIDE.md',
          content: guideContent
        });
        return;
      }

      // 7. Inbound Lead Trigger Bridge (Website & Telephony)
      if (method === 'POST' && (pathname === '/api/intake' || pathname === '/api/telephony/notify')) {
        const rawBody = await this._readBody(req);
        let leadData = {};
        try {
          leadData = JSON.parse(rawBody || '{}');
        } catch {
          this._sendJson(res, 400, { success: false, error: 'Malformed JSON lead payload' });
          return;
        }

        const isVoice = pathname === '/api/telephony/notify' || leadData.source === 'VOICE' || !!leadData.callerPhone;
        const triggerSource = isVoice ? 'INBOUND_TELEPHONY' : 'INBOUND_INTAKE';
        const intakeId = leadData.intakeId || `LUMI-${isVoice ? 'VOICE' : 'INTAKE'}-${Date.now().toString().slice(-6)}`;

        const leadNotification = {
          intakeId,
          triggerSource,
          timestamp: new Date().toISOString(),
          companyName: leadData.companyName || leadData.company || 'Prospective Client',
          contactName: leadData.contactName || leadData.name || leadData.callerName || 'Inbound Lead',
          phone: leadData.phone || leadData.callerPhone || null,
          email: leadData.email || null,
          targetUrl: leadData.targetUrl || leadData.url || leadData.website || null,
          notes: leadData.notes || leadData.transcript || leadData.message || null,
          lens: leadData.lens || 'corporate',
          suggestedAgents: ['agent-06-website-inspector-pm', 'agent-07-sow-closer']
        };

        // Persist audit record
        const auditEntry = this.auditLogger.logEvent({
          divisionId: 'division-2-sales',
          divisionNumber: 2,
          agentId: 'agent-06-website-inspector-pm',
          agentNumber: 6,
          agentName: '360° Full-Spectrum Website Inspector & Marketing PM',
          triggerSource,
          executionTimeMs: 0,
          status: 'SUCCESS',
          provider: 'inbound_bridge',
          model: 'bridge-v1',
          tokenEfficiency: { promptTokensSaved: 0, systemTokensSaved: 0, totalTokensSaved: 0, ratioSaved: '0%' },
          deliverablePath: null,
          deliverableTitle: `Inbound Notification: ${leadNotification.companyName}`,
          deliverableSummary: `Received lead via ${triggerSource}: ${leadNotification.contactName} (${leadNotification.companyName})`,
          verificationPassed: true,
          metadata: leadNotification
        });

        // Broadcast alert across SSE
        this.broadcastSSE('inbound_lead', {
          lead: leadNotification,
          auditEvent: auditEntry
        });

        this._sendJson(res, 200, {
          success: true,
          intakeId,
          triggerSource,
          suggestedAgents: leadNotification.suggestedAgents,
          message: 'Inbound lead received and broadcast to Mission Control.'
        });
        return;
      }

      // Unmatched Route: 404
      this._sendJson(res, 404, {
        success: false,
        error: 'NOT_FOUND',
        message: `Endpoint ${method} ${pathname} does not exist on Mission Control Web Engine.`
      });

    } catch (err) {
      console.error('[MissionControl Server Error]', err);
      this._sendJson(res, 500, {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: err.message
      });
    }
  }

  /**
   * Start the server with automatic port discovery
   * @param {number} [startPort] 
   * @param {number} [maxAttempts=10] 
   * @returns {Promise<{ server: http.Server, port: number }>}
   */
  start(startPort = this.preferredPort, maxAttempts = 10) {
    return new Promise((resolve, reject) => {
      let currentPort = startPort;
      let attempts = 0;

      const tryListen = () => {
        const srv = http.createServer((req, res) => this.handleRequest(req, res));

        srv.once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            attempts++;
            if (attempts < maxAttempts) {
              currentPort++;
              tryListen();
            } else {
              reject(new Error(`Mission Control could not bind to a port after ${maxAttempts} attempts starting at ${startPort}.`));
            }
          } else {
            reject(err);
          }
        });

        srv.listen(currentPort, this.host, () => {
          this.server = srv;
          this.activePort = currentPort;

          console.log('\n================================================================');
          console.log('⚡ LUMILORE TECHNOLOGIES // MISSION CONTROL LOCAL WEB ENGINE');
          console.log(`📡 URL: http://${this.host}:${this.activePort}`);
          console.log(`⏱️  Timestamp: ${new Date().toISOString()}`);
          console.log('⚡ Conductor Fleet: 6 Divisions, 19 Operatives Ready');
          console.log('================================================================\n');

          resolve({ server: srv, port: currentPort });
        });
      };

      tryListen();
    });
  }

  /**
   * Graceful server shutdown
   */
  async stop() {
    // Terminate all SSE client streams
    for (const client of this.sseClients) {
      try {
        client.end();
      } catch {}
    }
    this.sseClients.clear();

    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          this.server = null;
          this.activePort = null;
          resolve();
        });
      });
    }
  }
}

// Direct CLI boot
if (process.argv[1] && process.argv[1].endsWith('server.mjs')) {
  const mc = new MissionControlServer();
  mc.start().catch(err => {
    console.error('✕ Failed to start Mission Control server:', err);
    process.exit(1);
  });

  // Graceful shutdown listeners
  const shutdown = async () => {
    console.log('\nStopping Mission Control Web Engine gracefully...');
    await mc.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

