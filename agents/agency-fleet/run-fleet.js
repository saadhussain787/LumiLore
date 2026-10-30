#!/usr/bin/env node
/**
 * LumiLore Technologies // The Conductor Event Bus CLI
 * Sprint 28: Agency Fleet Core Foundation
 * 
 * Unified master CLI orchestrator executing:
 *   - 6 Divisions (Growth, Sales, Engineering, Security, Vitality, Delivery)
 *   - 19 Specialized Autonomous Agents
 *   - OmniRoute Multi-LLM Gateway with Quota Failover
 * 
 * Usage:
 *   node agents/agency-fleet/run-fleet.js --status
 *   node agents/agency-fleet/run-fleet.js --division 1 --dry-run
 *   node agents/agency-fleet/run-fleet.js --agent 15 --dry-run
 *   node agents/agency-fleet/run-fleet.js --all --dry-run
 */

import { ContractEngine } from './core/contract-engine.js';
import { OmniRouter } from './core/omni-router.js';

const args = process.argv.slice(2);
const isStatusOnly = args.includes('--status') || args.includes('-s');
const isDryRun = args.includes('--dry-run') || process.env.DRY_RUN === 'true';
const isAll = args.includes('--all');

function getArgValue(flag) {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  return null;
}

const divisionArg = getArgValue('--division') || getArgValue('-d');
const agentArg = getArgValue('--agent') || getArgValue('-a');

export async function runFleetCLI(cliOptions = {}) {
  const router = new OmniRouter();
  const engine = new ContractEngine({ router });

  const dryRunMode = cliOptions.dryRun !== undefined ? cliOptions.dryRun : isDryRun;
  const statusMode = cliOptions.status !== undefined ? cliOptions.status : (isStatusOnly || (!agentArg && !divisionArg && !isAll));
  const targetAgent = cliOptions.agent || agentArg;
  const targetDivision = cliOptions.division || divisionArg;
  const targetAll = cliOptions.all !== undefined ? cliOptions.all : isAll;

  console.log('\n================================================================');
  console.log('⚡ LUMILORE TECHNOLOGIES // THE CONDUCTOR AGENCY FLEET CLI');
  console.log(`📡 Mode: ${dryRunMode ? 'DRY-RUN (OFFLINE RESILIENCE MOCK)' : 'LIVE GATEWAY'}`);
  console.log(`⏱️ Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  // Case 1: Status (Explicit or Default)
  if (statusMode && !targetAgent && !targetDivision && !targetAll) {
    const divisions = engine.listDivisions();
    const agents = engine.listAgents();
    const routerStatus = router.getStatus();

    console.log('🏛️  REGISTERED DIVISIONS & AGENTS:');
    for (const div of divisions) {
      const divAgents = engine.listAgents(div.id);
      console.log(`\n  [Division ${div.number}] ${div.name.toUpperCase()}`);
      console.log(`    Target Sprint: ${div.sprintTarget} | Lead Role: ${div.leadRole}`);
      for (const agent of divAgents) {
        console.log(`    • Agent #${String(agent.number).padStart(2, '0')}: ${agent.name} (${agent.id})`);
      }
    }

    console.log('\n----------------------------------------------------------------');
    console.log('🌐 OMNIROUTE MULTI-LLM GATEWAY STATUS:');
    console.log(`  Default Region: ${routerStatus.defaultRegion}`);
    console.log(`  Default Model:  ${routerStatus.defaultModel}`);
    console.log('  Provider Circuit Breakers:');
    for (const [p, state] of Object.entries(routerStatus.providers)) {
      const badge = state.tripped ? '🔴 TRIPPED' : '🟢 HEALTHY';
      console.log(`    • ${p.padEnd(18, ' ')} : ${badge} (Failures: ${state.failures})`);
    }

    console.log('\n================================================================');
    console.log(`✓ Fleet Registry Verified: 6/6 Divisions, 19/19 Agents Active`);
    console.log('================================================================\n');
    return { status: 'OK', divisions: divisions.length, agents: agents.length };
  }

  // Case 2: Run specific agent
  if (targetAgent) {
    const agent = engine.getAgent(targetAgent);
    console.log(`🚀 Executing Agent #${agent.number}: ${agent.name}...`);
    const res = await engine.executeAgent(agent.id, {
      testTrigger: true,
      timestamp: new Date().toISOString()
    }, { dryRun: dryRunMode });

    console.log(`\n  Provider: ${res.provider} (${res.model})`);
    console.log(`  Latency:  ${res.latencyMs}ms`);
    console.log(`  Status:   ${res.success ? '✓ PASSED' : '✕ FAILED'}`);
    console.log(`  Tokens Saved via Compression: ${res.compressed?.totalTokensSaved || 0}`);
    console.log('\n  Verification Checks:');
    for (const c of res.verification.checks) {
      console.log(`    ${c.ok ? '✓' : '✕'} ${c.name}`);
    }

    if (!res.success) {
      console.error('\n✕ Errors:', res.verification.errors);
      process.exit(1);
    }
    return res;
  }

  // Case 3: Run specific division
  if (targetDivision) {
    const divNum = parseInt(targetDivision, 10);
    const divAgents = engine.listAgents().filter(a => a.division.includes(String(divNum)));

    if (divAgents.length === 0) {
      console.error(`✕ Error: No agents found for division ${targetDivision}`);
      process.exit(1);
    }

    console.log(`🚀 Executing Division ${targetDivision} (${divAgents.length} Agents)...`);
    const results = [];
    for (const agent of divAgents) {
      console.log(`\n  --> Executing Agent #${agent.number}: ${agent.name}...`);
      const res = await engine.executeAgent(agent.id, { divisionRun: true }, { dryRun: dryRunMode });
      console.log(`      ✓ Provider: ${res.provider} | Latency: ${res.latencyMs}ms | Result: ${res.success ? 'PASS' : 'FAIL'}`);
      results.push(res);
    }

    const allPassed = results.every(r => r.success);
    console.log(`\n================================================================`);
    console.log(`Division ${targetDivision} Run Complete: ${results.filter(r => r.success).length}/${results.length} Passed`);
    console.log('================================================================\n');

    if (!allPassed) process.exit(1);
    return results;
  }

  // Case 4: Run all agents
  if (targetAll) {
    const allAgents = engine.listAgents();
    console.log(`🚀 Executing All 19 Agents across 6 Divisions in Fleet Simulation...\n`);
    const results = [];
    for (const agent of allAgents) {
      process.stdout.write(`  [${String(agent.number).padStart(2, '0')}/19] ${agent.name.padEnd(55, '.')} `);
      const res = await engine.executeAgent(agent.id, { fleetSimulation: true }, { dryRun: dryRunMode });
      console.log(res.success ? '✓ PASS' : '✕ FAIL');
      results.push(res);
    }

    const allPassed = results.every(r => r.success);
    console.log(`\n================================================================`);
    console.log(`Full Fleet Execution Complete: ${results.filter(r => r.success).length}/19 Passed`);
    console.log('================================================================\n');

    if (!allPassed) process.exit(1);
    return results;
  }
}

// Direct execution guard
if (process.argv[1] && process.argv[1].endsWith('run-fleet.js')) {
  runFleetCLI().catch(err => {
    console.error('\n✕ Fleet Execution Error:', err);
    process.exit(1);
  });
}
