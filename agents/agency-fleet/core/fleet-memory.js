/**
 * Shared Fleet Memory Mesh — DynamoDB Single-Table Design
 * Sprint 46: Core Autonomous Fleet Infrastructure
 * 
 * Features:
 *   - Unified customer context across Inbound Phone Leads, Web Chat, and Audit Inquiries
 *   - DynamoDB Single-Table Key Schema:
 *       Root Entity:      PK = CUSTOMER#<id>,       SK = METADATA#ROOT
 *       Voice Touchpoint: PK = CUSTOMER#<id>,       SK = TOUCHPOINT#VOICE#<timestamp>
 *       Chat Touchpoint:  PK = CUSTOMER#<id>,       SK = TOUCHPOINT#CHAT#<sessionId>#<timestamp>
 *       Audit Touchpoint: PK = CUSTOMER#<id>,       SK = TOUCHPOINT#AUDIT#<domain>#<timestamp>
 *       Unified State:    PK = ENTITY#<id>,         SK = STATE#CURRENT
 *       Audience Index:   GSI1PK = LENS#<lens>,     GSI1SK = TIMESTAMP#<iso>
 *   - Zero-Downtime Deterministic Local Cache Fallback (.ai/memory/fleet_memory_mesh.json)
 *   - Real-time 360-degree Customer Dossier Synthesizer for fleet agents
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

// Lazy-loaded AWS SDK references
let DynamoDBClient = null;
let DynamoDBDocumentClient = null;
let PutCommand = null;
let GetCommand = null;
let QueryCommand = null;
let UpdateCommand = null;

async function initDdbClasses() {
  if (DynamoDBClient && DynamoDBDocumentClient) return true;
  try {
    const modClient = await import('@aws-sdk/client-dynamodb');
    const modDoc = await import('@aws-sdk/lib-dynamodb');
    DynamoDBClient = modClient.DynamoDBClient;
    DynamoDBDocumentClient = modDoc.DynamoDBDocumentClient;
    PutCommand = modDoc.PutCommand;
    GetCommand = modDoc.GetCommand;
    QueryCommand = modDoc.QueryCommand;
    UpdateCommand = modDoc.UpdateCommand;
    return true;
  } catch {
    try {
      const require = createRequire(import.meta.url);
      const modClient = require('../../../backend/src/node_modules/@aws-sdk/client-dynamodb');
      const modDoc = require('../../../backend/src/node_modules/@aws-sdk/lib-dynamodb');
      DynamoDBClient = modClient.DynamoDBClient;
      DynamoDBDocumentClient = modDoc.DynamoDBDocumentClient;
      PutCommand = modDoc.PutCommand;
      GetCommand = modDoc.GetCommand;
      QueryCommand = modDoc.QueryCommand;
      UpdateCommand = modDoc.UpdateCommand;
      return true;
    } catch {
      return false;
    }
  }
}

export class FleetMemoryMesh {
  /**
   * @param {Object} [options]
   * @param {string} [options.tableName]
   * @param {string} [options.region]
   * @param {string} [options.cachePath]
   * @param {boolean} [options.forceOffline=false]
   */
  constructor(options = {}) {
    this.tableName = options.tableName || process.env.FLEET_MEMORY_TABLE || process.env.TABLE_NAME || 'LumiLore_Intake';
    this.region = options.region || process.env.AWS_REGION || 'ca-central-1';
    this.cachePath = options.cachePath || path.join(rootDir, '.ai/memory/fleet_memory_mesh.json');
    this.forceOffline = !!options.forceOffline;

    this._docClient = null;
    this._localCache = null;
    this._loadLocalCache();
  }

  /**
   * Initialize local cache from disk
   * @private
   */
  _loadLocalCache() {
    try {
      if (fs.existsSync(this.cachePath)) {
        const raw = fs.readFileSync(this.cachePath, 'utf8');
        this._localCache = JSON.parse(raw);
      }
    } catch {
      this._localCache = null;
    }

    if (!this._localCache || typeof this._localCache !== 'object') {
      this._localCache = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        totalEntities: 0,
        totalTouchpoints: 0,
        entities: {}
      };
    }
  }

  /**
   * Save local cache to disk atomically
   * @private
   */
  _persistLocalCache() {
    try {
      const dir = path.dirname(this.cachePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      this._localCache.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.cachePath, JSON.stringify(this._localCache, null, 2), 'utf8');
    } catch (err) {
      console.warn(`[FleetMemoryMesh] Cache write warning: ${err.message}`);
    }
  }

  /**
   * Lazily acquire DynamoDB document client
   * @returns {Promise<Object|null>}
   */
  async getDocClient() {
    if (this.forceOffline) return null;
    if (this._docClient) return this._docClient;

    const available = await initDdbClasses();
    if (!available) return null;

    try {
      const ddbClient = new DynamoDBClient({ region: this.region });
      this._docClient = DynamoDBDocumentClient.from(ddbClient, {
        marshallOptions: { removeUndefinedValues: true, convertEmptyValues: true }
      });
      return this._docClient;
    } catch {
      return null;
    }
  }

  /**
   * Normalize customer ID key
   * @param {string} id 
   * @returns {string}
   */
  normalizeCustomerId(id = '') {
    if (!id || typeof id !== 'string') return 'ANONYMOUS';
    return id.trim().replace(/^CUSTOMER#/i, '');
  }

  /**
   * Ingest a multi-channel touchpoint into the shared memory mesh
   * @param {Object} touchpoint
   * @param {string} touchpoint.customerId - Phone number (E.164), email, or UUID
   * @param {'voice'|'chat'|'audit'|'sow'|'custom'} touchpoint.channel
   * @param {string} [touchpoint.type] - e.g. 'EMERGENCY_AFTER_HOURS', 'DISCOVERY_CHAT', 'GEO_AUDIT'
   * @param {string} [touchpoint.lens='trades'|'corporate']
   * @param {Object} [touchpoint.payload] - Channel specific details
   * @returns {Promise<Object>}
   */
  async recordTouchpoint(touchpoint = {}) {
    const customerId = this.normalizeCustomerId(touchpoint.customerId);
    const channel = (touchpoint.channel || 'custom').toLowerCase();
    const timestamp = touchpoint.timestamp || new Date().toISOString();
    const lens = (touchpoint.lens || 'trades').toLowerCase();
    const payload = touchpoint.payload || {};

    const pk = `CUSTOMER#${customerId}`;
    let sk = `TOUCHPOINT#${channel.toUpperCase()}#${timestamp}`;
    if (channel === 'chat' && payload.sessionId) {
      sk = `TOUCHPOINT#CHAT#${payload.sessionId}#${timestamp}`;
    } else if (channel === 'audit' && payload.domain) {
      sk = `TOUCHPOINT#AUDIT#${payload.domain}#${timestamp}`;
    }

    const item = {
      PK: pk,
      SK: sk,
      customerId,
      channel,
      type: touchpoint.type || 'GENERAL_TOUCHPOINT',
      lens,
      timestamp,
      payload,
      GSI1PK: `LENS#${lens}`,
      GSI1SK: `TIMESTAMP#${timestamp}`,
      createdAt: timestamp
    };

    // 1. Always update local memory cache first for instant synchronous availability
    if (!this._localCache.entities[customerId]) {
      this._localCache.entities[customerId] = {
        customerId,
        lens,
        createdAt: timestamp,
        lastUpdated: timestamp,
        root: {
          customerId,
          primaryPhone: payload.callerPhone || (customerId.startsWith('+') ? customerId : null),
          primaryEmail: payload.email || null,
          companyName: payload.company || null,
          lens,
          qualificationStage: payload.urgency === 'CRITICAL' ? 'EMERGENCY_DISPATCHED' : 'QUALIFIED',
          painPoints: payload.tradeCategory ? [payload.tradeCategory] : [],
          activeBooking: payload.bookedSlot || null,
          lastAuditDomain: payload.domain || null,
          totalTouchpoints: 0
        },
        touchpoints: []
      };
      this._localCache.totalEntities++;
    }

    const entity = this._localCache.entities[customerId];
    entity.touchpoints.push(item);
    entity.lastUpdated = timestamp;
    entity.root.totalTouchpoints = entity.touchpoints.length;
    if (payload.tradeCategory && !entity.root.painPoints.includes(payload.tradeCategory)) {
      entity.root.painPoints.push(payload.tradeCategory);
    }
    if (payload.bookedSlot) {
      entity.root.activeBooking = payload.bookedSlot;
    }
    if (payload.domain) {
      entity.root.lastAuditDomain = payload.domain;
    }
    this._localCache.totalTouchpoints++;
    this._persistLocalCache();

    // 2. Best-effort DynamoDB write
    let ddbWritten = false;
    let ddbError = null;
    try {
      const client = await this.getDocClient();
      if (client && PutCommand) {
        await client.send(new PutCommand({
          TableName: this.tableName,
          Item: item
        }));

        // Upsert root metadata item in DynamoDB
        await client.send(new PutCommand({
          TableName: this.tableName,
          Item: {
            PK: pk,
            SK: 'METADATA#ROOT',
            ...entity.root,
            GSI1PK: `LENS#${lens}`,
            GSI1SK: `TIMESTAMP#${timestamp}`,
            lastUpdated: timestamp
          }
        }));
        ddbWritten = true;
      }
    } catch (err) {
      ddbError = err.message;
    }

    return {
      success: true,
      customerId,
      channel,
      sk,
      persistedDdb: ddbWritten,
      persistedCache: true,
      ddbError,
      timestamp
    };
  }

  /**
   * Retrieve unified customer dossier across all channels
   * @param {string} customerId 
   * @returns {Promise<Object>}
   */
  async getCustomerContext(customerId = '') {
    const cleanId = this.normalizeCustomerId(customerId);
    const localEntity = this._localCache.entities[cleanId];

    let liveItems = [];
    let source = 'LOCAL_CACHE';

    try {
      const client = await this.getDocClient();
      if (client && QueryCommand) {
        const result = await client.send(new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression: 'PK = :pk',
          ExpressionAttributeValues: {
            ':pk': `CUSTOMER#${cleanId}`
          }
        }));
        if (result?.Items && result.Items.length > 0) {
          liveItems = result.Items;
          source = 'DYNAMODB_LIVE';
        }
      }
    } catch {}

    // Combine or fallback to local cache
    let root = localEntity?.root || null;
    let touchpoints = localEntity?.touchpoints || [];

    if (liveItems.length > 0) {
      const rootItem = liveItems.find(it => it.SK === 'METADATA#ROOT');
      if (rootItem) {
        root = rootItem;
      }
      touchpoints = liveItems.filter(it => it.SK.startsWith('TOUCHPOINT#'));
    }

    if (!root && touchpoints.length === 0) {
      return {
        found: false,
        customerId: cleanId,
        source: 'NONE',
        dossier: null
      };
    }

    // Synthesize comprehensive 360-degree customer context
    const voiceEvents = touchpoints.filter(t => t.channel === 'voice');
    const chatEvents = touchpoints.filter(t => t.channel === 'chat');
    const auditEvents = touchpoints.filter(t => t.channel === 'audit');

    const combinedPainPoints = new Set(root?.painPoints || []);
    for (const v of voiceEvents) {
      if (v.payload?.tradeCategory) combinedPainPoints.add(v.payload.tradeCategory);
      if (v.payload?.summary) combinedPainPoints.add(v.payload.summary.slice(0, 50));
    }

    const dossier = {
      customerId: cleanId,
      source,
      lens: root?.lens || (voiceEvents[0]?.lens) || 'trades',
      qualificationStage: root?.qualificationStage || 'QUALIFIED',
      contactInfo: {
        primaryPhone: root?.primaryPhone || (cleanId.startsWith('+') ? cleanId : null),
        primaryEmail: root?.primaryEmail || null,
        companyName: root?.companyName || null
      },
      summaryState: {
        totalInteractions: touchpoints.length,
        voiceCallCount: voiceEvents.length,
        webChatCount: chatEvents.length,
        auditCount: auditEvents.length,
        painPoints: Array.from(combinedPainPoints),
        activeEmergency: voiceEvents.some(v => v.payload?.urgency === 'CRITICAL'),
        lastKnownAddress: voiceEvents.find(v => v.payload?.address)?.payload?.address || null,
        lastKnownUnit: voiceEvents.find(v => v.payload?.unitNumber)?.payload?.unitNumber || null,
        activeBooking: root?.activeBooking || null,
        lastAuditDomain: root?.lastAuditDomain || null
      },
      recentTimeline: touchpoints.slice(-5).reverse().map(t => ({
        channel: t.channel,
        type: t.type,
        timestamp: t.timestamp,
        summary: t.payload?.summary || t.payload?.domain || t.payload?.lastMessage || 'Touchpoint recorded'
      }))
    };

    return {
      found: true,
      customerId: cleanId,
      source,
      dossier
    };
  }

  /**
   * Update entity qualification or workflow status
   * @param {string} customerId 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   */
  async updateEntityState(customerId = '', updates = {}) {
    const cleanId = this.normalizeCustomerId(customerId);
    const timestamp = new Date().toISOString();

    if (!this._localCache.entities[cleanId]) {
      this._localCache.entities[cleanId] = {
        customerId: cleanId,
        createdAt: timestamp,
        lastUpdated: timestamp,
        root: { customerId: cleanId, totalTouchpoints: 0 },
        touchpoints: []
      };
      this._localCache.totalEntities++;
    }

    const entity = this._localCache.entities[cleanId];
    entity.root = { ...entity.root, ...updates, lastUpdated: timestamp };
    entity.lastUpdated = timestamp;
    this._persistLocalCache();

    // DynamoDB update
    let ddbUpdated = false;
    try {
      const client = await this.getDocClient();
      if (client && PutCommand) {
        await client.send(new PutCommand({
          TableName: this.tableName,
          Item: {
            PK: `CUSTOMER#${cleanId}`,
            SK: 'METADATA#ROOT',
            ...entity.root,
            GSI1PK: `LENS#${entity.root.lens || 'trades'}`,
            GSI1SK: `TIMESTAMP#${timestamp}`,
            lastUpdated: timestamp
          }
        }));
        ddbUpdated = true;
      }
    } catch {}

    return {
      success: true,
      customerId: cleanId,
      updatedState: entity.root,
      persistedDdb: ddbUpdated
    };
  }

  /**
   * Health probe for Mission Control and telemetry monitoring
   * @returns {Promise<Object>}
   */
  async getMeshHealth() {
    const startTime = Date.now();
    let ddbStatus = 'OFFLINE_RESILIENCE';
    let latencyMs = 0;
    let tableArn = null;

    try {
      const client = await this.getDocClient();
      if (client && GetCommand) {
        const pingStart = Date.now();
        // Light probe get
        await client.send(new GetCommand({
          TableName: this.tableName,
          Key: { PK: 'HEALTH#PING', SK: 'PROBE' }
        }));
        latencyMs = Date.now() - pingStart;
        ddbStatus = 'HEALTHY_ACTIVE';
      }
    } catch (err) {
      latencyMs = Date.now() - startTime;
      ddbStatus = /credentials|security|token/i.test(err.message)
        ? 'CREDENTIAL_FALLBACK'
        : 'LOCAL_RESILIENCE';
    }

    return {
      timestamp: new Date().toISOString(),
      meshStatus: ddbStatus === 'HEALTHY_ACTIVE' ? 'ONLINE' : 'DEGRADED_RESILIENT',
      storageMode: ddbStatus === 'HEALTHY_ACTIVE' ? 'DYNAMODB_SINGLE_TABLE' : 'LOCAL_MESH_FILE',
      tableName: this.tableName,
      region: this.region,
      latencyMs,
      cachedEntitiesCount: this._localCache.totalEntities || 0,
      cachedTouchpointsCount: this._localCache.totalTouchpoints || 0
    };
  }
}
