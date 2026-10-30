/**
 * Master Agency Contract & Trigger Engine
 * Sprint 28: Agency Fleet Core Foundation
 * 
 * Synthesizes:
 *   - msitarzewski/agency-agents (Role, Identity, Mission, Boundaries, Deliverables, KPIs)
 *   - f/prompts.chat (Precision execution triggers & task inputs)
 *   - x1xhlol Devin/Manus (Verification loops & deterministic output validation)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OmniRouter } from './omni-router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ContractEngine {
  /**
   * @param {Object} [options]
   */
  constructor(options = {}) {
    this.options = options;
    this.registryPath = options.registryPath || path.resolve(__dirname, '../registry.json');
    this.router = options.router || new OmniRouter(options.routerOptions || {});
    this.registry = this.loadRegistry();
  }

  /**
   * Load and validate registry.json
   * @returns {Object}
   */
  loadRegistry() {
    if (!fs.existsSync(this.registryPath)) {
      throw new Error(`ContractEngine: Registry file not found at ${this.registryPath}`);
    }
    const raw = fs.readFileSync(this.registryPath, 'utf8');
    const data = JSON.parse(raw);
    
    if (!Array.isArray(data.divisions) || data.divisions.length !== 6) {
      throw new Error(`ContractEngine: Registry must contain exactly 6 divisions (found ${data.divisions?.length}).`);
    }

    if (!Array.isArray(data.agents) || data.agents.length !== 19) {
      throw new Error(`ContractEngine: Registry must contain exactly 19 agents (found ${data.agents?.length}).`);
    }

    return data;
  }

  /**
   * Get all registered divisions
   * @returns {Array}
   */
  listDivisions() {
    return this.registry.divisions;
  }

  /**
   * List agents, optionally filtered by division
   * @param {string} [divisionId] 
   * @returns {Array}
   */
  listAgents(divisionId = null) {
    if (!divisionId) {
      return this.registry.agents;
    }
    return this.registry.agents.filter(a => a.division === divisionId);
  }

  /**
   * Find agent by ID or number
   * @param {string|number} identifier 
   * @returns {Object}
   */
  getAgent(identifier) {
    if (typeof identifier === 'number' || /^\d+$/.test(identifier)) {
      const num = parseInt(identifier, 10);
      const agent = this.registry.agents.find(a => a.number === num);
      if (!agent) {
        throw new Error(`ContractEngine: Agent number ${num} not found.`);
      }
      return agent;
    }

    const agent = this.registry.agents.find(a => a.id === identifier);
    if (!agent) {
      throw new Error(`ContractEngine: Agent ID "${identifier}" not found.`);
    }
    return agent;
  }

  /**
   * Synthesize system prompt and execution trigger for an agent
   * Merges agency-agents role contract + prompts.chat trigger structure
   * @param {Object} agent 
   * @param {Object} [taskInput] 
   * @returns {{ systemPrompt: string, taskPrompt: string }}
   */
  buildPrompts(agent, taskInput = {}) {
    // 1. Build msitarzewski/agency-agents system prompt
    const systemPrompt = [
      `### OPERATIVE IDENTITY`,
      `Name: ${agent.name}`,
      `Role: ${agent.role}`,
      `Division: ${agent.division} (LumiLore Autonomous Fleet)`,
      ``,
      `### MISSION`,
      agent.mission,
      ``,
      `### STRICT OPERATIONAL BOUNDARIES`,
      ...agent.boundaries.map(b => `- ${b}`),
      ``,
      `### MANDATORY DELIVERABLES`,
      ...agent.deliverables.map(d => `- ${d}`),
      ``,
      `### SUCCESS KPIS`,
      ...agent.kpis.map(k => `- ${k}`),
      ``,
      `### EXECUTION DIRECTIVE (prompts.chat)`,
      agent.triggers.systemPrompt,
      ``,
      `You must formulate your output as structured JSON or rigorous Markdown conforming strictly to these boundaries and deliverables.`
    ].join('\n');

    // 2. Build task execution prompt
    const inputFormatted = Object.keys(taskInput).length > 0
      ? JSON.stringify(taskInput, null, 2)
      : '{"mode": "autonomous_sprint_evaluation", "scope": "default"}';

    const taskPrompt = [
      `Execute mission parameters for ${agent.name}.`,
      ``,
      `Task Input Parameters:`,
      inputFormatted,
      ``,
      `Formulate complete deliverables adhering to all boundaries and KPIs.`
    ].join('\n');

    return { systemPrompt, taskPrompt };
  }

  /**
   * Verification Loop (Devin/Manus Tool-Loop Pattern)
   * Validates generated deliverable payload against agent contract requirements
   * @param {Object} agent 
   * @param {string} rawOutput 
   * @returns {{ passed: boolean, checks: Array<{ name: string, ok: boolean }>, errors: string[] }}
   */
  verifyOutput(agent, rawOutput = '') {
    const checks = [];
    const errors = [];

    // Check 1: Non-empty response
    const hasContent = !!(rawOutput && rawOutput.trim().length > 20);
    checks.push({ name: 'Payload Non-Empty', ok: hasContent });
    if (!hasContent) errors.push('Output is empty or too short (<20 chars).');

    // Check 2: Deliverable mentions / grounding
    let deliverablesSatisfied = true;
    for (const deliverable of agent.deliverables.slice(0, 2)) {
      const keywords = deliverable.split(/\s+/).filter(w => w.length > 4);
      const mentioned = keywords.some(k => new RegExp(k, 'i').test(rawOutput));
      if (!mentioned) {
        deliverablesSatisfied = false;
        break;
      }
    }
    checks.push({ name: 'Deliverable Grounding', ok: deliverablesSatisfied });
    if (!deliverablesSatisfied) {
      errors.push('Output did not explicitly address required deliverables.');
    }

    // Check 3: JSON or Markdown structure
    let isValidStructure = false;
    try {
      JSON.parse(rawOutput);
      isValidStructure = true;
    } catch {
      // If not JSON, check for structured markdown headers
      isValidStructure = /#|###|\*\*|---|✓|\[/.test(rawOutput);
    }
    checks.push({ name: 'Structured Format (JSON/Markdown)', ok: isValidStructure });
    if (!isValidStructure) errors.push('Output is neither valid JSON nor structured markdown.');

    // Check 4: Zero generic AI platitudes
    const genericPhrases = [/in this fast-paced world/i, /delve into/i, /testament to/i, /game changer/i];
    const hasGeneric = genericPhrases.some(r => r.test(rawOutput));
    checks.push({ name: 'Zero Generic AI Platitudes', ok: !hasGeneric });
    if (hasGeneric) errors.push('Detected generic AI boilerplate phrases.');

    const passed = checks.every(c => c.ok);
    return { passed, checks, errors };
  }

  /**
   * Execute an agent through OmniRoute with verification loop
   * @param {string|number} identifier 
   * @param {Object} [taskInput] 
   * @param {Object} [options] 
   * @returns {Promise<Object>}
   */
  async executeAgent(identifier, taskInput = {}, options = {}) {
    const startTime = Date.now();
    const agent = this.getAgent(identifier);
    const { systemPrompt, taskPrompt } = this.buildPrompts(agent, taskInput);

    // Route through OmniRoute Multi-LLM Gateway
    const routeResult = await this.router.routePrompt({
      system: systemPrompt,
      prompt: taskPrompt,
      preferredProvider: options.preferredProvider || (options.dryRun ? 'offline_resilience' : undefined),
      contract: agent,
      temperature: options.temperature || 0.2,
      maxTokens: options.maxTokens || 1500
    });

    // Run Devin/Manus verification loop
    const verification = this.verifyOutput(agent, routeResult.reply);

    return {
      success: verification.passed,
      agent: {
        id: agent.id,
        number: agent.number,
        name: agent.name,
        role: agent.role,
        division: agent.division
      },
      provider: routeResult.provider,
      model: routeResult.model,
      output: routeResult.reply,
      verification,
      compressed: routeResult.compressed,
      latencyMs: Date.now() - startTime
    };
  }
}

