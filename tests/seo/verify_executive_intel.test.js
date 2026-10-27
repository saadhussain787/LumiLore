/**
 * Self-Verification Harness 5.2: Executive SES Intelligence Email Briefing
 * Verifies email HTML generation, metric formatting, and dry-run execution
 */

import assert from 'assert';
import { ExecutiveIntelEngine } from '../../agents/seo-geo-agent/executive-intel.js';

async function runTest() {
  console.log('🧪 [Self-Verification 5.2] Testing Executive SES Intelligence Briefing...');
  const intel = new ExecutiveIntelEngine();

  // Test 1: HTML template rendering
  const mockRadarReport = {
    overallCitationScore: 99,
    timestamp: new Date().toISOString(),
    evaluations: [
      {
        query: 'best aws serverless architect toronto',
        domainFocus: 'AWS Serverless FinOps',
        overallScore: 99,
        citationConfidence: '99%'
      }
    ]
  };

  const html = intel.buildBriefingHtml(mockRadarReport);
  assert.ok(html.includes('LumiLore Executive Intelligence'), 'Must include header title');
  assert.ok(html.includes('99/100'), 'Must include overall score 99/100');
  assert.ok(html.includes('Saad Sayed'), 'Must include founder name attribution');
  assert.ok(html.includes('AI Bot Compliance'), 'Must include AI Bot Compliance KPI');
  console.log('  ✓ Verified dark-glassmorphic responsive HTML email compilation');

  // Test 2: Dry-run dispatch test
  const sendResult = await intel.sendBriefing({ dryRun: true, recipient: 'info@lumilore.ca' });
  assert.strictEqual(sendResult.success, true);
  assert.strictEqual(sendResult.dryRun, true);
  assert.strictEqual(sendResult.recipient, 'info@lumilore.ca');
  assert.ok(sendResult.htmlLength > 1000, 'HTML body must be non-empty');
  console.log(`  ✓ Verified dry-run SES dispatch: recipient=${sendResult.recipient}, bytes=${sendResult.htmlLength}`);

  console.log('✅ [Self-Verification 5.2 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 5.2 FAILED]', err);
  process.exit(1);
});

