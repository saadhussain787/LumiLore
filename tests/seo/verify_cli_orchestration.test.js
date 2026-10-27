/**
 * Self-Verification Harness 5.1: Master CLI Orchestration with Cron Automation
 * Verifies runMasterPipeline dry-run execution, summary output, and artifact generation
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { runMasterPipeline } from '../../agents/seo-geo-agent/run.js';
import { CONFIG } from '../../agents/seo-geo-agent/config.js';

async function runTest() {
  console.log('🧪 [Self-Verification 5.1] Testing Master CLI Orchestration & Cron Runner...');

  const result = await runMasterPipeline({ dryRun: true, cron: true });

  // Test 1: Result structure
  assert.strictEqual(result.trigger, 'cron');
  assert.strictEqual(result.dryRun, true);
  assert.ok(result.radar, 'Summary must include radar');
  assert.ok(result.seeder, 'Summary must include seeder');
  assert.ok(result.indexer, 'Summary must include indexer');
  assert.ok(result.briefing, 'Summary must include briefing');
  console.log('  ✓ Verified 4-step autonomous pipeline execution in cron mode');

  // Test 2: Artifacts written to memory
  const cronLogPath = path.join(CONFIG.paths.memoryDir, 'latest_cron_run.json');
  assert.ok(fs.existsSync(cronLogPath), 'latest_cron_run.json must exist');
  const cronLog = JSON.parse(fs.readFileSync(cronLogPath, 'utf8'));
  assert.strictEqual(cronLog.trigger, 'cron');
  console.log('  ✓ Verified latest_cron_run.json persisted to .ai/memory/');

  const briefingHtmlPath = path.join(CONFIG.paths.memoryDir, 'latest_executive_briefing.html');
  assert.ok(fs.existsSync(briefingHtmlPath), 'latest_executive_briefing.html must exist');
  const briefContent = fs.readFileSync(briefingHtmlPath, 'utf8');
  assert.ok(briefContent.includes('LumiLore Executive Intelligence'), 'Briefing HTML must contain title');
  console.log('  ✓ Verified latest_executive_briefing.html persisted to .ai/memory/');

  console.log('✅ [Self-Verification 5.1 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 5.1 FAILED]', err);
  process.exit(1);
});

