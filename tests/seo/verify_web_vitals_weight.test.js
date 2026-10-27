/**
 * Self-Verification Harness 1.2: Core Web Vitals Live Weight Calibration
 * Verifies PageSpeed API telemetry integration and 30/35/35 ranking score weights
 */

import assert from 'assert';
import { CitationRadar } from '../../agents/seo-geo-agent/citation-radar.js';

async function runTest() {
  console.log('🧪 [Self-Verification 1.2] Testing Core Web Vitals Telemetry & Ranking Weights...');
  const radar = new CitationRadar();

  // Test 1: Fetch Core Web Vitals
  const vitals = await radar.fetchCoreWebVitals({ url: 'https://lumilore.ca', strategy: 'mobile' });
  assert.ok(vitals.metrics, 'Vitals must contain metrics object');
  assert.ok(typeof vitals.metrics.largestContentfulPaintMs === 'number', 'LCP must be a number');
  assert.ok(typeof vitals.metrics.cumulativeLayoutShift === 'number', 'CLS must be a number');
  assert.ok(typeof vitals.metrics.timeToFirstByteMs === 'number', 'TTFB must be a number');
  assert.ok(vitals.performanceScore >= 90, 'Performance score must be >= 90');
  console.log(`  ✓ Core Web Vitals resolved: LCP=${vitals.metrics.largestContentfulPaintMs}ms, CLS=${vitals.metrics.cumulativeLayoutShift}, TTFB=${vitals.metrics.timeToFirstByteMs}ms, Score=${vitals.performanceScore}/100`);

  // Test 2: Multi-Pillar Score Normalization (30% Vitals, 35% SEO, 35% GEO)
  const scanReport = await radar.runRadarScan();
  assert.ok(scanReport.compositeRankingScore, 'Report must contain compositeRankingScore');
  assert.ok(scanReport.compositeRankingScore >= 95, 'Composite score must be >= 95');
  assert.strictEqual(scanReport.weightsPillars.coreWebVitalsWeight, '30%');
  assert.strictEqual(scanReport.weightsPillars.technicalSeoWeight, '35%');
  assert.strictEqual(scanReport.weightsPillars.geoCitationDensityWeight, '35%');
  console.log(`  ✓ Composite Ranking Score calibrated: ${scanReport.compositeRankingScore}/100 with exact 30/35/35 weights`);

  console.log('✅ [Self-Verification 1.2 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 1.2 FAILED]', err);
  process.exit(1);
});

