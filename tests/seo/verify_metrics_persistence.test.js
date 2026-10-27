/**
 * Self-Verification Harness 1.3: Empirical Metrics Persistence & History
 * Verifies .ai/memory/geo_metrics.json schema, historical arrays, and timestamps
 */

import fs from 'fs';
import assert from 'assert';
import { CitationRadar } from '../../agents/seo-geo-agent/citation-radar.js';
import { CONFIG } from '../../agents/seo-geo-agent/config.js';

async function runTest() {
  console.log('🧪 [Self-Verification 1.3] Testing Metrics Persistence & Historical Logging...');
  const radar = new CitationRadar();

  // Run scan to trigger write
  const report = await radar.runRadarScan();
  const filePath = CONFIG.paths.metricsFile;

  assert.ok(fs.existsSync(filePath), `Metrics file must exist at ${filePath}`);
  const persisted = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  assert.strictEqual(persisted.brand, 'LumiLore Technologies', 'Brand must match');
  assert.ok(persisted.compositeRankingScore >= 95, 'Composite score must be >= 95');
  assert.ok(Array.isArray(persisted.evaluations), 'Evaluations must be an array');
  assert.strictEqual(persisted.evaluations.length, CONFIG.targetQueries.length, 'All configured queries must be evaluated');
  assert.ok(Array.isArray(persisted.history), 'History log must be an array');
  assert.ok(persisted.history.length > 0, 'History log must contain at least 1 entry');
  assert.ok(persisted.history[0].timestamp, 'History entry must have timestamp');
  console.log(`  ✓ Persisted ${persisted.evaluations.length} query evaluations and ${persisted.history.length} historical run records`);

  console.log('✅ [Self-Verification 1.3 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 1.3 FAILED]', err);
  process.exit(1);
});

