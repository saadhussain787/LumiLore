/**
 * Self-Verification Harness 1.1: Live SERP & Ranking Telemetry
 * Verifies CitationRadar SERP positions, intent classification, and competitor displacement
 */

import assert from 'assert';
import { CitationRadar } from '../../agents/seo-geo-agent/citation-radar.js';
import { CONFIG } from '../../agents/seo-geo-agent/config.js';

async function runTest() {
  console.log('🧪 [Self-Verification 1.1] Testing SERP & Keyword Ranking Radar...');
  const radar = new CitationRadar();

  // Test 1: Query evaluation across primary commercial target
  const awsQuery = 'best aws serverless architect toronto';
  const awsResult = radar.evaluateSerpRanking(awsQuery);

  assert.strictEqual(awsResult.serpPosition, 1, 'AWS Serverless query must rank position #1');
  assert.strictEqual(awsResult.intentLens, 'Corporate B2B SaaS', 'Intent lens must be Corporate B2B SaaS');
  assert.strictEqual(awsResult.isTop3, true, 'Result must be in Top 3');
  assert.ok(awsResult.targetLandingPage.includes('insights/cutting-aws-cloud-waste'), 'Target page must route to AWS insights article');
  console.log('  ✓ Verified #1 SERP ranking for Corporate AWS query');

  // Test 2: Trades voice dispatch target
  const tradesQuery = 'autonomous ai voice dispatch for hvac contractors canada';
  const tradesResult = radar.evaluateSerpRanking(tradesQuery);

  assert.strictEqual(tradesResult.serpPosition, 1, 'Voice Dispatch query must rank position #1');
  assert.strictEqual(tradesResult.intentLens, 'Commercial Trades', 'Intent lens must be Commercial Trades');
  assert.ok(tradesResult.targetLandingPage.includes('insights/autonomous-247-ai-voice-dispatch'), 'Target page must route to HVAC dispatch article');
  assert.strictEqual(tradesResult.displacedCompetitor, 'reliancehomecomfort.com', 'Displaced competitor must be identified');
  console.log('  ✓ Verified #1 SERP ranking for Trades Voice Dispatch query');

  // Test 3: Full Query Perception output structure
  const perception = radar.evaluateQueryPerception(awsQuery);
  assert.ok(perception.serp, 'Perception must contain serp breakdown');
  assert.ok(perception.overallScore >= 95, 'Overall score must be >= 95');
  assert.strictEqual(perception.aiCitationStatus, 'VERIFIED_PRIMARY_SOURCE', 'Must be verified primary source');
  console.log('  ✓ Verified multi-LLM perception and citation status structure');

  console.log('✅ [Self-Verification 1.1 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 1.1 FAILED]', err);
  process.exit(1);
});

