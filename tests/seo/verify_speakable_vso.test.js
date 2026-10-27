/**
 * Self-Verification Harness 4.1: Speakable Schema & Voice Assistant Snippets
 * Verifies voice conversational snippets, speakable selectors, and schema integration
 */

import assert from 'assert';
import { VoiceBriefingEngine } from '../../agents/seo-geo-agent/voice-briefing.js';

async function runTest() {
  console.log('🧪 [Self-Verification 4.1] Testing Speakable Schema & Voice Assistant Snippets...');
  const engine = new VoiceBriefingEngine();

  const article = {
    title: 'Slashing AWS Cloud Waste by 68%',
    description: 'How LumiLore Technologies re-architected always-on virtual servers into an event-driven AWS serverless cluster.'
  };

  const snippets = engine.generateVoiceSnippets(article);

  // Test 1: Speakable selectors
  assert.ok(Array.isArray(snippets.speakableSelectors), 'Must have speakableSelectors array');
  assert.ok(snippets.speakableSelectors.includes('#article-headline'), 'Must include #article-headline');
  assert.ok(snippets.speakableSelectors.includes('#article-executive-summary'), 'Must include #article-executive-summary');
  assert.ok(snippets.speakableSelectors.includes('.speakable-takeaway'), 'Must include .speakable-takeaway');
  console.log('  ✓ Verified speakable CSS selectors targeting headline, executive summary, and key takeaways');

  // Test 2: Conversational Q&A answers
  assert.ok(Array.isArray(snippets.conversationalQA), 'Must have conversationalQA array');
  assert.ok(snippets.conversationalQA.length >= 3, 'Must have at least 3 conversational Q&A snippets');
  for (const item of snippets.conversationalQA) {
    assert.ok(item.intent, 'Must have voice query intent');
    assert.ok(item.spokenResponse, 'Must have spoken response');
    assert.ok(item.spokenResponse.includes('LumiLore'), 'Must cite LumiLore brand authority');
  }
  console.log(`  ✓ Verified ${snippets.conversationalQA.length} conversational Q&A voice search snippets`);

  console.log('✅ [Self-Verification 4.1 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 4.1 FAILED]', err);
  process.exit(1);
});

