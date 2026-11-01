/**
 * Fleet Activity Audit Logger
 * Sprint 35: Agency Mission Control GUI & Fleet Activity Audit Log
 * 
 * Provides an append-only, thread-safe, structured JSONL audit trail
 * tracking all 19-agent fleet executions across CLI, Cron, GUI, and Inbound Webhooks.
 * Destination: .ai/memory/fleet_activity_log.jsonl
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultRootDir = path.resolve(__dirname, '../../..');

export class FleetAuditLogger {
  /**
   * @param {Object} [options]
   * @param {string} [options.rootDir]
   * @param {string} [options.memoryDir]
   * @param {string} [options.logFileName]
   */
  constructor(options = {}) {
    this.rootDir = options.rootDir || defaultRootDir;
    this.memoryDir = options.memoryDir || path.join(this.rootDir, '.ai/memory');
    this.logFilePath = path.join(this.memoryDir, options.logFileName || 'fleet_activity_log.jsonl');
    this._ensureStorage();
  }

  /**
   * Ensure memory directory and log file exist
   * @private
   */
  _ensureStorage() {
    if (!fs.existsSync(this.memoryDir)) {
      fs.mkdirSync(this.memoryDir, { recursive: true });
    }
    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, '', 'utf8');
    }
  }

  /**
   * Record a structured audit event into fleet_activity_log.jsonl
   * @param {Object} data 
   * @returns {Object} Full recorded event object
   */
  logEvent(data = {}) {
    const now = new Date();
    const eventId = data.eventId || `evt_${now.getTime()}_${crypto.randomBytes(3).toString('hex')}`;
    
    const divNum = typeof data.divisionNumber === 'number' 
      ? data.divisionNumber 
      : (data.divisionId ? parseInt(String(data.divisionId).match(/division-(\d+)/)?.[1] || '0', 10) || null : null);

    const event = {
      eventId,
      timestamp: data.timestamp || now.toISOString(),
      divisionId: data.divisionId || 'core',
      divisionNumber: divNum,
      agentId: data.agentId || 'agent-system',
      agentNumber: typeof data.agentNumber === 'number' ? data.agentNumber : null,
      agentName: data.agentName || 'Autonomous Operative',
      triggerSource: data.triggerSource || 'CLI', // CLI, CRON, GUI, INBOUND_INTAKE, INBOUND_TELEPHONY, SIMULATION
      executionTimeMs: typeof data.executionTimeMs === 'number' ? data.executionTimeMs : 0,
      status: (data.status || 'SUCCESS').toUpperCase(), // SUCCESS, ERROR, RUNNING
      provider: data.provider || 'offline_resilience',
      model: data.model || 'resilience-deterministic-v1',
      tokenEfficiency: data.tokenEfficiency || {
        promptTokensSaved: 0,
        systemTokensSaved: 0,
        totalTokensSaved: 0,
        ratioSaved: '0%'
      },
      deliverablePath: data.deliverablePath || null,
      deliverableTitle: data.deliverableTitle || null,
      deliverableSummary: data.deliverableSummary || null,
      verificationPassed: data.verificationPassed !== undefined ? !!data.verificationPassed : true,
      metadata: data.metadata || {}
    };

    const line = JSON.stringify(event) + '\n';

    try {
      this._ensureStorage();
      fs.appendFileSync(this.logFilePath, line, 'utf8');
    } catch (err) {
      console.error('[FleetAuditLogger Error] Failed to write event to disk:', err.message);
    }

    return event;
  }

  /**
   * Retrieve and filter events from the persistent JSONL audit trail
   * @param {Object} [query]
   * @param {number} [query.limit=50]
   * @param {number} [query.offset=0]
   * @param {string} [query.divisionId]
   * @param {string} [query.agentId]
   * @param {string} [query.status]
   * @param {string} [query.triggerSource]
   * @param {string} [query.search]
   * @param {string} [query.startDate]
   * @param {string} [query.endDate]
   * @returns {{ events: Array<Object>, totalCount: number, filteredCount: number }}
   */
  getEvents(query = {}) {
    this._ensureStorage();

    if (!fs.existsSync(this.logFilePath)) {
      return { events: [], totalCount: 0, filteredCount: 0 };
    }

    const rawContent = fs.readFileSync(this.logFilePath, 'utf8');
    const lines = rawContent.split('\n').filter(line => line.trim().length > 0);

    const allEvents = [];
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        allEvents.push(parsed);
      } catch {
        // Skip malformed lines safely
      }
    }

    // Sort newest first
    allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    let filtered = allEvents;

    if (query.divisionId) {
      const divMatch = String(query.divisionId).toLowerCase();
      filtered = filtered.filter(e => 
        (e.divisionId && e.divisionId.toLowerCase().includes(divMatch)) ||
        (e.divisionNumber !== null && String(e.divisionNumber) === divMatch)
      );
    }

    if (query.agentId) {
      const agentMatch = String(query.agentId).toLowerCase();
      filtered = filtered.filter(e => 
        (e.agentId && e.agentId.toLowerCase().includes(agentMatch)) ||
        (e.agentNumber !== null && String(e.agentNumber) === agentMatch)
      );
    }

    if (query.status) {
      const statusMatch = String(query.status).toUpperCase();
      if (statusMatch !== 'ALL') {
        filtered = filtered.filter(e => e.status === statusMatch);
      }
    }

    if (query.triggerSource) {
      const trigMatch = String(query.triggerSource).toUpperCase();
      if (trigMatch !== 'ALL') {
        filtered = filtered.filter(e => e.triggerSource === trigMatch);
      }
    }

    if (query.startDate) {
      const startMs = new Date(query.startDate).getTime();
      filtered = filtered.filter(e => new Date(e.timestamp).getTime() >= startMs);
    }

    if (query.endDate) {
      const endMs = new Date(query.endDate).getTime();
      filtered = filtered.filter(e => new Date(e.timestamp).getTime() <= endMs);
    }

    if (query.search) {
      const s = String(query.search).toLowerCase();
      filtered = filtered.filter(e => {
        const haystack = [
          e.agentName,
          e.agentId,
          e.divisionId,
          e.deliverableTitle,
          e.deliverableSummary,
          e.deliverablePath,
          e.triggerSource,
          JSON.stringify(e.metadata)
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(s);
      });
    }

    const filteredCount = filtered.length;
    const offset = parseInt(query.offset, 10) || 0;
    const limit = query.limit !== undefined ? parseInt(query.limit, 10) : 50;

    const pagedEvents = limit > 0 ? filtered.slice(offset, offset + limit) : filtered.slice(offset);

    return {
      events: pagedEvents,
      totalCount: allEvents.length,
      filteredCount
    };
  }

  /**
   * Export given events array to standard RFC 4180 CSV
   * @param {Array<Object>} events 
   * @returns {string} CSV string
   */
  exportAsCsv(events = []) {
    const headers = [
      'Event ID',
      'Timestamp',
      'Trigger Source',
      'Division',
      'Agent #',
      'Agent ID',
      'Agent Name',
      'Status',
      'Latency (ms)',
      'Provider',
      'Model',
      'Tokens Saved',
      'Deliverable Path',
      'Summary'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = [headers.join(',')];

    for (const e of events) {
      const tokensSaved = e.tokenEfficiency?.totalTokensSaved || 0;
      rows.push([
        escapeCsv(e.eventId),
        escapeCsv(e.timestamp),
        escapeCsv(e.triggerSource),
        escapeCsv(e.divisionId),
        escapeCsv(e.agentNumber),
        escapeCsv(e.agentId),
        escapeCsv(e.agentName),
        escapeCsv(e.status),
        escapeCsv(e.executionTimeMs),
        escapeCsv(e.provider),
        escapeCsv(e.model),
        escapeCsv(tokensSaved),
        escapeCsv(e.deliverablePath),
        escapeCsv(e.deliverableSummary || e.deliverableTitle || '')
      ].join(','));
    }

    return rows.join('\n');
  }

  /**
   * Export given events array to formatted JSON
   * @param {Array<Object>} events 
   * @returns {string} JSON string
   */
  exportAsJson(events = []) {
    return JSON.stringify(events, null, 2);
  }

  /**
   * Calculate high-level KPIs and metrics summary across all recorded events
   * @returns {Object}
   */
  getMetricsSummary() {
    const { events } = this.getEvents({ limit: 0 });
    const total = events.length;

    let successful = 0;
    let errors = 0;
    let totalLatency = 0;
    let totalTokensSaved = 0;
    const divisionCounts = {};
    const triggerCounts = {};

    for (const e of events) {
      if (e.status === 'SUCCESS') successful++;
      if (e.status === 'ERROR') errors++;
      totalLatency += (e.executionTimeMs || 0);
      totalTokensSaved += (e.tokenEfficiency?.totalTokensSaved || 0);

      const div = e.divisionId || 'unassigned';
      divisionCounts[div] = (divisionCounts[div] || 0) + 1;

      const trig = e.triggerSource || 'CLI';
      triggerCounts[trig] = (triggerCounts[trig] || 0) + 1;
    }

    const successRatePercent = total > 0 ? ((successful / total) * 100).toFixed(1) : '100.0';
    const avgLatencyMs = total > 0 ? Math.round(totalLatency / total) : 0;

    return {
      totalEvents: total,
      successfulRuns: successful,
      errorRuns: errors,
      successRatePercent: parseFloat(successRatePercent),
      avgLatencyMs,
      totalTokensSaved,
      divisionCounts,
      triggerCounts,
      lastEventTimestamp: events[0]?.timestamp || null
    };
  }
}

// Global singleton instance for common fleet imports
export const defaultAuditLogger = new FleetAuditLogger();
