/**
 * Self-Verification Harness 3.1: 10-Keyword Blanket Pipeline
 * Verifies high-intent commercial keyword catalog, dual-lens distribution, and conversion CTAs
 */

import assert from 'assert';
import { KEYWORD_PIPELINE } from '../../agents/seo-geo-agent/content-engine.js';

async function runTest() {
  console.log('🧪 [Self-Verification 3.1] Testing 10-Keyword Long-Tail Blanket Pipeline...');

  // Test 1: Exactly 10 commercial keywords
  assert.strictEqual(KEYWORD_PIPELINE.length, 10, 'Keyword pipeline must contain exactly 10 keywords');
  console.log(`  ✓ Verified pipeline length: ${KEYWORD_PIPELINE.length} target long-tail keywords`);

  // Test 2: Dual-lens balance
  const corporateKeywords = KEYWORD_PIPELINE.filter(k => k.lens === 'corporate');
  const tradesKeywords = KEYWORD_PIPELINE.filter(k => k.lens === 'trades');
  assert.ok(corporateKeywords.length >= 4, 'Must have at least 4 corporate keywords');
  assert.ok(tradesKeywords.length >= 4, 'Must have at least 4 trades keywords');
  console.log(`  ✓ Verified dual-lens balance: ${corporateKeywords.length} Corporate B2B keywords, ${tradesKeywords.length} Commercial Trades keywords`);

  // Test 3: Required metadata on each keyword entry
  for (const item of KEYWORD_PIPELINE) {
    assert.ok(item.id, `Item ${item.id} must have id`);
    assert.ok(item.keyword, `Item ${item.id} must have keyword string`);
    assert.ok(item.slug, `Item ${item.id} must have clean URL slug`);
    assert.ok(item.commercialValue.includes('$'), `Item ${item.id} must specify commercial value in $`);
    assert.ok(item.ctaService, `Item ${item.id} must define target ctaService`);
    assert.ok(item.ctaTier, `Item ${item.id} must define target ctaTier`);
  }
  console.log('  ✓ Verified 100% of keyword entries define valid IDs, slugs, commercial values, and CTA services');

  console.log('✅ [Self-Verification 3.1 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 3.1 FAILED]', err);
  process.exit(1);
});

